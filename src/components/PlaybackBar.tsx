'use client';

import { useEffect, useState } from 'react';
import { stages } from '@/content/platform';
import { boot } from '@/world/bootStore';
import { useFx } from '@/world/FxProvider';
import {
  play,
  playBypass,
  playComplete,
  playConfigure,
  playSkip,
  playStart,
  playToggle,
  subscribePlay,
} from '@/world/playStore';

/**
 * Platform trailer controls.
 *
 * After the loader boots, full (and lite) FX autoplay a short flight through
 * the six pipeline stages. Scroll stays locked until Skip or the trailer ends,
 * then the page lands on Work for a short manual scroll.
 */
export function PlaybackBar() {
  const { level, ready } = useFx();
  const [mode, setMode] = useState(play.mode);
  const [stageIndex, setStageIndex] = useState(play.stageIndex);
  const [pct, setPct] = useState(0);
  const [booted, setBooted] = useState(false);

  useEffect(
    () =>
      subscribePlay(() => {
        setMode(play.mode);
        setStageIndex(play.stageIndex);
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

  // Wait for the loader to release before starting — otherwise the trailer
  // plays behind the overlay and feels broken.
  useEffect(() => {
    if (!ready) return;
    if (boot.booted) {
      setBooted(true);
      return;
    }
    const id = window.setInterval(() => {
      if (boot.booted) {
        setBooted(true);
        window.clearInterval(id);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!ready || !booted) return;

    if (level === 'off') {
      playBypass();
      return;
    }

    // Lite gets a shorter cut; full gets the ~15s trailer.
    playConfigure(level === 'lite' ? 8000 : 15000);

    // Let the loader dissolve finish before locking scroll again.
    const delay = window.setTimeout(() => {
      if (play.mode === 'idle') playStart();
    }, 900);

    return () => window.clearTimeout(delay);
  }, [ready, booted, level]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (play.mode !== 'playing' && play.mode !== 'paused') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        playSkip();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        playToggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Block wheel / touch while locked so Lenis and native scroll cannot fight.
  useEffect(() => {
    const block = (e: Event) => {
      if (play.scrollLocked) e.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    return () => {
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
    };
  }, []);

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
            onClick={playComplete}
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
