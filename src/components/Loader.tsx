'use client';

import { useEffect, useRef, useState } from 'react';
import { loaderCopy } from '@/content/nav';
import { useFx } from '@/world/FxProvider';
import {
  allResolved,
  bootProgress,
  isMilestoneResolved,
  markBooted,
  resolveAll,
  resolveMilestone,
  subscribeBoot,
} from '@/world/bootStore';
import { subscribeWorldGate, worldGate } from '@/world/worldGate';

/**
 * Intro loader — non-blocking overlay.
 *
 * Does not lock body scroll. When the world is still deferred, dissolves as
 * soon as fonts resolve so the prerendered hero is interactive immediately.
 * World/frame milestones still gate the trailer Play path separately.
 */
export function Loader() {
  const { level, ready } = useFx();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [worldMounted, setWorldMounted] = useState(false);
  const shown = useRef(0);

  const skip = !ready || level === 'off';

  useEffect(
    () =>
      subscribeWorldGate(() => {
        setWorldMounted(worldGate.mount);
      }),
    [],
  );

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

    // Soft watchdog — never trap the reader behind a stalled overlay.
    const watchdog = window.setTimeout(() => {
      resolveMilestone('fonts');
      if (!worldGate.mount) {
        markBooted();
        setLeaving(true);
      } else {
        resolveAll();
      }
    }, 4000);

    const unsub = subscribeBoot(() => {
      if (allResolved()) window.clearTimeout(watchdog);
    });

    return () => {
      window.clearTimeout(watchdog);
      unsub();
    };
  }, [skip]);

  // Deferred world: release on fonts alone. Mounted world: wait for milestones.
  useEffect(() => {
    if (skip || gone || leaving) return;
    let raf = 0;

    const tick = () => {
      const deferredRelease = !worldMounted && isMilestoneResolved('fonts');
      const target = deferredRelease ? 100 : bootProgress() * 100;
      shown.current += (target - shown.current) * 0.08;
      const rounded = Math.min(100, Math.round(shown.current));
      setPct(rounded);

      if (deferredRelease && rounded >= 99) {
        markBooted();
        setLeaving(true);
        return;
      }

      if (worldMounted && allResolved() && rounded >= 99) {
        markBooted();
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [skip, gone, leaving, worldMounted]);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), 900);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (skip || gone) return null;

  const stage =
    loaderCopy.stages[
      Math.min(loaderCopy.stages.length - 1, Math.floor((pct / 100) * loaderCopy.stages.length))
    ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void transition-opacity duration-[900ms] ease-out"
      style={{
        opacity: leaving ? 0 : 1,
        // Allow interaction with prerendered HTML once fade starts; never trap.
        pointerEvents: leaving ? 'none' : 'auto',
      }}
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
