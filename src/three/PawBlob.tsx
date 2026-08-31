import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

interface Lobe {
  radius: number;
  position: [number, number, number];
  scale: [number, number, number];
  seed: number;
}

/**
 * Cinco volumes: um coxim central maior + quatro lobos menores num arco
 * acima dele — a mesma lógica estrutural de uma pata (um pad grande, quatro
 * dedos), mas abstrata e assimétrica, nunca literal. Fundidos numa única
 * geometria (sem CSG, sem lib nova — `mergeGeometries` já vem dentro do
 * pacote `three` instalado) para ler como uma peça de cerâmica só, não
 * cinco esferas encostadas.
 */
const LOBES: Lobe[] = [
  { radius: 0.66, position: [0.04, -0.28, 0.02], scale: [1.08, 0.82, 1], seed: 0.3 },
  { radius: 0.3, position: [-0.58, 0.42, 0.1], scale: [1, 1.05, 0.95], seed: 1.7 },
  { radius: 0.33, position: [-0.22, 0.66, 0.16], scale: [0.98, 1.1, 1], seed: 2.9 },
  { radius: 0.32, position: [0.24, 0.64, 0.08], scale: [1, 1.08, 0.97], seed: 4.1 },
  { radius: 0.28, position: [0.58, 0.38, -0.02], scale: [1.05, 1, 0.95], seed: 5.4 },
];

function displaceLobe(geometry: THREE.BufferGeometry, seed: number): THREE.BufferGeometry {
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i);
    const normal = vertex.clone().normalize();

    const displacement =
      0.05 * Math.sin(normal.x * 3.2 + seed) +
      0.045 * Math.sin(normal.y * 2.6 + normal.z * 1.8 + seed * 1.3) +
      0.035 * Math.cos(normal.z * 3.4 + normal.x * 1.5 + seed * 0.6);

    vertex.addScaledVector(normal, displacement);
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  return geometry;
}

function buildSculpture(): THREE.BufferGeometry {
  const parts = LOBES.map((lobe) => {
    const geometry = new THREE.IcosahedronGeometry(lobe.radius, 16);
    displaceLobe(geometry, lobe.seed);
    geometry.scale(...lobe.scale);
    geometry.translate(...lobe.position);
    return geometry;
  });

  const merged = mergeGeometries(parts, false);
  merged.computeVertexNormals();
  merged.center();
  return merged;
}

interface PawBlobProps {
  pointer: React.RefObject<{ x: number; y: number }>;
}

export function PawBlob({ pointer }: PawBlobProps) {
  const geometry = useMemo(() => buildSculpture(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const elapsed = state.clock.getElapsedTime();

    // Rotação contínua muito lenta (~1 volta a cada ~90s).
    group.rotation.y = -0.35 + elapsed * ((Math.PI * 2) / 90);

    // "Respiração" de escala quase imperceptível.
    const breath = 1 + Math.sin(elapsed * 0.35) * 0.012;
    group.scale.setScalar(breath);

    // Resposta mínima ao cursor: inclinação de poucos graus.
    const targetTiltX = pointer.current.y * 0.1;
    const targetTiltZ = -pointer.current.x * 0.1;
    group.rotation.x += (targetTiltX - group.rotation.x) * 0.02;
    group.rotation.z += (targetTiltZ - group.rotation.z) * 0.02;
  });

  return (
    <group ref={groupRef} rotation={[0.05, -0.35, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#c9603b" roughness={0.92} metalness={0} />
      </mesh>
    </group>
  );
}
