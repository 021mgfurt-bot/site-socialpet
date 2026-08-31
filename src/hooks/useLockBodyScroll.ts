import { useLayoutEffect } from "react";

/**
 * Bloqueia o scroll do body preservando a posição de rolagem atual, e
 * restaura exatamente essa posição ao destravar (usado pelo menu mobile).
 */
export function useLockBodyScroll(locked: boolean): void {
  useLayoutEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previousStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previousStyle.position;
      body.style.top = previousStyle.top;
      body.style.left = previousStyle.left;
      body.style.right = previousStyle.right;
      body.style.width = previousStyle.width;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
