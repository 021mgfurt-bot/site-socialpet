# Integração site ↔ app — instalação do PWA

Contexto: o site institucional (`site-socialpet`) e o aplicativo SocialPet
(`apppetshop`) são origens diferentes. Este documento existe porque o site
**não pode** disparar nem observar o `beforeinstallprompt`/`appinstalled`
do aplicativo — isolamento de origem é uma garantia do navegador, não uma
limitação de implementação. O que segue é o levantamento do que já existe
no app, o que o site faz hoje, e a especificação exata do que falta no app
para fechar o fluxo de verdade.

**Decisão registrada (Prompt 7.6):** o app foi autorizado pontualmente
para essa mudança, mas a implementação real não aconteceu nesta rodada —
`apppetshop/legacy/` é uma **cópia de backup** do código em produção (ver
`legacy/README.md`: "não editar diretamente para adicionar funcionalidade
nova... deve continuar sendo feita na pasta de origem"), não o ambiente
que realmente é servido aos usuários. Implementar ali teria produzido uma
demonstração local sem efeito real, o que teria sido reportado como
"aprovado" sem ser verdade. Optou-se por manter o app intocado e deixar
esta especificação pronta para quando a pasta de origem real (ou onde o
deploy de fato acontecer) for apontada.

## PWA real da aplicação — o que já existe (levantado em `legacy/`, leitura)

**`legacy/manifest.webmanifest`**
```json
{
  "id": "./",
  "name": "SocialPet",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "theme_color": "#f57c55",
  "background_color": "#fffaf6",
  "icons": [
    { "src": "./assets/icon-192.png", "sizes": "192x192", "purpose": "any" },
    { "src": "./assets/icon-512.png", "sizes": "512x512", "purpose": "any" },
    { "src": "./assets/icon-maskable-512.png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```
Atende aos três requisitos mínimos de instalabilidade (`display: standalone`,
ícones, `start_url`) — é um PWA instalável de verdade, não uma suposição.

**`legacy/service-worker.js`** — service worker completo e ativo: cacheia o
app shell no `install`, serve navegações com estratégia network-first e
fallback pra `offline.html`, limpa caches antigos no `activate`, e já lida
com `push`/`notificationclick` (notificações de lembrete). Não foi (e não
será) alterado.

**`legacy/app.js`** já implementa o fluxo de instalação inteiro, do lado do
app:

| Onde (linha aprox.) | O quê |
|---|---|
| `2366-2370` | `window.addEventListener("beforeinstallprompt", ...)` — captura o evento, guarda em `state.installPrompt`, mostra `#installButton` |
| `2371-2374` | `window.addEventListener("appinstalled", ...)` — limpa `state.installPrompt`, esconde `#installButton` |
| `2375-2376` | Em iOS, mostra `#installButton` incondicionalmente (não existe `beforeinstallprompt` lá) |
| `6838-6843` | `isIosDevice()` — `/iphone|ipad|ipod/i` no UA, ou `platform === "MacIntel" && maxTouchPoints > 1` (iPadOS) |
| `6845-6850` | `isAppInstalled()` — `matchMedia("(display-mode: standalone)").matches \|\| navigator.standalone === true` |
| `6859-6874` | `installPwa()` — chama `state.installPrompt.prompt()` quando disponível; em iOS mostra toast com instrução manual; em outros navegadores sem `beforeinstallprompt`, mostra toast genérico ("abra o menu ⋮...") |

**Conclusão do levantamento**: o app já resolve corretamente `install`/`iOS`/
`already installed` para quem já está **dentro dele**. Não há nada quebrado
para consertar lá, e nada que precise ser criado do zero — o gap real é
só a ponte entre o site (descoberta) e esse fluxo (que já existe no app).

## O que foi implementado no site

- `src/lib/pwaPlatform.ts` — funções puras de detecção: `isIosLike()`
  (mesmo critério do `isIosDevice()` do app, para as duas classificações
  ficarem consistentes), `isAndroidLike()`, `isChromiumLike()` (heurística
  best-effort para "esse navegador costuma suportar instalação automática"),
  `getIsStandalone()` (`display-mode: standalone` + `navigator.standalone`).
- `src/hooks/usePwaInstallEnvironment.ts` — combina essas funções num
  estado único (`install` | `iosInstructions` | `open` | `unsupported` |
  `installed`), reage a mudança de `display-mode` em tempo real, preserva
  a plataforma real (iOS/Android/desktop) mesmo quando standalone, e
  aceita um override `?pwaDebug=<estado>` só em `import.meta.env.DEV`
  (nunca em build de produção) para testar cada estado manualmente.
- `src/sections/InstallSpotlight.tsx` (Prompt 7.6 — substitui o
  `InstallSocialPetCta` pequeno do Prompt 7.5, removido) — faixa própria
  logo após o Hero, com peso visual real: ícone oficial, "Instale o
  SocialPet", copy curta, indicador de plataforma (Android/iPhone/
  Computador) e CTA com presença. Nunca finge que a instalação terminou:
  `install`/`open`/`unsupported`/`installed` apenas levam para a aplicação
  real; só `iosInstructions` abre uma experiência própria.
- `src/components/pwa/IosInstallSheet.tsx` — painel compacto (bottom sheet
  no mobile, modal centrado a partir de 600px) com os 4 passos manuais
  (abrir no Safari → Compartilhar → Adicionar à Tela de Início →
  Confirmar). Renderizado via `createPortal` direto em `document.body` —
  necessário porque o CTA que abre o painel vive dentro de uma seção que
  o GSAP anima (aplica `transform` inline mesmo em repouso); qualquer
  ancestral com `transform` vira containing block de descendentes
  `position: fixed`, então sem o portal o overlay ficava preso ao
  tamanho/posição daquele ancestral em vez de cobrir a viewport inteira
  (bug real encontrado em QA — documentado no componente).
- `src/data/navLinks.ts` — item "Instalar" (`/#instalar`) adicionado à
  navegação principal (Header e Footer reaproveitam o mesmo array).

### Limitação crítica ainda sem resolução no site (Prompt 7.6 §2/§38)

O botão "Instalar SocialPet" continua, tecnicamente, apenas abrindo a
aplicação real numa nova aba — ele **não** dispara nenhuma interface
nativa de instalação a partir do site, porque isso só pode acontecer na
própria origem do app (ver "Limitações cross-origin" abaixo). A faixa
nova resolve os problemas de copy e de direção visual (Prompt 7.6
§19-34); o problema de fundo ("o clique não instala de verdade") só se
resolve implementando o `/install` entry point descrito a seguir, **no
app real** — não foi implementado nesta rodada por decisão explícita
(ver nota no topo do documento).

## Fluxo Android / navegador compatível

CTA mostra **"Instalar SocialPet"**, aponta para `VITE_SOCIALPET_APP_URL`
em nova aba (`target="_blank"`). A instalação de fato acontece na aba do
app, via o `beforeinstallprompt` que **já existe lá** (tabela acima) — o
site não precisa (e não pode) replicar essa lógica.

## Fluxo iPhone/iPad/Safari

CTA mostra **"Instalar no iPhone"** → abre `IosInstallSheet` com os 4
passos (abrir o SocialPet no Safari → tocar em Compartilhar → escolher
"Adicionar à Tela de Início" → confirmar), mais um link "Abrir SocialPet
no Safari" pra já levar o usuário lá. Não existe prompt automático em
lugar nenhum no iOS — nem o site nem o app fingem que existe.

## Fluxo Desktop

Chromium-like (heurística por UA, ver `isChromiumLike()`) → **"Instalar
SocialPet"**. Outros (Firefox, Safari desktop) → **"Abrir SocialPet"**: sem
instrução irrelevante, o app continua 100% utilizável pelo navegador.

## Limitações cross-origin (por que o site não pode ir além disso)

- `beforeinstallprompt` e `appinstalled` só disparam na origem que tem o
  manifest + service worker registrados — isso é o app, não o site. O
  site não tem (e este prompt não pede) manifest próprio.
- Não é possível ler `localStorage`, cache do service worker, nem o estado
  interno (`state.installPrompt`) do app a partir do site — isolamento de
  origem, não workaround.
- `display-mode: standalone` e `navigator.standalone`, quando checados no
  site, só dizem se **o próprio site** está rodando standalone — não dizem
  nada sobre o app estar instalado. O estado `installed` do CTA existe e é
  honesto (é um sinal real), só que na prática quase nunca é `true` no
  contexto do site, pelo motivo acima.

## Implementação que futuramente será necessária no app (não feita agora)

Nada aqui foi implementado — é a especificação exata do que precisa
existir na origem real do app (não em `legacy/`, ver nota no topo) para
fechar o fluxo de instalação de ponta a ponta.

### 1. Install entry point (`/install` ou equivalente)

Um ponto de entrada dedicado, para o site linkar diretamente nele em vez
de cair na tela genérica de login. Como o app hoje é uma SPA de arquivo
único sem router próprio (`?view=` só existe pra telas internas
pós-login, ver `src/config/env.ts` no site), a forma mais compatível é
um query param reconhecido cedo no boot (`?intent=install`) que:
- mostra uma tela simples (logo oficial, nome, explicação curta, estado
  do navegador — Prompt 7.6 §6), não a tela cheia de login;
- não interfere com sessão existente: se `state.user` já existir, mostra
  a mesma tela de instalação mas sem pedir novo login (Prompt 7.6 §42).

### 2. `beforeinstallprompt` — reaproveitar, não duplicar

Já existe (`app.js:2366-2370`). A única mudança necessária é a tela do
`/install` reagir ao mesmo `state.installPrompt` já capturado, em vez de
criar um segundo listener. Enquanto o evento ainda não chegou, mostrar um
estado curto ("Preparando instalação…", Prompt 7.6 §8) — nunca um botão
"Instalar" clicável antes do evento existir de verdade.

### 3. Clique → `prompt()` → `userChoice`

```js
async function handleInstallClick() {
  if (!state.installPrompt) return; // botão só aparece com evento disponível
  state.installPrompt.prompt();
  const { outcome } = await state.installPrompt.userChoice; // "accepted" | "dismissed"
  state.installPrompt = null;
  if (outcome === "accepted") {
    // UI já deve migrar sozinha via appinstalled (não depender só daqui)
  }
  // "dismissed": não insistir, não mostrar prompt de novo na mesma sessão
}
```
`userChoice` só diz que o usuário respondeu ao prompt do navegador — a
confirmação de que a instalação *terminou* é o `appinstalled` (item 4),
não o `outcome === "accepted"` sozinho (Prompt 7.6 §9).

### 4. `appinstalled` → UI muda na hora

Já existe (`app.js:2371-2374`), já esconde `#installButton`. Na tela
`/install`, o mesmo listener deve trocar o CTA de "Instalar SocialPet"
para "Abrir SocialPet" **sem esperar reload** (Prompt 7.6 §10) — é o
mesmo padrão que já funciona no app hoje, só replicado nessa tela nova.

### 5. `getInstalledRelatedApps()` — enhancement, não requisito

Suporte real limitado (Chromium/Android, atrás de flag em alguns
canais). Para funcionar, exigiria:
- o manifest do app declarar `"id"` estável (já declara: `"id": "./"`);
- o **site** ter seu próprio `manifest.webmanifest` com
  `"related_applications": [{ "platform": "webapp", "url": "<url do manifest do app>" }]`
  e `"prefer_related_applications": true` — o site não tem manifest
  próprio hoje, e criar um só para isso é decisão de arquitetura maior,
  fora do escopo deste prompt.
- Sem essa configuração dos dois lados, a API sempre retorna lista vazia
  — o que **não prova que o app não está instalado** (Prompt 7.6 §11),
  só que a checagem não está configurada. Por isso o site nunca trata
  "lista vazia" como "não instalado" — ver `usePwaInstallEnvironment`.

### 6. Confirmação de instalação de volta ao site (opcional, avaliar)

Se um dia fizer sentido o site saber que a instalação terminou (ex.: pra
já nascer mostrando "Abrir SocialPet" numa visita seguinte), as opções
security-conscious são:
- **`postMessage` entre janelas**, só enquanto o site mantém a referência
  da aba que abriu (`window.open`) — o handler no site **precisa**
  validar `event.origin` contra a URL exata de `VITE_SOCIALPET_APP_URL`
  (nunca `targetOrigin: "*"`, Prompt 7.6 §45); expira quando a aba fecha,
  não é persistente nem confiável como fonte de verdade.
- **Mesmo domínio/subdomínio** (`app.socialpet.com` + `socialpet.com`)
  eliminaria o problema de origem inteiramente — maior mudança de
  infraestrutura, fora do escopo de um prompt de instalação.
- Não usar dado pessoal, não implementar tracking, não depender disso
  como verdade permanente (Prompt 7.6 §14) — é sempre um sinal de sessão,
  nunca um registro definitivo de "este usuário instalou".

## Comportamento dos navegadores (referência rápida)

| Navegador | `beforeinstallprompt` | Instalação manual disponível |
|---|---|---|
| Chrome/Edge/Opera/Samsung Internet (Android) | Sim | Sim (menu) |
| Chrome/Edge/Opera/Brave (desktop) | Sim | Sim (menu/ícone na barra de endereço) |
| Safari (iOS/iPadOS) | Não, nunca | Sim, manual (Compartilhar → Adicionar à Tela de Início) |
| Safari (desktop) | Não | Limitado (macOS 14+, incerto) |
| Firefox (desktop) | Não | Não tem instalação de PWA nativa |
| Firefox (Android) | Não | Sim, manual (menu → Instalar) |

## Fluxo final desejado (quando a integração acima existir)

1. Usuário chega no site, vê a faixa de instalação logo após o Hero (ou
   clica em "Instalar" no Header/Footer).
2. Clica em "Instalar SocialPet" → vai para `/install` no app real (ou,
   no iOS, vê as instruções primeiro, e o link de dentro do sheet também
   aponta pra lá).
3. **(pendente no app)** `/install` mostra "Preparando instalação…" até o
   `beforeinstallprompt` chegar, depois "Instalar SocialPet" de verdade —
   clique dispara o prompt nativo do navegador.
4. **(pendente no app)** `appinstalled` muda a UI daquela tela na hora,
   sem reload.
5. **(futuro, opcional)** App avisa o site que a instalação terminou, por
   um dos mecanismos da seção acima.
6. **(futuro, opcional)** Se o usuário voltar ao site depois de instalar,
   o CTA já nasce como "Abrir SocialPet" — hoje isso só acontece pela
   detecção local de `display-mode: standalone`, que funciona apenas
   dentro do próprio contexto instalado, não a partir do site.
