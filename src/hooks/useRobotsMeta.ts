import { useEffect } from "react";

/**
 * Sobrescreve a tag <meta name="robots"> enquanto o componente estiver
 * montado, e restaura o valor anterior ao desmontar. Usado por páginas
 * cujo conteúdo ainda não é a versão final (Prompt 5 §26) — o valor
 * injetado por `vite.seo.plugin.ts` no <head> continua sendo a regra geral
 * do site; isto é a exceção por rota.
 */
export function useRobotsMeta(content: string): void {
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = tag?.getAttribute("content") ?? null;
    const createdHere = !tag;

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);

    return () => {
      if (createdHere) {
        tag?.remove();
      } else if (previousContent !== null) {
        tag?.setAttribute("content", previousContent);
      }
    };
  }, [content]);
}
