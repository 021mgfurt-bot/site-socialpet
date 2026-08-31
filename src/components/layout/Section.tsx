import { forwardRef, type ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./Section.module.css";

interface SectionProps {
  id: string;
  tone?: "base" | "paper";
  padding?: "default" | "hero" | "none";
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  children: ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, tone = "base", padding = "default", ariaLabel, ariaLabelledBy, className, children },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cx(
        styles.section,
        tone === "paper" && styles.paper,
        padding === "hero" && styles.paddingHero,
        padding === "none" && styles.paddingNone,
        className,
      )}
    >
      {children}
    </section>
  );
});
