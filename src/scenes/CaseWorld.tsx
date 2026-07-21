'use client';

import { useMemo } from 'react';
import { WorldMount } from '@/world/WorldMount';
import { caseStudyBeats } from '@/world/locations';
import { CaseScene } from './CaseScene';

export function CaseWorld({
  color,
  colorAlt,
  chapterCount,
}: {
  color: string;
  colorAlt: string;
  chapterCount: number;
}) {
  const beats = useMemo(() => caseStudyBeats(chapterCount), [chapterCount]);

  return (
    <WorldMount beats={beats}>
      <CaseScene color={color} colorAlt={colorAlt} chapterCount={chapterCount} />
    </WorldMount>
  );
}
