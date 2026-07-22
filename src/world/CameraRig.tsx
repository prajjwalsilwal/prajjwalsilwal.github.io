'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { makeCurves, type Beat } from './locations';
import {
  isPlaybackDriving,
  playCurveT,
  playTick,
} from './playStore';
import { clamp01, damp, scroll, type SectionRect } from './scrollStore';

interface Props {
  beats: readonly Beat[];
  /** Pointer parallax strength in world units. */
  parallax?: number;
}

/**
 * Flies the camera along the beat curve.
 *
 * During the platform trailer, progress comes from playStore time (home →
 * platform-end). After that, beats are anchored to DOM sections so Work →
 * Contact still tracks scroll — without inventing a 20-viewport runway.
 *
 * All vectors are allocated once and reused; the anchor table is rebuilt only
 * when the sections are remeasured, never per frame.
 */
export function CameraRig({ beats, parallax = 1.6 }: Props) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const curves = useMemo(() => makeCurves(beats), [beats]);

  // Scratch objects — never reallocated.
  const scratch = useRef({
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    smoothLook: new THREE.Vector3(),
    offset: new THREE.Vector3(),
    px: 0,
    py: 0,
    initialised: false,
  }).current;

  const anchors = useRef({
    values: new Float64Array(beats.length),
    /** Identity of the sections array the table was built from. */
    builtFrom: null as SectionRect[] | null,
    valid: false,
  }).current;

  if (anchors.values.length !== beats.length) {
    anchors.values = new Float64Array(beats.length);
    anchors.builtFrom = null;
  }

  const rebuildAnchors = () => {
    const sections = scroll.sections;
    const n = beats.length;
    const out = anchors.values;

    for (let i = 0; i < n; i++) {
      const { section, at } = beats[i].anchor;
      const rect = sections.find((s) => s.id === section);
      out[i] = rect ? rect.start + (rect.end - rect.start) * at : n > 1 ? i / (n - 1) : 0;
    }

    // Anchors must strictly increase, or the camera jumps backwards wherever
    // two sections overlap or a measurement lands out of order.
    for (let i = 1; i < n; i++) {
      if (out[i] <= out[i - 1]) out[i] = out[i - 1] + 1e-4;
    }

    anchors.builtFrom = sections;
    anchors.valid = sections.length > 0;
  };

  /** Document progress → position along the curve, 0–1. */
  const curveParam = (progress: number): number => {
    const n = beats.length;
    if (n < 2) return 0;

    if (scroll.sections !== anchors.builtFrom) rebuildAnchors();
    if (!anchors.valid) return progress;

    const a = anchors.values;
    if (progress <= a[0]) return 0;
    if (progress >= a[n - 1]) return 1;

    for (let i = 0; i < n - 1; i++) {
      if (progress <= a[i + 1]) {
        const span = Math.max(a[i + 1] - a[i], 1e-6);
        return clamp01((i + (progress - a[i]) / span) / (n - 1));
      }
    }

    return clamp01(progress);
  };

  useFrame((_, delta) => {
    // Clamp dt so a backgrounded tab returning does not fling the camera.
    const dt = Math.min(delta, 1 / 30);

    let t: number;
    if (isPlaybackDriving()) {
      playTick(dt * 1000);
      t = playCurveT(beats.length);
    } else {
      scroll.eased = damp(scroll.eased, scroll.progress, 4.5, dt);
      t = curveParam(clamp01(scroll.eased));
    }

    curves.position.getPointAt(t, scratch.pos);
    curves.target.getPointAt(t, scratch.look);

    // Pointer parallax, damped so the camera never twitches with the cursor.
    // Disabled during the trailer so the flight stays locked on rails.
    const parallaxAmt = isPlaybackDriving() ? 0 : parallax;
    scratch.px = damp(scratch.px, scroll.pointer.x, 3, dt);
    scratch.py = damp(scratch.py, scroll.pointer.y, 3, dt);
    scratch.offset.set(scratch.px * parallaxAmt, scratch.py * parallaxAmt * 0.6, 0);

    // Snappier follow during the trailer so the shot reads as video, not lag.
    const posLambda = isPlaybackDriving() ? 14 : 8;
    const lookLambda = isPlaybackDriving() ? 10 : 6;

    if (!scratch.initialised) {
      camera.position.copy(scratch.pos).add(scratch.offset);
      scratch.smoothLook.copy(scratch.look);
      scratch.initialised = true;
    } else {
      camera.position.x = damp(camera.position.x, scratch.pos.x + scratch.offset.x, posLambda, dt);
      camera.position.y = damp(camera.position.y, scratch.pos.y + scratch.offset.y, posLambda, dt);
      camera.position.z = damp(camera.position.z, scratch.pos.z, posLambda, dt);

      scratch.smoothLook.x = damp(scratch.smoothLook.x, scratch.look.x, lookLambda, dt);
      scratch.smoothLook.y = damp(scratch.smoothLook.y, scratch.look.y, lookLambda, dt);
      scratch.smoothLook.z = damp(scratch.smoothLook.z, scratch.look.z, lookLambda, dt);
    }

    camera.lookAt(scratch.smoothLook);

    // FOV eases between beats, and widens slightly with scroll velocity so fast
    // flicks feel like acceleration.
    const fovIndex = t * (curves.fovs.length - 1);
    const i = Math.floor(fovIndex);
    const frac = fovIndex - i;
    const a = curves.fovs[Math.min(i, curves.fovs.length - 1)];
    const b = curves.fovs[Math.min(i + 1, curves.fovs.length - 1)];
    const velocityBoost = isPlaybackDriving()
      ? 0
      : Math.min(Math.abs(scroll.velocity) * 260, 8);
    const targetFov = a + (b - a) * frac + velocityBoost;

    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = damp(camera.fov, targetFov, 5, dt);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
