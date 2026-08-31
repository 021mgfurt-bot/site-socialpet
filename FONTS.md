# Tipografia — estado

Decisão atual (substitui a decisão do Prompt 3/Prompt 5, registrada abaixo
para histórico): **Inter** — mesma família usada pela aplicação real
(`legacy/styles.css`, `:root`: `font-family: Inter, ui-rounded, "Segoe UI",
system-ui, -apple-system, BlinkMacSystemFont, sans-serif;`). Uma família só
para todo o site; a hierarquia editorial vem de escala, peso e tracking
(`--weight-*`/`--tracking-*` em `src/styles/tokens.css`), não de misturar
famílias diferentes.

## Inter — resolvido

- Fonte variável, pacote `@fontsource-variable/inter` (npm), licença
  **OFL-1.1**.
- Self-hosted: um único import (`@import "@fontsource-variable/inter/wght.css";`
  em `src/styles/fonts.css`) cobre todo o eixo de peso (100–900) — troca a
  necessidade de múltiplos arquivos por peso (como Switzer exigia) por um
  arquivo por subset de caracteres.
- Só o subset "latin" é de fato baixado em runtime: todo o alfabeto
  acentuado do português (á, ã, ç, é, ê, í, ó, õ, ú...) cabe em Latin-1
  (U+0000–00FF), coberto pelo subset "latin". Os subsets cyrillic/greek/
  vietnamese declarados no CSS do pacote nunca são requisitados pelo
  navegador porque nenhum texto do site usa esses intervalos Unicode —
  comportamento nativo de `@font-face`+`unicode-range`, confirmado via
  captura de Network (só `inter-latin-wght-normal.woff2`, ~48KB, uma
  requisição).
- A aplicação real **não** hospeda a própria fonte (depende do Inter do
  sistema, com fallback para `ui-rounded`/`system-ui`); o site hospeda o
  arquivo de verdade para garantir a mesma tipografia em qualquer máquina,
  já que aqui a fonte carrega via `<link>`/`@import` em vez de depender de
  instalação local.

## Regra permanente (atualizada)

Não trocar Inter por outra família como solução definitiva sem antes
reconfirmar, no código real da aplicação (`legacy/styles.css`), qual é a
fonte oficial em uso — a decisão deste documento existe para acompanhar a
aplicação, não para fixar uma preferência de design independente dela.

## Histórico — Instrument Serif + Switzer (Prompt 3–6, descontinuado)

Entre o Prompt 4 e o ajuste de tipografia que trouxe Inter para o site, a
decisão tipográfica era **Instrument Serif** (display) + **Switzer**
(corpo/UI) — duas famílias, cada uma self-hosted e com licença verificada
na época (Instrument Serif via `@fontsource/instrument-serif`, OFL-1.1;
Switzer via download direto do CDN oficial da Fontshare, licença ITF Free
Font License). Essa decisão foi revertida porque o site passou a adotar a
mesma tipografia da aplicação real (Inter) em vez de uma identidade
editorial própria e desconectada da marca — ambos os pacotes/arquivos
foram removidos do repositório (`@fontsource/instrument-serif` desinstalado,
`src/assets/fonts/switzer/` apagado). Não restam imports, preloads ou
menções ativas a nenhuma das duas em nenhum arquivo do site.
