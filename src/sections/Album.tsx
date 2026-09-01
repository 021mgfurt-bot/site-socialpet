import { useEffect, useRef } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import { DeviceMockup } from "../components/ui/DeviceMockup";
import { ProductVideo } from "../components/media/ProductVideo";
import { MockupPlaceholder } from "../components/media/MockupPlaceholder";
import { AlbumPhoto } from "../components/media/AlbumPhoto";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playAlbumEntrance, playAlbumParallax } from "../motion/albumTimeline";
import { gsap } from "../motion/gsap";
import styles from "./Album.module.css";

/**
 * Álbum por pet, upload (galeria multi-arquivo) e captura por câmera
 * confirmados em legacy/app.js/index.html (Prompt 10 §3-4): sem legenda,
 * sem exclusão de foto de álbum, sem limite de quantidade — só um limite
 * de 12MB por arquivo (validateImage, app.js:6154-6164). Por isso a copy
 * não promete legendas, remoção nem "espaço ilimitado". O Memorial reusa
 * o mesmo álbum por pet (confirmado, sem fluxo de fotos separado) — por
 * preferência explícita do usuário (§52), não é mencionado nesta seção.
 *
 * As 4 fotos e a captura de interface são reais, da conta demo oficial
 * (Prompt 10.6/10.7) — as mesmas 5 fotos de Mel cadastradas no álbum
 * real, não placeholders. Pendência registrada no relatório do Prompt
 * 10.7: confirmar licença de uso público das imagens antes da
 * publicação comercial definitiva.
 */
export function Album() {
  const reducedMotion = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const photoLargeRef = useRef<HTMLImageElement>(null);
  const photoBRef = useRef<HTMLImageElement>(null);
  const photoCRef = useRef<HTMLImageElement>(null);
  const photoDRef = useRef<HTMLImageElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [
      photoLargeRef.current,
      photoBRef.current,
      photoCRef.current,
      photoDRef.current,
      collectionRef.current,
      interfaceRef.current,
    ].filter(Boolean);

    if (reducedMotion) {
      gsap.set(targets, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const cleanupEntrance = playAlbumEntrance({
      stage: stageRef.current,
      photoLarge: photoLargeRef.current,
      photoB: photoBRef.current,
      photoC: photoCRef.current,
      photoD: photoDRef.current,
      collection: collectionRef.current,
      interfaceBlock: interfaceRef.current,
    });

    const cleanupParallax = playAlbumParallax({
      stage: stageRef.current,
      photoB: photoBRef.current,
      photoD: photoDRef.current,
    });

    return () => {
      cleanupEntrance();
      cleanupParallax();
    };
  }, [reducedMotion]);

  return (
    <Section id="memorias" tone="base" ariaLabel="Álbum de fotos de cada pet">
      <Container>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <h2 className={styles.headline}>As fotos que você não quer perder no meio da galeria.</h2>
          </div>

          <div ref={stageRef} className={styles.stage}>
            <p className="visually-hidden">Um pequeno conjunto de fotos do álbum de Mel:</p>

            <div className={styles.photoCluster}>
              <AlbumPhoto
                ref={photoLargeRef}
                src="/product-demos/album/mel-photo-1.jpg"
                alt="Mel deitada na grama"
                className={styles.photoLarge}
              />
              <AlbumPhoto
                ref={photoBRef}
                src="/product-demos/album/mel-photo-2.jpg"
                alt="Mel de perfil, no parque"
                className={styles.photoB}
              />
              <AlbumPhoto
                ref={photoCRef}
                src="/product-demos/album/mel-photo-3.jpg"
                alt="Mel correndo na praia"
                className={styles.photoC}
              />
              <AlbumPhoto
                ref={photoDRef}
                src="/product-demos/album/mel-photo-4.jpg"
                alt="Mel cochilando"
                className={styles.photoD}
              />
            </div>

            <div ref={collectionRef} className={styles.collection}>
              <span className={styles.collectionPet}>Mel</span>
              <span className={styles.collectionCount}>5 fotos</span>
            </div>
          </div>

          <p className={styles.copy}>
            Adicione fotos ao álbum de cada pet e encontre esses registros depois, sem precisar procurar
            entre milhares de imagens no celular.
          </p>

          <div ref={interfaceRef} className={styles.interfaceBlock}>
            <DeviceMockup
              label="Álbum real de Mel no SocialPet, na conta de demonstração"
              className={styles.interfaceMockup}
            >
              <ProductVideo
                poster="/product-demos/album/album-screen-mobile.png"
                fallback={<MockupPlaceholder />}
              />
            </DeviceMockup>
            <p className={styles.actionsCopy}>
              Você pode escolher uma foto que já está no celular ou tirar uma foto na hora.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
