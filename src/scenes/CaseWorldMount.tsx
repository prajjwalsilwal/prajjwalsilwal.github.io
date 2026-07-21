'use client';

import dynamic from 'next/dynamic';

/** Client-only boundary for a case study's world — see `HomeWorldMount`. */
const CaseWorld = dynamic(() => import('./CaseWorld').then((m) => m.CaseWorld), {
  ssr: false,
});

export function CaseWorldMount(props: {
  color: string;
  colorAlt: string;
  chapterCount: number;
}) {
  return <CaseWorld {...props} />;
}
