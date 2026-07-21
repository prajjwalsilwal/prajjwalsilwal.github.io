'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { registerSection } from '@/world/scrollStore';

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
  'aria-labelledby'?: string;
}

/**
 * A "location" in the world.
 *
 * Registers its DOM bounds with the scroll store so the camera rig knows where
 * this section sits in the journey. The element is a real <section> carrying
 * real content — the 3D layer is decoration over it, never a replacement.
 */
export function Section({ id, children, className = '', ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => registerSection(id, ref.current), [id]);

  return (
    <section id={id} ref={ref} className={className} {...rest}>
      {children}
    </section>
  );
}
