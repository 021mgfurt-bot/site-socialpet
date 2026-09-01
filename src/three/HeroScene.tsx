import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PawBlob } from "./PawBlob";

const TARGET_FPS = 30;

/**
 * Com `frameloop="demand"`, o R3F só renderiza quando algo chama
 * `invalidate()`. Este componente dispara isso a ~30fps — suficiente para
 * um movimento tão lento, reduz custo de GPU/bateria em vez de renderizar
 * no refresh rate nativo do monitor.
 *
 * O loop só roda enquanto o canvas está de fato na viewport. Sem isso, ele
 * continuava invalidando a ~30fps pra sempre depois que o Hero já tinha
 * saído de vista — WebGL competindo com o ScrollTrigger das seções mais
 * abaixo pelo mesmo thread principal, o suficiente pra causar o scroll
 * "piscando"/travado relatado ao vivo em Vacinação (bug real, não uma
 * mudança de comportamento do 3D em si).
 */
function FrameRateLimiter() {
  const invalidate = useThree((state) => state.invalidate);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvasEl = gl.domElement;
    let intervalId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (intervalId === null) {
            intervalId = window.setInterval(() => invalidate(), 1000 / TARGET_FPS);
          }
        } else if (intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(canvasEl);

    return () => {
      observer.disconnect();
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [invalidate, gl]);

  return null;
}

export function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]}
      // Distância/FOV com margem generosa em volta da escultura (bounding
      // radius ~1.3) — a versão anterior enquadrava rente demais, e o
      // limite retangular do canvas cortava a forma numa linha reta visível
      // em vez de deixar a silhueta arredondada desvanecer (bug real
      // encontrado na revisão visual deste ajuste).
      camera={{ position: [0, 0, 8.5], fov: 26 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <FrameRateLimiter />
      {/* Luz de estúdio em três pontos: key quente, fill suave e fria o
          bastante pra dar profundidade sem esfriar o material, rim em
          creme criando uma borda de luz que separa a escultura do fundo. */}
      <ambientLight intensity={0.32} color="#fff0e9" />
      <directionalLight position={[-3.5, 3.2, 3]} intensity={1.9} color="#ffd9b8" />
      <directionalLight position={[2.5, -2, 1.5]} intensity={0.3} color="#ffe4cf" />
      <directionalLight position={[-1, 1.5, -3.5]} intensity={0.7} color="#fffaf6" />
      <PawBlob pointer={pointer} />
    </Canvas>
  );
}
