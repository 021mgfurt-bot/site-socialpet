import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registra o ScrollTrigger uma única vez. Chamado a partir dos componentes
 * que efetivamente usam scroll-driven motion (não no bootstrap global) para
 * manter o custo de import isolado de quem não precisa dele.
 */
export function ensureScrollTriggerRegistered(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Timings e easings centrais do motion do site — espelham os tokens CSS em
 * src/styles/tokens.css (--motion-*, --ease-*). Qualquer timeline GSAP nova
 * deve puxar valores daqui, não hard-codar duração/easing por seção.
 */
export const motion = {
  duration: {
    fast: 0.2,
    base: 0.4,
    slow: 0.75,
  },
  ease: {
    enter: "power3.out",
    exit: "power2.in",
    organic: "sine.inOut",
  },
} as const;

export { gsap, ScrollTrigger };
