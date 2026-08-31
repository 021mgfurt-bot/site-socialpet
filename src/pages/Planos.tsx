import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { EditorialHeading } from "../components/ui/EditorialHeading";
import styles from "./Planos.module.css";

export function Planos() {
  return (
    <Section id="planos-page" ariaLabel="Planos do SocialPet">
      <Container>
        <div className={styles.intro}>
          <EditorialHeading level="h1">Planos em evolução</EditorialHeading>
          <p className={styles.copy}>
            Hoje o SocialPet está disponível de graça, com tudo que você viu até aqui. Estamos
            desenhando novos planos, mas ainda não temos preço nem data para anunciar. Quando isso
            existir de verdade, esta página muda para mostrar.
          </p>
        </div>

        {import.meta.env.DEV && (
          <div className={styles.placeholder}>
            <span className={styles.tag}>Em desenvolvimento</span>
            <p className={styles.placeholderText}>
              A comparação de planos e recursos entra aqui assim que houver algo real para comparar.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
