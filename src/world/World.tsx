'use client';

import dynamic from 'next/dynamic';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { useFx } from './FxProvider';
import { CameraRig } from './CameraRig';
import { resolveMilestone, isMilestoneResolved } from './bootStore';
import { isPlaybackDriving, subscribePlay } from './playStore';
import { subscribeWorldGate, worldGate } from './worldGate';
import type { Beat } from './locations';

/** Reports the first rendered frame — the honest "the world is up" signal. */
function FirstFrame() {
  useFrame(() => resolveMilestone('frame'));
  return null;
}

/** Lazy post stack — kept out of the lite Three chunk until full tier needs it. */
const Post = dynamic(() => import('./Post').then((m) => m.Post), { ssr: false });

interface Props {
  beats: readonly Beat[];
  /** Scene contents — nodes, monoliths, portals, particle fields. */
  children: ReactNode;
}

/**
 * The single persistent WebGL canvas.
 *
 * Mounted once per journey and never unmounted within that page, so navigating
 * between home and a case study is a change of scene contents rather than a
 * context teardown.
 */
export function World({ beats, children }: Props) {
  const { level, budget, ready } = useFx();
  const [tabVisible, setTabVisible] = useState(true);
  const [canvasNeeded, setCanvasNeeded] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Fixed full-viewport canvas: pause when main content is off-screen, unless
  // the trailer needs frames (pending play or first-frame gate).
  useEffect(() => {
    const main = document.getElementById('main');
    let mainVisible = true;

    const sync = () => {
      const needsFrame =
        worldGate.playPending || isPlaybackDriving() || !isMilestoneResolved('frame');
      setCanvasNeeded(mainVisible || needsFrame);
    };

    const io =
      main &&
      new IntersectionObserver(
        ([entry]) => {
          mainVisible = (entry?.intersectionRatio ?? 0) > 0.02;
          sync();
        },
        { threshold: [0, 0.02, 0.1, 0.5, 1] },
      );
    if (main && io) io.observe(main);

    const unsubPlay = subscribePlay(sync);
    const unsubGate = subscribeWorldGate(sync);
    sync();

    return () => {
      io?.disconnect();
      unsubPlay();
      unsubGate();
    };
  }, []);

  if (!ready || level === 'off') return null;

  const active = tabVisible && canvasNeeded;

  return (
    <div className="world-canvas pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
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
        {budget.postprocessing ? <Post /> : null}
      </Canvas>
    </div>
  );
}
