import * as THREE from 'three';

/**
 * The camera journey.
 *
 * Each beat is a "location" in the world. The rig builds a Catmull-Rom curve
 * through the positions and a second through the look-at targets, then samples
 * both against document scroll progress — so the flight automatically stretches
 * or compresses to whatever the page's real height turns out to be.
 *
 * `id` must match the DOM section id that registers with the scroll store, and
 * the order here must match document order.
 */

export interface Beat {
  id: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
  /** Field of view at this beat — widening sells acceleration. */
  fov: number;
  /**
   * Which DOM section this beat belongs to, and where inside it the camera
   * should arrive (0 = section top, 1 = section bottom).
   *
   * This anchoring is what keeps the flight aligned with the writing. Sampling
   * the curve against raw document progress instead would spread the beats
   * evenly down the page, and since the platform section is many screens tall
   * while contact is one, the camera would race past the hero and then crawl.
   */
  anchor: { section: string; at: number };
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** The home-page journey. */
export const HOME_BEATS: readonly Beat[] = [
  // Hero — holds for the start of the trailer, then the flight enters the pipeline.
  {
    id: 'home',
    position: v(0, 0, 26),
    target: v(0, 0, 0),
    fov: 55,
    anchor: { section: 'home', at: 0.45 },
  },

  // Approach into the mouth of the pipeline (trailer mid-flight).
  {
    id: 'platform',
    position: v(0, 1.5, 8),
    target: v(0, 0, -14),
    fov: 62,
    anchor: { section: 'platform', at: 0.08 },
  },

  // Exit of the six stage nodes — end of the time-driven trailer segment.
  {
    id: 'platform-end',
    position: v(0, 0, -150),
    target: v(0, 0, -172),
    fov: 60,
    anchor: { section: 'platform', at: 0.92 },
  },

  // Break out of the pipeline into open space where the monoliths float.
  {
    id: 'work',
    position: v(0, 4, -196),
    target: v(0, 0, -226),
    fov: 58,
    anchor: { section: 'work', at: 0.35 },
  },

  // Drift down past the gallery into the quieter closing half.
  {
    id: 'about',
    position: v(-6, -8, -252),
    target: v(2, -10, -276),
    fov: 52,
    anchor: { section: 'about', at: 0.45 },
  },
  {
    id: 'experience',
    position: v(4, -20, -292),
    target: v(-2, -24, -316),
    fov: 52,
    anchor: { section: 'experience', at: 0.45 },
  },
  {
    id: 'skills',
    position: v(-3, -34, -330),
    target: v(0, -38, -352),
    fov: 54,
    anchor: { section: 'skills', at: 0.45 },
  },
  {
    id: 'education',
    position: v(2, -46, -366),
    target: v(0, -50, -388),
    fov: 54,
    anchor: { section: 'education', at: 0.45 },
  },

  // Contact — the final portal, dead ahead.
  {
    id: 'contact',
    position: v(0, -58, -404),
    target: v(0, -60, -432),
    fov: 50,
    anchor: { section: 'contact', at: 0.5 },
  },
];

/**
 * A case study's own journey: arrive, then one beat per chapter, then the
 * portal. Built at runtime because chapter counts differ per study.
 */
export function caseStudyBeats(chapterCount: number): Beat[] {
  const beats: Beat[] = [
    {
      id: 'cs-hero',
      position: v(0, 0, 22),
      target: v(0, 0, 0),
      fov: 55,
      anchor: { section: 'cs-hero', at: 0.45 },
    },
  ];

  // Chapters spiral gently away from the origin so each has its own vantage.
  for (let i = 0; i < chapterCount; i++) {
    const angle = (i / Math.max(chapterCount, 1)) * Math.PI * 1.6;
    const depth = -26 - i * 30;
    beats.push({
      id: `cs-chapter-${i}`,
      position: v(Math.sin(angle) * 12, Math.cos(angle) * 5 - i * 1.5, depth + 16),
      target: v(Math.sin(angle) * 3, -i * 1.5, depth),
      fov: 56,
      anchor: { section: `cs-chapter-${i}`, at: 0.5 },
    });
  }

  const portalZ = -26 - chapterCount * 30 - 34;
  beats.push({
    id: 'cs-portal',
    position: v(0, -chapterCount * 1.5, portalZ + 22),
    target: v(0, -chapterCount * 1.5, portalZ),
    fov: 50,
    anchor: { section: 'cs-portal', at: 0.55 },
  });

  return beats;
}

/** Reusable scratch vectors — the rig must not allocate per frame. */
export function makeCurves(beats: readonly Beat[]) {
  return {
    position: new THREE.CatmullRomCurve3(
      beats.map((b) => b.position),
      false,
      'catmullrom',
      0.4,
    ),
    target: new THREE.CatmullRomCurve3(
      beats.map((b) => b.target),
      false,
      'catmullrom',
      0.4,
    ),
    fovs: beats.map((b) => b.fov),
  };
}
