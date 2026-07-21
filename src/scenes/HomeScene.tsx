'use client';

import { useFx } from '@/world/FxProvider';
import { ParticleField } from '@/world/ParticleField';
import { CONTACT_PORTAL } from '@/world/layout';
import { StageNodes } from './StageNodes';
import { PipelineStream } from './PipelineStream';
import { Monoliths } from './Monoliths';
import { Portal } from './Portal';
import { ProximityGroup } from './ProximityGroup';

/**
 * Everything the home journey flies through.
 *
 * Below `full`, the geometry is dropped and only the particle field remains —
 * a weak GPU gets an atmospheric backdrop rather than a slideshow.
 */
export function HomeScene() {
  const { budget } = useFx();

  return (
    <>
      <ParticleField />

      {budget.sceneGeometry && (
        <>
          <ProximityGroup sections={['platform']}>
            <StageNodes />
            <PipelineStream />
          </ProximityGroup>

          <ProximityGroup sections={['work']}>
            <Monoliths />
          </ProximityGroup>

          <ProximityGroup sections={['education', 'contact']}>
            <Portal position={CONTACT_PORTAL} color="#5eead4" radius={7} />
          </ProximityGroup>
        </>
      )}
    </>
  );
}
