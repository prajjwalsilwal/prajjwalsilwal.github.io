/**
 * Boot progress.
 *
 * The percentage shown in the loader is real: each milestone resolves when the
 * thing it names has actually happened. There is no timer padding it out. If a
 * milestone never resolves the loader still releases on the watchdog below,
 * because a visitor stuck behind a stalled preloader is worse than a visitor
 * seeing an unpolished first frame.
 *
 * TODO: once real GLTF models / HDRIs / audio are added, register each as a
 * milestone here (or fold in drei's useProgress) so the bar reflects their
 * download too — the weighting below assumes the current asset-light scene.
 */

export type Milestone = 'fonts' | 'world' | 'frame';

const ALL: Milestone[] = ['fonts', 'world', 'frame'];

/** Relative weight of each milestone in the reported percentage. */
const WEIGHT: Record<Milestone, number> = { fonts: 0.25, world: 0.45, frame: 0.3 };

const done = new Set<Milestone>();
const listeners = new Set<() => void>();

export const boot = {
  /** True once the loader has finished and handed off to the hero. */
  booted: false,
};

export function resolveMilestone(m: Milestone): void {
  if (done.has(m)) return;
  done.add(m);
  listeners.forEach((fn) => fn());
}

export function bootProgress(): number {
  let total = 0;
  ALL.forEach((m) => {
    if (done.has(m)) total += WEIGHT[m];
  });
  return Math.min(1, total);
}

export function allResolved(): boolean {
  return ALL.every((m) => done.has(m));
}

export function subscribeBoot(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function markBooted(): void {
  boot.booted = true;
}

/** Reset hook for the `off` path, where there is nothing to wait for. */
export function resolveAll(): void {
  ALL.forEach((m) => done.add(m));
  listeners.forEach((fn) => fn());
}
