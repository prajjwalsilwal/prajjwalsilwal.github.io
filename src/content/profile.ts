/**
 * Identity, contact details and site-level metadata.
 *
 * Everything here is transcribed from the pre-rebuild static site. These are
 * real, verifiable facts — treat edits as content changes, not copy tweaks.
 */

export const profile = {
  name: 'Prajjwal Silwal',
  role: 'Automation & Data Platform Engineer',
  location: 'Monroe, LA',
  availability: 'Live in production · Monroe, LA · remote OK',
  siteUrl: 'https://prajjwalsilwal.github.io',

  headline: {
    lead: 'I build the full stack',
    emphasis: 'behind a live business.',
  },

  subhead: 'Prajjwal Silwal · Automation & Data Platform Engineer',

  bio:
    'I designed and shipped an end-to-end data platform — ingestion, transformation, an ' +
    'analytics warehouse, a read API, and the operations dashboard people run their day on. ' +
    'A real 200+ unit property company, braudproperties.com, depends on it every day. ' +
    'Built solo, top to bottom.',

  /** Long-form About copy, three paragraphs, verbatim from the previous site. */
  about: [
    "I'm based in Monroe, LA, and I build systems end to end — the extractor that pulls the " +
      'data, the schema that stores it, the API that serves it, and the interface someone ' +
      'actually uses. Owning every layer is what lets me make a real business run on my code.',
    "That's the Braud Data Platform: a pipeline, a snapshot warehouse, a FastAPI service, and " +
      'a React dashboard, plus an AI layer and an SMS worker — roughly 22,900 lines across 119 ' +
      'files, running unattended for a 200+ unit portfolio. I designed the domain logic (risk ' +
      'scoring, a delinquency and eviction rules engine) as carefully as the infrastructure.',
    'Before this, I spent four years as an IT contractor across 20+ client environments — ' +
      'hardware, imaging, diagnostics, and the Python + SQL tooling that keeps operations ' +
      'visible. I still want to see the data pipeline and sit with the person who depends on ' +
      'its output.',
  ],

  aboutHeadline: { lead: 'I own the whole', emphasis: 'stack, on purpose.' },

  /** The four "what I'm about" tiles beside the About copy. */
  aboutTiles: [
    {
      title: 'Ingestion → product',
      body:
        "I'm comfortable at every layer: browser automation, data modeling, warehousing, API " +
        'design, and the React frontend on top.',
    },
    {
      title: 'Domain logic done right',
      body:
        'Rules engines and risk scoring modeled precisely to how the business actually works — ' +
        'explainable and deterministic, not guessed.',
    },
    {
      title: 'Built to run unattended',
      body:
        'Scheduled jobs, connection pooling, caching, and event-driven waits so the system holds ' +
        'up without someone watching it.',
    },
    {
      title: "What I'm not chasing",
      body:
        'Resume-padding dashboards or tooling demos with no one on the other end waiting for the ' +
        'output.',
    },
  ],

  contact: {
    headline: { lead: 'Need someone who can', emphasis: 'build the whole thing?' },
    body:
      'Open to freelance, contract, and full-time roles. I do my best work when a team needs one ' +
      'person who can take a problem from raw data all the way to a product people rely on — ' +
      'pipeline, warehouse, API, and interface. Based in Monroe, LA; remote-friendly.',
    email: 'silwalprajjwal@gmail.com',
    phone: '+1 (318) 557-8090',
    phoneHref: 'tel:+13185578090',
    linkedin: 'https://linkedin.com/in/prajjwal-silwal',
    github: 'https://github.com/prajjwalsilwal',
    resume: '/Prajjwal_Silwal_Resume.pdf',
  },

  liveSite: 'https://braudproperties.com',

  metaDescription:
    'Prajjwal Silwal — Automation & full-stack data engineer. I designed and shipped the Braud ' +
    'Data Platform: an end-to-end data pipeline, snapshot warehouse, FastAPI service, and React ' +
    'operations dashboard that a live 200+ unit property-management company runs on every day.',

  ogDescription:
    'I build the full stack behind a live business — data pipelines, an analytics warehouse, a ' +
    'FastAPI service, and the dashboard a 200+ unit property company runs its day on.',

  keywords: [
    'Data Engineer',
    'Automation Engineer',
    'Full-Stack',
    'Python',
    'Playwright',
    'FastAPI',
    'PostgreSQL',
    'Neon',
    'React',
    'Data Pipeline',
    'Warehouse',
    'Dashboard',
    'Monroe Louisiana',
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prajjwal Silwal',
    jobTitle: 'Automation & Data Platform Engineer',
    url: 'https://prajjwalsilwal.github.io/',
    sameAs: ['https://linkedin.com/in/prajjwal-silwal', 'https://github.com/prajjwalsilwal'],
    email: 'silwalprajjwal@gmail.com',
    telephone: '+1-318-557-8090',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Monroe',
      addressRegion: 'LA',
      addressCountry: 'US',
    },
    description:
      'Automation & full-stack data engineer. Designed and shipped the Braud Data Platform — ' +
      'pipeline, snapshot warehouse, FastAPI service, and React operations dashboard — running a ' +
      'live 200+ unit property portfolio daily.',
  },
} as const;

/** Hero stat strip. `value`/`suffix` are split so the counters can animate the number. */
export const heroStats = [
  { value: 15.6, suffix: 'K', decimals: 1, label: 'Python LOC · 77 files' },
  { value: 7.3, suffix: 'K', decimals: 1, label: 'React LOC · 42 files' },
  { value: 200, suffix: '+', decimals: 0, label: 'Units live · daily + hourly' },
  { value: 1, suffix: '', decimals: 0, label: 'Engineer · end to end' },
] as const;

/** The four scale cards in the flagship section. `bar` is the fill percentage. */
export const scaleStats = [
  { value: 15600, suffix: '', label: 'Lines of Python · 77 files', bar: 100 },
  { value: 7300, suffix: '', label: 'Lines of React · 42 files', bar: 47 },
  { value: 200, suffix: '+', label: 'Units in the live portfolio', bar: 88 },
  { value: 24, suffix: '/7', label: 'Unattended · daily + hourly jobs', bar: 100 },
] as const;
