'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navItems } from '@/content/nav';
import { profile } from '@/content/profile';
import { scroll } from '@/world/scrollStore';

/**
 * Floating pill nav.
 *
 * Real anchors to real section ids, so it works as a table of contents with JS
 * disabled and is keyboard-navigable by default. The active-section highlight
 * polls the scroll store on a rAF rather than subscribing, keeping scroll
 * itself free of React work.
 */
export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    let raf = 0;
    let last = '';

    const tick = () => {
      const section = scroll.sections[scroll.activeIndex];
      if (section && section.id !== last) {
        last = section.id;
        setActive(section.id);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onHome]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
      <div className="pointer-events-auto flex w-full max-w-4xl items-center gap-3 rounded-full border border-edge bg-abyss/70 px-4 py-2.5 backdrop-blur-xl">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-wider2 text-ink"
        >
          PS
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="sr-only">{profile.name} — home</span>
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={href(item.id)}
                  aria-current={onHome && active === item.id ? 'true' : undefined}
                  className={`rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider2 transition-colors duration-300 ${
                    onHome && active === item.id
                      ? 'bg-white/[0.07] text-accent'
                      : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={profile.contact.resume}
          target="_blank"
          rel="noopener"
          className="ml-auto shrink-0 rounded-full border border-edge px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider2 text-ink-dim transition-colors hover:border-accent/40 hover:text-accent md:ml-0"
        >
          Resume ↗
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="shrink-0 rounded-full border border-edge px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider2 text-ink-dim md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        hidden={!open}
        className="pointer-events-auto absolute inset-x-4 top-20 rounded-2xl border border-edge bg-abyss/95 p-3 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-col">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={href(item.id)}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 font-mono text-xs uppercase tracking-wider2 text-ink-dim hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
