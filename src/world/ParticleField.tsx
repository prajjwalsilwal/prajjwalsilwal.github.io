'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFx } from './FxProvider';
import {
  FORMATION_BUILDERS,
  SECTION_FORMATION,
  makeRandom,
  type FormationName,
} from './formations';
import { damp, scroll } from './scrollStore';
import { boot } from './bootStore';

/**
 * The one particle system for the whole world.
 *
 * Two position attributes (`aFrom`, `aTo`) plus a `uMix` uniform let the field
 * morph between formations entirely on the GPU. Rebuilding a formation is a
 * CPU fill into a preallocated array, and only happens when the journey crosses
 * into a new section — a handful of times per session, never per frame.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uDrift;
  uniform vec3 uPointer;

  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    // Smoothstep the blend so particles ease into place instead of sliding
    // linearly, which reads as mechanical.
    float m = smoothstep(0.0, 1.0, uMix);
    vec3 pos = mix(aFrom, aTo, m);

    // Cheap organic drift — no noise texture needed at this amplitude.
    float t = uTime + aPhase * 6.2831;
    pos.x += sin(t * 0.35) * uDrift;
    pos.y += cos(t * 0.29) * uDrift;
    pos.z += sin(t * 0.23) * uDrift * 0.6;

    // Particles lean away from the cursor, giving the field a sense of volume.
    pos.xy += uPointer.xy * (0.4 + aScale * 0.6);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Fade out very close to the camera so flying through the field does not
    // blow out into a wall of white.
    float dist = -mv.z;
    vFade = smoothstep(0.5, 10.0, dist) * (1.0 - smoothstep(150.0, 320.0, dist));

    // uSize is roughly the pixel size of an average particle at 40 world units
    // out. Keeping the reference distance close to where the camera actually
    // sits is what stops near particles ballooning into blobs.
    gl_PointSize = uSize * aScale * (40.0 / max(dist, 0.001));
    gl_Position = projectionMatrix * mv;

    vColor = aColor;
  }
`;

const FRAG = /* glsl */ `
  uniform float uBrightness;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    // Radial falloff — a soft glow sprite without loading a texture.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Additive blending accumulates fast: tens of thousands of overlapping
    // sprites saturate to white long before they look dense. uBrightness keeps
    // a single particle dim so the field reads bright, not each dot.
    float glow = pow(1.0 - d * 2.0, 3.0);
    gl_FragColor = vec4(vColor * glow, glow * vFade * uBrightness);
  }
`;

interface Props {
  /** Overrides the section-driven formation (used by case-study scenes). */
  formation?: FormationName;
  /** Base tint. Case studies pass their own colour. */
  color?: string;
  size?: number;
  drift?: number;
  brightness?: number;
}

export function ParticleField({
  formation,
  color = '#5eead4',
  size = 2.6,
  drift = 0.35,
  brightness = 0.4,
}: Props) {
  const { budget } = useFx();
  const count = budget.particles;

  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  // Every buffer is allocated exactly once, sized to the FX budget.
  const buffers = useMemo(() => {
    if (count === 0) return null;

    const from = new Float32Array(count * 3);
    const to = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const phase = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const rand = makeRandom(99);
    const base = new THREE.Color(color);
    // Stay within a narrow analogous range of the base hue. A wide hue jump
    // reads as colour noise once additive blending stacks the sprites up.
    const alt = new THREE.Color(color).offsetHSL(0.08, -0.1, 0.06);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      scale[i] = 0.35 + Math.pow(rand(), 2.2) * 1.6;
      phase[i] = rand();
      tmp.copy(base).lerp(alt, rand());
      // A few particles run brighter so the field sparkles instead of reading
      // as one flat wash — brightness only, never a hue shift.
      if (rand() > 0.94) tmp.offsetHSL(0, 0, 0.22);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    return { from, to, scale, phase, colors };
  }, [count, color]);

  const state = useRef({
    current: 'sphere' as FormationName,
    mix: 1,
    /** Formation the `aTo` buffer currently holds. */
    loaded: null as FormationName | null,
  }).current;

  const geometry = useMemo(() => {
    if (!buffers) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(buffers.from, 3));
    g.setAttribute('aFrom', new THREE.BufferAttribute(buffers.from, 3));
    g.setAttribute('aTo', new THREE.BufferAttribute(buffers.to, 3));
    g.setAttribute('aScale', new THREE.BufferAttribute(buffers.scale, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(buffers.phase, 1));
    g.setAttribute('aColor', new THREE.BufferAttribute(buffers.colors, 3));
    // The field spans the whole world; a computed bounding sphere would make
    // frustum culling pop it in and out, so we opt out entirely.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
    return g;
  }, [buffers]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  /** Copy `aTo` into `aFrom`, then build `next` into `aTo` and restart the blend. */
  const swapTo = (next: FormationName) => {
    if (!buffers || !geometry) return;
    if (state.loaded === next) return;

    if (state.loaded !== null) {
      buffers.from.set(buffers.to);
      (geometry.getAttribute('aFrom') as THREE.BufferAttribute).needsUpdate = true;
    }

    FORMATION_BUILDERS[next](buffers.to, count);
    (geometry.getAttribute('aTo') as THREE.BufferAttribute).needsUpdate = true;

    if (state.loaded === null) {
      // First load: no previous formation to come from, so start settled.
      buffers.from.set(buffers.to);
      (geometry.getAttribute('aFrom') as THREE.BufferAttribute).needsUpdate = true;
      state.mix = 1;
    } else {
      state.mix = 0;
    }

    state.loaded = next;
    state.current = next;
  };

  // Seed the initial formation. On the home journey the field starts as the
  // loader's sphere; the swap to `network` when boot completes is what makes the
  // orb visibly disperse into the hero rather than cutting to it.
  useEffect(() => {
    if (!buffers || !geometry) return;
    state.loaded = null;
    swapTo(formation ?? (boot.booted ? 'network' : 'sphere'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buffers, geometry]);

  // Explicit formation changes (case-study scenes).
  useEffect(() => {
    if (formation) swapTo(formation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  useFrame((_, delta) => {
    const mat = material.current;
    if (!mat) return;
    const dt = Math.min(delta, 1 / 30);

    // On the home journey the formation follows whichever section we're in —
    // but not until the loader has released, or the orb would break apart
    // before the intro finishes.
    if (!formation && boot.booted) {
      const active = scroll.sections[scroll.activeIndex];
      const wanted = active ? SECTION_FORMATION[active.id] : undefined;
      if (wanted && wanted !== state.current) swapTo(wanted);
    }

    if (state.mix < 1) {
      state.mix = Math.min(1, state.mix + dt * 0.7);
      mat.uniforms.uMix.value = state.mix;
    }

    mat.uniforms.uTime.value += dt;

    const p = mat.uniforms.uPointer.value as THREE.Vector3;
    p.x = damp(p.x, scroll.pointer.x * 0.9, 2.5, dt);
    p.y = damp(p.y, scroll.pointer.y * 0.9, 2.5, dt);
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 1 },
      uSize: { value: size },
      uDrift: { value: drift },
      uBrightness: { value: brightness },
      uPointer: { value: new THREE.Vector3() },
    }),
    [size, drift, brightness],
  );

  if (!geometry) return null;

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
