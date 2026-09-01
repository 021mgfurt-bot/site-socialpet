import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface AgendaTimelineTargets {
  rail: HTMLElement | null;
  railFill: HTMLElement | null;
  todayEvents: HTMLElement[];
  recurrence: HTMLElement | null;
  next: HTMLElement | null;
  phone: HTMLElement | null;
}

/**
 * Uma timeline coordenada só, presa a um único ScrollTrigger no wrapper
 * da seção (Prompt 9 §38/§65: nada de um trigger por elemento). A "linha"
 * é um `scaleY` de 0→1 num elemento comum (não SVG — evita hardcodar
 * coordenadas de viewBox, Prompt 9 §58), os eventos de hoje entram em
 * stagger acompanhando o crescimento da linha, depois recorrência e
 * "próximo compromisso" revelam em sequência. Sem pin (Prompt 9 §36/§37).
 */
export function playAgendaEntrance(targets: AgendaTimelineTargets): () => void {
  const { rail, railFill, todayEvents, recurrence, next, phone } = targets;
  if (!rail) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: rail,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  if (railFill) {
    tl.fromTo(railFill, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "power2.out" }, 0);
  }

  if (todayEvents.length > 0) {
    tl.fromTo(
      todayEvents,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.15, ease: "power2.out" },
      0.2,
    );
  }

  if (recurrence) {
    tl.fromTo(recurrence, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.6);
  }

  if (next) {
    tl.fromTo(next, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.85);
  }

  if (phone) {
    tl.fromTo(phone, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.1);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export interface AgendaCompletionTargets {
  marker: HTMLElement | null;
  label: HTMLElement | null;
}

/**
 * Transformação pendente → concluído do primeiro horário de hoje —
 * marcador se preenche, rótulo "Feito" aparece (Prompt 9 §29). Trigger
 * próprio, mas leve (sem scrub/pin), disparado quando o próprio evento
 * entra em vista.
 */
export function playAgendaCompletion(targets: AgendaCompletionTargets): () => void {
  const { marker, label } = targets;
  if (!marker) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: marker,
      start: "top 82%",
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(marker, { scale: 0.6, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, 0.3);
  if (label) {
    tl.fromTo(label, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, 0.5);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
