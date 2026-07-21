import { Section } from '@/components/Section';
import { Reveal } from '@/components/Reveal';
import { profile } from '@/content/profile';

/**
 * The final portal. The glowing ring behind this lives in the 3D scene; every
 * actual contact detail is real, selectable HTML so it survives with the world
 * switched off.
 */
export function Contact() {
  const { contact } = profile;

  return (
    <Section
      id="contact"
      className="beat relative flex min-h-screen items-center px-6 py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mono-label">07 / contact</p>
        </Reveal>

        <Reveal delay={60}>
          <h2
            id="contact-heading"
            className="mt-6 font-display text-[clamp(2rem,6vw,4rem)] font-light leading-[1.1]"
          >
            {contact.headline.lead}
            <br />
            <em className="not-italic text-accent">{contact.headline.emphasis}</em>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-ink-dim">
            {contact.body}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <a
            href={`mailto:${contact.email}`}
            className="mt-12 inline-flex items-baseline gap-3 font-display text-[clamp(1.25rem,4vw,2.25rem)] font-light text-ink transition-colors hover:text-accent"
          >
            {contact.email}
            <span aria-hidden="true" className="text-accent">
              ↗
            </span>
          </a>
        </Reveal>

        <Reveal delay={240}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {[
              { label: 'LinkedIn ↗', href: contact.linkedin, external: true },
              { label: 'GitHub ↗', href: contact.github, external: true },
              { label: contact.phone, href: contact.phoneHref, external: false },
              { label: 'Resume PDF ↗', href: contact.resume, external: true },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener' : undefined}
                  className="font-mono text-xs uppercase tracking-wider2 text-ink-dim transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
