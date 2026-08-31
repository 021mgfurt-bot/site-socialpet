import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cx } from "../../lib/classNames";
import styles from "./TextLink.module.css";

interface CommonProps {
  className?: string;
  withArrow?: boolean;
  children: ReactNode;
}

type TextLinkAsInternal = CommonProps & { to: string; href?: undefined };
type TextLinkAsExternal = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };
type TextLinkAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined };

type TextLinkProps = TextLinkAsInternal | TextLinkAsExternal | TextLinkAsButton;

function Arrow({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className={styles.arrow} aria-hidden="true">
      →
    </span>
  );
}

/**
 * Link de baixo compromisso (ex.: "Ler nossa política de privacidade").
 * `to` navega internamente via React Router; `href` sai do app (URL
 * externa ou âncora); sem os dois, renderiza um <button> (ex.: scroll).
 */
export function TextLink({ className, withArrow, children, ...rest }: TextLinkProps) {
  const classes = cx(styles.link, className);

  if ("to" in rest && rest.to) {
    const { to, ...linkRest } = rest as TextLinkAsInternal;
    return (
      <Link className={classes} to={to} {...linkRest}>
        <span>{children}</span>
        <Arrow show={withArrow} />
      </Link>
    );
  }

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a className={classes} href={href} {...anchorRest}>
        <span>{children}</span>
        <Arrow show={withArrow} />
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} type={buttonRest.type ?? "button"} {...buttonRest}>
      <span>{children}</span>
      <Arrow show={withArrow} />
    </button>
  );
}
