import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface InstallSpotlightTargets {
  band: HTMLElement | null;
  icon: HTMLElement | null;
}

/**
 * Entrada simples via ScrollTrigger — sem pin (Prompt 7.6 §30). O ícone
 * "levanta" um pouco a mais que a faixa (Prompt 7.6 §29 "ícone levantando
 * alguns pixels"), criando uma leve profundidade sem virar espetáculo.
 */
export function playInstallSpotlightEntrance(targets: InstallSpotlightTargets): () => void {
  const { band, icon } = targets;
  if (!band) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: band,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(band, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
  if (icon) {
    tl.fromTo(icon, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }, 0.1);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
