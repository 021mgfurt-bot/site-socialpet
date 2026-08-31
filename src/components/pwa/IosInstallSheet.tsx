import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { socialPetAppUrl, externalAppLinkProps } from "../../config/env";
import styles from "./IosInstallSheet.module.css";

interface IosInstallSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * iOS/Safari nunca oferece instalação automática em lugar nenhum — nem no
 * site, nem no app (Prompt 7.5 §2/§23). Este painel só explica os 3 toques
 * manuais; a instalação de fato acontece depois, dentro do Safari já com
 * o SocialPet (o aplicativo) aberto.
 *
 * Renderizado via portal direto em document.body: o CTA que abre este
 * sheet mora dentro do grupo de CTAs do Hero, que o GSAP anima (aplica
 * `transform` inline, mesmo em repouso) — qualquer ancestral com
 * `transform` vira containing block de descendentes `position: fixed`,
 * então sem o portal o scrim "fixed" ficava preso ao tamanho/posição
 * daquele ancestral em vez de cobrir a viewport inteira (bug real
 * encontrado em QA, viewport 390x844: scrim media ~350x203 em vez de
 * 390x844).
 */
export function IosInstallSheet({ open, onClose }: IosInstallSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return createPortal(
    <div className={styles.scrim} aria-hidden={!open} data-open={open}>
      <div
        ref={panelRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
      >
        <div className={styles.handle} aria-hidden="true" />

        <h2 id="ios-install-title" className={styles.title}>
          Como instalar no iPhone
        </h2>

        <ol className={styles.steps}>
          <li>
            <span className={styles.stepIndex}>1</span>
            <span>Abra o SocialPet no Safari</span>
          </li>
          <li>
            <span className={styles.stepIndex}>2</span>
            <span>
              Toque no ícone de <strong>Compartilhar</strong>
            </span>
          </li>
          <li>
            <span className={styles.stepIndex}>3</span>
            <span>
              Escolha <strong>Adicionar à Tela de Início</strong>
            </span>
          </li>
          <li>
            <span className={styles.stepIndex}>4</span>
            <span>Confirme</span>
          </li>
        </ol>

        <div className={styles.actions}>
          <a className={styles.openLink} href={socialPetAppUrl} {...externalAppLinkProps} onClick={onClose}>
            Abrir SocialPet no Safari
          </a>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
