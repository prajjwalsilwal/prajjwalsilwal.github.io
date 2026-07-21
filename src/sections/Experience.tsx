import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { experience } from '@/content/resume';

export function Experience() {
  return (
    <Section id="experience" className="relative px-6 py-32" aria-labelledby="experience-heading">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mono-label">04 / experience</p>
          <h2
            id="experience-heading"
            className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight"
          >
            Where I&apos;ve Worked
          </h2>
        </Reveal>

        <ol className="mt-16">
          {experience.map((role, i) => (
            <li key={role.id} className="relative pb-14 pl-8 last:pb-0">
              {/* Timeline spine — drawn per entry so it stops at the last one. */}
              {i < experience.length - 1 && (
                <span
                  className="absolute left-[3px] top-3 h-full w-px bg-gradient-to-b from-accent/40 to-transparent"
                  aria-hidden="true"
                />
              )}
              <span
                className={`absolute left-0 top-2 h-[7px] w-[7px] rounded-full ${
                  role.current ? 'bg-accent' : 'bg-ink-faint'
                }`}
                aria-hidden="true"
              />

              <Reveal delay={i * 80}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono-label">{role.date}</span>
                  {role.current && (
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider2 text-accent">
                      Current
                    </span>
                  )}
                </div>

                <div className="glass mt-4 p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-light">{role.role}</h3>
                      <p className="mono-label mt-1.5">{role.company}</p>
                    </div>
                    {role.tags.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5">
                        {role.tags.map((tag) => (
                          <li key={tag} className="tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <ul className="mt-6 space-y-3">
                    {role.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="relative pl-5 text-[13.5px] leading-relaxed text-ink-dim before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-accent/50"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
