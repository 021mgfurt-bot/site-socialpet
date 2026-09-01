import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface PrivacyEntranceTargets {
  intro: HTMLElement | null;
  surface: HTMLElement | null;
}

/**
 * Entrada simples via ScrollTrigger — 1 timeline, sem pin (Prompt 11
 * §50-51). Mesma receita do InstallSpotlight: o texto entra primeiro, a
 * "superfície" (documento) entra logo depois com um leve atraso, sem
 * nenhum efeito "cyber" ou 3D.
 */
export function playPrivacyEntrance(targets: PrivacyEntranceTargets): () => void {
  const { intro, surface } = targets;
  if (!intro) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: intro,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  if (surface) {
    tl.fromTo(surface, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.15);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
