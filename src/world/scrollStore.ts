/**
 * Global scroll state, deliberately outside React.
 *
 * The camera rig and every particle system read this each frame. Holding it in
 * component state would re-render the tree on every scroll event, which is the
 * single easiest way to make a scroll-driven WebGL site stutter. This is a
 * plain mutable object; readers mutate nothing, writers are the scroll driver
 * and the resize handler only.
 */

export interface SectionRect {
  id: string;
  /** Normalized document position of the section's start, 0–1. */
  start: number;
  /** Normalized document position of the section's end, 0–1. */
  end: number;
}

export interface ScrollState {
  /** Raw scroll offset in px. */
  y: number;
  /** Document progress, 0–1. */
  progress: number;
  /** Smoothed progress — what the camera actually follows. */
  eased: number;
  /** Signed scroll velocity, normalized-ish. Used for motion streaks. */
  velocity: number;
  /**
   * One viewport height expressed in document-progress units.
   *
   * Lets callers reason in screens ("show this a screen before we reach it")
   * instead of raw fractions, which are meaningless on a page whose height
   * changes with content.
   */
  viewport: number;
  /** Measured section bounds, in document order. */
  sections: SectionRect[];
  /** Index of the section currently under the viewport centre. */
  activeIndex: number;
  /** Progress within the active section, 0–1. */
  sectionProgress: number;
  /** Pointer position in normalized device coords, for parallax. */
  pointer: { x: number; y: number };
}

export const scroll: ScrollState = {
  y: 0,
  progress: 0,
  eased: 0,
  velocity: 0,
  viewport: 0.2,
  sections: [],
  activeIndex: 0,
  sectionProgress: 0,
  pointer: { x: 0, y: 0 },
};

/** Registered section elements, keyed by id, in document order after measure. */
const registry = new Map<string, HTMLElement>();

export function registerSection(id: string, el: HTMLElement | null): () => void {
  if (!el) return () => {};
  registry.set(id, el);
  measureSections();
  return () => {
    registry.delete(id);
  };
}

/**
 * Recompute normalized section bounds. Called on register, on resize, and once
 * after fonts settle — never per frame.
 */
export function measureSections(): void {
  if (typeof window === 'undefined') return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) {
    scroll.sections = [];
    return;
  }

  const next: SectionRect[] = [];
  registry.forEach((el, id) => {
    const top = el.offsetTop;
    const height = el.offsetHeight;
    next.push({
      id,
      start: clamp01(top / scrollable),
      end: clamp01((top + height) / scrollable),
    });
  });

  next.sort((a, b) => a.start - b.start);
  scroll.sections = next;
}

export function updateActiveSection(): void {
  const { sections, progress } = scroll;
  if (sections.length === 0) {
    scroll.activeIndex = 0;
    scroll.sectionProgress = 0;
    return;
  }

  let index = 0;
  for (let i = 0; i < sections.length; i++) {
    if (progress >= sections[i].start) index = i;
    else break;
  }

  const active = sections[index];
  const span = Math.max(active.end - active.start, 1e-6);
  scroll.activeIndex = index;
  scroll.sectionProgress = clamp01((progress - active.start) / span);
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
