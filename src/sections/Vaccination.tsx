import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { DeviceMockup } from "../components/ui/DeviceMockup";
import { MockupPlaceholder } from "../components/media/MockupPlaceholder";
import { ProductVideo } from "../components/media/ProductVideo";
import { VACCINE_DEMO_RECORDS } from "../data/vaccineDemoRecords";
import { computeVaccineStatus } from "../lib/vaccineStatus";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { playVaccinationEntrance, playVaccinationStatusFocus } from "../motion/vaccinationTimeline";
import { gsap } from "../motion/gsap";
import { cx } from "../lib/classNames";
import styles from "./Vaccination.module.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Primeira funcionalidade real apresentada em profundidade (Prompt 7). A
 * tela dentro do mockup agora mostra uma captura real da conta demo
 * (Prompt 10.7, `public/product-demos/vaccination/vaccination-screen-mobile.png`,
 * capturada em resolução mobile real via DevTools) — os 3 estados de
 * vacina de Mel/Thor, gerados pela lógica real do app, não digitados).
 * Ainda é imagem estática, não vídeo (ver
 * docs/product-demo-capture.md para o porquê e como gerar o MP4 depois).
 * O protagonismo continua com os registros de status ao redor, que são
 * dados fictícios mas calculados pela mesma lógica da aplicação real (ver
 * lib/vaccineStatus.ts).
 */
export function Vaccination() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const statusRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const statusEntries = statusRefs.current.filter((el): el is HTMLLIElement => Boolean(el));

    if (reducedMotion) {
      gsap.set([headlineRef.current, copyRef.current, mockupRef.current, ...statusEntries], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    // No desktop, os registros de status são controlados só pelo pin
    // (playVaccinationStatusFocus) — dois ScrollTriggers animando opacity
    // no mesmo elemento é a causa real de um bug encontrado em QA (link
    // direto pra #vacinacao deixava 2 dos 3 registros presos em opacity:0,
    // porque o trigger de entrada não necessariamente "dispara" quando o
    // scroll já nasce além do seu ponto de início). Fora do desktop não
    // existe pin, então a entrada simples continua sendo a única fonte.
    const cleanupEntrance = playVaccinationEntrance({
      headline: headlineRef.current,
      copy: copyRef.current,
      mockup: mockupRef.current,
      statusEntries: isDesktop ? [] : statusEntries,
    });

    const cleanupFocus = isDesktop
      ? playVaccinationStatusFocus({ section: sectionRef.current, statusEntries })
      : () => {};

    return () => {
      cleanupEntrance();
      cleanupFocus();
    };
  }, [isDesktop, reducedMotion]);

  return (
    <Section ref={sectionRef} id="vacinacao" tone="paper" ariaLabel="Vacinação">
      <Container>
        <div className={styles.intro}>
          <h2 ref={headlineRef} className={styles.headline}>
            Você sabe quando vence a próxima vacina?
          </h2>
          <p ref={copyRef} className={styles.copy}>
            Cada vacina fica registrada com a data de aplicação e a validade. A partir daí, o
            SocialPet calcula sozinho o que está em dia, o que está vencendo e o que já venceu.
          </p>
        </div>

        <div className={styles.showcase}>
          <p className="visually-hidden">Exemplo de registros de vacinação:</p>
          <ul className={styles.statusStack}>
            {VACCINE_DEMO_RECORDS.map((record, index) => {
              const status = computeVaccineStatus(record.nextDueDate);
              return (
                <li
                  key={record.id}
                  ref={(el) => {
                    statusRefs.current[index] = el;
                  }}
                  className={cx(styles.statusEntry, styles[`tone-${status.tone}`])}
                >
                  <span className={styles.statusLabel}>{status.label}</span>
                  <span className={styles.statusMeta}>
                    {record.vaccineName} · {record.petName}
                  </span>
                </li>
              );
            })}
          </ul>

          <div ref={mockupRef} className={styles.mockupWrap}>
            <DeviceMockup label="Tela real de vacinação do SocialPet, na conta de demonstração" className={styles.mockup}>
              <ProductVideo poster="/product-demos/vaccination/vaccination-screen-mobile.png" fallback={<MockupPlaceholder />} />
            </DeviceMockup>
          </div>
        </div>
      </Container>
    </Section>
  );
}
