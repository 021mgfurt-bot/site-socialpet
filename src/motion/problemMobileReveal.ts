import { ensureScrollTriggerRegistered, gsap, ScrollTrigger } from "./gsap";

export interface ProblemMobileTargets {
  fragmentEls: HTMLElement[];
  revealWord: HTMLElement | null;
  product: HTMLElement | null;
}

/**
 * Versão mobile/tablet (<1024px, Prompt 6 §32-33): sem pin, sem scrub —
 * scroll normal, fragmentos empilhados revelando em stagger conforme
 * entram na viewport, depois "SocialPet", depois o produto. Cada trigger
 * dispara uma vez (toggleActions "play none none none").
 */
export function playProblemMobileReveal(targets: ProblemMobileTargets): () => void {
  const { fragmentEls, revealWord, product } = targets;
  if (fragmentEls.length === 0 && !revealWord && !product) return () => {};

  ensureScrollTriggerRegistered();

  const triggers: ScrollTrigger[] = [];

  if (fragmentEls.length > 0) {
    gsap.set(fragmentEls, { opacity: 0, y: 20 });
    const tween = gsap.to(fragmentEls, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: fragmentEls[0],
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }

  if (revealWord) {
    gsap.set(revealWord, { opacity: 0, y: 16 });
    const tween = gsap.to(revealWord, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: revealWord,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }

  if (product) {
    gsap.set(product, { opacity: 0, scale: 0.96, y: 16 });
    const tween = gsap.to(product, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: product,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
  }

  return () => {
    triggers.forEach((trigger) => trigger.kill());
  };
}
