import { forwardRef, type ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./DeviceMockup.module.css";

interface DeviceMockupProps {
  /** Descrição da tela mostrada, para leitor de tela. Omitir se `decorative`. */
  label?: string;
  decorative?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Moldura neutra de smartphone contemporâneo — bezel fino, Dynamic Island,
 * sem logotipo/branding de fabricante, sem reflexo artificial pesado
 * (Wireframe & Visual System §30; refinado no ajuste de Hero — inspiração
 * "iPhone 17" só como referência de proporção/acabamento, nunca cópia de
 * marca). A tela real do SocialPet é sempre o protagonista.
 */
export const DeviceMockup = forwardRef<HTMLDivElement, DeviceMockupProps>(function DeviceMockup(
  { label, decorative = false, className, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(styles.frame, className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? "true" : undefined}
    >
      <div className={styles.screen}>
        {children}
        <div className={styles.dynamicIsland} aria-hidden="true" />
      </div>
      <span className={styles.sideButtonLeft} aria-hidden="true" />
      <span className={styles.sideButtonRight} aria-hidden="true" />
    </div>
  );
});
