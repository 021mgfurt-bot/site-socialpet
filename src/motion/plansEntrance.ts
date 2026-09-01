import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface PlansEntranceTargets {
  block: HTMLElement | null;
}

/**
 * Entrada simples via ScrollTrigger — 1 timeline, sem pin (Prompt 12
 * §59-61). Mesma receita de InstallSpotlight/Privacy: só um reveal de
 * texto, sem espetáculo — esta seção é uma transição curta, não um
 * momento de produto.
 */
export function playPlansEntrance(targets: PlansEntranceTargets): () => void {
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

  tl.fromTo(block, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
