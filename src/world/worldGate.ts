/**
 * Controls when the home WebGL world may mount and when a trailer play
 * has been requested. Kept outside React so mounts and PlaybackBar can
 * share intent without prop drilling.
 */

export const worldGate = {
  /** True once idle timeout fired or the user asked to play. */
  mount: false,
  /** True while waiting for first frame after an intentional Play. */
  playPending: false,
};

const listeners = new Set<() => void>();

export function subscribeWorldGate(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function requestWorldMount(): void {
  if (worldGate.mount) return;
  worldGate.mount = true;
  notify();
}

/** User clicked Watch — mount world if needed and queue play. */
export function requestTrailerPlay(): void {
  worldGate.playPending = true;
  if (!worldGate.mount) {
    worldGate.mount = true;
  }
  notify();
}

export function clearPlayPending(): void {
  if (!worldGate.playPending) return;
  worldGate.playPending = false;
  notify();
}
