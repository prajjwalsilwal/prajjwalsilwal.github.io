'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFx } from './FxProvider';
import { play, subscribePlay } from './playStore';
import { clamp01, measureSections, scroll, updateActiveSection } from './scrollStore';

/**
 * Drives Lenis smooth scroll and keeps the scroll store fed.
 *
 * Lenis runs off GSAP's ticker rather than its own rAF so the scroll position,
 * ScrollTrigger and the R3F render loop all advance against the same clock —
 * mixing two rAF loops is what produces the classic one-frame camera judder.
 *
 * During the platform trailer Lenis stays running — scroll is never locked —
 * while the camera samples playStore time instead of scroll progress.
 */
export function SmoothScroll() {
  const { level, ready } = useFx();

  useEffect(() => {
    if (!ready) return;

    gsap.registerPlugin(ScrollTrigger);

    const cleanups: (() => void)[] = [];
    let lenis: Lenis | null = null;

    // With FX off we still track scroll (nav highlighting depends on it) but we
    // never hijack it — that layout is a plain readable document.
    if (level !== 'off') {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch devices already have momentum scrolling; doubling it feels laggy.
        syncTouch: false,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
      });
    }

    const syncLenisLock = () => {
      if (!lenis) return;
      if (play.scrollLocked) lenis.stop();
      else lenis.start();
    };
    syncLenisLock();
    cleanups.push(subscribePlay(syncLenisLock));

    const readScroll = () => {
      if (play.scrollLocked) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const prev = scroll.progress;
      scroll.y = y;
      scroll.progress = scrollable > 0 ? clamp01(y / scrollable) : 0;
      scroll.velocity = scroll.progress - prev;
      scroll.viewport = scrollable > 0 ? window.innerHeight / scrollable : 1;
      updateActiveSection();
    };

    const onResize = () => {
      measureSections();
      readScroll();
      ScrollTrigger.refresh();
    };

    const onPointer = (e: PointerEvent) => {
      scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    cleanups.push(() => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
    });

    measureSections();
    readScroll();

    // Web fonts change section heights after first paint; remeasure once they
    // land rather than guessing at a timeout.
    let cancelled = false;
    document.fonts?.ready
      .then(() => {
        if (!cancelled) onResize();
      })
      .catch(() => {});
    cleanups.push(() => {
      cancelled = true;
    });

    return () => cleanups.forEach((fn) => fn());
  }, [level, ready]);

  return null;
}
