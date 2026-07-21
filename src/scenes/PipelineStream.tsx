'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PIPELINE_CURVE } from '@/world/layout';
import { makeRandom } from '@/world/formations';
import { useFx } from '@/world/FxProvider';

/**
 * Data flowing between the pipeline stages.
 *
 * The curve is baked once into a 1-D float texture and sampled in the vertex
 * shader, so a particle's position along the path is computed on the GPU from a
 * single uniform clock. Nothing about this animation touches the CPU per frame —
 * which is what lets it run at a few thousand particles alongside everything
 * else in the scene.
 */

const SAMPLES = 512;

const VERT = /* glsl */ `
  uniform sampler2D uPath;
  uniform float uTime;
  uniform float uSize;
  uniform float uSpeed;

  attribute float aOffset;   // starting position along the path, 0-1
  attribute float aRadius;   // distance from the path centre line
  attribute float aAngle;
  attribute float aScale;
  attribute float aSpeed;

  varying float vHead;
  varying float vFade;

  void main() {
    // Wrap around the path; each particle carries its own speed so the stream
    // has texture instead of moving as one rigid block.
    float t = fract(aOffset + uTime * uSpeed * aSpeed);

    vec3 p = texture2D(uPath, vec2(t, 0.5)).xyz;

    // Swirl around the centre line so the stream reads as a tube, not a wire.
    float a = aAngle + uTime * 0.35;
    p.x += cos(a) * aRadius;
    p.y += sin(a) * aRadius;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;

    // Brighten the leading edge of each particle's run.
    vHead = smoothstep(0.0, 0.25, t) * (1.0 - smoothstep(0.75, 1.0, t));
    vFade = smoothstep(1.0, 12.0, dist) * (1.0 - smoothstep(120.0, 260.0, dist));

    gl_PointSize = uSize * aScale * (40.0 / max(dist, 0.001));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;

  varying float vHead;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float glow = pow(1.0 - d * 2.0, 2.8);
    vec3 c = mix(uColor, uHot, vHead);
    gl_FragColor = vec4(c * glow, glow * vFade * (0.12 + vHead * 0.38));
  }
`;

export function PipelineStream() {
  const { budget } = useFx();
  const count = Math.floor(budget.particles * 0.18);
  const material = useRef<THREE.ShaderMaterial>(null);

  // Bake the curve into a float texture once.
  const pathTexture = useMemo(() => {
    const data = new Float32Array(SAMPLES * 4);
    const p = new THREE.Vector3();
    for (let i = 0; i < SAMPLES; i++) {
      PIPELINE_CURVE.getPointAt(i / (SAMPLES - 1), p);
      data[i * 4] = p.x;
      data[i * 4 + 1] = p.y;
      data[i * 4 + 2] = p.z;
      data[i * 4 + 3] = 1;
    }
    const tex = new THREE.DataTexture(data, SAMPLES, 1, THREE.RGBAFormat, THREE.FloatType);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const geometry = useMemo(() => {
    if (count === 0) return null;
    const rand = makeRandom(2024);

    const offset = new Float32Array(count);
    const radius = new Float32Array(count);
    const angle = new Float32Array(count);
    const scale = new Float32Array(count);
    const speed = new Float32Array(count);
    // `position` is unused by the shader but three still wants the attribute
    // for the draw range.
    const position = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      offset[i] = rand();
      radius[i] = 0.25 + Math.pow(rand(), 1.8) * 2.4;
      angle[i] = rand() * Math.PI * 2;
      scale[i] = 0.4 + rand() * 1.5;
      speed[i] = 0.6 + rand() * 0.9;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(position, 3));
    g.setAttribute('aOffset', new THREE.BufferAttribute(offset, 1));
    g.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1));
    g.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, -80), 400);
    return g;
  }, [count]);

  useEffect(
    () => () => {
      geometry?.dispose();
      pathTexture.dispose();
    },
    [geometry, pathTexture],
  );

  const uniforms = useMemo(
    () => ({
      uPath: { value: pathTexture },
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uSpeed: { value: 0.045 },
      uColor: { value: new THREE.Color('#3b82f6') },
      uHot: { value: new THREE.Color('#7dd3fc') },
    }),
    [pathTexture],
  );

  useFrame((_, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value += Math.min(delta, 1 / 30);
    }
  });

  if (!geometry) return null;

  return (
    <points geometry={geometry} frustumCulled={false}>
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
