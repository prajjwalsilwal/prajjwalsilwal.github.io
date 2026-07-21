import * as THREE from 'three';
import { stages } from '@/content/platform';
import { work } from '@/content/work';

/**
 * Where things physically sit in the world.
 *
 * Shared by the geometry that draws them and by the particle formations that
 * flow between them, so a node and its data stream can never disagree about
 * where the node is.
 */

/** Six pipeline stage nodes, offset off the flight axis so the camera passes them. */
export const STAGE_NODES: readonly THREE.Vector3[] = stages.map((_, i) => {
  const z = -20 - i * 24;
  // Alternating lateral offset keeps the flight from being a dead straight line.
  const side = i % 2 === 0 ? 1 : -1;
  const x = side * (4.5 + (i % 3) * 0.9);
  const y = Math.sin(i * 1.3) * 2.2;
  return new THREE.Vector3(x, y, z);
});

/** A smooth curve through the stage nodes — the "data flow" streams follow it. */
export const PIPELINE_CURVE = new THREE.CatmullRomCurve3(
  [new THREE.Vector3(0, 0, 6), ...STAGE_NODES, new THREE.Vector3(0, 0, -164)],
  false,
  'catmullrom',
  0.5,
);

/** Glass monoliths for the work gallery, arranged as a shallow arc. */
export const MONOLITHS: readonly { position: THREE.Vector3; rotationY: number }[] = work.map(
  (_, i) => {
    const n = work.length;
    // Spread across an arc the camera flies into at z ≈ -226.
    const t = n > 1 ? i / (n - 1) : 0.5;
    const angle = (t - 0.5) * 1.5;
    const radius = 30;
    return {
      position: new THREE.Vector3(
        Math.sin(angle) * radius,
        (i % 3) * 3.2 - 3.2,
        -226 - Math.cos(angle) * 6 + (i % 2) * 5,
      ),
      // Each panel turns to face roughly toward the camera's arrival point.
      rotationY: -angle * 0.8,
    };
  },
);

/** The closing contact portal. */
export const CONTACT_PORTAL = new THREE.Vector3(0, -60, -432);

/** Ambient region the closing sections drift through. */
export const CLOSING_REGION = {
  from: new THREE.Vector3(0, -8, -250),
  to: new THREE.Vector3(0, -60, -430),
};
