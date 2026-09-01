import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cx } from "../../lib/classNames";
import styles from "./ProductVideo.module.css";

interface ProductVideoProps {
  /** Caminho pro MP4 (H.264) — a base obrigatória, quando houver captura real. */
  srcMp4?: string;
  /** WebM opcional, só se trouxer vantagem real de tamanho (Prompt 10.5 §26). */
  srcWebm?: string;
  /** Frame extraído do próprio vídeo (Prompt 10.5 §22) — nunca uma thumbnail
   * inventada. Também é o que aparece com reduced-motion, autoplay
   * bloqueado, ou enquanto o vídeo ainda não carregou. */
  poster?: string;
  /** Renderizado no lugar do vídeo/poster quando nenhum dos dois é passado,
   * ou se a reprodução falhar sem poster disponível — nunca uma tela
   * preta/ícone quebrado (§46). */
  fallback: ReactNode;
}

/**
 * Vídeo curto e silencioso da interface real do SocialPet, pensado pra
 * viver dentro da tela de um DeviceMockup — por isso não tem `role`/
 * `aria-label` próprio: o `DeviceMockup` ao redor já expõe um único
 * `role="img"`/`aria-label` descrevendo a demonstração (mesmo padrão do
 * MockupPlaceholder), então este componente nunca duplica esse rótulo.
 * Só reproduz enquanto está visível (IntersectionObserver, mesmo
 * padrão do FrameRateLimiter do Hero em src/three/HeroScene.tsx — pausa
 * fora da viewport pelo mesmo motivo: não competir com scroll/GSAP de
 * outras seções). Com `prefers-reduced-motion: reduce`, nunca renderiza o
 * elemento `<video>` — só a imagem do poster, então não há loop contínuo
 * nem chamada de `play()` possível (Prompt 10.5 §23/§67).
 */
export function ProductVideo({ srcMp4, srcWebm, poster, fallback }: ProductVideoProps) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reducedMotion || !srcMp4 || failed) return;
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {
            // Autoplay bloqueado pelo navegador — o poster (atributo do
            // próprio <video>) continua visível, nenhuma tela vazia.
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [reducedMotion, srcMp4, failed]);

  // Sem vídeo (ainda) — se houver ao menos uma captura real (poster),
  // mostra ela como prova de produto estática em vez do placeholder
  // genérico. Mesma regra quando o vídeo falha ou em reduced-motion.
  if (!srcMp4 || failed || reducedMotion) {
    if (poster) {
      return (
        <div className={styles.wrap}>
          <img src={poster} alt="" className={cx(styles.media, styles.staticPoster)} />
        </div>
      );
    }
    return <div className={styles.wrap}>{fallback}</div>;
  }

  return (
    <div className={styles.wrap}>
      <video
        ref={videoRef}
        className={styles.media}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onError={() => setFailed(true)}
      >
        <source src={srcMp4} type="video/mp4" />
        {srcWebm && <source src={srcWebm} type="video/webm" />}
      </video>
    </div>
  );
}
