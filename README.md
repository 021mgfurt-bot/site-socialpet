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
  app/        rotas (React Router)
  components/ layout (Header, Footer, MobileMenu...) e ui (Button, Container...)
  config/     configuração central (URL da aplicação real)
  data/       dados estáticos (links de navegação, seções da Home)
  hooks/      hooks compartilhados (reduced-motion, focus trap, scroll lock...)
  lib/        utilitários pequenos
  motion/     GSAP centralizado (tokens, timelines do Hero)
  pages/      páginas (Home, Planos, páginas legais)
  sections/   seções da Home (Hero implementado; demais como placeholder)
  styles/     tokens de design, fontes, reset global
  three/      infraestrutura da cena 3D do Hero (lazy, com fallback)
```

## Fontes

Instrument Serif (display) e Switzer (corpo/UI) — ambas self-hosted, licenciamento documentado em [`FONTS.md`](./FONTS.md).

## SEO por ambiente

`canonical`, `robots.txt` e `sitemap.xml` são gerados em build time a partir de `VITE_SITE_URL` (`vite.seo.plugin.ts`). Sem essa variável configurada, o build assume `noindex`/`nofollow` e bloqueia indexação por padrão — nunca publica um domínio adivinhado.

## QA

Scripts de teste visual/acessibilidade/contraste em `qa/` (Playwright + axe-core, ambos só em `devDependencies`). Rodam contra o servidor de desenvolvimento local; capturas ficam em `qa/screenshots/` (fora do controle de versão).

## Estado atual

Fundação técnica, design system e Hero da Home implementados e testados em todos os breakpoints relevantes (320px a ultrawide). As demais seções da Home existem como placeholders estruturais (visíveis só em desenvolvimento) até serem desenhadas e implementadas.
