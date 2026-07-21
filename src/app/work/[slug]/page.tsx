import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaseWorldMount } from '@/scenes/CaseWorldMount';
import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { Footer } from '@/components/Footer';
import { caseStudies, getCaseStudy } from '@/content/work';
import { profile } from '@/content/profile';

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.metaDescription,
    openGraph: {
      title: `${study.title} | ${profile.name}`,
      description: study.ogDescription,
      type: 'article',
      url: `/work/${study.slug}/`,
    },
    alternates: { canonical: `/work/${study.slug}/` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <>
      <CaseWorldMount
        color={study.color}
        colorAlt={study.colorAlt}
        chapterCount={study.chapters.length}
      />

      <main id="main" className="relative z-10">
        {/* ── Arrival ─────────────────────────────────────────────── */}
        <Section
          id="cs-hero"
          className="beat relative flex min-h-screen items-center px-6 pb-24 pt-32"
          aria-labelledby="cs-heading"
        >
          <div className="mx-auto w-full max-w-4xl">
            <Reveal>
              <Link
                href="/#work"
                className="mono-label transition-colors hover:text-accent"
              >
                ← All Projects
              </Link>
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-8">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider2"
                  style={{ borderColor: `${study.color}44`, color: study.color }}
                >
                  {study.status === 'live' && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: study.color }}
                      aria-hidden="true"
                    />
                  )}
                  {study.statusLabel}
                </span>
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h1
                id="cs-heading"
                className="mt-7 font-display text-[clamp(2.25rem,6vw,4rem)] font-light leading-[1.08]"
              >
                {study.title}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mono-label mt-5">{study.subtitle}</p>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300}>
              <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
                {study.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd
                      className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-light tabular-nums"
                      style={{ color: study.color }}
                    >
                      {stat.value}
                    </dd>
                    <dt className="mono-label mt-2 block leading-relaxed">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Section>

        {/* ── Chapters ────────────────────────────────────────────── */}
        {study.chapters.map((chapter, i) => (
          <Section
            key={chapter.title}
            id={`cs-chapter-${i}`}
            className="beat relative flex min-h-screen items-center px-6 py-32"
            aria-labelledby={`chapter-${i}`}
          >
            <div className="mx-auto w-full max-w-3xl">
              <Reveal>
                <p className="mono-label" style={{ color: study.color }}>
                  {String(i + 1).padStart(2, '0')} / {study.chapters.length.toString().padStart(2, '0')}
                </p>
                <h2
                  id={`chapter-${i}`}
                  className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] font-light"
                >
                  {chapter.title}
                </h2>
              </Reveal>

              <div className="mt-8 space-y-5">
                {chapter.body.map((para, j) => (
                  <Reveal key={j} delay={j * 70}>
                    <p className="text-[15px] leading-relaxed text-ink-dim">{para}</p>
                  </Reveal>
                ))}
              </div>

              {chapter.steps && (
                <ol className="mt-12 grid gap-4 sm:grid-cols-2">
                  {chapter.steps.map((step, j) => (
                    <Reveal key={step.title} delay={j * 60} as="li">
                      <div className="glass h-full p-6">
                        {step.num && (
                          <span className="font-mono text-[11px]" style={{ color: study.color }}>
                            {step.num}
                          </span>
                        )}
                        <h3 className="mt-3 text-[15px] font-medium">{step.title}</h3>
                        <p className="mt-2.5 text-[13px] leading-relaxed text-ink-dim">
                          {step.body}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>
          </Section>
        ))}

        {/* ── Portal ──────────────────────────────────────────────── */}
        <Section
          id="cs-portal"
          className="beat relative flex min-h-screen items-center px-6 py-32"
          aria-labelledby="portal-heading"
        >
          <div className="mx-auto w-full max-w-2xl text-center">
            <Reveal>
              <h2
                id="portal-heading"
                className="font-display text-[clamp(2rem,5vw,3.25rem)] font-light"
              >
                {study.portal.heading}
              </h2>
            </Reveal>

            <Reveal delay={80}>
              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-ink-dim">
                {study.portal.body}
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {study.portal.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      className={`btn ${link.primary ? 'btn-primary' : 'btn-ghost'}`}
                      style={
                        link.primary
                          ? {
                              borderColor: `${study.color}66`,
                              color: study.color,
                              background: `${study.color}14`,
                            }
                          : undefined
                      }
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`btn ${link.primary ? 'btn-primary' : 'btn-ghost'}`}
                      style={
                        link.primary
                          ? {
                              borderColor: `${study.color}66`,
                              color: study.color,
                              background: `${study.color}14`,
                            }
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-16">
                <Link href="/#work" className="mono-label transition-colors hover:text-accent">
                  ← Back to all projects
                </Link>
              </p>
            </Reveal>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
