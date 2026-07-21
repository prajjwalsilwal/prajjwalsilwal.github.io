import * as THREE from 'three';
import { CLOSING_REGION, MONOLITHS, PIPELINE_CURVE, STAGE_NODES } from './layout';

/**
 * Particle formations.
 *
 * Each function fills a preallocated Float32Array in place and returns nothing.
 * They run a handful of times per session (once per formation, at init), never
 * per frame — so readability wins over micro-optimisation here, while the
 * "fill in place, allocate nothing" contract is what keeps the frame loop clean.
 */

export type FormationName =
  | 'sphere'
  | 'network'
  | 'pipeline'
  | 'gallery'
  | 'ambient'
  | 'corridor';

/** Deterministic PRNG so the world looks identical on every load. */
export function makeRandom(seed = 1337) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Evenly distributed points on a sphere — the loader's forming orb. */
export function sphereFormation(out: Float32Array, count: number, radius = 9): void {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
}

/**
 * The hero constellation: a data-pipeline node network. Most particles cluster
 * into nodes; the rest string along the edges between them, reading as links.
 */
export function networkFormation(out: Float32Array, count: number, seed = 7): void {
  const rand = makeRandom(seed);
  const NODES = 26;

  // Node anchors, biased into a wide slab so it reads as a network diagram
  // rather than a ball.
  const anchors: THREE.Vector3[] = [];
  for (let i = 0; i < NODES; i++) {
    anchors.push(
      new THREE.Vector3(
        (rand() - 0.5) * 30,
        (rand() - 0.5) * 15,
        (rand() - 0.5) * 18,
      ),
    );
  }

  // Edges connect each node to its nearest few neighbours.
  const edges: [number, number][] = [];
  for (let i = 0; i < NODES; i++) {
    const dists = anchors
      .map((a, j) => ({ j, d: a.distanceTo(anchors[i]) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    dists.forEach(({ j }) => edges.push([i, j]));
  }

  const nodeShare = Math.floor(count * 0.45);

  for (let i = 0; i < count; i++) {
    if (i < nodeShare) {
      // Cluster tightly around a node.
      const a = anchors[i % NODES];
      const spread = 0.55 + rand() * 0.9;
      out[i * 3] = a.x + (rand() - 0.5) * spread;
      out[i * 3 + 1] = a.y + (rand() - 0.5) * spread;
      out[i * 3 + 2] = a.z + (rand() - 0.5) * spread;
    } else {
      // Sit along an edge, with a little jitter so links have thickness.
      const [ai, bi] = edges[(i - nodeShare) % edges.length];
      const t = rand();
      const a = anchors[ai];
      const b = anchors[bi];
      out[i * 3] = a.x + (b.x - a.x) * t + (rand() - 0.5) * 0.35;
      out[i * 3 + 1] = a.y + (b.y - a.y) * t + (rand() - 0.5) * 0.35;
      out[i * 3 + 2] = a.z + (b.z - a.z) * t + (rand() - 0.5) * 0.35;
    }
  }
}

/**
 * Particles sleeved around the pipeline curve, denser near each stage node so
 * the six stops read as bright knots in the flow.
 */
export function pipelineFormation(out: Float32Array, count: number, seed = 21): void {
  const rand = makeRandom(seed);
  const point = new THREE.Vector3();
  const nodeShare = Math.floor(count * 0.3);

  for (let i = 0; i < count; i++) {
    if (i < nodeShare) {
      const node = STAGE_NODES[i % STAGE_NODES.length];
      const r = 1.4 + rand() * 2.6;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      out[i * 3] = node.x + r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = node.y + r * Math.sin(phi) * Math.sin(theta);
      out[i * 3 + 2] = node.z + r * Math.cos(phi);
    } else {
      const t = rand();
      PIPELINE_CURVE.getPointAt(t, point);
      const r = 1.2 + rand() * 5.5;
      const theta = rand() * Math.PI * 2;
      out[i * 3] = point.x + Math.cos(theta) * r;
      out[i * 3 + 1] = point.y + Math.sin(theta) * r;
      out[i * 3 + 2] = point.z + (rand() - 0.5) * 3;
    }
  }
}

/** A loose haze around the floating work monoliths. */
export function galleryFormation(out: Float32Array, count: number, seed = 41): void {
  const rand = makeRandom(seed);
  for (let i = 0; i < count; i++) {
    if (i % 3 === 0 && MONOLITHS.length > 0) {
      // A third of the field halos the panels themselves.
      const m = MONOLITHS[i % MONOLITHS.length].position;
      out[i * 3] = m.x + (rand() - 0.5) * 14;
      out[i * 3 + 1] = m.y + (rand() - 0.5) * 16;
      out[i * 3 + 2] = m.z + (rand() - 0.5) * 12;
    } else {
      out[i * 3] = (rand() - 0.5) * 90;
      out[i * 3 + 1] = (rand() - 0.5) * 46;
      out[i * 3 + 2] = -200 - rand() * 70;
    }
  }
}

/** A long volumetric corridor for the closing sections. */
export function ambientFormation(out: Float32Array, count: number, seed = 91): void {
  const rand = makeRandom(seed);
  const { from, to } = CLOSING_REGION;
  for (let i = 0; i < count; i++) {
    const t = rand();
    // Cube-root biasing pushes particles toward the outside of the corridor,
    // leaving the flight path itself readable.
    const radial = Math.cbrt(rand()) * 26;
    const theta = rand() * Math.PI * 2;
    out[i * 3] = from.x + (to.x - from.x) * t + Math.cos(theta) * radial;
    out[i * 3 + 1] = from.y + (to.y - from.y) * t + Math.sin(theta) * radial * 0.7;
    out[i * 3 + 2] = from.z + (to.z - from.z) * t + (rand() - 0.5) * 18;
  }
}

/**
 * The corridor a case study is read inside: a hollow tube running from just
 * behind the camera's start out past the final portal. Hollow matters — a solid
 * cloud would sit between the reader and the pinned text.
 */
export function corridorFormation(out: Float32Array, count: number, seed = 55): void {
  const rand = makeRandom(seed);
  const NEAR = 20;
  const FAR = -230;

  for (let i = 0; i < count; i++) {
    const t = rand();
    // Bias radially outward so the centre stays clear.
    const radial = 8 + Math.pow(rand(), 0.6) * 30;
    const theta = rand() * Math.PI * 2;
    out[i * 3] = Math.cos(theta) * radial;
    out[i * 3 + 1] = Math.sin(theta) * radial * 0.8 - t * 8;
    out[i * 3 + 2] = NEAR + (FAR - NEAR) * t;
  }
}

export const FORMATION_BUILDERS: Record<
  FormationName,
  (out: Float32Array, count: number) => void
> = {
  sphere: (out, count) => sphereFormation(out, count),
  network: (out, count) => networkFormation(out, count),
  pipeline: (out, count) => pipelineFormation(out, count),
  gallery: (out, count) => galleryFormation(out, count),
  ambient: (out, count) => ambientFormation(out, count),
  corridor: (out, count) => corridorFormation(out, count),
};

/** Formation shown at each stage of the journey, keyed by section id. */
export const SECTION_FORMATION: Record<string, FormationName> = {
  home: 'network',
  platform: 'pipeline',
  work: 'gallery',
  about: 'ambient',
  experience: 'ambient',
  skills: 'ambient',
  education: 'ambient',
  contact: 'ambient',
};
