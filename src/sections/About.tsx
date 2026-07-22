import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { profile } from '@/content/profile';

export function About() {
  return (
    <Section id="about" className="relative px-6 py-16 md:py-20" aria-labelledby="about-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mono-label">03 / about</p>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal>
              <h2
                id="about-heading"
                className="font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight"
              >
                {profile.aboutHeadline.lead}
                <br />
                <em className="not-italic text-accent">{profile.aboutHeadline.emphasis}</em>
              </h2>
            </Reveal>

            <div className="mt-8 space-y-5">
              {profile.about.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="max-w-xl text-[15px] leading-relaxed text-ink-dim">{para}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <a
                href={profile.contact.resume}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost mt-10"
              >
                Download Resume ↗
              </a>
            </Reveal>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {profile.aboutTiles.map((tile, i) => (
              <Reveal key={tile.title} delay={i * 60} as="li">
                <div className="glass h-full p-6">
                  <h3 className="text-[15px] font-medium">{tile.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-dim">{tile.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
