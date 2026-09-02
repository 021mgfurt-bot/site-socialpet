# site-socialpet

Site institucional/comercial do SocialPet — separado da aplicação real (que continua vivendo no seu próprio repositório, referenciada aqui só como fonte de marca, funcionalidades e conteúdo real). Não é a aplicação: aqui não há cadastro, login nem dados de usuário — só apresentação, explicação e um caminho claro até a aplicação de verdade.

## Stack

React 19 + TypeScript + Vite. Roteamento com React Router. Motion com GSAP e ScrollTrigger. Camada 3D com Three.js e React Three Fiber, isolada e carregada sob demanda (nunca no caminho crítico do carregamento inicial). Estilo em CSS puro — CSS Modules por componente, tokens de design centralizados em `src/styles/tokens.css`, sem Tailwind ou biblioteca de UI.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # ajuste VITE_SOCIALPET_APP_URL / VITE_SITE_URL se necessário
npm run dev
```

Comandos disponíveis: `npm run dev`, `npm run build` (typecheck + build), `npm run lint`, `npm run preview`.

## Estrutura

```
src/
  app/        rotas (React Router) + página 404 (catch-all)
  components/ layout (Header, Footer, MobileMenu...) e ui (Button, Container, FaqItem...)
  config/     configuração central (URL da aplicação real)
  data/       dados estáticos (links de navegação, planos)
  hooks/      hooks compartilhados (reduced-motion, focus trap, scroll lock, SEO por rota...)
  lib/        utilitários pequenos
  motion/     GSAP centralizado (tokens + uma timeline por seção)
  pages/      páginas (Home, Planos, páginas legais, 404)
  sections/   todas as seções da Home (Hero → CTA Final, ver abaixo)
  styles/     tokens de design, fontes, reset global
  three/      infraestrutura da cena 3D do Hero (lazy, com fallback, só desktop+WebGL)
```

## Home

Hero → Install Spotlight → Problema → SocialPet → Vacinação → Despesas + Relatórios →
Agenda + Lembretes → Álbum + Memórias → Privacidade + Confiança → Planos → FAQ → CTA
Final → Footer. Todas as seções são reais (nenhum placeholder restante) — demonstrações
de produto usam capturas reais de uma conta demo oficial (`docs/product-demos.md`), nunca
dado de usuário real.

## Fontes

Inter (única família, mesma da aplicação real) — self-hosted, licenciamento documentado em [`FONTS.md`](./FONTS.md).

## SEO

`canonical`, `robots.txt`, `sitemap.xml` e `og:image`/`twitter:image` (URL absoluta) são
gerados em build time a partir de `VITE_SITE_URL` (`vite.seo.plugin.ts`). Sem essa
variável configurada, o build assume `noindex`/`nofollow` e não emite nenhuma URL
absoluta — nunca publica um domínio adivinhado (localhost/preview). O sitemap só lista
rotas indexáveis hoje (`/` e `/planos`) — as páginas legais ficam de fora enquanto
estiverem marcadas `noindex` (texto jurídico em revisão).

`<title>`/description/canonical por rota são trocados em runtime por
`src/hooks/useDocumentHead.ts` (mesmo padrão imperativo de `useRobotsMeta.ts`, sem
biblioteca nova). Isso ajuda crawlers que executam JavaScript (Google) e a aba do
navegador, mas **não** ajuda crawlers de preview social (Facebook/X/LinkedIn/Slack não
executam JS) — esses sempre leem os valores estáticos de `index.html`, que representam
a Home. Limitação real de SPA sem SSR, documentada em `vite.seo.plugin.ts`.

`public/og-image.png` (1200×630) é gerado a partir de `qa/og-image/template.html` via
`node qa/og-image/generate.mjs` — reexecutável sempre que o template mudar.

## Deploy (Vercel)

`vercel.json` configura o rewrite de SPA (qualquer rota client-side, tipo `/planos`,
precisa cair em `index.html` em vez de 404 do host estático) e headers de segurança
básicos (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options`). Variáveis de ambiente de produção obrigatórias:
`VITE_SOCIALPET_APP_URL` (o build de produção lança erro sem ela) e `VITE_SITE_URL`
(opcional, mas necessária para SEO indexável).

## QA

Scripts de teste visual/acessibilidade/contraste em `qa/` (Playwright + axe-core, ambos só em `devDependencies`). Rodam contra o servidor de desenvolvimento local; capturas ficam em `qa/screenshots/` (fora do controle de versão).

## Estado atual

Home completa (Hero ao CTA Final), design system consolidado, SEO por rota, página 404
e configuração de deploy implementados e testados em todos os breakpoints relevantes
(320px a ultrawide). Nenhum placeholder estrutural restante.
