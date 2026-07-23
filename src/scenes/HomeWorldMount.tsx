'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useFx } from '@/world/FxProvider';
import { requestWorldMount, subscribeWorldGate, worldGate } from '@/world/worldGate';

/**
 * Deferred client-only boundary for the home journey's 3D world.
 *
 * Mounts on `requestIdleCallback` (≈2s timeout) or when the user clicks Play —
 * whichever comes first — so the Three chunk does not race first paint.
 */
const HomeWorld = dynamic(() => import('./HomeWorld').then((m) => m.HomeWorld), {
  ssr: false,
});

export function HomeWorldMount() {
  const { level, ready } = useFx();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!ready || level === 'off') return;

    const tryMount = () => {
      if (worldGate.mount) setMount(true);
    };

    tryMount();
    const unsub = subscribeWorldGate(tryMount);

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const schedule = () => {
      requestWorldMount();
      setMount(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(schedule, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(schedule, 2000);
    }

    return () => {
      unsub();
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [ready, level]);

  if (!ready || level === 'off' || !mount) return null;
  return <HomeWorld />;
}
