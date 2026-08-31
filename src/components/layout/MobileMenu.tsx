import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../../data/navLinks";
import { loginUrl, signUpUrl, externalAppLinkProps } from "../../config/env";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { cx } from "../../lib/classNames";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      className={cx(styles.overlay, open && styles.open)}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      aria-hidden={!open}
    >
      <nav className={styles.nav} aria-label="Navegação mobile">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} to={link.to} className={styles.navLink} onClick={onClose}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <a className={styles.enterLink} href={loginUrl} onClick={onClose} {...externalAppLinkProps}>
          Entrar
        </a>
        <a className={styles.createLink} href={signUpUrl} onClick={onClose} {...externalAppLinkProps}>
          Criar minha conta
        </a>
      </div>
    </div>
  );
}
