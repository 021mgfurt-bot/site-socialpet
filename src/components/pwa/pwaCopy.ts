import type { PwaCtaState, PwaPlatform } from "../../hooks/usePwaInstallEnvironment";

/** Rótulo do botão por estado — única fonte, nada de string solta pelos
 * componentes (Prompt 7.5 §26). Ajustado no Prompt 7.6: "iosInstructions"
 * deixa de soar como link de ajuda secundário ("Como instalar...") e
 * passa a ser a própria ação principal ("Instalar no iPhone"). */
export const PWA_CTA_LABEL: Record<PwaCtaState, string> = {
  install: "Instalar SocialPet",
  iosInstructions: "Instalar no iPhone",
  open: "Abrir SocialPet",
  unsupported: "Abrir SocialPet",
  installed: "Abrir SocialPet",
};

/** Indicador contextual pequeno ao lado do CTA (Prompt 7.6 §25). */
export const PWA_PLATFORM_LABEL: Record<PwaPlatform, string> = {
  ios: "iPhone",
  android: "Android",
  desktop: "Computador",
  other: "",
};
