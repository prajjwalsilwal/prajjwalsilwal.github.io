import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { Counter } from '@/components/Counter';
import { scaleStats } from '@/content/profile';
import { platformActions, platformIntro, stages, surfaces } from '@/content/platform';

/**
 * The flagship.
 *
 * Each stage is a tall block so the camera has room to arrive at its node and
 * hold there while the copy is read — the pinning is a product of section
 * height rather than a scroll hijack, which keeps it usable when the world is
 * switched off.
 */
export function Platform() {
  return (
    <Section id="platform" className="relative px-6 py-32" aria-labelledby="platform-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider2 text-accent">
              {platformIntro.badge}
            </span>
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h2
            id="platform-heading"
            className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-tight"
          >
            {platformIntro.title.lead}
            <em className="not-italic text-accent">{platformIntro.title.emphasis}</em>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-dim">
            {platformIntro.lede}
          </p>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-faint">
            {platformIntro.oneliner}
          </p>
        </Reveal>

        {/* Scale */}
        <dl className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scaleStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="glass h-full p-6">
                <dd className="font-display text-3xl font-light tabular-nums">
                  <Counter value={stat.value} suffix={stat.suffix} group />
                </dd>
                <dt className="mono-label mt-3 block leading-relaxed">{stat.label}</dt>
                <div className="mt-5 h-px w-full bg-white/10">
                  <div className="h-full bg-accent/70" style={{ width: `${stat.bar}%` }} />
                </div>
              </div>
            </Reveal>
          ))}
        </dl>

        {/* The six stages */}
        <Reveal>
          <div className="mt-32 max-w-2xl">
            <h3 className="font-display text-2xl font-light">{platformIntro.pipelineHeading}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">
              {platformIntro.pipelineSub}
            </p>
          </div>
        </Reveal>

        <ol className="stage-flow mt-16 space-y-[40vh]">
          {stages.map((stage) => (
            <li key={stage.id} id={`stage-${stage.id}`}>
              <Reveal>
                <article className="glass max-w-xl p-8 lg:ml-auto lg:mr-0 lg:max-w-lg">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-accent">{stage.num}</span>
                    <span className="mono-label text-accent">{stage.kicker}</span>
                  </div>
                  <h4 className="mt-4 font-display text-xl font-light leading-snug">
                    {stage.title}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-ink-dim">{stage.desc}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {stage.tags.map((tag) => (
                      <li key={tag} className="tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Product surfaces */}
        <Reveal>
          <div className="mt-40 max-w-2xl">
            <h3 className="font-display text-2xl font-light">{platformIntro.surfaceHeading}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-dim">{platformIntro.surfaceSub}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {surfaces.map((surface, i) => (
            <Reveal key={surface.title} delay={(i % 4) * 60}>
              <div className="glass h-full p-6">
                <p className="font-mono text-[10px] text-accent">{surface.icon}</p>
                <h4 className="mt-4 text-[15px] font-medium leading-snug">{surface.title}</h4>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">{surface.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-wrap gap-3">
            {platformActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener' : undefined}
                className={`btn ${action.primary ? 'btn-primary' : 'btn-ghost'}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
