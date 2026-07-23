import { Section } from '@/components/Section';
import { Counter } from '@/components/Counter';
import { Reveal } from '@/components/Reveal';
import { TrailerCTA } from '@/components/TrailerCTA';
import { heroStats, profile } from '@/content/profile';
import { architectureManifest } from '@/content/platform';

export function Hero() {
  return (
    <Section
      id="home"
      className="beat relative flex min-h-0 items-center px-6 pb-16 pt-28 md:pb-20 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Reveal>
            <p className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              <span className="mono-label">{profile.availability}</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1
              id="hero-heading"
              className="mt-7 font-display text-[clamp(2.5rem,7vw,4.75rem)] font-light leading-[1.04] tracking-tight"
            >
              {profile.headline.lead}
              <br />
              <em className="not-italic text-accent">{profile.headline.emphasis}</em>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mono-label mt-6">{profile.subhead}</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-dim">
              I designed and shipped an end-to-end data platform — ingestion, transformation, an
              analytics warehouse, a read API, and the operations dashboard people run their day
              on. A real 200+ unit property company,{' '}
              <a
                href={profile.liveSite}
                target="_blank"
                rel="noopener"
                className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                braudproperties.com
              </a>
              , depends on it every day. Built solo, top to bottom.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#platform" className="btn btn-primary">
                Explore the platform ↓
              </a>
              <a href={profile.liveSite} target="_blank" rel="noopener" className="btn btn-ghost">
                See it live ↗
              </a>
              <TrailerCTA />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-3xl font-light tabular-nums">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </dd>
                  <dt className="mono-label mt-2 block leading-relaxed">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={380}>
            <ul className="mt-10 flex gap-3">
              {[
                { href: `mailto:${profile.contact.email}`, label: 'Email' },
                { href: profile.contact.linkedin, label: 'LinkedIn' },
                { href: profile.contact.github, label: 'GitHub' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener"
                    className="inline-flex rounded-full border border-edge px-4 py-2 font-mono text-[10px] uppercase tracking-wider2 text-ink-faint transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Architecture manifest — the platform's shape, stated plainly. */}
        <Reveal delay={220}>
          <div className="glass overflow-hidden">
            <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span className="ml-2 font-mono text-[10px] text-ink-faint">
                {architectureManifest.filename}
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[11.5px] leading-[1.9] text-ink-dim">
              <code>
                {architectureManifest.lines.map((line, i) => {
                  if (line.blank) return <br key={i} />;

                  if (line.item) {
                    return (
                      <div key={i}>
                        {'  - '}
                        <span className="text-accent-warm">{line.item}</span>
                        {'   '}
                        <span className="text-[#4ade80]">{line.status}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={i}>
                      <span className="text-accent">{line.key}</span>
                      {':'}
                      {line.value && (
                        <>
                          {' '}
                          <span
                            className={
                              line.kind === 'num'
                                ? 'text-accent-hot'
                                : line.kind === 'str'
                                  ? 'text-accent-warm'
                                  : 'text-ink'
                            }
                          >
                            {line.value}
                          </span>
                        </>
                      )}
                      {line.trail}
                      {line.comment && (
                        <span className="text-ink-faint">
                          {'  '}
                          {line.comment}
                        </span>
                      )}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </Reveal>
      </div>

      <div
        className="mono-label absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px]"
        aria-hidden="true"
      >
        scroll
      </div>
    </Section>
  );
}
