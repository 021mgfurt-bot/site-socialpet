import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function getInitial(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Reflete `prefers-reduced-motion` em tempo real (inclusive se o usuário
 * mudar a preferência do sistema com a aba aberta). Toda decisão de motion
 * do site (GSAP, Three.js, scroll suave) deve passar por este hook em vez
 * de checar `matchMedia` isoladamente em cada componente.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
