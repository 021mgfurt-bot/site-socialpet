import { useEffect } from "react";

interface DocumentHeadConfig {
  /** Título completo da aba/resultado de busca — não só o sufixo. */
  title: string;
  description: string;
  /** Caminho absoluto da rota, ex.: "/planos". Use "/" pra Home. */
  path: string;
}

function ensureMeta(attrName: "name" | "property", attrValue: string): HTMLMetaElement {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureCanonicalLink(): HTMLLinkElement {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  return tag;
}

/**
 * Título, descrição e canonical por rota (Prompt 14 §38-42) — mesmo
 * padrão imperativo de `useRobotsMeta.ts` (não precisa de outra
 * biblioteca; sem SSR, `document.title`/`<meta>`/`<link>` bastam),
 * restaurando o valor anterior ao desmontar.
 *
 * Isto ajuda crawlers que executam JavaScript (Google) e a aba do
 * navegador em si. NÃO ajuda crawlers de preview social (Facebook/X/
 * LinkedIn/Slack, que leem só o HTML estático do primeiro request, sem
 * rodar JS) — esses sempre veem os valores fixos de `index.html`/
 * `vite.seo.plugin.ts`, que representam a Home. É uma limitação real da
 * arquitetura SPA sem SSR, não um bug: documentada no relatório do
 * Prompt 14, não escondida.
 */
export function useDocumentHead({ title, description, path }: DocumentHeadConfig): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descriptionTag = ensureMeta("name", "description");
    const previousDescription = descriptionTag.getAttribute("content");
    descriptionTag.setAttribute("content", description);

    const ogTitleTag = ensureMeta("property", "og:title");
    const previousOgTitle = ogTitleTag.getAttribute("content");
    ogTitleTag.setAttribute("content", title);

    const ogDescriptionTag = ensureMeta("property", "og:description");
    const previousOgDescription = ogDescriptionTag.getAttribute("content");
    ogDescriptionTag.setAttribute("content", description);

    const twitterTitleTag = ensureMeta("name", "twitter:title");
    const previousTwitterTitle = twitterTitleTag.getAttribute("content");
    twitterTitleTag.setAttribute("content", title);

    const twitterDescriptionTag = ensureMeta("name", "twitter:description");
    const previousTwitterDescription = twitterDescriptionTag.getAttribute("content");
    twitterDescriptionTag.setAttribute("content", description);

    // Canonical/og:url por rota só existem quando há domínio real
    // configurado — mesma regra do build (vite.seo.plugin.ts): nunca
    // fingir canonical de produção em dev/preview sem VITE_SITE_URL.
    const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");
    const canonicalTag = siteUrl ? ensureCanonicalLink() : null;
    const previousCanonicalHref = canonicalTag?.getAttribute("href") ?? null;
    const ogUrlTag = siteUrl ? ensureMeta("property", "og:url") : null;
    const previousOgUrl = ogUrlTag?.getAttribute("content") ?? null;
    if (siteUrl) {
      const fullUrl = `${siteUrl}${path}`;
      canonicalTag?.setAttribute("href", fullUrl);
      ogUrlTag?.setAttribute("content", fullUrl);
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) descriptionTag.setAttribute("content", previousDescription);
      if (previousOgTitle !== null) ogTitleTag.setAttribute("content", previousOgTitle);
      if (previousOgDescription !== null) ogDescriptionTag.setAttribute("content", previousOgDescription);
      if (previousTwitterTitle !== null) twitterTitleTag.setAttribute("content", previousTwitterTitle);
      if (previousTwitterDescription !== null) {
        twitterDescriptionTag.setAttribute("content", previousTwitterDescription);
      }
      if (previousCanonicalHref !== null) canonicalTag?.setAttribute("href", previousCanonicalHref);
      if (previousOgUrl !== null) ogUrlTag?.setAttribute("content", previousOgUrl);
    };
  }, [title, description, path]);
}
