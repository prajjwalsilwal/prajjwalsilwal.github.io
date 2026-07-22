import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { education } from '@/content/resume';

export function Education() {
  const { school, certs } = education;

  return (
    <Section id="education" className="relative px-6 py-16 md:py-20" aria-labelledby="education-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mono-label">{education.eyebrow}</p>
          <h2
            id="education-heading"
            className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight"
          >
            {education.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <article className="glass h-full p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-light">{school.institution}</h3>
                  <p className="mono-label mt-2">{school.meta}</p>
                </div>
                <span className="rounded-full border border-edge px-3 py-1 font-mono text-[9px] uppercase tracking-wider2 text-ink-faint">
                  {school.badge}
                </span>
              </div>

              <p className="mt-6 text-[15px] text-ink">{school.program}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">{school.detail}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {school.courses.map((course) => (
                  <li key={course} className="tag">
                    {course}
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-edge pt-5 text-[13px] leading-relaxed text-ink-faint">
                {school.note}
              </p>
            </article>
          </Reveal>

          <Reveal delay={100}>
            <article className="glass h-full p-8">
              <h3 className="font-display text-lg font-light">{certs.heading}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">{certs.note}</p>

              <ul className="mt-7 space-y-3">
                {certs.items.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex items-center gap-4 rounded-xl border border-edge bg-white/[0.02] p-4"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-edge font-mono text-sm text-accent"
                      aria-hidden="true"
                    >
                      {cert.logo}
                    </span>
                    <div>
                      <p className="text-[13.5px]">{cert.name}</p>
                      <p className="mono-label mt-1">{cert.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
