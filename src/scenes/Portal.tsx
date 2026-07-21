'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A glowing ring the camera arrives at — used for the contact scene and at the
 * end of every case study, where it sits behind the "visit the live site" link.
 *
 * Purely decorative: the real link lives in the HTML overlay so it stays
 * clickable, focusable and crawlable.
 */
export function Portal({
  position,
  color = '#5eead4',
  radius = 6,
}: {
  position: THREE.Vector3 | [number, number, number];
  color?: string;
  radius?: number;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);

  const c = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ring.current) ring.current.rotation.z = t * 0.14;
    if (inner.current) {
      inner.current.rotation.z = -t * 0.22;
      inner.current.scale.setScalar(1 + Math.sin(t * 1.3) * 0.04);
    }
    if (glow.current) {
      const mat = glow.current.material as THREE.SpriteMaterial;
      mat.opacity = 0.28 + Math.sin(t * 0.9) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ring}>
        <torusGeometry args={[radius, 0.06, 8, 128]} />
        <meshBasicMaterial color={c} toneMapped={false} />
      </mesh>

      <mesh ref={inner}>
        <torusGeometry args={[radius * 0.78, 0.02, 6, 96]} />
        <meshBasicMaterial color={c} transparent opacity={0.5} toneMapped={false} />
      </mesh>

      {/* Soft disc filling the ring so it reads as a threshold, not a hoop. */}
      <mesh>
        <circleGeometry args={[radius * 0.95, 64]} />
        <meshBasicMaterial
          color={c}
          transparent
          opacity={0.045}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <sprite ref={glow} scale={[radius * 5, radius * 5, 1]}>
        <spriteMaterial
          color={c}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}
