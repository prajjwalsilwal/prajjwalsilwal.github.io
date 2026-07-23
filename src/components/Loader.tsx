'use client';

import { useEffect, useRef, useState } from 'react';
import { loaderCopy } from '@/content/nav';
import { useFx } from '@/world/FxProvider';
import {
  markBooted,
  resolveAll,
  resolveMilestone,
  isMilestoneResolved,
  subscribeBoot,
} from '@/world/bootStore';

/**
 * Brief non-blocking intro. Never locks scroll. Dissolves as soon as fonts
 * are ready — the WebGL world mounts on its own schedule behind the page.
 */
export function Loader() {
  const { level, ready } = useFx();
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const shown = useRef(0);

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

    const watchdog = window.setTimeout(() => resolveMilestone('fonts'), 2500);
    return () => window.clearTimeout(watchdog);
  }, [skip]);

  useEffect(() => {
    if (skip || gone || leaving) return;
    let raf = 0;

    const tick = () => {
      const target = isMilestoneResolved('fonts') ? 100 : 35;
      shown.current += (target - shown.current) * 0.12;
      const rounded = Math.min(100, Math.round(shown.current));
      setPct(rounded);

      if (isMilestoneResolved('fonts') && rounded >= 99) {
        markBooted();
        setLeaving(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const unsub = subscribeBoot(() => {
      /* wake tick via state on next frame */
    });

    return () => {
      cancelAnimationFrame(raf);
      unsub();
    };
  }, [skip, gone, leaving]);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (skip || gone) return null;

  const stage =
    loaderCopy.stages[
      Math.min(loaderCopy.stages.length - 1, Math.floor((pct / 100) * loaderCopy.stages.length))
    ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void transition-opacity duration-700 ease-out"
      style={{
        opacity: leaving ? 0 : 1,
        pointerEvents: 'none',
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
    </div>
  );
}
