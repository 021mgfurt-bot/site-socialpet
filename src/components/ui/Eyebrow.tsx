import type { ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return <p className={cx(styles.eyebrow, className)}>{children}</p>;
}
