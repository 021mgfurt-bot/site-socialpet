import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { TextLink } from "../components/ui/TextLink";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playPrivacyEntrance } from "../motion/privacyEntrance";
import { gsap } from "../motion/gsap";
import styles from "./Privacy.module.css";

/**
 * Privacidade + confiança (Prompt 11, headline/copy ajustadas no Prompt
 * 11.1, card "Para que usamos" ajustado de novo no Prompt 11.2). Todo
 * claim aqui foi verificado no código real de `apppetshop` antes de virar
 * copy — ver o relatório do Prompt 11 para a auditoria completa,
 * evidência por claim, e a lista do que foi removido por falta de
 * evidência (ex.: não afirmamos que dá pra excluir a conta ou os dados,
 * porque isso não existe hoje; não mencionamos compartilhamento entre
 * contas, porque a "Família" do app é simulada em localStorage, sem
 * persistência real no servidor).
 *
 * A headline original ("o que entra na sua conta, fica na sua conta")
 * foi trocada no Prompt 11.1 por soar como uma garantia mais ampla do
 * que a auditoria comprova — a informação passa por serviços técnicos
 * reais do produto (Resend para e-mail de redefinição de senha, storage
 * MinIO, banco Postgres), então "fica só na conta" não é uma frase
 * estreita o bastante. A nova headline afirma só o que foi verificado:
 * a finalidade (organizar a rotina do pet) e a ausência de rastreador de
 * publicidade — nenhum GA/GTM/Meta Pixel/Hotjar/Clarity/Mixpanel/
 * Segment/PostHog/pixel de anúncio existe no site nem no app; nenhum
 * cookie é usado em nenhum dos dois.
 *
 * O card "Para que usamos" passou por dois ajustes: o Prompt 11.1 tirou o
 * claim de anunciante dali (já dito na copy de apoio, repetir não soma
 * evidência) e deixou "só para fazer essas telas funcionarem, nada além
 * disso" — mas "nada além disso" é absoluto demais: a auditoria também
 * confirma uso de informação em autenticação, perfil, recuperação de
 * senha e demais operações normais da conta, não só nas telas de
 * produto. O Prompt 11.2 trocou por uma frase que cobre esse uso mais
 * amplo sem prometer nada além do verificado. `/privacidade` segue
 * marcada "conteúdo em revisão" (texto jurídico definitivo pendente) —
 * esta seção não antecipa esse texto, só aponta pra ele.
 */
export function Privacy() {
  const reducedMotion = useReducedMotion();

  const introRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      gsap.set([introRef.current, surfaceRef.current], { opacity: 1, y: 0 });
      return;
    }

    const cleanup = playPrivacyEntrance({ intro: introRef.current, surface: surfaceRef.current });
    return cleanup;
  }, [reducedMotion]);

  return (
    <Section id="privacidade" tone="paper" ariaLabel="Privacidade e confiança">
      <Container>
        <div className={styles.layout}>
          <div ref={introRef} className={styles.intro}>
            <h2 className={styles.headline}>
              Suas informações organizam a rotina do seu pet, não uma campanha de anúncio.
            </h2>
            <p className={styles.copy}>
              As informações que você adiciona ajudam o SocialPet a organizar vacinas, despesas, agenda e
              fotos de cada pet. O site e o aplicativo não usam rastreador de publicidade.
            </p>
          </div>

          <div ref={surfaceRef} className={styles.surface}>
            <span className={styles.surfaceEyebrow}>SocialPet · Privacidade</span>

            <ul className={styles.pointList}>
              <li className={styles.point}>
                <h3 className={styles.pointTitle}>O que você informa</h3>
                <p className={styles.pointText}>
                  Dados da sua conta e dos seus pets: os mesmos que aparecem nas telas de vacinação,
                  despesas, agenda e álbum.
                </p>
              </li>
              <li className={styles.point}>
                <h3 className={styles.pointTitle}>Para que usamos</h3>
                <p className={styles.pointText}>Para manter sua conta funcionando e organizar as informações de cada pet.</p>
              </li>
              <li className={styles.point}>
                <h3 className={styles.pointTitle}>Onde encontrar os detalhes</h3>
                <p className={styles.pointText}>
                  A Política de Privacidade explica tudo isso com mais profundidade.
                </p>
              </li>
            </ul>

            <div className={styles.links}>
              <TextLink to="/privacidade" withArrow>
                Ver Política de Privacidade
              </TextLink>
              <TextLink to="/contato" withArrow>
                Ficou com alguma dúvida?
              </TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
