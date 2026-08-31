import { lazy, Suspense } from "react";
import { useHeroSceneEligibility } from "./useHeroSceneEligibility";
import { ThreeErrorBoundary } from "./ThreeErrorBoundary";
import { HeroSceneFallback } from "./HeroSceneFallback";
import styles from "./HeroSceneSlot.module.css";

// Import isolado: o bundle do Three.js/R3F só é baixado quando este chunk é
// solicitado, nunca no caminho crítico do carregamento inicial.
const HeroScene = lazy(() => import("./HeroScene").then((mod) => ({ default: mod.HeroScene })));

/**
 * Slot de tamanho reservado no layout — existe independentemente de o
 * WebGL carregar ou não, então nada no Hero pula/redimensiona quando a
 * cena 3D aparece ou falha.
 */
export function HeroSceneSlot() {
  const eligible = useHeroSceneEligibility();

  return (
    <div className={styles.slot}>
      {eligible ? (
        <ThreeErrorBoundary fallback={<HeroSceneFallback />}>
          <Suspense fallback={<HeroSceneFallback />}>
            <HeroScene />
          </Suspense>
        </ThreeErrorBoundary>
      ) : (
        <HeroSceneFallback />
      )}
    </div>
  );
}
