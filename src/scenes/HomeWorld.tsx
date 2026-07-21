'use client';

import { WorldMount } from '@/world/WorldMount';
import { HOME_BEATS } from '@/world/locations';
import { HomeScene } from './HomeScene';

export function HomeWorld() {
  return (
    <WorldMount beats={HOME_BEATS}>
      <HomeScene />
    </WorldMount>
  );
}
