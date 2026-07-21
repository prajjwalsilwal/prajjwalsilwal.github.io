'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  decimals?: number;
  /** Thousands separators — off for values like 200, on for 15,600. */
  group?: boolean;
  className?: string;
  duration?: number;
}

/**
 * Count-up statistic.
 *
 * Renders the final value on the server and for reduced-motion readers, so the
 * number is never missing or stuck at zero for anyone — the animation is an
 * enhancement applied only once the element scrolls into view.
 */
export function Counter({
  value,
  suffix = '',
  decimals = 0,
  group = false,
  className = '',
  duration = 1600,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let start = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);

          const step = (now: number) => {
            if (!start) start = now;
            const t = Math.min((now - start) / duration, 1);
            // Ease-out cubic: fast opening, gentle settle.
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(value * eased);
            if (t < 1) raf = requestAnimationFrame(step);
            else setDisplay(value);
          };

          setDisplay(0);
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const text = group
    ? display.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : display.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix && <span className="text-accent">{suffix}</span>}
    </span>
  );
}
