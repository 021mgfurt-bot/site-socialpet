import type { Plugin } from "vite";

/**
 * Gera canonical/robots/sitemap a partir de VITE_SITE_URL em vez de deixar
 * um domínio placeholder ir para qualquer build real (Prompt 5 §25/§26).
 *
 * Sem VITE_SITE_URL configurada (dev, ou build de homologação sem domínio
 * ainda decidido): nenhum <link rel="canonical"> é emitido, robots.txt
 * bloqueia indexação por completo, e não existe sitemap.xml no build — em
 * vez de publicar um domínio ".example" como se fosse real.
 *
 * Com VITE_SITE_URL configurada: canonical/OG usam a URL real, robots.txt
 * libera rastreamento e aponta pro sitemap real, o sitemap.xml é gerado
 * com as rotas reais do site, e og:image/twitter:image passam a apontar
 * pro domínio real (Prompt 14) — sem isso, nenhuma URL absoluta de imagem
 * é injetada, pra nunca publicar um link quebrado apontando pra
 * localhost/preview.
 *
 * Canonical/og:url aqui sempre apontam pra raiz (`/`): isto é HTML estático
 * de build, compartilhado por todas as rotas client-side da SPA — não dá
 * pra gerar um `<link rel="canonical">` por rota sem SSR/multi-entry, fora
 * do escopo deste projeto. `src/hooks/useDocumentHead.ts` complementa isso
 * em runtime (troca canonical/title/description por rota depois que o
 * React monta), o que já ajuda crawlers que executam JavaScript (Google),
 * mas não ajuda crawlers de preview social (Facebook/X/LinkedIn/Slack, que
 * não executam JS) — esses sempre vão ler os valores estáticos daqui,
 * representando a Home. Limitação real da arquitetura SPA, documentada,
 * não escondida.
 */
export function seoPlugin(): Plugin {
  let siteUrl = "";

  return {
    name: "socialpet-seo",
    configResolved(config) {
      siteUrl = (config.env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");
    },
    transformIndexHtml() {
      const tags: { tag: string; attrs: Record<string, string>; injectTo: "head" }[] = [];

      if (siteUrl) {
        tags.push({ tag: "link", attrs: { rel: "canonical", href: `${siteUrl}/` }, injectTo: "head" });
        tags.push({ tag: "meta", attrs: { property: "og:url", content: `${siteUrl}/` }, injectTo: "head" });
        tags.push({ tag: "meta", attrs: { name: "robots", content: "index, follow" }, injectTo: "head" });
        // og:image só existe como URL absoluta quando há domínio real — os
        // crawlers de preview social (Facebook/X/LinkedIn/Slack) não
        // executam JavaScript, então isto precisa estar no HTML estático
        // já servido, nunca só injetado depois pelo React (Prompt 14 §47).
        tags.push({ tag: "meta", attrs: { property: "og:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" });
        tags.push({ tag: "meta", attrs: { property: "og:image:width", content: "1200" }, injectTo: "head" });
        tags.push({ tag: "meta", attrs: { property: "og:image:height", content: "630" }, injectTo: "head" });
        tags.push({ tag: "meta", attrs: { name: "twitter:image", content: `${siteUrl}/og-image.png` }, injectTo: "head" });
      } else {
        // Sem domínio real ainda: nunca indexar, nunca fingir uma URL canônica.
        tags.push({
          tag: "meta",
          attrs: { name: "robots", content: "noindex, nofollow" },
          injectTo: "head",
        });
      }

      return tags;
    },
    generateBundle() {
      // Só rotas indexáveis hoje. As páginas legais (Privacidade/Cookies/
      // Termos/Contato) ficam de fora do sitemap de propósito: elas usam
      // `useRobotsMeta("noindex, nofollow")` enquanto o texto jurídico
      // estiver em revisão (`reviewed=false`, ver LegalPageLayout.tsx) —
      // listar uma URL noindex no sitemap manda sinal contraditório pro
      // buscador (Prompt 14, achado real de auditoria). Sem rota-404, sem
      // hash, sem página de dev, conforme já era antes.
      const ROUTES = ["/", "/planos"];

      if (siteUrl) {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        });

        const urls = ROUTES.map((route) => `  <url>\n    <loc>${siteUrl}${route}</loc>\n  </url>`).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      } else {
        // Bloqueia tudo explicitamente em vez de deixar o robots.txt padrão
        // do navegador/CDN decidir sozinho.
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nDisallow: /\n`,
        });
      }
    },
  };
}
