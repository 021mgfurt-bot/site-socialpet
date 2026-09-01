import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { TextLink } from "../components/ui/TextLink";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playPlansEntrance } from "../motion/plansEntrance";
import { gsap } from "../motion/gsap";
import styles from "./Plans.module.css";

/**
 * Teaser curto de Planos na Home (Prompt 12) — não duplica `/planos`, só
 * aponta pra ela. Substituiu o placeholder estrutural "planos" que existia
 * em `HOME_SECTIONS` (mesmo padrão do que aconteceu com "privacidade" no
 * Prompt 11). `HOME_SECTIONS`/`PlaceholderSection` foram removidos no
 * Prompt 13, quando os últimos placeholders ("pwa", redundante com
 * Install Spotlight; "faq" e "cta", implementados de verdade) deixaram de
 * existir.
 *
 * Auditoria do Prompt 12 confirmou: nenhum plano, preço, checkout ou
 * assinatura recorrente existe no produto real hoje; criar conta não
 * passa por nenhum gate de pagamento. Por isso esta seção não promete
 * preço, não usa "grátis"/"gratuito" (criar conta sem cobrança não é o
 * mesmo que uma decisão comercial de "plano gratuito" — Prompt 12 §26-27)
 * e não menciona data de lançamento.
 */
export function Plans() {
  const reducedMotion = useReducedMotion();
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(blockRef.current, { opacity: 1, y: 0 });
      return;
    }

    const cleanup = playPlansEntrance({ block: blockRef.current });
    return cleanup;
  }, [reducedMotion]);

  return (
    <Section id="planos" tone="base" ariaLabel="Planos do SocialPet">
      <Container>
        <div ref={blockRef} className={styles.block}>
          <h2 className={styles.headline}>Os planos do SocialPet ainda estão sendo definidos.</h2>
          <p className={styles.copy}>
            Você já pode criar uma conta e usar o aplicativo hoje. Quando o modelo de assinatura
            estiver pronto, a página de planos explica o que muda.
          </p>
          <TextLink to="/planos" withArrow>
            Ver planos
          </TextLink>
        </div>
      </Container>
    </Section>
  );
}
