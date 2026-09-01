import { ensureScrollTriggerRegistered, gsap } from "./gsap";

export interface AlbumEntranceTargets {
  stage: HTMLElement | null;
  photoLarge: HTMLElement | null;
  photoB: HTMLElement | null;
  photoC: HTMLElement | null;
  photoD: HTMLElement | null;
  collection: HTMLElement | null;
  interfaceBlock: HTMLElement | null;
}

/**
 * Uma timeline só, presa a um único ScrollTrigger no estágio de fotos
 * (Prompt 10 §28/§29/§66): a foto grande entra primeiro (o momento de
 * pausa pedido em §18), depois as duas menores em stagger, depois a foto
 * que "transborda" por baixo, depois o rótulo da coleção, depois o bloco
 * de interface. Sem pin (§30). Movimento mais lento/suave que Despesas e
 * Agenda de propósito (§27): easings mais longos, sem bounce/spring.
 *
 * `photoB` e `photoD` também recebem parallax contínuo por scrub
 * (`playAlbumParallax`) — para as duas tweens não brigarem pela mesma
 * propriedade `y` no mesmo frame, a entrada delas usa só opacity+scale, e
 * quem é dono de `y` nesses dois elementos é sempre o parallax.
 */
export function playAlbumEntrance(targets: AlbumEntranceTargets): () => void {
  const { stage, photoLarge, photoB, photoC, photoD, collection, interfaceBlock } = targets;
  if (!stage) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top 78%",
      toggleActions: "play none none none",
    },
  });

  if (photoLarge) {
    tl.fromTo(
      photoLarge,
      { opacity: 0, scale: 0.96, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "sine.out" },
      0,
    );
  }

  if (photoB) {
    tl.fromTo(photoB, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: "sine.out" }, 0.35);
  }

  if (photoC) {
    tl.fromTo(photoC, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "sine.out" }, 0.55);
  }

  if (photoD) {
    tl.fromTo(photoD, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.9, ease: "sine.out" }, 0.6);
  }

  if (collection) {
    tl.fromTo(collection, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "sine.out" }, 1.05);
  }

  if (interfaceBlock) {
    tl.fromTo(
      interfaceBlock,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "sine.out" },
      1.3,
    );
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export interface AlbumParallaxTargets {
  stage: HTMLElement | null;
  photoB: HTMLElement | null;
  photoD: HTMLElement | null;
}

/**
 * Parallax extremamente sutil (Prompt 10 §31): duas fotos se deslocam
 * poucos pixels, em velocidades diferentes, enquanto o estágio atravessa
 * a viewport. `scrub` suavizado (não 1:1) para não parecer preso ao
 * scroll. Único dono da propriedade `y` de `photoB`/`photoD` (ver
 * comentário em `playAlbumEntrance`). Trigger próprio — scrub e a entrada
 * `toggleActions` não podem dividir o mesmo ScrollTrigger — 2º e último
 * desta seção, dentro do orçamento do §66.
 */
export function playAlbumParallax(targets: AlbumParallaxTargets): () => void {
  const { stage, photoB, photoD } = targets;
  if (!stage) return () => {};

  ensureScrollTriggerRegistered();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  if (photoB) {
    tl.fromTo(photoB, { y: -18 }, { y: 18, ease: "none" }, 0);
  }
  if (photoD) {
    tl.fromTo(photoD, { y: -10 }, { y: 10, ease: "none" }, 0);
  }

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
