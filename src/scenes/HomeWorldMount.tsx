'use client';

import dynamic from 'next/dynamic';

/**
 * The client-only boundary for the home journey's 3D world.
 *
 * Keeping `ssr: false` here does two jobs: it stops R3F's React-18 internals
 * from being evaluated during the prerender (which hard-crashes the build), and
 * it keeps the WebGL bundle out of the initial HTML so the readable document
 * ships first.
 */
const HomeWorld = dynamic(() => import('./HomeWorld').then((m) => m.HomeWorld), {
  ssr: false,
});

export function HomeWorldMount() {
  return <HomeWorld />;
}
