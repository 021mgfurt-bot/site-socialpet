import { ScrollTrigger } from "../motion/gsap";

/**
 * Scroll suave até uma seção, exceto quando o usuário pediu menos
 * movimento. Se a seção já estiver pinada por um ScrollTrigger (ex.:
 * Vacinação em desktop), `scrollIntoView` não é confiável: o elemento
 * pinado vira `position: fixed`, então o navegador acha que "já está
 * visível" e não rola o suficiente — o usuário chega com o scroll no
 * meio da timeline pinada, num estado de foco/dimming pensado pra ser
 * alcançado rolando aos poucos, não como estado inicial. Nesse caso,
 * rolamos direto para o pixel onde o ScrollTrigger começa (`.start`,
 * já calculado por ele) em vez de pedir pro navegador decidir.
 */
export function scrollToSection(id: string, reducedMotion: boolean): void {
  const target = document.getElementById(id);
  if (!target) return;

  const pinTrigger = ScrollTrigger.getAll().find(
    (st) => st.pin === target || st.trigger === target,
  );

  if (pinTrigger) {
    // .start pode estar desatualizado se algo mudou a altura do documento
    // depois que esse ScrollTrigger foi criado (fonte terminando de
    // carregar, outra seção pinada acima calculando seu próprio spacer) —
    // recalcula antes de mirar nele. refresh() só recalcula números, não
    // move nada sozinho, então é seguro chamar aqui.
    ScrollTrigger.refresh();
    window.scrollTo({
      top: pinTrigger.start,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    return;
  }

  target.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
