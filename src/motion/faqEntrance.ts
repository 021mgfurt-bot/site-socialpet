import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface FaqEntranceTargets {
  intro: HTMLElement | null;
  list: HTMLElement | null;
}

/**
 * Entrada simples via ScrollTrigger — 1 timeline, sem pin (Prompt 13
 * §76-79). O accordion em si (abrir/fechar cada pergunta) não usa GSAP —
 * é resolvido só com CSS (`grid-template-rows`), evitando qualquer
 * conflito entre GSAP e altura automática (Prompt 13 §31).
 */
export function playFaqEntrance(targets: FaqEntranceTargets): () => void {
  const { intro, list } = targets;
  if (!intro) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: intro,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  if (list) {
    tl.fromTo(list, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.15);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
