import type { ReactNode } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { Container } from "../../components/ui/Container";
import { TextLink } from "../../components/ui/TextLink";
import { useRobotsMeta } from "../../hooks/useRobotsMeta";
import { useDocumentHead } from "../../hooks/useDocumentHead";
import styles from "./LegalPageLayout.module.css";

interface LegalPageLayoutProps {
  title: string;
  summary: string;
  /** Caminho da rota, ex.: "/privacidade" — usado só pro title/description
   * por rota (Prompt 14); o canonical real de uma página noindex não
   * importa pra indexação, mas manter os dois em sincronia evita um
   * `<title>` desatualizado na aba do navegador. */
  path: string;
  toc?: { id: string; label: string }[];
  /**
   * Enquanto `false` (padrão), a página mostra o aviso "CONTEÚDO EM
   * REVISÃO" e é marcada `noindex` — impede que uma página com texto
   * jurídico provisório seja indexada por engano (Prompt 5 §26). Passar
   * `true` só quando o conteúdo final for aprovado; os dois sinais
   * (aviso visível + noindex) andam juntos de propósito, para não ter
   * como aprovar um sem o outro.
   */
  reviewed?: boolean;
  children: ReactNode;
}

export function LegalPageLayout({ title, summary, path, toc, reviewed = false, children }: LegalPageLayoutProps) {
  useRobotsMeta(reviewed ? "index, follow" : "noindex, nofollow");
  useDocumentHead({ title: `${title} | SocialPet`, description: summary, path });

  return (
    <>
      <Header variant="reduced" />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <div className={styles.page}>
            <header className={styles.header}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.summary}>{summary}</p>
              {!reviewed && (
                <div className={styles.reviewNotice} role="note">
                  CONTEÚDO EM REVISÃO. Esta página ainda não tem o texto jurídico definitivo. O que
                  está aqui é a estrutura da página, não a política final.
                </div>
              )}
            </header>

            <div className={styles.body}>
              {toc && toc.length > 0 && (
                <nav className={styles.toc} aria-label={`Nesta página: ${title}`}>
                  <span className={styles.tocTitle}>Nesta página</span>
                  <ul>
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className={styles.content}>{children}</div>
            </div>

            <div className={styles.contact}>
              <p>Dúvidas sobre esta página?</p>
              <TextLink to="/contato" withArrow>
                Falar com o SocialPet
              </TextLink>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
