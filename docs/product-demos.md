# Demonstrações reais do produto (Vacinação, Despesas, Agenda, Álbum)

Status: **capturas de imagem prontas e integradas** (Prompt 10.6/10.7) — vídeo/GIF
ainda **não** existe (ver "Vídeo, próximo passo" abaixo).

## O que existe hoje

Uma conta demo oficial do SocialPet (a conta real do usuário do projeto, com um
pet real — Lolly — mais três pets fictícios: Mel, Thor, Luna) foi populada
manualmente pelo usuário e por automação de navegador já autenticada (nunca por
login automatizado — ver "Regra de autenticação" abaixo) com vacinas, despesas,
lembretes e fotos de álbum fictícios, calculados pela lógica real do app (não
digitados/simulados por CSS).

A partir dessa conta, foram capturados 5 recortes de tela reais, **em resolução
mobile de verdade** (219×477, via Chrome DevTools em modo de emulação de
iPhone — não crops de tela desktop redimensionados) mais 4 fotos reais do
álbum de Mel:

```
public/product-demos/vaccination/vaccination-screen-mobile.png
public/product-demos/expenses/report-screen-mobile.png
public/product-demos/agenda/agenda-screen-mobile.png
public/product-demos/album/album-screen-mobile.png
public/product-demos/album/mel-photo-1.png
public/product-demos/album/mel-photo-2.png
public/product-demos/album/mel-photo-3.png
public/product-demos/album/mel-photo-4.png
```

Essas imagens são servidas como `poster` do `<ProductVideo>` existente em cada
seção (`Vaccination.tsx`, `Expenses.tsx`, `Agenda.tsx`, `Album.tsx`). Sem
`srcMp4`, o `ProductVideo` renderiza o poster como `<img>` com
`object-fit: contain` (classe `.staticPoster`) — a imagem aparece inteira e
proporcional dentro do `DeviceMockup`, nunca cortada/esticada. O mesmo caminho
de código atende o estado de `prefers-reduced-motion: reduce` (nenhum vídeo
toca; a imagem estática é o resultado final em ambos os casos).

As 4 fotos do álbum (`mel-photo-*.png`) substituem os placeholders de cor do
`Album.tsx` diretamente via `<AlbumPhoto>` (mesma moldura visual do
`PhotoPlaceholder` que substituíram).

## Regra de autenticação (por que nenhum vídeo real de tela existe ainda)

Login automatizado no SocialPet nunca é feito por Claude — nem para popular a
conta demo, nem para capturar telas. Toda captura desta rodada foi feita numa
aba do Chrome **já autenticada pelo usuário**; cliques de navegação, quando o
DevTools de emulação mobile estava aberto, também foram feitos pelo usuário
(ver limitação abaixo). Isso é deliberado, não uma lacuna a preencher depois.

## Limitação técnica encontrada (Prompt 10.7)

Com o painel de emulação de dispositivo do Chrome DevTools aberto (qualquer
modo, inclusive "Responsive" simples), a ferramenta de automação de clique
(`computer` / `left_click`) trava com timeout
(`Input.dispatchMouseEvent timed out`), embora screenshot/zoom/JS continuem
funcionando na mesma aba. Causa raiz não diagnosticada. Solução usada: o
usuário navega/clica manualmente na aba emulada e avisa no chat; a automação
só captura (`zoom` na região do viewport emulado, que produz upscale nítido
em vez do screenshot bruto minúsculo).

## Vídeo, próximo passo (ainda não feito)

O pipeline Playwright (`qa/capture-product-demo.mjs`) segue exigindo
`SOCIALPET_DEMO_EMAIL`/`SOCIALPET_DEMO_PASSWORD` e login automatizado — por
isso não foi executado nesta rodada (mesma regra acima). Para gerar vídeo/GIF
real no futuro, sem violar a regra de autenticação:

1. O usuário roda a gravação manualmente (Playwright com as credenciais
   fornecidas por ele mesmo, fora desta sessão, ou uma gravação de tela
   simples) e entrega o arquivo bruto.
2. Revisão manual do vídeo bruto frame a frame antes de qualquer conversão —
   confirmar ausência de dado sensível, notificação do sistema, token na URL.
3. Converter pra MP4 (H.264, sem áudio) + extrair poster do próprio vídeo:
   ```
   ffmpeg -i captura.webm -an -c:v libx264 -crf 26 -preset slow -movflags +faststart socialpet-<secao>-demo.mp4
   ffmpeg -i socialpet-<secao>-demo.mp4 -vframes 1 -ss 00:00:01 socialpet-<secao>-poster.webp
   ```
4. Colocar em `public/product-demos/<secao>/` e passar `srcMp4` pro
   `<ProductVideo>` já existente (troca de uma prop — o poster atual continua
   sendo o fallback correto enquanto não há vídeo, e o fallback de
   reduced-motion depois).

## Pendência de licenciamento

As fotos de Mel (`mel-photo-*.png`) e as capturas de tela são reais, da conta
demo oficial. Antes de publicação comercial definitiva do site, confirmar que
o uso público dessas imagens está autorizado (mesma pendência registrada nos
comentários de `Album.tsx`/`Vaccination.tsx`).
