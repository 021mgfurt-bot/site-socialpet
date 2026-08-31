import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/classNames";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Primary/Secondary do site — nunca usados para links de baixo compromisso
 * (isso é TextLink). Renderiza <a> quando `href` é passado (CTAs que saem
 * para a aplicação real), <button> caso contrário (ex.: "Ver como funciona",
 * que faz scroll interno).
 */
export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  const classes = cx(styles.button, variant === "primary" ? styles.primary : styles.secondary, className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a className={classes} href={href} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} type={buttonRest.type ?? "button"} {...buttonRest}>
      {children}
    </button>
  );
}
