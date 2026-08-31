import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Prende o foco dentro de `containerRef` enquanto `active` for verdadeiro
 * (Tab/Shift+Tab não escapam do container) e restaura o foco para o
 * elemento que estava focado antes de abrir, ao fechar. Usado pelo menu
 * mobile — qualquer outro overlay futuro (diálogo, drawer) deve reutilizar
 * este hook em vez de reimplementar a lógica de foco.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    // Um frame de atraso: logo após abrir, o elemento ainda pode estar
    // marcado como não-focável pelo navegador (transição de `aria-hidden`/
    // visibilidade não terminou de ser recalculada no mesmo tick em que o
    // clique que abriu o menu também focou o próprio botão). Sem isso, o
    // foco ficava preso no botão que abriu o menu em vez de ir para o
    // primeiro link — bug real visto no teste automatizado deste prompt.
    // `requestAnimationFrame` não é suficiente: no primeiro frame da
    // transição CSS de abertura (opacity/visibility), o Chromium ainda
    // recusa foco no elemento recém-visível (confirmado em teste
    // automatizado — o foco voltava pro botão que abriu o menu mesmo
    // chamando `.focus()` explicitamente). Um `setTimeout` curto, depois
    // do frame de transição já ter começado a renderizar, resolve.
    const timeoutId = window.setTimeout(() => {
      focusables()[0]?.focus();
    }, 50);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      container.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}
