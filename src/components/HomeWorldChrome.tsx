'use client';

import dynamic from 'next/dynamic';
import { useFx } from '@/world/FxProvider';

const HomeWorldMount = dynamic(
  () => import('@/scenes/HomeWorldMount').then((m) => m.HomeWorldMount),
  { ssr: false },
);

const PlaybackBar = dynamic(
  () => import('@/components/PlaybackBar').then((m) => m.PlaybackBar),
  { ssr: false },
);

/**
 * World + trailer chrome — only pulled in when FX is eligible.
 */
export function HomeWorldChrome() {
  const { level, ready } = useFx();

  if (!ready || level === 'off') return null;

  return (
    <>
      <HomeWorldMount />
      <PlaybackBar />
    </>
  );
}
