import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reseta o scroll ao trocar de rota — exceto quando a navegação já mira uma âncora. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
