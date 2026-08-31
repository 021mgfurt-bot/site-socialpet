/** Scroll suave até uma seção, exceto quando o usuário pediu menos movimento. */
export function scrollToSection(id: string, reducedMotion: boolean): void {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
