import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { loginUrl, signUpUrl, externalAppLinkProps } from "../config/env";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playCtaFinalEntrance } from "../motion/ctaFinalEntrance";
import { gsap } from "../motion/gsap";
import styles from "./CtaFinal.module.css";

/**
 * Fechamento definitivo da Home (Prompt 13) — última seção narrativa
 * antes do Footer. Visualmente parente do Install Spotlight (mesma
 * família cromática, coral/terracotta) mas não duplicata: aqui a
 * superfície é a própria seção (full-bleed, sem cartão arredondado
 * contido no Container) e o gradiente vai até --color-coral-deepest
 * (Prompt 15.2 — antes ia até --color-ink-deep, um tom quase preto que
 * não existe no app real), mais dramático que Install Spotlight, porque
 * essa é a resposta a uma pergunta diferente — Install Spotlight resolve
 * "como deixo fácil de acessar", este bloco resolve "quero começar a
 * usar" (Prompt 13 §49).
 *
 * Sem preço, sem "grátis", sem trial, sem urgência — o cadastro de hoje
 * não passa por cobrança, mas isso não foi definido comercialmente como
 * plano gratuito (mesma regra do Prompt 12, reaplicada aqui).
 */
export function CtaFinal() {
  const reducedMotion = useReducedMotion();
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      gsap.set(blockRef.current, { opacity: 1, y: 0 });
      return;
    }

    const cleanup = playCtaFinalEntrance({ block: blockRef.current });
    return cleanup;
  }, [reducedMotion]);

  return (
    <Section id="cta" padding="hero" ariaLabel="Criar minha conta no SocialPet" className={styles.section}>
      <Container>
        <div ref={blockRef} className={styles.block}>
          <img src="/icon-192.png" alt="" className={styles.mark} width={40} height={40} />

          <h2 className={styles.headline}>
            Cada vacina, despesa, lembrete e foto do seu pet já tem lugar certo no SocialPet.
          </h2>

          <p className={styles.copy}>A conta é criada direto no aplicativo, sem loja de aplicativos e sem pagamento.</p>

          <div className={styles.actions}>
            <a className={styles.cta} href={signUpUrl} {...externalAppLinkProps}>
              Criar minha conta
            </a>
            <a className={styles.secondary} href={loginUrl} {...externalAppLinkProps}>
              Já tenho uma conta
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
