import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MobileMenu } from "./MobileMenu";
import { loginUrl, signUpUrl } from "../../config/env";
import { NAV_LINKS } from "../../data/navLinks";
import { cx } from "../../lib/classNames";
import styles from "./Header.module.css";

interface HeaderProps {
  /** "reduced" omite a navegação principal — usado nas páginas legais. */
  variant?: "full" | "reduced";
}

export function Header({ variant = "full" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(variant === "reduced");
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    if (variant === "reduced") return;

    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking.current = false;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  return (
    <header className={cx(styles.header, (scrolled || menuOpen) && styles.scrolled)}>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className={styles.bar}>
        <Logo />

        {variant === "full" && (
          <nav className={styles.nav} aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={styles.actions}>
          <a className={styles.enterLink} href={loginUrl}>
            Entrar
          </a>
          <Button href={signUpUrl} variant="primary" className={styles.desktopCta}>
            Criar minha conta
          </Button>
          <Button href={signUpUrl} variant="primary" className={styles.mobileCta}>
            Criar conta
          </Button>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={cx(styles.menuIcon, menuOpen && styles.menuIconOpen)} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
