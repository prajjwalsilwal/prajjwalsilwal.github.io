'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useFx } from '@/world/FxProvider';
import { isPlaybackDriving, playBypass } from '@/world/playStore';

/**
 * App-wide WebGL + home-only trailer chrome.
 *
 * The canvas itself is a single dynamic import so Three never touches SSR,
 * and it lives once under the root layout (not per page).
 */
const PersistentWorld = dynamic(
  () => import('@/world/PersistentWorld').then((m) => m.PersistentWorld),
  { ssr: false },
);

const PlaybackBar = dynamic(
  () => import('@/components/PlaybackBar').then((m) => m.PlaybackBar),
  { ssr: false },
);

export function WorldChrome() {
  const { level, ready } = useFx();
  const pathname = usePathname() || '/';
  const onHome = pathname === '/' || pathname === '';

  // Leaving home mid-trailer must not keep driving a curve that no longer exists.
  useEffect(() => {
    if (!onHome && isPlaybackDriving()) playBypass();
  }, [onHome]);

  if (!ready || level === 'off') return null;

  return (
    <>
      <PersistentWorld />
      {onHome ? <PlaybackBar /> : null}
    </>
  );
}
