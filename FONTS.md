# Tipografia — estado

Decisão congelada (Prompt 3): **Instrument Serif** (display) + **Switzer** (corpo/UI).

## Instrument Serif — resolvido

- Fonte: pacote `@fontsource/instrument-serif` (npm), licença **OFL-1.1**, confirmada via `npm view @fontsource/instrument-serif license`.
- Self-hosted: os arquivos `.woff2`/`.woff` ficam em `node_modules/@fontsource/instrument-serif` e são importados por `src/styles/fonts.css`.
- Peso disponível: 400 (regular e itálico). É o único peso necessário — a Instrument Serif é usada só em display/headline.

## Switzer — resolvido no Prompt 5

- **Licença confirmada por fonte oficial**: a própria API pública da Fontshare (`https://api.fontshare.com/v2/fonts?q=switzer`) retorna, para a Switzer, `"license_type": "itf_ffl"` — ITF Free Font License, da Indian Type Foundry (publicadora oficial da fonte, também listada como tal na resposta da API). É uma licença gratuita para uso pessoal e comercial, incluindo incorporação em site — não uma relicenciação de terceiro não verificada (diferente do pacote não-oficial `@carrot-kpi/switzer-font` no npm, que segue **não sendo usado** por essa razão).
- **Self-hosted**: os arquivos `.woff2` dos pesos 400, 500 e 600 foram baixados diretamente do CDN oficial da Fontshare (`cdn.fontshare.com`), pelas URLs retornadas pela própria API/CSS oficial deles (`api.fontshare.com/v2/css`) — não são cópia de um espelho de terceiros. Ficam em `src/assets/fonts/switzer/` e são declarados via `@font-face` em `src/styles/fonts.css`.
- **Nenhuma requisição a domínio externo acontece mais em runtime** para carregar a tipografia do site — o `<link>` para `api.fontshare.com` foi removido de `index.html`. Isso também simplifica a Política de Cookies/Privacidade: não há mais nada a registrar sobre "fonte carregada de provedor externo" (ver Prompt 5 §20) — a ressalva ficou obsoleta porque o problema que ela documentava foi resolvido, não porque deixou de ser relevante.

## Regra permanente

Nunca substituir Switzer por Inter, Poppins, Montserrat ou Roboto como solução definitiva. Se algum dia os arquivos precisarem ser atualizados (nova versão da fonte), repetir o mesmo processo: baixar do CDN oficial da Fontshare a partir da CSS oficial deles, nunca de um espelho de terceiro.
