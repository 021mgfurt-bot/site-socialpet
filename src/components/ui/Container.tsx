import type { ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./Container.module.css";

type ContainerTag = "div" | "header" | "footer" | "nav" | "article";

interface ContainerProps {
  as?: ContainerTag;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Container de conteúdo alinhado à grade (largura máxima ~1320px, ou
 * ~1440px em `wide`). Fundos/decoração full-bleed vivem fora deste
 * componente, no Section — o Container só limita o texto/CTA.
 */
export function Container({ as = "div", wide = false, className, children }: ContainerProps) {
  const Tag = as;
  return <Tag className={cx(styles.container, wide && styles.wide, className)}>{children}</Tag>;
}
