'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import * as THREE from 'three';
import { useFx } from './FxProvider';
import { CameraRig } from './CameraRig';
import { resolveMilestone, isMilestoneResolved } from './bootStore';
import { isPlaybackDriving, subscribePlay } from './playStore';
import { requestWorldMount, subscribeWorldGate, worldGate } from './worldGate';
import { HOME_BEATS, caseStudyBeats, type Beat } from './locations';
import { HomeScene } from '@/scenes/HomeScene';
import { CaseScene } from '@/scenes/CaseScene';
import { getCaseStudy } from '@/content/work';

/** Reports the first rendered frame — the honest "the world is up" signal. */
function FirstFrame() {
  useFrame(() => resolveMilestone('frame'));
  return null;
}

class WorldErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn('[world] WebGL scene failed; falling back to CSS void.', err);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function parseCaseSlug(pathname: string): string | null {
  const m = pathname.match(/^\/work\/([^/]+)\/?$/);
  return m?.[1] ?? null;
}

/**
 * One persistent WebGL canvas for the whole app.
 *
 * Mounting a new <Canvas> per route was stacking WebGL contexts on client
 * navigations (Chrome: "too many active WebGL contexts"). Scene content and
 * camera beats swap with the route; the GL context does not.
 */
export function PersistentWorld() {
  const pathname = usePathname() || '/';
  const { level, budget, ready } = useFx();
  const [allowed, setAllowed] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [canvasNeeded, setCanvasNeeded] = useState(true);

  const caseSlug = parseCaseSlug(pathname);
  const study = caseSlug ? getCaseStudy(caseSlug) : undefined;
  const onHome = pathname === '/' || pathname === '';

  const beats: readonly Beat[] = useMemo(() => {
    if (study) return caseStudyBeats(study.chapters.length);
    return HOME_BEATS;
  }, [study]);

  // Defer first mount so HTML paints first; Play can force earlier via worldGate.
  useEffect(() => {
    if (!ready || level === 'off') return;

    const tryMount = () => {
      if (worldGate.mount) setAllowed(true);
    };
    tryMount();
    const unsub = subscribeWorldGate(tryMount);

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const schedule = () => {
      requestWorldMount();
      setAllowed(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(schedule, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(schedule, 1800);
    }

    return () => {
      unsub();
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [ready, level]);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

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
    // Re-bind when route changes (new #main).
    const t = window.setTimeout(sync, 50);

    return () => {
      io?.disconnect();
      unsubPlay();
      unsubGate();
      window.clearTimeout(t);
    };
  }, [pathname]);

  if (!ready || level === 'off' || !allowed) return null;
  // Unknown / non-journey routes get no canvas.
  if (!onHome && !study) return null;

  const active = tabVisible && canvasNeeded;

  return (
    <WorldErrorBoundary>
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
            scene.fog = new THREE.FogExp2('#040507', 0.022);
            resolveMilestone('world');

            const canvas = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              console.warn('[world] WebGL context lost — pausing scene.');
            };
            canvas.addEventListener('webglcontextlost', onLost, false);
          }}
        >
          <FirstFrame />
          <CameraRig beats={beats} />
          <Suspense fallback={null}>
            {study ? (
              <CaseScene
                color={study.color}
                colorAlt={study.colorAlt}
                chapterCount={study.chapters.length}
              />
            ) : (
              <HomeScene />
            )}
          </Suspense>
        </Canvas>
      </div>
    </WorldErrorBoundary>
  );
}
