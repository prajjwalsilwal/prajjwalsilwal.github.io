'use client';

import type { ReactNode } from 'react';
import type { Beat } from './locations';
import { World } from './World';

/**
 * Thin wrapper around the canvas.
 *
 * This module and everything it reaches — three, R3F, the scenes — must only
 * ever be loaded behind a `dynamic(..., { ssr: false })` boundary. R3F v8 pokes
 * at React 18 internals that do not exist during a server render, so importing
 * it into the prerender crashes the build rather than degrading. See
 * `HomeWorldMount` / `CaseWorldMount` for the boundaries that enforce this.
 */
export function WorldMount({ beats, children }: { beats: readonly Beat[]; children: ReactNode }) {
  return <World beats={beats}>{children}</World>;
}
