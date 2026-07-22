import { clamp01, measureSections, scroll, updateActiveSection } from './scrollStore';

/**
 * Platform trailer playback.
 *
 * While `playing` / `paused`, the camera rig samples the home→platform-end
 * segment of the beat curve from `t` (time) instead of document scroll. That
 * is what makes the first visit feel like a short video rather than a long
 * scroll homework assignment.
 *
 * Kept outside React for the same reason as scrollStore: the R3F frame loop
 * reads this every frame and must not re-render the tree to do so.
 */

export type PlayMode = 'idle' | 'playing' | 'paused' | 'done';

export const play = {
  mode: 'idle' as PlayMode,
  /** Trailer progress, 0–1. */
  t: 0,
  /** Full FX duration. Lite uses a shorter value set by the controller. */
  durationMs: 15000,
  /** Active pipeline stage caption index, 0–5. */
  stageIndex: 0,
  /** True while scroll must stay locked for the trailer. */
  scrollLocked: false,
};

const listeners = new Set<() => void>();

export function subscribePlay(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify(): void {
  listeners.forEach((fn) => fn());
}

export function isPlaybackDriving(): boolean {
  return play.mode === 'playing' || play.mode === 'paused';
}

/**
 * Map trailer progress onto the Catmull-Rom curve so t=0 is the hero beat and
 * t=1 is platform-end (beat index 2 on the home journey).
 */
export function playCurveT(beatCount: number): number {
  if (beatCount < 2) return 0;
  const endBeat = Math.min(2, beatCount - 1);
  return play.t * (endBeat / (beatCount - 1));
}

function syncStageIndex(): void {
  play.stageIndex = Math.min(5, Math.floor(play.t * 6));
}

export function playConfigure(durationMs: number): void {
  play.durationMs = durationMs;
}

export function playStart(): void {
  if (play.mode === 'done') return;
  play.mode = 'playing';
  play.scrollLocked = true;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.playback = 'playing';
    document.body.style.overflow = 'hidden';
  }
  notify();
}

export function playPause(): void {
  if (play.mode !== 'playing') return;
  play.mode = 'paused';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.playback = 'paused';
  }
  notify();
}

export function playResume(): void {
  if (play.mode !== 'paused') return;
  play.mode = 'playing';
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.playback = 'playing';
  }
  notify();
}

export function playToggle(): void {
  if (play.mode === 'playing') playPause();
  else if (play.mode === 'paused') playResume();
}

/** Advance the trailer. Call from the R3F frame loop with clamped dt in ms. */
export function playTick(dtMs: number): void {
  if (play.mode !== 'playing') return;
  const prevStage = play.stageIndex;
  play.t = Math.min(1, play.t + dtMs / Math.max(play.durationMs, 1));
  syncStageIndex();
  if (play.t >= 1) {
    playComplete();
    return;
  }
  // Only wake React listeners when the caption stage changes — progress bar
  // polls via rAF in PlaybackBar so we do not re-render 60×/s.
  if (play.stageIndex !== prevStage) notify();
}

function unlockScroll(): void {
  play.scrollLocked = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.documentElement.dataset.playback = 'done';
  }
}

/** End of trailer or user Skip — unlock and land on Work. */
export function playComplete(): void {
  if (play.mode === 'done') return;
  play.t = 1;
  syncStageIndex();
  play.mode = 'done';
  unlockScroll();

  // Instant jump so the camera never snaps back to the hero for a frame
  // between unlocking scroll and reaching Work.
  if (typeof window !== 'undefined') {
    const work = document.getElementById('work');
    if (work) {
      const top = Math.max(0, work.offsetTop - 8);
      window.scrollTo({ top, behavior: 'auto' });
      measureSections();
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      scroll.y = window.scrollY;
      scroll.progress = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0;
      scroll.eased = scroll.progress;
      scroll.velocity = 0;
      updateActiveSection();
    }
  }

  notify();
}

export function playSkip(): void {
  playComplete();
}

/** Mark done without scrolling — used when FX is off / reduced motion. */
export function playBypass(): void {
  play.mode = 'done';
  play.t = 1;
  unlockScroll();
  notify();
}
