import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface HeroScrollExitTargets {
  section: Element | null;
  headline: Element | null;
  mockup: Element | null;
  scene: Element | null;
}

/**
 * Continuidade sutil pro scroll saindo do Hero — sem pinning, sem
 * scroll-jacking, sem travar a velocidade do scroll. A headline sobe
 * poucos pixels, o mockup se desloca de leve, a cena 3D reduz escala e
 * opacidade — o suficiente pra sugerir profundidade, não um efeito.
 */
export function playHeroScrollExit(targets: HeroScrollExitTargets, reducedMotion: boolean): () => void {
  if (reducedMotion || !targets.section) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: targets.section,
      start: "top top",
      end: "bottom top",
      scrub: 0.4,
    },
  });

  if (targets.headline) {
    tl.to(targets.headline, { y: -24, ease: "none" }, 0);
  }
  if (targets.mockup) {
    tl.to(targets.mockup, { y: 18, ease: "none" }, 0);
  }
  if (targets.scene) {
    tl.to(targets.scene, { scale: 0.92, opacity: 0.6, ease: "none" }, 0);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
