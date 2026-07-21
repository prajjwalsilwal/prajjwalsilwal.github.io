/**
 * Experience, skills and education — transcribed verbatim from the previous
 * site's timeline, skills grid and education cards.
 */

export interface Role {
  id: string;
  date: string;
  current?: boolean;
  role: string;
  company: string;
  tags: readonly string[];
  bullets: readonly string[];
}

export const experience: readonly Role[] = [
  {
    id: 'braud',
    date: 'Jan 2026 – Present',
    current: true,
    role: 'Automation & Data Platform Engineer',
    company: 'Braud Property Management',
    tags: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
    bullets: [
      'Designed and shipped the Braud Data Platform end to end — ingestion, transformation, a ' +
        'snapshot warehouse, a FastAPI service, and a React operations dashboard — running ' +
        'unattended for a 200+ unit portfolio',
      'Built the warehouse as an append-only snapshot model (PostgreSQL / Neon) keyed by ' +
        'snapshot_date, so the business can time-travel over its own operational history',
      'Modeled the domain precisely: a delinquency & eviction-eligibility rules engine, ' +
        'deterministic tenant risk scoring, and a prioritized actions feed',
      'Added a privacy-aware AI layer (OpenRouter) over anonymized metrics and an outbound SMS ' +
        'worker for two-way tenant comms',
      '~15,600 lines of Python (77 files) + ~7,300 lines of React (42 files), orchestrated by ' +
        'four scheduled jobs with event-driven Playwright waits — zero manual steps',
    ],
  },
  {
    id: 'contractor',
    date: 'Jan 2022 – Dec 2025',
    role: 'Technical Analyst & Support Lead',
    company: 'Independent Contractor',
    tags: ['Python', 'SQL', 'IT Systems'],
    bullets: [
      'Managed IT support and hardware lifecycle for 20+ remote and local clients — imaging, ' +
        'repairs, and fleet tracking across mixed Windows/Linux environments',
      'Automated Python web-scraping pipelines processing 500+ business records for client ' +
        'market analysis and outreach lists',
      'Built Python + SQL diagnostic dashboards across 30+ endpoints so support staff could see ' +
        'machine health before opening a remote session',
      'Did component-level repairs before recommending full replacements — kept client hardware ' +
        'running longer on tight budgets',
    ],
  },
  {
    id: 'tutor',
    date: '2019 – 2023',
    role: 'Mathematics Tutor',
    company: 'University of Louisiana at Monroe',
    tags: [],
    bullets: [
      'Tutored 100+ students in statistics, algebra, and trigonometry — the same stats ' +
        'foundation I later applied to KPI modeling and pipeline validation',
    ],
  },
];

export const skillsIntro = {
  eyebrow: '05 / tools',
  title: 'The Stack Behind the Platform',
  sub: 'Not an exhaustive list — this is what the systems on this site were actually built with.',
} as const;

export const skills = [
  {
    label: 'Platform · backend & data',
    items: ['Python', 'Playwright', 'FastAPI', 'PostgreSQL', 'Neon', 'SQL', 'Pandas'],
  },
  {
    label: 'Product · frontend',
    items: ['React', 'Vite', 'Tailwind CSS', 'Next.js', 'Sanity CMS'],
  },
  {
    label: 'AI · automation & orchestration',
    items: ['OpenRouter', 'Headless Automation', 'Task Scheduler', 'SMS Integration'],
  },
  {
    label: 'Analytics & IT · contract years',
    items: ['Power BI', 'Forecasting', 'Windows / Linux', 'Hardware Diagnostics'],
  },
] as const;

export const education = {
  eyebrow: '06 / education',
  title: 'Education & Credentials',
  school: {
    institution: 'University of Louisiana at Monroe',
    meta: 'Monroe, LA · Jan 2019 – May 2023',
    badge: 'In Progress',
    program: 'Mathematics & Computer Science',
    detail:
      '100+ credit hours completed · degree paused to work full-time in data engineering and ' +
      'automation',
    courses: ['Statistics', 'Calculus', 'Linear Algebra', 'Data Modeling', 'Probability'],
    note:
      'Coursework in statistics and linear algebra directly informs the risk scoring, trend ' +
      'modeling, and data validation I do in the platform.',
  },
  certs: {
    heading: 'Certifications',
    note:
      'Earned during the contractor years — IT Support for the hardware/diagnostics work; Data ' +
      'Analytics for the pipeline and warehouse side.',
    items: [
      {
        logo: 'G',
        name: 'Google Data Analytics Certificate',
        issuer: 'Google · SQL, spreadsheets, R',
      },
      {
        logo: 'G',
        name: 'Google IT Support Certificate',
        issuer: 'Google · networking, OS, troubleshooting',
      },
    ],
  },
} as const;
