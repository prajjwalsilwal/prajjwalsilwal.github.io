/**
 * FX tiering.
 *
 * `full` is the cinematic world. `lite` keeps a minimal WebGL backdrop but drops
 * post-processing and most of the particle budget. `off` renders no WebGL at all
 * and the site falls back to a plain HTML layout.
 *
 * The build-time flag NEXT_PUBLIC_FX_LEVEL sets the ceiling; the runtime probe
 * can only lower it, never raise it. That way a device that cannot cope is never
 * handed the heavy scene, and a deliberate `off` build is never overridden.
 */

export type FxLevel = 'full' | 'lite' | 'off';

const ORDER: Record<FxLevel, number> = { off: 0, lite: 1, full: 2 };

/** Build-time ceiling. Anything unrecognised means "full". */
export function configuredLevel(): FxLevel {
  const raw = process.env.NEXT_PUBLIC_FX_LEVEL;
  if (raw === 'off' || raw === 'lite' || raw === 'full') return raw;
  return 'full';
}

function lower(a: FxLevel, b: FxLevel): FxLevel {
  return ORDER[a] <= ORDER[b] ? a : b;
}

/**
 * Resolve the level for the current device. Must only be called in the browser —
 * on the server we always render the `off` markup, then upgrade after mount so
 * the prerendered HTML is the accessible version. See `useFxLevel`.
 */
export function probeLevel(): FxLevel {
  const ceiling = configuredLevel();
  if (ceiling === 'off') return 'off';
  if (typeof window === 'undefined') return 'off';

  // An explicit request for less motion is honoured as a hard downgrade, not a
  // hint — the world is almost entirely motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';

  if (!hasWebGL()) return 'off';

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 900;
  const fewCores =
    typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
  // Chromium-only; absent elsewhere, which is why it is an optional narrowing.
  const lowMemory =
    typeof (navigator as { deviceMemory?: number }).deviceMemory === 'number' &&
    (navigator as { deviceMemory?: number }).deviceMemory! <= 4;

  if (coarse || small || fewCores || lowMemory) return lower(ceiling, 'lite');
  return ceiling;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

/** Per-tier budgets, read by the scene components. */
export interface FxBudget {
  /** Particle count for the main field. */
  particles: number;
  /** Upper bound passed to <Canvas dpr>. */
  maxDpr: number;
  postprocessing: boolean;
  bloom: boolean;
  chromaticAberration: boolean;
  noise: boolean;
  /** Whether section geometry (nodes, monoliths, portals) is drawn at all. */
  sceneGeometry: boolean;
}

export const BUDGETS: Record<FxLevel, FxBudget> = {
  full: {
    particles: 24000,
    maxDpr: 2,
    postprocessing: true,
    bloom: true,
    chromaticAberration: true,
    noise: true,
    sceneGeometry: true,
  },
  lite: {
    particles: 4000,
    maxDpr: 1.5,
    postprocessing: false,
    bloom: false,
    chromaticAberration: false,
    noise: false,
    sceneGeometry: false,
  },
  off: {
    particles: 0,
    maxDpr: 1,
    postprocessing: false,
    bloom: false,
    chromaticAberration: false,
    noise: false,
    sceneGeometry: false,
  },
};
