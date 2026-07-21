'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ParticleField } from '@/world/ParticleField';
import { useFx } from '@/world/FxProvider';
import { Portal } from './Portal';
import { ChapterMarkers } from './ChapterMarkers';

/**
 * The 3D world for a single case study.
 *
 * One scene serves all five studies — the colour, chapter count and portal
 * position come from the content layer, so a new case study gets a scene for
 * free and none of them can drift apart visually.
 */
export function CaseScene({
  color,
  colorAlt,
  chapterCount,
}: {
  color: string;
  colorAlt: string;
  chapterCount: number;
}) {
  const { budget } = useFx();

  const portalPosition = useMemo(
    () => new THREE.Vector3(0, -chapterCount * 1.5, -26 - chapterCount * 30 - 34),
    [chapterCount],
  );

  return (
    <>
      {/* Dimmer than the home field — this one sits directly behind body copy
          for the length of the study, so it has to stay out of the way. */}
      <ParticleField
        formation="corridor"
        color={color}
        size={2.2}
        drift={0.45}
        brightness={0.26}
      />

      {budget.sceneGeometry && (
        <>
          <ChapterMarkers count={chapterCount} color={color} colorAlt={colorAlt} />
          <Portal position={portalPosition} color={colorAlt} radius={6} />
        </>
      )}
    </>
  );
}
