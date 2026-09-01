import { forwardRef } from "react";
import { cx } from "../../lib/classNames";
import styles from "./PhotoPlaceholder.module.css";

interface AlbumPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Foto real do álbum da conta demo (Prompt 10.7) — mesma moldura visual
 * (borda, sombra, cantos) do PhotoPlaceholder que ela substitui, só que
 * com uma foto de verdade em vez de uma superfície de cor. `alt` sempre
 * descreve só o que está de fato visível, nunca inventa contexto (§40 do
 * Prompt 10, reafirmado no Prompt 10.7 §66).
 */
export const AlbumPhoto = forwardRef<HTMLImageElement, AlbumPhotoProps>(function AlbumPhoto(
  { src, alt, className },
  ref,
) {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      className={cx(styles.photo, styles.photoImg, className)}
    />
  );
});
