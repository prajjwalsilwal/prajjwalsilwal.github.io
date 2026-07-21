import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { skills, skillsIntro } from '@/content/resume';

export function Skills() {
  return (
    <Section id="skills" className="relative px-6 py-32" aria-labelledby="skills-heading">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mono-label">{skillsIntro.eyebrow}</p>
          <h2
            id="skills-heading"
            className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight"
          >
            {skillsIntro.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
            {skillsIntro.sub}
          </p>
        </Reveal>

        <dl className="mt-14 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {skills.map((row, i) => (
            <Reveal key={row.label} delay={i * 60}>
              <div className="grid gap-4 py-7 sm:grid-cols-[190px_1fr] sm:gap-8">
                <dt className="mono-label leading-relaxed">{row.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {row.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-edge bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-ink-dim"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
