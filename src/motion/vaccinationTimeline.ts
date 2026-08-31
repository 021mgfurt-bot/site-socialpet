import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface VaccinationEntranceTargets {
  headline: HTMLElement | null;
  copy: HTMLElement | null;
  mockup: HTMLElement | null;
  statusEntries: HTMLElement[];
}

/**
 * Entrada simples (todos os breakpoints): headline → copy → mockup →
 * registros de status, em stagger curto, sem pin. Roda uma vez ao entrar
 * na viewport.
 */
export function playVaccinationEntrance(targets: VaccinationEntranceTargets): () => void {
  const { headline, copy, mockup, statusEntries } = targets;
  const staggered = [headline, copy, mockup, ...statusEntries].filter(
    (el): el is HTMLElement => Boolean(el),
  );
  if (staggered.length === 0) return () => {};

  ensureScrollTriggerRegistered();

  const tween = gsap.fromTo(
    staggered,
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: headline ?? mockup ?? statusEntries[0],
        start: "top 82%",
        toggleActions: "play none none none",
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export interface VaccinationStatusFocusTargets {
  section: HTMLElement | null;
  statusEntries: HTMLElement[];
}

const DESKTOP_HEADER_HEIGHT = 84;

/**
 * Curto momento pinado (desktop, ~90vh — bem mais curto que o pin da
 * seção Problema, de propósito: Prompt 7 §27 pede uma experiência mais
 * enxuta aqui) só pra dar destaque sequencial a cada estado de vacinação,
 * a micro-narrativa pedida em §19/§26. Fora do desktop isso nem é criado.
 */
export function playVaccinationStatusFocus(targets: VaccinationStatusFocusTargets): () => void {
  const { section, statusEntries } = targets;
  if (!section || statusEntries.length === 0) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: () => `top ${DESKTOP_HEADER_HEIGHT}`,
      end: "+=90%",
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  // Baseline explícito em t=0: sem isso, um card cuja própria animação
  // ainda não foi alcançada pelo scrub (ex.: link direto pra #vacinacao já
  // scrollado fundo, sem passar pelo início do timeline) fica preso na
  // opacity:0 declarada em CSS — nenhum tween chegou a tocar nele ainda.
  // Um .set em t=0 é sempre "passado" em qualquer progresso > 0, então
  // garante todo mundo visível independente de onde o scroll começa.
  tl.set(statusEntries, { opacity: 1, scale: 1 }, 0);

  const segment = 1 / statusEntries.length;

  statusEntries.forEach((entry, index) => {
    const others = statusEntries.filter((_, i) => i !== index);
    const at = index * segment;

    tl.to(entry, { scale: 1.06, opacity: 1, duration: segment * 0.7, ease: "power1.inOut" }, at)
      .to(others, { scale: 0.97, opacity: 0.45, duration: segment * 0.7, ease: "power1.inOut" }, at);
  });

  // Estado final: todos legíveis de novo, sem nenhum apagado, antes de
  // liberar o scroll pra próxima seção.
  tl.to(statusEntries, { scale: 1, opacity: 1, duration: segment * 0.6, ease: "power1.out" });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
