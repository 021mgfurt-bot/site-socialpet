import styles from "./HeroSceneSlot.module.css";

/**
 * Equivalente estático da escultura 3D: mesmo ângulo/paleta conceitual,
 * sem custo de WebGL. Usado em mobile, falha de contexto 3D e
 * `prefers-reduced-motion`.
 */
export function HeroSceneFallback() {
  return <div className={styles.fallback} aria-hidden="true" />;
}
