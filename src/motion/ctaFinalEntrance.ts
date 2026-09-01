import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface CtaFinalEntranceTargets {
  block: HTMLElement | null;
}

/**
 * Entrada simples via ScrollTrigger — 1 timeline, sem pin (Prompt 13
 * §77-79), mesmo padrão de todas as outras seções curtas do site.
 */
export function playCtaFinalEntrance(targets: CtaFinalEntranceTargets): () => void {
  const { block } = targets;
  if (!block) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(block, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
