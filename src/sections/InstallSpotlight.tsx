import { useEffect, useRef, useState } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { usePwaInstallEnvironment } from "../hooks/usePwaInstallEnvironment";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { socialPetAppUrl, externalAppLinkProps } from "../config/env";
import { PWA_CTA_LABEL, PWA_PLATFORM_LABEL } from "../components/pwa/pwaCopy";
import { IosInstallSheet } from "../components/pwa/IosInstallSheet";
import { playInstallSpotlightEntrance } from "../motion/installSpotlightEntrance";
import { gsap } from "../motion/gsap";
import styles from "./InstallSpotlight.module.css";

/**
 * Faixa de instalação do SocialPet — substitui o CTA pequeno do Hero
 * (Prompt 7.5) por uma composição com presença real (Prompt 7.6 §19-34).
 * O SocialPet já É o aplicativo: a copy nunca trata a instalação como
 * "transformar o site em app" (§20-21).
 *
 * O clique em qualquer estado além de iOS continua só levando para a
 * aplicação real (mesma limitação cross-origin documentada em
 * docs/pwa-install-integration.md) — o Prompt 7.6 pediu explicitamente
 * para NÃO alterar o aplicativo nesta rodada, então o botão "Instalar
 * SocialPet" ainda não abre o prompt nativo de instalação por si só.
 * Isso é uma pendência real, não escondida: ver o relatório final.
 */
export function InstallSpotlight() {
  const { state, platform } = usePwaInstallEnvironment();
  const reducedMotion = useReducedMotion();
  const [iosSheetOpen, setIosSheetOpen] = useState(false);

  const bandRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      gsap.set([bandRef.current, iconRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const cleanup = playInstallSpotlightEntrance({ band: bandRef.current, icon: iconRef.current });
    return cleanup;
  }, [reducedMotion]);

  const label = PWA_CTA_LABEL[state];
  const platformLabel = state === "installed" ? "Instalado" : PWA_PLATFORM_LABEL[platform];
  const isOpenLike = state === "open" || state === "unsupported" || state === "installed";

  return (
    <Section id="instalar" tone="base" ariaLabel="Instalar o SocialPet">
      <Container>
        <div ref={bandRef} className={styles.band}>
          <div ref={iconRef} className={styles.iconWrap}>
            <img src="/icon-192.png" alt="" className={styles.icon} width={96} height={96} />
          </div>

          <div className={styles.copy}>
            <h2 className={styles.headline}>Instale o SocialPet</h2>
            <p className={styles.text}>
              Adicione o SocialPet à tela inicial do seu celular ou computador e tenha o aplicativo
              sempre à mão.
            </p>
          </div>

          <div className={styles.actions}>
            {platformLabel && <span className={styles.platformBadge}>{platformLabel}</span>}

            {state === "iosInstructions" ? (
              <button type="button" className={styles.cta} onClick={() => setIosSheetOpen(true)}>
                <CtaIcon open={false} />
                {label}
              </button>
            ) : (
              <a className={styles.cta} href={socialPetAppUrl} {...externalAppLinkProps}>
                <CtaIcon open={isOpenLike} />
                {label}
              </a>
            )}
          </div>
        </div>

        <IosInstallSheet open={iosSheetOpen} onClose={() => setIosSheetOpen(false)} />
      </Container>
    </Section>
  );
}

function CtaIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 5l7 7-7 7" />
        <path d="M21 12H3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 19.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-0.5" />
    </svg>
  );
}
