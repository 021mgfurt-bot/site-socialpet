import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { NAV_LINKS } from "../../data/navLinks";
import { loginUrl, signUpUrl } from "../../config/env";
import styles from "./Footer.module.css";

const LEGAL_LINKS = [
  { label: "Privacidade", to: "/privacidade" },
  { label: "Cookies", to: "/cookies" },
  { label: "Termos de uso", to: "/termos" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>
            Vacinas, despesas, agenda e memórias de cada pet, guardadas num só lugar.
          </p>
        </div>

        <nav className={styles.column} aria-label="Navegação">
          <span className={styles.columnTitle}>Navegação</span>
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.column}>
          <span className={styles.columnTitle}>Aplicação</span>
          <a className={styles.link} href={loginUrl}>
            Acessar o SocialPet
          </a>
          <a className={styles.link} href={signUpUrl}>
            Criar minha conta
          </a>
        </div>

        <nav className={styles.column} aria-label="Legal">
          <span className={styles.columnTitle}>Legal</span>
          {LEGAL_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={styles.link}>
              {link.label}
            </Link>
          ))}
          <Link to="/contato" className={styles.link}>
            Contato
          </Link>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© {year} SocialPet. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
