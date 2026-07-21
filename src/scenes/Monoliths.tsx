'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { work } from '@/content/work';
import { MONOLITHS } from '@/world/layout';

/**
 * The work gallery: one glass slab per project, floating in open space.
 *
 * These are the 3D counterpart to the project cards in the HTML overlay — the
 * card is what you read and click, the monolith is what the camera flies past.
 * Each carries its project's accent colour so the two read as the same object.
 *
 * TODO: swap the flat slab for a GLTF panel with a real refractive material
 * (MeshTransmissionMaterial or a custom refraction shader) once the asset
 * budget allows — transmission is expensive, hence the cheaper fake here.
 */

function Monolith({
  index,
  color,
}: {
  index: number;
  color: THREE.Color;
}) {
  const group = useRef<THREE.Group>(null);
  const edge = useRef<THREE.LineSegments>(null);
  const { position, rotationY } = MONOLITHS[index];

  const geometry = useMemo(() => new THREE.PlaneGeometry(7, 10.5, 1, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      // Slow independent bob so the gallery never looks like a rigid grid.
      group.current.position.y = position.y + Math.sin(t * 0.5 + index * 1.3) * 0.6;
      group.current.rotation.y = rotationY + Math.sin(t * 0.25 + index) * 0.06;
    }
    if (edge.current) {
      const mat = edge.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.35 + Math.sin(t * 1.1 + index * 2.1) * 0.15;
    }
  });

  return (
    <group ref={group} position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <lineSegments ref={edge} geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

export function Monoliths() {
  const colors = useMemo(() => work.map((w) => new THREE.Color(w.color)), []);

  return (
    <group>
      {work.map((item, i) => (
        <Monolith key={item.id} index={i} color={colors[i]} />
      ))}
    </group>
  );
}
