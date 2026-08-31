import { gsap, motion } from "./gsap";

export interface HeroEntranceTargets {
  eyebrow: Element | null;
  headline: Element | null;
  copy: Element | null;
  ctas: Element | null;
  mockup: Element | null;
  scene: Element | null;
}

/**
 * Entrada inicial do Hero: eyebrow → headline → copy → CTAs → mockup →
 * cena 3D, em stagger curto. A cena 3D entra por último e com um
 * comportamento próprio (scale 0.94→1 + opacity, não só fade) — ela é a
 * camada mais "cheia" visualmente, faz sentido ela se assentar por último.
 * Com `prefers-reduced-motion`, os elementos aparecem direto, sem stagger.
 */
export function playHeroEntrance(targets: HeroEntranceTargets, reducedMotion: boolean): () => void {
  const staggered = [targets.eyebrow, targets.headline, targets.copy, targets.ctas, targets.mockup].filter(
    (el): el is Element => Boolean(el),
  );
  const scene = targets.scene;

  if (staggered.length === 0 && !scene) return () => {};

  if (reducedMotion) {
    gsap.set(staggered, { opacity: 1, y: 0 });
    if (scene) gsap.set(scene, { opacity: 1, scale: 1 });
    return () => {};
  }

  gsap.fromTo(
    staggered,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: motion.duration.slow,
      ease: motion.ease.enter,
      stagger: 0.08,
      delay: 0.1,
      overwrite: "auto",
    },
  );

  if (scene) {
    gsap.fromTo(
      scene,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: motion.duration.slow * 1.3,
        ease: motion.ease.organic,
        delay: 0.1 + staggered.length * 0.08 + 0.06,
        overwrite: "auto",
      },
    );
  }

  return () => {
    const all = scene ? [...staggered, scene] : staggered;
    gsap.killTweensOf(all);
    gsap.set(staggered, { opacity: 1, y: 0, clearProps: "opacity,transform" });
    if (scene) gsap.set(scene, { opacity: 1, scale: 1, clearProps: "opacity,transform" });
  };
}
