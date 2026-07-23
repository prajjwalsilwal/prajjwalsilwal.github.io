'use client';

import { useEffect, useState } from 'react';
import { stages } from '@/content/platform';
import { isMilestoneResolved, subscribeBoot } from '@/world/bootStore';
import { useFx } from '@/world/FxProvider';
import {
  play,
  playBypass,
  playConfigure,
  playPause,
  playSkip,
  playStart,
  playToggle,
  subscribePlay,
} from '@/world/playStore';
import { readTrailerPref, writeTrailerPref } from '@/world/trailerPrefs';
import {
  clearPlayPending,
  subscribeWorldGate,
  worldGate,
} from '@/world/worldGate';

const READY_TIMEOUT_MS = 2500;

/**
 * Platform trailer controls — click-to-play only.
 *
 * Never auto-starts, never locks scroll. Play waits for the first WebGL frame
 * (or bypasses after READY_TIMEOUT_MS). Background tabs pause and stay paused.
 */
export function PlaybackBar() {
  const { level, ready } = useFx();
  const [mode, setMode] = useState(play.mode);
  const [stageIndex, setStageIndex] = useState(play.stageIndex);
  const [pct, setPct] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(
    () =>
      subscribePlay(() => {
        setMode(play.mode);
        setStageIndex(play.stageIndex);
      }),
    [],
  );

  useEffect(
    () =>
      subscribeWorldGate(() => {
        setPending(worldGate.playPending);
      }),
    [],
  );

  // Poll progress for the bar without forcing React on every R3F frame.
  useEffect(() => {
    if (mode !== 'playing' && mode !== 'paused') return;
    let raf = 0;
    const tick = () => {
      setPct(Math.round(play.t * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  // Highlight the matching stage card in the DOM while the trailer runs.
  useEffect(() => {
    if (mode !== 'playing' && mode !== 'paused') {
      document.querySelectorAll('[data-stage][data-active]').forEach((el) => {
        el.removeAttribute('data-active');
      });
      return;
    }
    const stage = stages[stageIndex];
    if (!stage) return;
    document.querySelectorAll('[data-stage]').forEach((el) => {
      if (el.getAttribute('data-stage') === stage.id) el.setAttribute('data-active', 'true');
      else el.removeAttribute('data-active');
    });
  }, [mode, stageIndex]);

  // Intentional Play: wait for first frame, else bypass after timeout.
  useEffect(() => {
    if (!ready || !pending) return;

    if (level === 'off') {
      clearPlayPending();
      playBypass();
      return;
    }

    playConfigure(level === 'lite' ? 8000 : 15000);

    let cancelled = false;
    let started = false;

    const tryStart = () => {
      if (cancelled || started) return;
      if (!isMilestoneResolved('frame')) return;
      started = true;
      clearPlayPending();
      if (play.mode === 'idle') playStart();
    };

    if (isMilestoneResolved('frame')) {
      tryStart();
      return () => {
        cancelled = true;
      };
    }

    const unsub = subscribeBoot(tryStart);
    const timeout = window.setTimeout(() => {
      if (cancelled || started) return;
      started = true;
      clearPlayPending();
      playBypass();
    }, READY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(timeout);
    };
  }, [ready, pending, level]);

  // Background tab: pause and stay paused (no surprise resume).
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && play.mode === 'playing') playPause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (play.mode !== 'playing' && play.mode !== 'paused') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        writeTrailerPref('skipped');
        playSkip();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        playToggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Persist completion so the hero CTA does not reappear.
  useEffect(() => {
    if (mode !== 'done') return;
    if (readTrailerPref() === 'skipped') return;
    writeTrailerPref('done');
  }, [mode]);

  if (!ready || level === 'off') return null;
  if (mode !== 'playing' && mode !== 'paused') return null;

  const stage = stages[stageIndex] ?? stages[0];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-3 px-4 pb-6 pt-16"
      style={{
        background:
          'linear-gradient(to top, rgba(4,5,7,0.92) 0%, rgba(4,5,7,0.55) 55%, transparent 100%)',
      }}
      role="region"
      aria-label="Platform trailer"
    >
      <div className="pointer-events-none max-w-lg text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider2 text-accent">
          {stage.num} · {stage.kicker}
        </p>
        <p className="mt-1 font-display text-lg font-light text-ink sm:text-xl">{stage.title}</p>
      </div>

      <div className="pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-white/10 bg-void/80 px-4 py-3 backdrop-blur-md">
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Trailer progress"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={playToggle}
            className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider2 text-ink transition hover:border-accent/40 hover:text-accent"
            aria-label={mode === 'playing' ? 'Pause trailer' : 'Resume trailer'}
          >
            {mode === 'playing' ? 'Pause' : 'Play'}
          </button>

          <span className="font-mono text-[10px] tabular-nums text-ink-faint">
            {pct}% · Esc to skip
          </span>

          <button
            type="button"
            onClick={() => {
              writeTrailerPref('skipped');
              playSkip();
            }}
            className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider2 text-accent transition hover:bg-accent/20"
            aria-label="Skip trailer"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
