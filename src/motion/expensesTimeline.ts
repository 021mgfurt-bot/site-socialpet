import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface ExpensesStageTargets {
  fragments: HTMLElement | null;
  total: HTMLElement | null;
  categories: HTMLElement | null;
  report: HTMLElement | null;
}

/**
 * Sem pin (Prompt 8 §38/§39): cada estágio revela sozinho quando cruza o
 * próprio ponto de entrada na viewport, enquanto o texto à esquerda fica
 * `position: sticky` (CSS puro, sem GSAP) — a progressão nasce do scroll
 * normal, não de uma timeline scrubada. Deliberadamente diferente do pin
 * curto usado em Vacinação (Prompt 8 §12/§37).
 */
export function playExpensesStagesEntrance(targets: ExpensesStageTargets): () => void {
  const stages = [targets.fragments, targets.total, targets.categories, targets.report].filter(
    (el): el is HTMLElement => Boolean(el),
  );
  if (stages.length === 0) return () => {};

  ensureScrollTriggerRegistered();

  const triggers = stages.map((stage) =>
    gsap.fromTo(
      stage,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      },
    ),
  );

  return () => {
    for (const tween of triggers) {
      tween.scrollTrigger?.kill();
      tween.kill();
    }
  };
}
