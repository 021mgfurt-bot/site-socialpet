/**
 * Detecção de plataforma para o CTA de instalação do PWA — feature
 * detection em primeiro lugar, `userAgent` só onde não existe alternativa
 * (Android não tem nenhuma API de feature detection própria; o resto do
 * arquivo evita UA sempre que possível). Mantido isolado em vez de
 * espalhado pelos componentes (Prompt 7.5 §10/§11).
 *
 * Importante: nada aqui sabe se o SocialPet (aplicativo, origem
 * separada) está de fato instalado ou se `beforeinstallprompt` vai
 * disparar lá — isso é tecnicamente inobservável a partir do site
 * (Prompt 7.5 §13). O que existe aqui é só uma classificação honesta de
 * "que tipo de fluxo de instalação esse ambiente costuma oferecer",
 * usada para escolher a copy certa antes de encaminhar o usuário para a
 * aplicação real.
 */

/** iPhone/iPad/iPod, incluindo iPadOS 13+ que se anuncia como "MacIntel"
 * com touch — mesmo critério usado pela aplicação real (`isIosDevice()`
 * em legacy/app.js), para manter a mesma classificação nos dois lados. */
export function isIosLike(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isClassicIos = /iphone|ipad|ipod/i.test(ua);
  const isIpadOsAsMac = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isClassicIos || isIpadOsAsMac;
}

/** Não existe feature detection para "é Android" — só UA mesmo. */
export function isAndroidLike(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent || "");
}

/**
 * Best-effort: Chromium (Chrome/Edge/Opera/Brave/Samsung Internet) é a
 * família de navegador que hoje suporta o fluxo automático de instalação
 * de PWA (`beforeinstallprompt`) — Firefox e Safari desktop não. Não há
 * como confirmar isso de verdade sem estar na própria origem da
 * aplicação (§13), então isto é só um palpite razoável pra escolher a
 * copy ("Instalar" vs "Abrir"), nunca uma garantia.
 */
export function isChromiumLike(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/firefox|fxios/i.test(ua)) return false;
  // Safari "puro" tem "Safari" mas não "Chrome"/"Chromium"/"Edg"/"OPR".
  const hasChromiumToken = /chrome|chromium|crios|edg|opr|samsungbrowser/i.test(ua);
  return hasChromiumToken;
}

/**
 * `display-mode: standalone` cobre a maioria dos browsers instaláveis;
 * `navigator.standalone` é o sinal específico da Apple (não existe
 * `display-mode` utilizável no Safari antigo). Combinar os dois é o
 * jeito recomendado de checar "já estou rodando como app instalado".
 */
export function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mediaStandalone =
    typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mediaStandalone || iosStandalone);
}
