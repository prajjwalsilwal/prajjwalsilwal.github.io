/**
 * The Braud Data Platform — the flagship. Six stages the camera flies along,
 * plus the product surfaces built on top. Copy transcribed verbatim.
 */

export interface Stage {
  id: string;
  num: string;
  kicker: string;
  title: string;
  desc: string;
  tags: readonly string[];
  /** Hue used for this node's emissive material and its particle stream. */
  hue: number;
}

export const platformIntro = {
  badge: 'Flagship · in production',
  title: { lead: 'The Braud ', emphasis: 'Data Platform' },
  lede:
    "An end-to-end system that ingests a property portfolio's operational data, models it into " +
    'a time-travelable warehouse, serves it over an API, and turns it into the dashboard ' +
    'ownership runs their day on — ingestion to product, built solo.',
  oneliner:
    'Not a demo or a course project — a live system a real company operates on daily, designed ' +
    'and built end to end by one engineer.',
  pipelineHeading: 'The architecture is the navigation',
  pipelineSub:
    'Data flows through six stages. Scroll to fly the network from raw extraction to the ' +
    'product surface.',
  surfaceHeading: 'What the product actually does',
  surfaceSub: 'Every surface below is live in the dashboard — real domain logic, not mockups.',
} as const;

export const stages: readonly Stage[] = [
  {
    id: 'ingest',
    num: '01',
    kicker: 'Ingest',
    title: '12 headless extractors, on a schedule',
    desc:
      'Playwright drives real browser sessions to pull operational reports the vendor exposes no ' +
      'API for — event-driven waits, never blind sleeps, so extraction stays fast and resilient ' +
      'when pages change.',
    tags: ['Python', 'Playwright', 'Headless browser'],
    hue: 0.52,
  },
  {
    id: 'transform',
    num: '02',
    kicker: 'Transform',
    title: '18 cleaners turn messy exports into typed facts',
    desc:
      'Each raw export is normalized, typed, and deduplicated into clean fact tables — the ' +
      'boring, essential layer that makes everything downstream trustworthy.',
    tags: ['Python', 'Pandas', 'Data modeling'],
    hue: 0.46,
  },
  {
    id: 'warehouse',
    num: '03',
    kicker: 'Warehouse',
    title: 'An append-only snapshot model that time-travels',
    desc:
      'Every fact is keyed by snapshot_date in PostgreSQL (Neon). Nothing is overwritten — so ' +
      'the business can replay any past day and see exactly what was true then. Trends and ' +
      'history come for free.',
    tags: ['PostgreSQL', 'Neon', 'Snapshot warehouse'],
    hue: 0.58,
  },
  {
    id: 'serve',
    num: '04',
    kicker: 'Serve',
    title: 'A FastAPI read layer, pooled and cached',
    desc:
      '15 routers behind a process-wide connection pool and TTL caching, so the dashboard reads ' +
      "are fast and the warehouse isn't hammered. Clean separation between data and product.",
    tags: ['FastAPI', 'Connection pool', 'TTL cache'],
    hue: 0.68,
  },
  {
    id: 'product',
    num: '05',
    kicker: 'Product',
    title: 'The operations dashboard people actually run',
    desc:
      'A React / Vite / Tailwind app that turns the warehouse into a working surface: the screen ' +
      'ownership opens first each morning to decide what to do next.',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    hue: 0.78,
  },
  {
    id: 'orchestrate',
    num: '06',
    kicker: 'Orchestrate',
    title: 'Four scheduled jobs keep it unattended',
    desc:
      'A daily full extract at 06:00, an end-of-day fast refresh at 17:00, an hourly ' +
      'near-realtime sync, and a minute-level SMS worker — running on their own, no one ' +
      'babysitting the pipeline.',
    tags: ['Task Scheduler', 'Event-driven', 'Zero manual steps'],
    hue: 0.86,
  },
];

/** The eight live product surfaces. */
export const surfaces = [
  {
    icon: '// actions',
    title: 'Prioritized actions feed',
    body:
      'Ranks every operational signal into a single "do this now" workstream, so a manager ' +
      'starts with the highest-leverage task instead of a wall of reports.',
  },
  {
    icon: '// risk',
    title: 'Tenant risk scoring',
    body:
      'Deterministic risk tiers computed from delinquency, late-payment history, lease ' +
      'expirations, and violations — explainable, not a black box.',
  },
  {
    icon: '// rules',
    title: 'Delinquency & eviction rules engine',
    body:
      'Domain logic modeled precisely: grace through day 5, delinquent from day 6, ' +
      'eviction-eligible from day 11 at a balance ≥ rent. Encoded, not guessed.',
  },
  {
    icon: '// leasing',
    title: 'Leasing pipeline',
    body:
      'Vacancy, applicant funnel, and lease-expiration risk in one view — so nothing sits empty ' +
      'or lapses unnoticed.',
  },
  {
    icon: '// maintenance',
    title: 'Maintenance tracker',
    body:
      'Open work orders by age and criticality, surfaced before they become emergencies or ' +
      'tenant complaints.',
  },
  {
    icon: '// finance',
    title: 'Financials',
    body:
      'Cash-basis P&L, collection rates, and delinquency trends read straight from the snapshot ' +
      'warehouse.',
  },
  {
    icon: '// ai',
    title: 'Privacy-aware AI layer',
    body:
      'OpenRouter summarizes applicant screening and suggests tenant actions — operating only on ' +
      'anonymized metrics, private by design.',
  },
  {
    icon: '// sms',
    title: 'Outbound SMS worker',
    body:
      'A message queue drained by a dedicated Playwright worker for real two-way tenant ' +
      'communication, wired into the same data.',
  },
] as const;

/**
 * The architecture manifest rendered in the hero terminal. Kept as structured
 * lines rather than a blob so the syntax colouring stays data-driven.
 */
export interface ManifestLine {
  /** Renders as a vertical gap. */
  blank?: boolean;
  key?: string;
  value?: string;
  kind?: 'str' | 'num';
  /** Unhighlighted text after the value. */
  trail?: string;
  comment?: string;
  /** A list entry under the preceding key. */
  item?: string;
  status?: string;
}

export const architectureManifest: { filename: string; lines: readonly ManifestLine[] } = {
  filename: 'braud_platform/architecture.yaml',
  lines: [
    { key: 'platform', value: 'braud_data_platform' },
    { key: 'portfolio', value: '200+ units', kind: 'str', comment: '# live' },
    { key: 'built_by', value: '1 engineer, end to end', kind: 'str' },
    { blank: true },
    { key: 'ingest', value: '12', kind: 'num', trail: ' playwright extractors' },
    { key: 'transform', value: '18', kind: 'num', trail: ' python cleaners' },
    { key: 'warehouse', value: 'postgres/neon · snapshot model', kind: 'str' },
    { key: 'serve', value: 'fastapi · 15 routers · pooled', kind: 'str' },
    { key: 'product', value: 'react · vite · tailwind', kind: 'str' },
    { blank: true },
    { key: 'orchestrate' },
    { item: 'daily 06:00', status: 'full extract ✓' },
    { item: 'eod  17:00', status: 'fast refresh ✓' },
    { item: 'hourly', status: 'near-realtime ✓' },
    { item: 'minute', status: 'sms worker ✓' },
    { blank: true },
    { key: 'scale', value: '~22,900', kind: 'num', trail: ' LOC · 119 files' },
  ],
};

/** Links under the flagship section. */
export const platformActions = [
  { label: 'Visit the live business ↗', href: 'https://braudproperties.com', external: true, primary: true },
  { label: 'Pipeline case study →', href: '/work/braud-pipeline/', external: false, primary: false },
  { label: 'Dashboard case study →', href: '/work/braud-dashboard/', external: false, primary: false },
  { label: 'Open dashboard demo ↗', href: '/braud_demo_master/demo/', external: true, primary: false },
] as const;
