'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { stages } from '@/content/platform';
import { PIPELINE_CURVE, STAGE_NODES } from '@/world/layout';
import { isPlaybackDriving, play } from '@/world/playStore';
import { scroll } from '@/world/scrollStore';

/**
 * The six pipeline stages as lit nodes in space, plus the tube the camera
 * follows between them.
 *
 * A node brightens as the journey reaches it, so the visual state and the
 * pinned HTML copy beside it are driven by the same scroll progress and can't
 * fall out of sync.
 */

function StageNode({ index, color }: { index: number; color: THREE.Color }) {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Sprite>(null);
  const position = STAGE_NODES[index];

  // Where along the platform section this node sits, 0–1.
  const nodeT = (index + 0.5) / stages.length;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;

    // Proximity of the journey to this node, 1 at the node, falling off away.
    let focus = 0;
    if (isPlaybackDriving()) {
      focus = Math.max(0, 1 - Math.abs(play.t - nodeT) * 4.5);
    } else {
      const platform = scroll.sections.find((s) => s.id === 'platform');
      if (platform) {
        const within =
          (scroll.eased - platform.start) / Math.max(platform.end - platform.start, 1e-6);
        focus = Math.max(0, 1 - Math.abs(within - nodeT) * 4.5);
      }
    }

    if (shell.current) {
      shell.current.rotation.y += dt * 0.25;
      shell.current.rotation.x += dt * 0.12;
      const s = 1 + focus * 0.35 + Math.sin(t * 1.4 + index) * 0.03;
      shell.current.scale.setScalar(s);
    }

    if (core.current) {
      const mat = core.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + focus * 0.45;
      core.current.scale.setScalar(1 + Math.sin(t * 2.2 + index * 1.7) * 0.06);
    }

    if (halo.current) {
      const mat = halo.current.material as THREE.SpriteMaterial;
      mat.opacity = 0.12 + focus * 0.5;
      halo.current.scale.setScalar(7 + focus * 5);
    }
  });

  return (
    <group position={position}>
      {/* Solid emissive core — the part bloom picks up. */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>

      {/* Faceted wireframe shell, slowly tumbling. */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </mesh>

      {/* TODO: swap this sprite halo for a real volumetric light shaft or a
          GLTF node model once higher-fidelity assets are available. */}
      <sprite ref={halo}>
        <spriteMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

export function StageNodes() {
  const colors = useMemo(
    () => stages.map((s) => new THREE.Color().setHSL(s.hue, 0.72, 0.6)),
    [],
  );

  // The connecting tube — thin, dim, just enough to read as a path.
  const tube = useMemo(
    () => new THREE.TubeGeometry(PIPELINE_CURVE, 220, 0.045, 6, false),
    [],
  );

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#5eead4" transparent opacity={0.28} toneMapped={false} />
      </mesh>

      {stages.map((stage, i) => (
        <StageNode key={stage.id} index={i} color={colors[i]} />
      ))}
    </group>
  );
}
