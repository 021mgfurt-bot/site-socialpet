import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { FaqItem } from "../components/ui/FaqItem";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playFaqEntrance } from "../motion/faqEntrance";
import { gsap } from "../motion/gsap";
import styles from "./Faq.module.css";

/**
 * FAQ da Home (Prompt 13). As 6 perguntas nascem das auditorias reais dos
 * Prompts 9, 11 e 12 — nenhuma é genérica de template ("por que escolher
 * o SocialPet?"). Cada resposta é reescrita aqui, mais curta, e não
 * repete os parágrafos de Vacinação/Despesas/Privacidade/Planos.
 *
 * Perguntas deliberadamente fora daqui, por falta de evidência ou por
 * exigirem uma resposta só negativa (Prompt 13 §12/§13/§14/§15):
 * notificação de agenda com app fechado, compartilhamento entre contas
 * ("família"), exclusão de conta ou de qualquer dado (pet, vacina,
 * despesa, foto, lembrete, relatório) — nada disso existe hoje de ponta
 * a ponta no produto real.
 */
const FAQ_ITEMS = [
  {
    question: "Preciso baixar o SocialPet em alguma loja de aplicativos?",
    answer:
      "Não. O SocialPet funciona direto pelo navegador, e dá pra adicionar um atalho na tela inicial do celular ou computador pra acessar mais rápido depois.",
  },
  {
    question: "Posso cadastrar mais de um pet?",
    answer: "Pode. Cada pet tem sua própria vacinação, despesas, agenda e álbum dentro da mesma conta.",
  },
  {
    question: "O SocialPet mostra quando uma vacina está perto de vencer?",
    answer:
      "O status de cada vacina, em dia, vencendo ou vencida, é calculado a partir da data que você registrou e fica visível direto na tela do pet.",
  },
  {
    question: "Dá pra acompanhar os gastos com cada pet?",
    answer: "Dá. Cada despesa fica registrada com data, categoria e valor, e vira um relatório que você consulta quando quiser.",
  },
  {
    question: "O SocialPet já é pago?",
    answer:
      "Hoje não. Criar uma conta e usar o SocialPet não passa por nenhuma cobrança agora. Os planos pagos ainda estão sendo definidos, sem preço nem data pra anunciar.",
  },
  {
    question: "O que acontece com as informações que eu cadastro?",
    answer:
      "Elas servem pra manter sua conta funcionando e organizar as informações de cada pet: vacinação, despesas, agenda e fotos. O site e o aplicativo não usam rastreador de publicidade.",
  },
];

export function Faq() {
  const reducedMotion = useReducedMotion();
  const introRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      gsap.set([introRef.current, listRef.current], { opacity: 1, y: 0 });
      return;
    }

    const cleanup = playFaqEntrance({ intro: introRef.current, list: listRef.current });
    return cleanup;
  }, [reducedMotion]);

  return (
    <Section id="faq" tone="paper" ariaLabel="Perguntas frequentes">
      <Container>
        <div className={styles.layout}>
          <div ref={introRef} className={styles.intro}>
            <h2 className={styles.headline}>Algumas dúvidas antes de começar.</h2>
          </div>

          <ul ref={listRef} className={styles.list}>
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
