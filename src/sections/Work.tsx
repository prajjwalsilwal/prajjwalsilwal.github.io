'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { work, workIntro, workTags } from '@/content/work';

/**
 * The work gallery.
 *
 * Filtering is client state, but every project card and every link is in the
 * server-rendered markup regardless of the active filter — filtering hides
 * cards, it never withholds them from the document. That keeps all seven
 * projects crawlable and reachable without JS.
 */
export function Work() {
  const [active, setActive] = useState<string | null>(null);

  const visible = useMemo(
    () => (active ? work.filter((w) => w.tags.includes(active)) : work),
    [active],
  );

  return (
    <Section id="work" className="relative px-6 py-16 md:py-20" aria-labelledby="work-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mono-label">{workIntro.eyebrow}</p>
          <h2
            id="work-heading"
            className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight"
          >
            {workIntro.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
            {workIntro.sub}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[180px_1fr]">
          {/* Filter sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h3 className="mono-label mb-4">Filter</h3>
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              <li>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-pressed={active === null}
                  className={`w-full rounded-md px-2.5 py-1.5 text-left font-mono text-[11px] uppercase tracking-wider2 transition-colors ${
                    active === null
                      ? 'bg-white/[0.07] text-accent'
                      : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  All ({work.length})
                </button>
              </li>
              {workTags.map((tag) => {
                const count = work.filter((w) => w.tags.includes(tag)).length;
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => setActive(active === tag ? null : tag)}
                      aria-pressed={active === tag}
                      className={`w-full rounded-md px-2.5 py-1.5 text-left font-mono text-[11px] uppercase tracking-wider2 transition-colors ${
                        active === tag
                          ? 'bg-white/[0.07] text-accent'
                          : 'text-ink-faint hover:text-ink'
                      }`}
                    >
                      {tag} ({count})
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Project panels */}
          <ul className="grid gap-5 sm:grid-cols-2">
            {work.map((item, i) => {
              const shown = visible.includes(item);
              return (
                <li
                  key={item.id}
                  hidden={!shown}
                  className={shown ? '' : 'hidden'}
                >
                  <Reveal delay={(i % 2) * 60}>
                    <article
                      className="glass group relative flex h-full flex-col overflow-hidden p-7"
                      style={{ borderColor: `${item.color}22` }}
                    >
                      {/* Accent wash keyed to this project's colour, matching
                          its monolith out in the world. */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.16]"
                        style={{
                          background: `radial-gradient(120% 100% at 50% 0%, ${item.color}, transparent 70%)`,
                        }}
                      />

                      <div className="relative flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider2"
                          style={{ borderColor: `${item.color}44`, color: item.color }}
                        >
                          {item.status === 'live' && (
                            <span
                              className="h-1 w-1 rounded-full"
                              style={{ background: item.color }}
                              aria-hidden="true"
                            />
                          )}
                          {item.statusLabel}
                        </span>
                        {item.featured && <span className="mono-label text-[9px]">Featured</span>}
                      </div>

                      <ul className="relative mt-5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <li key={tag} className="tag">
                            {tag}
                          </li>
                        ))}
                      </ul>

                      <h3 className="relative mt-5 font-display text-lg font-light leading-snug">
                        {item.title}
                      </h3>
                      <p className="mono-label relative mt-2">{item.subtitle}</p>
                      <p className="relative mt-4 flex-1 text-[13px] leading-relaxed text-ink-dim">
                        {item.description}
                      </p>

                      {item.metric && (
                        <p
                          className="relative mt-5 inline-flex self-start rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider2"
                          style={{ background: `${item.color}14`, color: item.color }}
                        >
                          {item.metric}
                        </p>
                      )}

                      <div className="relative mt-6 flex flex-wrap gap-2">
                        {item.links.map((link) =>
                          link.external ? (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener"
                              className={`btn !px-4 !py-2 !text-[10px] ${
                                link.primary ? 'btn-primary' : 'btn-ghost'
                              }`}
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.label}
                              href={link.href}
                              className={`btn !px-4 !py-2 !text-[10px] ${
                                link.primary ? 'btn-primary' : 'btn-ghost'
                              }`}
                            >
                              {link.label}
                            </Link>
                          ),
                        )}
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
