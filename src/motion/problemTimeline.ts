import { ensureScrollTriggerRegistered, gsap } from "./gsap";
import { PROBLEM_FRAGMENTS } from "../data/problemFragments";

export interface ProblemTimelineTargets {
  stage: HTMLElement | null;
  fragmentEls: HTMLElement[];
  revealWord: HTMLElement | null;
  product: HTMLElement | null;
}

const DESKTOP_HEADER_HEIGHT = 84;

/**
 * Coreografia pinada do desktop (Prompt 6 §18-30): fragmentos dispersos →
 * onda 2 adensa a composição → reorganização (convergem, perdem rotação e
 * escala) → "SocialPet" revelado → pausa → produto entra. Um scroll de
 * ~180vh mapeado numa timeline única com scrub — sem scroll-jacking, sem
 * travar velocidade.
 */
export function playProblemTimeline(targets: ProblemTimelineTargets): () => void {
  const { stage, fragmentEls, revealWord, product } = targets;
  if (!stage || fragmentEls.length === 0) return () => {};

  ensureScrollTriggerRegistered();

  const wave1 = fragmentEls.filter((_, i) => PROBLEM_FRAGMENTS[i].wave === 1);
  const wave2 = fragmentEls.filter((_, i) => PROBLEM_FRAGMENTS[i].wave === 2);

  gsap.set(fragmentEls, {
    opacity: 0,
    scale: (i: number) => PROBLEM_FRAGMENTS[i].scale * 0.85,
    rotate: (i: number) => PROBLEM_FRAGMENTS[i].rotate,
    x: 0,
    y: 0,
  });
  if (revealWord) gsap.set(revealWord, { opacity: 0, scale: 0.92, y: 0 });
  if (product) gsap.set(product, { opacity: 0, scale: 0.94, y: 24 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: () => `top ${DESKTOP_HEADER_HEIGHT}`,
      end: "+=180%",
      scrub: 0.6,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  // Estágio 1 — fragmentos surgem aos poucos (não todos juntos).
  tl.to(
    wave1,
    {
      opacity: 1,
      scale: (i: number) => PROBLEM_FRAGMENTS[i].scale,
      duration: 1,
      ease: "power2.out",
      stagger: { each: 0.12, from: "random" },
    },
    0,
  );

  // Estágio 2 — a composição adensa (mais informação aparecendo).
  tl.to(
    wave2,
    {
      opacity: 1,
      scale: (i: number) => PROBLEM_FRAGMENTS[i].scale,
      duration: 1,
      ease: "power2.out",
      stagger: { each: 0.12, from: "random" },
    },
    0.7,
  );

  // Estágio 3 — reorganização: os próprios fragmentos convergem, perdem
  // rotação e escala — a transformação não é um fade genérico, são os
  // elementos dispersos que se organizam (Prompt 6 §22-23).
  tl.to(
    fragmentEls,
    {
      x: (i: number) => PROBLEM_FRAGMENTS[i].convergeX,
      y: (i: number) => PROBLEM_FRAGMENTS[i].convergeY,
      rotate: 0,
      scale: 0.4,
      opacity: 0,
      duration: 1.3,
      ease: "power2.inOut",
      stagger: 0.02,
    },
    2.4,
  );

  // Estágio 4 — revelação: SocialPet nasce da própria organização.
  if (revealWord) {
    tl.to(revealWord, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 3.1);
  }

  // Estágio 5 — pausa: nenhuma tween aqui de propósito (Prompt 6 §26).
  // Estágio 6 — entrada do produto: a palavra passa a mão pro produto em
  // vez de dividir o mesmo espaço com ele (evita a sobreposição estranha
  // de "SocialPet" atravessado pelo telefone, visto na revisão visual
  // deste ajuste) — ela sobe e desvanece enquanto o mockup aparece.
  if (revealWord) {
    tl.to(revealWord, { y: -60, opacity: 0, scale: 0.92, duration: 0.8, ease: "power2.in" }, 4.6);
  }
  if (product) {
    tl.to(product, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, 4.85);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
