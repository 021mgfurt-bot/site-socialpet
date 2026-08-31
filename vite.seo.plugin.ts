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
 * libera rastreamento e aponta pro sitemap real, e o sitemap.xml é gerado
 * com as rotas reais do site.
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
      const ROUTES = ["/", "/planos", "/privacidade", "/cookies", "/termos", "/contato"];

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
