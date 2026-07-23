/**
 * Persist trailer opt-out so return visits do not re-prompt.
 * Values: `skipped` (user dismissed) | `done` (finished once).
 */

export const TRAILER_STORAGE_KEY = 'ps-trailer';

export type TrailerPref = 'skipped' | 'done';

export function readTrailerPref(): TrailerPref | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(TRAILER_STORAGE_KEY);
    if (v === 'skipped' || v === 'done') return v;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function writeTrailerPref(value: TrailerPref): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TRAILER_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}
