'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { caseStudyBeats } from '@/world/locations';
import { scroll } from '@/world/scrollStore';

/**
 * A lit form at each case-study chapter.
 *
 * The camera beat and the marker are derived from the same `caseStudyBeats`
 * call, so a chapter's visual anchor is always exactly where the camera stops.
 * Each chapter gets a different primitive, giving the four beats their own
 * silhouette as the reader moves through them.
 *
 * TODO: replace these primitives with per-project GLTF models (a scraper, a
 * warehouse, a fleet of endpoints) once real assets exist.
 */
function Marker({
  position,
  color,
  index,
}: {
  position: THREE.Vector3;
  color: THREE.Color;
  index: number;
}) {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;

    if (wire.current) {
      wire.current.rotation.y += dt * 0.2;
      wire.current.rotation.x += dt * 0.09;
    }

    if (group.current) {
      // Brighten while its own chapter section is on screen. Keyed to the
      // section rather than global progress so it stays in step with the text
      // no matter how long that chapter runs.
      const rect = scroll.sections.find((s) => s.id === `cs-chapter-${index}`);
      let focus = 0;
      if (rect) {
        const mid = (rect.start + rect.end) / 2;
        const half = Math.max((rect.end - rect.start) / 2, 1e-6);
        focus = Math.max(0, 1 - Math.abs(scroll.eased - mid) / half);
      }
      group.current.scale.setScalar(1 + focus * 0.3 + Math.sin(t * 1.2 + index) * 0.02);
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>

      <mesh ref={wire}>
        {index % 3 === 0 ? (
          <torusKnotGeometry args={[3, 0.12, 128, 12, 2, 3]} />
        ) : index % 3 === 1 ? (
          <octahedronGeometry args={[3.6, 0]} />
        ) : (
          <dodecahedronGeometry args={[3.4, 0]} />
        )}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function ChapterMarkers({
  count,
  color,
  colorAlt,
}: {
  count: number;
  color: string;
  colorAlt: string;
}) {
  const markers = useMemo(() => {
    const beats = caseStudyBeats(count);
    const a = new THREE.Color(color);
    const b = new THREE.Color(colorAlt);

    // Beat 0 is the arrival and the last is the portal; the chapters sit
    // between. Each marker is pushed off to the side of its camera target,
    // alternating left and right — sitting *on* the target would park it dead
    // centre behind the pinned text every single chapter.
    return beats.slice(1, 1 + count).map((beat, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      return {
        position: beat.target.clone().add(new THREE.Vector3(side * 11, 3.5, -6)),
        color: a.clone().lerp(b, count > 1 ? i / (count - 1) : 0),
      };
    });
  }, [count, color, colorAlt]);

  return (
    <group>
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} color={m.color} index={i} />
      ))}
    </group>
  );
}
