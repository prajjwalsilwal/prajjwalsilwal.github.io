'use client';

import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scroll } from '@/world/scrollStore';

/**
 * Shows its children only while the journey is near the named sections.
 *
 * Two reasons this exists. Visually, fog alone doesn't hide a lit node 40 units
 * away, so the pipeline and the gallery bleed into the hero and read as stray
 * artefacts. Practically, it means only the location the camera is actually at
 * is being drawn.
 *
 * The margin is generous so geometry is already present (and fogged to nothing)
 * before it could pop into view.
 */
export function ProximityGroup({
  sections,
  marginScreens = 0.6,
  children,
}: {
  sections: readonly string[];
  /**
   * How far ahead of a section its geometry appears, in viewport heights.
   * Measured in screens rather than document fractions because this page is
   * many screens tall — a fixed fraction would mean "half the site" here and
   * "a sliver" on a shorter page.
   */
  marginScreens?: number;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;

    const rects = scroll.sections;
    if (rects.length === 0) {
      // Before measurement, show everything rather than an empty world.
      g.visible = true;
      return;
    }

    const margin = scroll.viewport * marginScreens;

    let near = false;
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (!sections.includes(r.id)) continue;
      if (scroll.eased >= r.start - margin && scroll.eased <= r.end + margin) {
        near = true;
        break;
      }
    }

    g.visible = near;
  });

  return <group ref={group}>{children}</group>;
}
