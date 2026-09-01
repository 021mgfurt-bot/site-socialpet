import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { EditorialHeading } from "../components/ui/EditorialHeading";
import { Button } from "../components/ui/Button";
import { TextLink } from "../components/ui/TextLink";
import { signUpUrl, externalAppLinkProps } from "../config/env";
import { PRICING_STATUS } from "../data/plans";
import styles from "./Planos.module.css";

/**
 * Página de transparência comercial (Prompt 12). Auditoria confirmou, no
 * código real de `apppetshop`: nenhum plano, preço, checkout, gateway de
 * pagamento, trial ou assinatura recorrente existe hoje — só
 * `POST /api/auth/register`, sem nenhum gate de pagamento. Por isso esta
 * página nunca chama a conta criada hoje de "plano grátis" (criar conta
 * sem cobrança não é a mesma coisa que uma decisão comercial de oferecer
 * um plano gratuito — Prompt 12 §26-27): ela descreve só o fato
 * observável (dá pra criar conta agora, sem pagamento) e é explícita
 * sobre o que ainda não existe (preço, data de lançamento).
 *
 * `PRICING_STATUS` (`src/data/plans.ts`) é o único ponto de decisão de
 * qual conteúdo esta página mostra — hoje só existe o branch
 * "not-launched". Quando planos reais existirem, um novo status entra em
 * `plans.ts` e este arquivo ganha o branch correspondente, sem precisar
 * de outra rota.
 */
const FAQ = [
  {
    question: "Há cobrança hoje?",
    answer: "Não. Criar uma conta e usar o SocialPet agora não passa por nenhum pagamento.",
  },
  {
    question: "Os planos já têm preço definido?",
    answer: "Ainda não. Estamos decidindo como vai funcionar, sem preço nem data pra anunciar.",
  },
  {
    question: "Posso criar uma conta agora?",
    answer: "Sim, direto no aplicativo — não precisa esperar os planos serem lançados.",
  },
];

export function Planos() {
  return (
    <Section id="planos-page" ariaLabel="Planos do SocialPet">
      <Container>
        <div className={styles.intro}>
          <EditorialHeading level="h1">O SocialPet já existe. O preço ainda não.</EditorialHeading>
          <p className={styles.copy}>
            Vacinação, despesas, agenda e álbum de fotos por pet já funcionam hoje, pra quem cria uma
            conta. Os planos pagos ainda estão sendo definidos, sem preço nem data pra anunciar. Quando
            existirem, esta página muda pra mostrar exatamente o que muda pra você.
          </p>

          <div className={styles.actions}>
            <Button href={signUpUrl} variant="primary" {...externalAppLinkProps}>
              Criar minha conta
            </Button>
            <TextLink to="/contato" withArrow>
              Ficou com alguma dúvida?
            </TextLink>
          </div>
        </div>

        {PRICING_STATUS === "not-launched" && (
          <div className={styles.faqBlock}>
            <h2 className={styles.faqTitle}>Perguntas sobre cobrança</h2>
            <ul className={styles.faqList}>
              {FAQ.map((item) => (
                <li key={item.question} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.question}</h3>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
