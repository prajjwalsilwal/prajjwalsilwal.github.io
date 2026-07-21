'use client';

import { useEffect, useRef, useState } from 'react';
import { loaderCopy } from '@/content/nav';
import { useFx } from '@/world/FxProvider';
import {
  allResolved,
  bootProgress,
  markBooted,
  resolveAll,
  resolveMilestone,
  subscribeBoot,
} from '@/world/bootStore';

/**
 * Intro loader.
 *
 * Sits over the canvas while the world initialises, then dissolves rather than
 * cutting — the particle sphere behind it disperses into the hero constellation
 * at the same moment, so the handoff reads as one continuous motion.
 */
export function Loader() {
  const { level, ready } = useFx();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const shown = useRef(0);

  // With FX off there is no world to build, so never show a preloader — the
  // plain layout is readable immediately.
  const skip = !ready || level === 'off';

  useEffect(() => {
    if (skip) {
      resolveAll();
      markBooted();
      setGone(true);
      return;
    }

    document.fonts?.ready
      .then(() => resolveMilestone('fonts'))
      .catch(() => resolveMilestone('fonts'));

    // Watchdog: if a milestone never lands (blocked font CDN, a driver that
    // never reports a frame), release anyway rather than trapping the reader.
    const watchdog = window.setTimeout(() => resolveAll(), 8000);

    const unsub = subscribeBoot(() => {
      if (allResolved()) window.clearTimeout(watchdog);
    });

    return () => {
      window.clearTimeout(watchdog);
      unsub();
    };
  }, [skip]);

  // Animate the displayed percentage toward real progress. Easing the number
  // up rather than snapping keeps it from jumping 0 → 70 in one frame.
  useEffect(() => {
    if (skip || gone) return;
    let raf = 0;

    const tick = () => {
      const target = bootProgress() * 100;
      shown.current += (target - shown.current) * 0.08;
      const rounded = Math.min(100, Math.round(shown.current));
      setPct(rounded);

      if (allResolved() && rounded >= 99) {
        markBooted();
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip, gone]);

  // Hold scroll while the loader is up so nobody scrolls past the intro.
  useEffect(() => {
    if (skip || gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [skip, gone]);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), 1200);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (skip || gone) return null;

  const stage =
    loaderCopy.stages[
      Math.min(loaderCopy.stages.length - 1, Math.floor((pct / 100) * loaderCopy.stages.length))
    ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void transition-opacity duration-[1100ms] ease-out"
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? 'none' : 'auto' }}
      role="progressbar"
      aria-label="Loading experience"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider3 text-ink">
        {loaderCopy.mark}
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
      </div>

      <div className="mt-8 h-px w-56 overflow-hidden bg-white/10 sm:w-72">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex w-56 items-baseline justify-between font-mono text-[10px] uppercase tracking-wider2 text-ink-faint sm:w-72">
        <span>{stage}</span>
        <span className="tabular-nums text-accent">{pct}%</span>
      </div>

      <p className="mt-10 max-w-xs text-center font-mono text-[10px] uppercase tracking-wider2 text-ink-faint/60">
        {loaderCopy.building}
      </p>
    </div>
  );
}
