'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { useFx } from './FxProvider';
import { CameraRig } from './CameraRig';
import { Post } from './Post';
import { resolveMilestone } from './bootStore';
import type { Beat } from './locations';

/** Reports the first rendered frame — the honest "the world is up" signal. */
function FirstFrame() {
  useFrame(() => resolveMilestone('frame'));
  return null;
}

interface Props {
  beats: readonly Beat[];
  /** Scene contents — nodes, monoliths, portals, particle fields. */
  children: ReactNode;
}

/**
 * The single persistent WebGL canvas.
 *
 * Mounted once in the root layout and never unmounted, so navigating between
 * the home journey and a case study is a change of scene contents rather than
 * a context teardown — which is what keeps the world feeling continuous.
 */
export function World({ beats, children }: Props) {
  const { level, budget, ready } = useFx();
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the tab is backgrounded. A paused frameloop
  // costs nothing; a running one drains battery behind another window.
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  if (!ready || level === 'off') return null;

  return (
    <div className="world-canvas pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, budget.maxDpr]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 55, near: 0.1, far: 900, position: [0, 0, 26] }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(new THREE.Color('#040507'), 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          // Dense enough that each location stays hidden until the camera is
          // nearly on it — otherwise the pipeline nodes and gallery monoliths
          // are visible behind the hero and read as stray artefacts.
          scene.fog = new THREE.FogExp2('#040507', 0.022);
          resolveMilestone('world');
        }}
      >
        <FirstFrame />
        <CameraRig beats={beats} />
        <Suspense fallback={null}>{children}</Suspense>
        <Post />
      </Canvas>
    </div>
  );
}
