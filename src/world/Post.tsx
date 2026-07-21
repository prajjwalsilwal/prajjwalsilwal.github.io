'use client';

import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useMemo } from 'react';
import { useFx } from './FxProvider';

/**
 * The look: bloom for the glow, a touch of chromatic aberration at the edges,
 * vignette to hold the eye centre-frame, and film noise so the near-black
 * background doesn't band on cheap panels.
 *
 * Skipped entirely below `full` — the composer costs a full-screen pass per
 * effect, which is exactly what a weak GPU cannot spare.
 */
export function Post() {
  const { budget } = useFx();

  const aberration = useMemo(() => new THREE.Vector2(0.0006, 0.0009), []);

  if (!budget.postprocessing) return null;

  return (
    <EffectComposer multisampling={0}>
      {/* The threshold has to sit above the particle field's own brightness,
          or bloom picks up every dot and the whole scene turns to fog. Only
          the emissive node cores and portal rings should cross it. */}
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.28}
        mipmapBlur
        radius={0.55}
      />
      <ChromaticAberration
        offset={aberration}
        radialModulation
        modulationOffset={0.35}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette offset={0.28} darkness={0.72} eskil={false} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.32} />
    </EffectComposer>
  );
}
