import { useEffect, useRef, type CSSProperties } from "react";
import { Section } from "../components/layout/Section";
import { DeviceMockup } from "../components/ui/DeviceMockup";
import { MockupPlaceholder } from "../components/media/MockupPlaceholder";
import { PROBLEM_FRAGMENTS } from "../data/problemFragments";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { playProblemTimeline } from "../motion/problemTimeline";
import { playProblemMobileReveal } from "../motion/problemMobileReveal";
import { gsap } from "../motion/gsap";
import { cx } from "../lib/classNames";
import styles from "./ProblemToSocialPet.module.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * "Problema" + "transição SocialPet" como uma experiência narrativa só
 * (Prompt 6 §11). Os fragmentos são texto real no DOM, em ordem de
 * leitura coerente — a dispersão é só visual (CSS), nunca semântica.
 */
export function ProblemToSocialPet() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const stageRef = useRef<HTMLDivElement>(null);
  const fragmentRefs = useRef<(HTMLLIElement | null)[]>([]);
  const revealWordRef = useRef<HTMLHeadingElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fragmentEls = fragmentRefs.current.filter((el): el is HTMLLIElement => Boolean(el));

    if (reducedMotion) {
      gsap.set(fragmentEls, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
      if (revealWordRef.current) gsap.set(revealWordRef.current, { opacity: 1, scale: 1, y: 0 });
      if (productRef.current) gsap.set(productRef.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const cleanup = isDesktop
      ? playProblemTimeline({
          stage: stageRef.current,
          fragmentEls,
          revealWord: revealWordRef.current,
          product: productRef.current,
        })
      : playProblemMobileReveal({
          fragmentEls,
          revealWord: revealWordRef.current,
          product: productRef.current,
        });

    return cleanup;
  }, [isDesktop, reducedMotion]);

  return (
    <Section id="problema" ariaLabel="Da dispersão à organização: como o SocialPet ajuda" padding="none">
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.narrativeArea}>
          <p className="visually-hidden">
            Vacina, consulta, gasto e foto de cada pet costumam morar em lugares diferentes:
          </p>

          <ul className={styles.fragmentList}>
            {PROBLEM_FRAGMENTS.map((fragment, index) => (
              <li
                key={fragment.id}
                ref={(el) => {
                  fragmentRefs.current[index] = el;
                }}
                className={cx(
                  styles.fragment,
                  styles[`tone-${fragment.tone}`],
                  styles[`color-${fragment.color}`],
                )}
                style={
                  {
                    "--frag-top": fragment.top,
                    "--frag-left": fragment.left,
                    "--frag-rotate": `${fragment.rotate}deg`,
                  } as CSSProperties
                }
              >
                {fragment.text}
              </li>
            ))}
          </ul>

          <p className="visually-hidden">
            Essas informações, hoje espalhadas, encontram um lugar só no SocialPet.
          </p>

          <div className={styles.revealLayer}>
            <h2 ref={revealWordRef} id="socialpet" className={styles.socialpetWord}>
              SocialPet
            </h2>
          </div>

          <div ref={productRef} className={styles.productLayer}>
            <DeviceMockup label="Prévia do SocialPet, em preparação" className={styles.productMockup}>
              <MockupPlaceholder />
            </DeviceMockup>
          </div>
        </div>
      </div>
    </Section>
  );
}
