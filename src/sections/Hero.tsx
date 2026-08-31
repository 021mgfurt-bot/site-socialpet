import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { TextLink } from "../components/ui/TextLink";
import { DeviceMockup } from "../components/ui/DeviceMockup";
import { MockupPlaceholder } from "../components/media/MockupPlaceholder";
import { HeroSceneSlot } from "../three/HeroSceneSlot";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playHeroEntrance } from "../motion/heroEntrance";
import { playHeroScrollExit } from "../motion/heroScrollExit";
import { scrollToSection } from "../lib/scrollToSection";
import { signUpUrl, externalAppLinkProps } from "../config/env";
import styles from "./Hero.module.css";

export function Hero() {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const sceneStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupEntrance = playHeroEntrance(
      {
        eyebrow: null,
        headline: headlineRef.current,
        copy: copyRef.current,
        ctas: ctasRef.current,
        mockup: mockupRef.current,
        scene: sceneStageRef.current,
      },
      reducedMotion,
    );

    const cleanupExit = playHeroScrollExit(
      {
        section: sectionRef.current,
        headline: headlineRef.current,
        mockup: mockupRef.current,
        scene: sceneStageRef.current,
      },
      reducedMotion,
    );

    return () => {
      cleanupEntrance();
      cleanupExit();
    };
    // Roda uma única vez na montagem; reducedMotion não muda a decisão
    // depois que o Hero já entrou em cena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSeeHowItWorks() {
    scrollToSection("problema", reducedMotion);
  }

  return (
    <Section
      ref={sectionRef}
      id="hero"
      padding="none"
      className={styles.heroSection}
      ariaLabel="Apresentação do SocialPet"
    >
      <Container>
        <div className={styles.layout}>
          <div className={styles.textBlock}>
            <h1 ref={headlineRef} className={styles.headline}>
              A vida do seu pet,
              <br />
              organizada com cuidado.
            </h1>

            <p ref={copyRef} className={styles.copy}>
              Vacinas, despesas, agenda e memórias reunidas em um só lugar, para você cuidar com mais
              clareza no dia a dia.
            </p>

            <div ref={ctasRef} className={styles.ctas}>
              <Button href={signUpUrl} variant="primary" {...externalAppLinkProps}>
                Criar minha conta
              </Button>
              <TextLink onClick={handleSeeHowItWorks} withArrow>
                Ver como funciona
              </TextLink>
            </div>
          </div>

          <div className={styles.visualBlock}>
            <div ref={sceneStageRef} className={styles.sceneStage}>
              <HeroSceneSlot />
            </div>
            <DeviceMockup
              ref={mockupRef}
              label="Captura real do SocialPet, em preparação"
              className={styles.mockup}
            >
              <MockupPlaceholder />
            </DeviceMockup>
          </div>
        </div>
      </Container>
    </Section>
  );
}
