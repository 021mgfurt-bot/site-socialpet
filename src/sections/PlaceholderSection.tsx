import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import styles from "./PlaceholderSection.module.css";

interface PlaceholderSectionProps {
  id: string;
  title: string;
  tone?: "base" | "paper";
}

/**
 * Placeholder estrutural discreto — existe só para permitir navegação por
 * âncora e validar o fluxo da Home (Prompt 4 §29). A composição real de
 * cada seção é trabalho de um prompt futuro; isto não é a seção final.
 *
 * Só aparece em `vite dev` (`import.meta.env.DEV`). Qualquer build — seja
 * homologação ou produção — nunca mostra o rótulo "Em desenvolvimento":
 * isso evitaria o site parecer quebrado numa visualização externa antes de
 * as seções reais existirem (Prompt 5 §32). O `id` continua presente para
 * as âncoras do header não apontarem para lugar nenhum.
 */
export function PlaceholderSection({ id, title, tone = "base" }: PlaceholderSectionProps) {
  if (!import.meta.env.DEV) {
    return <div id={id} aria-hidden="true" />;
  }

  return (
    <Section id={id} tone={tone} ariaLabel={title}>
      <Container>
        <div className={styles.placeholder}>
          <span className={styles.tag}>Em desenvolvimento</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
      </Container>
    </Section>
  );
}
