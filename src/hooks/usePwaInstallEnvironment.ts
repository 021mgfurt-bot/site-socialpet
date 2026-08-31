import { useEffect, useState } from "react";
import { isAndroidLike, isChromiumLike, isIosLike, getIsStandalone } from "../lib/pwaPlatform";

export type PwaCtaState = "install" | "iosInstructions" | "open" | "unsupported" | "installed";

export type PwaPlatform = "ios" | "android" | "desktop" | "other";

export interface PwaInstallEnvironment {
  state: PwaCtaState;
  platform: PwaPlatform;
  /** true quando o próprio ambiente atual já roda em modo standalone. */
  isStandalone: boolean;
}

const DEV_OVERRIDE_PARAM = "pwaDebug";
const VALID_STATES: PwaCtaState[] = ["install", "iosInstructions", "open", "unsupported", "installed"];

function readDevOverride(): PwaCtaState | null {
  // Só em dev (import.meta.env.DEV) — nunca fica disponível no build de
  // produção (Prompt 7.5 §45: nunca expor controle de debug em produção).
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get(DEV_OVERRIDE_PARAM);
  return VALID_STATES.includes(value as PwaCtaState) ? (value as PwaCtaState) : null;
}

function classify(isStandalone: boolean): { state: PwaCtaState; platform: PwaPlatform } {
  const platform: PwaPlatform = isIosLike() ? "ios" : isAndroidLike() ? "android" : "desktop";

  // O aparelho continua sendo Android/iPhone/computador mesmo rodando em
  // standalone — só o estado (o que o CTA faz) muda para "installed".
  if (isStandalone) return { state: "installed", platform };
  if (platform === "ios") return { state: "iosInstructions", platform };
  if (platform === "android") return { state: "install", platform };
  if (isChromiumLike()) return { state: "install", platform };
  if (typeof navigator !== "undefined") return { state: "open", platform };
  return { state: "unsupported", platform: "other" };
}

/**
 * Classifica o ambiente atual para decidir a copy/ação do CTA de
 * instalação — não sabe (e não pode saber, ver src/lib/pwaPlatform.ts)
 * se o SocialPet já está instalado de verdade; só se ESTE documento está
 * rodando em modo standalone agora.
 */
export function usePwaInstallEnvironment(): PwaInstallEnvironment {
  const [isStandalone, setIsStandalone] = useState(getIsStandalone);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => setIsStandalone(getIsStandalone());
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const override = readDevOverride();
  const classified = classify(isStandalone);

  if (override) {
    return { state: override, platform: classified.platform, isStandalone };
  }

  return { ...classified, isStandalone };
}
