import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MIN_WIDTH_QUERY = "(min-width: 1024px)";

function detectWebgl(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Decide se a cena 3D do Hero deve montar. Combina largura de viewport
 * (>= tablet landscape) e suporte real a WebGL — nunca só largura, porque
 * notebooks fracos existem em telas grandes (Wireframe & Visual System §33).
 * `prefers-reduced-motion` desliga a cena por completo: o Hero cai direto
 * no fallback estático, sem tentar renderizar um frame parado em WebGL.
 */
export function useHeroSceneEligibility(): boolean {
  const reducedMotion = useReducedMotion();
  const [wideEnough, setWideEnough] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MIN_WIDTH_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(MIN_WIDTH_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setWideEnough(event.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  if (reducedMotion) return false;
  if (!wideEnough) return false;
  return detectWebgl();
}
