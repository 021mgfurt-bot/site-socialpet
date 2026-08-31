import type { ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./EditorialHeading.module.css";

type HeadingLevel = "h1" | "h2" | "h3";
type HeadingSize = "display-xl" | "display-lg" | "h1" | "h2" | "h3";

interface EditorialHeadingProps {
  level: HeadingLevel;
  size?: HeadingSize;
  id?: string;
  className?: string;
  children: ReactNode;
}

const sizeClassMap: Record<HeadingSize, string> = {
  "display-xl": styles.displayXl,
  "display-lg": styles.displayLg,
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
};

/**
 * Headline em Instrument Serif — reservada a momentos editoriais/emocionais
 * (ver Wireframe & Visual System §5). Nunca usada em componentes funcionais
 * (botão, badge, item de menu).
 */
export function EditorialHeading({ level, size, id, className, children }: EditorialHeadingProps) {
  const Tag = level;
  const resolvedSize = size ?? level;
  return (
    <Tag id={id} className={cx(styles.heading, sizeClassMap[resolvedSize], className)}>
      {children}
    </Tag>
  );
}
