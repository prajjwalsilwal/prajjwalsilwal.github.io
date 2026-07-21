/**
 * Every project, and — where one exists — its full case study.
 *
 * A project and its case study share a single record so the gallery card and
 * the case-study scene can never drift out of sync. `caseStudy: null` means the
 * project links straight out to GitHub instead of having a scene of its own.
 *
 * NOTE ON GITHUB LINKS: the notebook/report project directories moved to
 * `public/projects/...` during the rebuild so their published site URLs stayed
 * stable. The `tree/main/...` links below include that `public/` segment and are
 * only correct once this branch merges to `main`.
 */

export interface CaseChapter {
  /** Chapter label — becomes the camera beat name and the <h2>. */
  title: string;
  /** One or more paragraphs. Inline markup is expressed as plain text. */
  body: readonly string[];
  /** Optional numbered sub-steps (the old "flow" and "features" blocks). */
  steps?: readonly { num?: string; title: string; body: string }[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  status: 'live' | 'complete';
  statusLabel: string;
  tags: readonly string[];
  metaDescription: string;
  ogDescription: string;
  /** Stat block under the case-study hero. */
  stats: readonly { value: string; label: string }[];
  chapters: readonly CaseChapter[];
  /** The closing portal. */
  portal: {
    heading: string;
    body: string;
    links: readonly { label: string; href: string; external: boolean; primary: boolean }[];
  };
  /** Hex colour driving this scene's lighting, particles and UI accents. */
  color: string;
  /** Secondary colour for gradients and the portal ring. */
  colorAlt: string;
}

export interface WorkItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  status: 'live' | 'complete' | 'analytics' | 'modeling';
  statusLabel: string;
  featured?: boolean;
  metric?: string;
  color: string;
  /** Primary destination when there is no case study. */
  links: readonly { label: string; href: string; external: boolean; primary: boolean }[];
  caseStudy: CaseStudy | null;
}

const GH_TREE = 'https://github.com/prajjwalsilwal/prajjwalsilwal.github.io/tree/main/public/projects';

export const work: readonly WorkItem[] = [
  // ─────────────────────────────────────────────────────────── Braud Properties
  {
    id: 'braud-properties',
    title: 'Braud Properties — Tenant Site',
    subtitle: 'Public rental platform · braudproperties.com',
    description:
      'The public face of the same portfolio the platform powers: live listings across 200+ ' +
      'units and 10 properties, Sanity CMS, real-time filters, and direct online applications.',
    tags: ['Next.js', 'React', 'Sanity CMS', 'Tailwind CSS', 'Buildium'],
    status: 'live',
    statusLabel: 'Live — In Production',
    featured: true,
    metric: '200+ Units Live',
    color: '#10b981',
    links: [
      { label: 'Visit Site →', href: 'https://braudproperties.com', external: true, primary: true },
      { label: 'Case Study →', href: '/work/braud-properties/', external: false, primary: false },
    ],
    caseStudy: {
      slug: 'braud-properties',
      title: 'Braud Properties — Public Rental Platform',
      subtitle: 'Tenant-Facing Property Website',
      status: 'live',
      statusLabel: 'Live — In Production',
      tags: ['Next.js', 'React', 'Sanity CMS', 'Tailwind CSS', 'Buildium'],
      metaDescription:
        'Braud Properties — public rental platform built with Next.js, React, Sanity CMS, and ' +
        'Buildium integration. Case study by Prajjwal Silwal.',
      ogDescription:
        'Full-stack production website for Braud & Son Property Management — 200+ live rental ' +
        'units across Monroe, LA.',
      color: '#10b981',
      colorAlt: '#34d399',
      stats: [
        { value: '200+', label: 'Units listed on site' },
        { value: '10', label: 'Property groups' },
        { value: 'Live', label: 'Production since Jan 2026' },
      ],
      chapters: [
        {
          title: 'Problem',
          body: [
            'Prospective tenants for Braud & Son Property Management had no single place to see ' +
              'what was actually available. Listings lived in Buildium, marketing copy lived in ' +
              "people's heads, and every inquiry started with a phone call. Staff repeated the " +
              'same answers — which units were open, which property they belonged to, how to ' +
              'apply — dozens of times a week.',
          ],
        },
        {
          title: 'Approach',
          body: [
            'I built a Next.js front-end with listing filters tied to live vacancy data, a Sanity ' +
              'CMS layer so non-technical staff can edit property pages without touching code, ' +
              'and a Buildium application flow so an interested tenant can apply from the same ' +
              'page they found the unit on. Tailwind handled responsive layout across the ' +
              '10-property portfolio.',
            "The hard part wasn't the UI — it was keeping listings accurate when availability " +
              'changes daily. The site reads from the same operational reality the property ' +
              'managers work in, not a static spreadsheet someone updates when they remember.',
          ],
        },
        {
          title: 'Decision',
          body: [
            'Sanity for content, Buildium for transactions. Property descriptions, photos, and ' +
              'marketing pages change slowly — that belongs in a CMS. Vacancy status and ' +
              'applications change fast — that belongs in Buildium. Splitting the two kept staff ' +
              'from editing listing availability by hand (which is how sites go stale).',
            'Public site separate from the ops dashboard. Tenants need marketing and filters; ' +
              'owners need delinquency and maintenance. Same company, different audiences — so ' +
              'this shipped as its own product surface at braudproperties.com rather than ' +
              'bolting listings onto the internal analytics UI.',
          ],
        },
        {
          title: 'Result',
          body: [
            'The site is live in production at braudproperties.com, covering 200+ units across ' +
              '10 properties in Monroe, LA. Tenants can filter by property group, see pricing ' +
              'and unit details, and submit applications online.',
            'Tenants browse available units and submit applications online — staff no longer ' +
              'field the same availability and application questions by phone on every inquiry.',
          ],
        },
      ],
      portal: {
        heading: 'Visit the live site',
        body:
          'The production website is live at braudproperties.com — browse listings, filters, and ' +
          'online applications.',
        links: [
          { label: 'Visit Site ↗', href: 'https://braudproperties.com', external: true, primary: true },
          { label: '← All Projects', href: '/#work', external: false, primary: false },
        ],
      },
    },
  },

  // ────────────────────────────────────────────────────────────── Braud Pipeline
  {
    id: 'braud-pipeline',
    title: 'The Braud Pipeline',
    subtitle: 'Buildium → PostgreSQL · Nightly ETL Automation',
    description:
      'Braud runs on Buildium with no API. Playwright extracts 17–19 operational reports each ' +
      'night, Python normalizes them, and PostgreSQL holds the result — zero manual steps after ' +
      'deploy.',
    tags: ['Python', 'Playwright', 'Prefect', 'PostgreSQL'],
    status: 'live',
    statusLabel: 'Live — In Production',
    metric: '0 Manual Steps',
    color: '#3b82f6',
    links: [
      { label: 'Case Study →', href: '/work/braud-pipeline/', external: false, primary: true },
      { label: 'Dashboard Demo ↗', href: '/braud_demo_master/demo/', external: true, primary: false },
    ],
    caseStudy: {
      slug: 'braud-pipeline',
      title: 'The Braud Pipeline',
      subtitle: 'Buildium → PostgreSQL · Nightly ETL Automation',
      status: 'live',
      statusLabel: 'Live — In Production',
      tags: ['Python', 'Playwright', 'Prefect', 'PostgreSQL'],
      metaDescription:
        'The Braud Pipeline — nightly Playwright + Prefect automation from Buildium to ' +
        'PostgreSQL with zero manual steps. Case study by Prajjwal Silwal.',
      ogDescription:
        'Nightly Buildium report automation into PostgreSQL — engineered without native API ' +
        'access on the Growth plan.',
      color: '#3b82f6',
      colorAlt: '#60a5fa',
      stats: [
        { value: '17+', label: 'Buildium reports / night' },
        { value: '0', label: 'Manual steps after deploy' },
        { value: '02:00', label: 'CST Prefect schedule' },
        { value: 'Live', label: 'Production since Jan 2026' },
      ],
      chapters: [
        {
          title: 'Problem',
          body: [
            "Braud Property Management runs on Buildium's Growth plan — no API. Every morning " +
              'someone logged into Buildium, opened 17–19 separate operational reports, and ' +
              'downloaded each one by hand. Occupancy, delinquency, maintenance, and lease data ' +
              'existed inside Buildium exports, but nothing moved into a database automatically. ' +
              'Staff spent the first part of each day on extraction, not analysis.',
          ],
        },
        {
          title: 'Approach',
          body: [
            'I built a three-stage nightly ETL job — headless browser extraction, Python ' +
              'normalization, and PostgreSQL load — orchestrated by Prefect with per-report retry ' +
              'and failure isolation.',
            'The pipeline runs on a fixed schedule. If one report fails, the rest of the nightly ' +
              "batch still completes and the failure is logged for retry — ownership doesn't wake " +
              'up to a half-empty database.',
          ],
          steps: [
            {
              num: '01',
              title: 'Extract',
              body:
                'Playwright logs into Buildium, navigates each report URL, and downloads the ' +
                'export files.',
            },
            {
              num: '02',
              title: 'Transform',
              body:
                'Python normalizes column formats, deduplicates rows, and validates records ' +
                'before load.',
            },
            {
              num: '03',
              title: 'Load',
              body:
                'Structured tables in PostgreSQL — occupancy, delinquency, maintenance, leases, ' +
                'with loaded_at timestamps.',
            },
          ],
        },
        {
          title: 'Decision',
          body: [
            'Playwright instead of waiting for API access. Upgrading Buildium plans for API ' +
              'access was a recurring cost with no guaranteed timeline. Browser automation is ' +
              'brittle when Buildium changes its UI, but it was deployable in weeks and entirely ' +
              'under our control.',
            'PostgreSQL as the integration layer. Rather than piping CSVs into separate tools, ' +
              'every report lands in one schema. Downstream systems — the operations dashboard, ' +
              'ad-hoc SQL, Power BI — all read from the same source instead of chasing fresh ' +
              'exports.',
          ],
        },
        {
          title: 'Result',
          body: [
            'The pipeline has run in production since Jan 2026 with zero manual steps after ' +
              'deployment. Nightly automation covers 17–19 operational Buildium reports into ' +
              'PostgreSQL. Manual login-and-download work at the start of each day is gone.',
            'That database is what feeds the Braud Operations Dashboard — a separate project ' +
              'focused on the owner-facing morning workflow.',
          ],
        },
      ],
      portal: {
        heading: 'See what this pipeline feeds',
        body:
          'The Braud Operations Dashboard reads live PostgreSQL output from this pipeline. ' +
          'Portfolio demo uses fictional data.',
        links: [
          { label: 'Dashboard Case Study →', href: '/work/braud-dashboard/', external: false, primary: true },
          { label: 'Open Sanitized Demo ↗', href: '/braud_demo_master/demo/', external: true, primary: false },
        ],
      },
    },
  },

  // ───────────────────────────────────────────────────────────── Braud Dashboard
  {
    id: 'braud-dashboard',
    title: 'Braud Operations Dashboard',
    subtitle: 'Owner-Facing Morning Workflow · Property Analytics',
    description:
      'Four modules built on the pipeline\'s PostgreSQL schema — Morning Briefing, Executive ' +
      'KPIs, Decision Inbox, and Occupancy — organized around how ownership actually starts the ' +
      'day.',
    tags: ['PostgreSQL', 'Dashboard UI', 'Power BI', 'Python'],
    status: 'live',
    statusLabel: 'Live — In Production',
    metric: '4 Modules Daily',
    color: '#6366f1',
    links: [
      { label: 'Case Study →', href: '/work/braud-dashboard/', external: false, primary: true },
      { label: 'Demo ↗', href: '/braud_demo_master/demo/', external: true, primary: false },
    ],
    caseStudy: {
      slug: 'braud-dashboard',
      title: 'Braud Operations Dashboard',
      subtitle: 'Owner-Facing Morning Workflow · Property Analytics',
      status: 'live',
      statusLabel: 'Live — In Production',
      tags: ['PostgreSQL', 'Dashboard UI', 'Power BI', 'Python'],
      metaDescription:
        'Braud Operations Dashboard — owner-facing morning workflow built on the nightly ' +
        'PostgreSQL pipeline. Case study by Prajjwal Silwal.',
      ogDescription:
        'Four production modules — Morning Briefing, Executive KPIs, Decision Inbox, Occupancy — ' +
        'read from the nightly Buildium pipeline.',
      color: '#6366f1',
      colorAlt: '#818cf8',
      stats: [
        { value: '4', label: 'Dashboard modules' },
        { value: 'Daily', label: 'Ownership morning workflow' },
        { value: 'Live', label: 'Reads pipeline PostgreSQL' },
        { value: 'Demo', label: 'Sanitized portfolio preview' },
      ],
      chapters: [
        {
          title: 'Problem',
          body: [
            'Once the Braud Pipeline started loading Buildium data into PostgreSQL each night, ' +
              'the extraction problem was solved — but ownership still had no single screen to ' +
              'start the day. Delinquency lived in one export mindset, vacancies in another, ' +
              'maintenance in a third. Someone was still mentally stitching spreadsheets together ' +
              "every morning to answer: who owes rent, what's empty, what's overdue, what needs a " +
              'decision today.',
          ],
        },
        {
          title: 'Approach',
          body: [
            "I built a purpose-built operations UI on top of the pipeline's PostgreSQL schema — " +
              'organized around how ownership actually starts their morning, not around how ' +
              'Buildium names its reports.',
            'Production reads live pipeline data refreshed nightly. The portfolio demo on this ' +
              'site uses fictional tenant and property names — same UI, no real data connected.',
          ],
          steps: [
            {
              title: 'Morning Briefing',
              body:
                'First screen of the day — delinquent tenants with balance and age, vacant units, ' +
                'overdue maintenance, expiring leases.',
            },
            {
              title: 'Executive KPIs',
              body:
                'Portfolio snapshot — occupancy rate, MTD collection rate, total delinquent ' +
                'balance, vacant unit count.',
            },
            {
              title: 'Decision Inbox',
              body:
                'Queue of drafted actions — payment risk follow-ups, SLA breaches, lease ' +
                'renewals. Copy into Buildium, mark acted.',
            },
            {
              title: 'Occupancy Snapshot',
              body:
                'Portfolio-wide and per-property unit status — total units, occupied count, ' +
                'vacancy rate, drill-down by property.',
            },
          ],
        },
        {
          title: 'Decision',
          body: [
            'Custom morning workflow over a generic BI gallery. Power BI is in the stack, but ' +
              "ownership didn't need thirty charts — they needed four specific views in a fixed " +
              'order. Building a dedicated UI let me design around the questions they ask before ' +
              'coffee, not around whatever template a BI tool ships with.',
            "Decision Inbox as a workflow surface, not just charts. Charts show state; they don't " +
              'help ownership act. The inbox drafts the next step — who to call, what to renew, ' +
              'which maintenance ticket breached SLA — so the dashboard ends in action, not just ' +
              'observation.',
          ],
        },
        {
          title: 'Result',
          body: [
            'Ownership opens this dashboard each morning with delinquency, vacancy, and ' +
              'maintenance status already assembled — instead of downloading and stitching ' +
              'together 17+ Buildium reports by hand.',
            'Four modules are in daily production use, fed by the nightly pipeline run. A ' +
              'sanitized standalone demo is available for portfolio review without exposing real ' +
              'tenant data.',
          ],
        },
      ],
      portal: {
        heading: 'Try the sanitized demo',
        body:
          'Fictional portfolio data — Morning Briefing, KPIs, Decision Inbox, and Occupancy ' +
          'modules. No database, no API, no real tenant information.',
        links: [
          { label: 'Open Dashboard Demo ↗', href: '/braud_demo_master/demo/', external: true, primary: true },
          { label: 'Pipeline Case Study →', href: '/work/braud-pipeline/', external: false, primary: false },
        ],
      },
    },
  },

  // ─────────────────────────────────────────────────────────── Lead Intelligence
  {
    id: 'lead-intelligence',
    title: 'Lead Intelligence Pipeline',
    subtitle: 'Web scraping + market data automation',
    description:
      'Client needed a Monroe-area outreach list. Scraped public directories, deduplicated 524 ' +
      'records to 498 clean rows across 38 categories — delivered as CSV and SQL export.',
    tags: ['Python', 'Web Scraping', 'SQL'],
    status: 'complete',
    statusLabel: '✓ Completed',
    metric: '498 Records',
    color: '#f59e0b',
    links: [
      { label: 'Case Study →', href: '/work/lead-intelligence/', external: false, primary: true },
      { label: 'Demo ↗', href: '/projects/lead-intelligence/demo/', external: true, primary: false },
    ],
    caseStudy: {
      slug: 'lead-intelligence',
      title: 'Lead Intelligence Pipeline',
      subtitle: 'Web Scraping + Market Data Automation',
      status: 'complete',
      statusLabel: '✓ Completed',
      tags: ['Python', 'Web Scraping', 'SQL', 'Data Cleaning', 'Automation'],
      metaDescription:
        'Lead Intelligence Pipeline — Python web scraping and deduplication delivering 498 clean ' +
        'business records across 38 categories. Case study by Prajjwal Silwal.',
      ogDescription:
        'Multi-source scrape, normalization and deduplication — 524 raw records to 498 clean ' +
        'rows for client outreach.',
      color: '#f59e0b',
      colorAlt: '#fbbf24',
      stats: [
        { value: '524', label: 'Records scraped' },
        { value: '498', label: 'After deduplication' },
        { value: '38', label: 'Business categories' },
        { value: 'Done', label: 'Delivered to client' },
      ],
      chapters: [
        {
          title: 'Problem',
          body: [
            'A client needed a local business dataset for outreach in the Monroe, LA area — ' +
              'names, categories, phone numbers, addresses — across hundreds of businesses. ' +
              'Manual research in directories and maps was slow, inconsistent between ' +
              'researchers, and painful to repeat when the list needed refreshing a month later.',
          ],
        },
        {
          title: 'Approach',
          body: [
            'I built a Python pipeline that pulled from public web directories (Yellow Pages, ' +
              'Google Maps listings, chamber directories), normalized each source into a common ' +
              'schema, and exported a clean CSV plus SQL-ready table.',
          ],
          steps: [
            {
              num: '01',
              title: 'Scrape',
              body:
                'Python crawlers extract names, categories, contact info, and locations per ' +
                'source.',
            },
            {
              num: '02',
              title: 'Clean',
              body: 'Normalize phone formats, standardize addresses, map categories to one taxonomy.',
            },
            {
              num: '03',
              title: 'Dedupe',
              body: 'Match on business name + phone; drop overlapping entries across sources.',
            },
            {
              num: '04',
              title: 'Export',
              body: 'Deliver leads_clean.csv and SQL table for segmentation and outreach.',
            },
          ],
        },
        {
          title: 'Decision',
          body: [
            'Multi-source scrape with aggressive deduplication. No single directory had complete ' +
              'coverage. Pulling from three sources and deduplicating on name + phone got better ' +
              'recall than betting on one site — at the cost of 26 duplicate rows removed from ' +
              'the initial 524-record pull.',
            'Deliver a flat file, not a live app. The client needed a list to work from in Excel ' +
              'and a CRM import — not a dashboard. Shipping CSV + SQL kept scope tight and let ' +
              'them start outreach the same week.',
          ],
        },
        {
          title: 'Result',
          body: [
            'Delivered 498 deduplicated business records across 38 categories, ready for client ' +
              'outreach and market segmentation. The pipeline ran end-to-end without manual steps ' +
              'between extraction and export.',
            'Client received a segmented outreach dataset — 498 businesses across 38 categories, ' +
              'formatted for CRM import and local market outreach.',
          ],
        },
      ],
      portal: {
        heading: 'Try the sanitized demo',
        body:
          'Interactive preview with fictional Monroe, LA records — no live scraping, no real ' +
          'business data.',
        links: [
          { label: 'Open Pipeline Demo ↗', href: '/projects/lead-intelligence/demo/', external: true, primary: true },
          { label: 'GitHub ↗', href: 'https://github.com/prajjwalsilwal', external: true, primary: false },
        ],
      },
    },
  },

  // ────────────────────────────────────────────────────────── Diagnostic Dashboard
  {
    id: 'diagnostic-dashboard',
    title: 'Multi-Client Diagnostic Dashboard',
    subtitle: 'IT operations monitoring & visualization',
    description:
      'Python collectors and SQL storage gave support staff endpoint health before they opened a ' +
      'ticket — across 30+ machines in 20+ client environments.',
    tags: ['Python', 'SQL', 'Dashboard UI'],
    status: 'complete',
    statusLabel: '✓ Completed',
    metric: '30+ Endpoints',
    color: '#8b5cf6',
    links: [
      { label: 'Case Study →', href: '/work/diagnostic-dashboard/', external: false, primary: true },
      { label: 'Demo ↗', href: '/projects/diagnostic-dashboard/demo/', external: true, primary: false },
    ],
    caseStudy: {
      slug: 'diagnostic-dashboard',
      title: 'Multi-Client Diagnostic Dashboard',
      subtitle: 'IT Operations Monitoring & Visualization',
      status: 'complete',
      statusLabel: '✓ Completed',
      tags: ['Python', 'SQL', 'Dashboard UI/UX', 'IT Systems', 'Automation'],
      metaDescription:
        'Multi-Client Diagnostic Dashboard — Python collectors and SQL time-series monitoring ' +
        'across 30+ endpoints in 20+ client environments. Case study by Prajjwal Silwal.',
      ogDescription:
        'Fleet health, 24-hour trends and active alerts across 20+ client environments — before ' +
        'anyone opens a remote session.',
      color: '#8b5cf6',
      colorAlt: '#a78bfa',
      stats: [
        { value: '30+', label: 'Monitored endpoints' },
        { value: '20+', label: 'Client environments' },
        { value: '24h', label: 'Metric history per machine' },
        { value: 'Done', label: 'Deployed per client' },
      ],
      chapters: [
        {
          title: 'Problem',
          body: [
            'As an IT contractor supporting 20+ client environments, troubleshooting started the ' +
              'same way every time: RDP in, check Task Manager, ask what changed, repeat. There ' +
              'was no fleet view — no way to see that WS-ACME-02 had been running at 89% CPU for ' +
              'twelve hours before anyone called. Technicians gathered context manually before ' +
              'they could fix anything.',
          ],
        },
        {
          title: 'Approach',
          body: [
            'Python collectors on each endpoint gathered CPU, memory, disk, and process metrics ' +
              'on a schedule. SQL stored time-series data partitioned by client and hostname. A ' +
              'dashboard UI surfaced per-client views with an active alerts panel for threshold ' +
              'breaches.',
          ],
          steps: [
            {
              num: '01',
              title: 'Collect',
              body: 'Scheduled Python agents on each endpoint — CPU, memory, disk, process metrics.',
            },
            {
              num: '02',
              title: 'Store',
              body: 'SQL time-series tables partitioned by client and hostname for fast lookups.',
            },
            {
              num: '03',
              title: 'Alert',
              body: 'Threshold rules flag critical CPU, memory, and offline states.',
            },
            {
              num: '04',
              title: 'Dashboard',
              body: 'Per-client views with fleet health, 24h trends, and an active alerts panel.',
            },
          ],
        },
        {
          title: 'Decision',
          body: [
            'Per-client dashboards, one shared collector pattern. Each client had different ' +
              'machine counts and alert thresholds, but the collection script and database schema ' +
              'were identical. I templated the dashboard per environment instead of building one ' +
              'generic view that fit nobody.',
            'Lightweight agents over a full RMM platform. These were small business clients ' +
              'without enterprise endpoint management budgets. A Python script on a schedule plus ' +
              'SQL was maintainable by one person and deployable in an afternoon.',
          ],
        },
        {
          title: 'Result',
          body: [
            'Deployed across 30+ endpoints in 20+ client environments. Support staff could open ' +
              'the dashboard and see which machines were critical before starting a remote ' +
              'session — instead of discovering high CPU after logging in.',
            'Support staff could review fleet health, 24-hour trends, and active alerts before ' +
              'starting a remote session — instead of RDP-ing in blind to check CPU and memory.',
          ],
        },
      ],
      portal: {
        heading: 'Try the sanitized demo',
        body:
          'Multi-client view with fictional endpoint data — switch environments, inspect health ' +
          'metrics, and review active alerts. No real systems connected.',
        links: [
          {
            label: 'Open Dashboard Demo ↗',
            href: '/projects/diagnostic-dashboard/demo/',
            external: true,
            primary: true,
          },
          { label: '← All Projects', href: '/#work', external: false, primary: false },
        ],
      },
    },
  },

  // ──────────────────────────────────────────────── GitHub-only analytics projects
  {
    id: 'finance-ops',
    title: 'Finance Ops Command Center',
    subtitle: 'Financial & operations analytics',
    description:
      'A dimensional finance dataset with EDA and reporting — revenue/expense/profit trends, ' +
      'variance analysis, and department + region performance, built as an analytical warehouse.',
    tags: ['Python', 'Pandas', 'Analytics'],
    status: 'analytics',
    statusLabel: 'Analytics',
    color: '#2dd4bf',
    links: [
      {
        label: 'View on GitHub ↗',
        href: `${GH_TREE}/enterprise-finance-ops-command-center`,
        external: true,
        primary: true,
      },
    ],
    caseStudy: null,
  },
  {
    id: 'financial-forecasting',
    title: 'Financial Forecasting Model',
    subtitle: 'Predictive financial modeling',
    description:
      'Preprocessing and forecasting pipeline over financial time series — the same statistical ' +
      "foundation that informs the platform's trend and collection-rate modeling.",
    tags: ['Python', 'Forecasting', 'Time series'],
    status: 'modeling',
    statusLabel: 'Modeling',
    color: '#22d3ee',
    links: [
      {
        label: 'View on GitHub ↗',
        href: `${GH_TREE}/financial-forecasting-model`,
        external: true,
        primary: true,
      },
    ],
    caseStudy: null,
  },
  {
    id: 'sales-performance',
    title: 'Sales Performance Dashboard',
    subtitle: 'Sales analytics & optimization',
    description:
      'Analysis pipeline surfacing sales performance drivers and optimization opportunities from ' +
      'raw transaction data — cleaning, metrics, and visualization.',
    tags: ['Python', 'Pandas', 'Dashboard'],
    status: 'analytics',
    statusLabel: 'Analytics',
    color: '#38bdf8',
    links: [
      {
        label: 'View on GitHub ↗',
        href: `${GH_TREE}/sales-performance-optimization-dashboard`,
        external: true,
        primary: true,
      },
    ],
    caseStudy: null,
  },
];

export const workIntro = {
  eyebrow: '02 / other work',
  title: 'Other Nodes in the Network',
  sub:
    'Production systems and delivered client work around the flagship. Demos use fictional data ' +
    'and say so.',
} as const;

/** Every distinct tag across the gallery, for the filter sidebar. */
export const workTags: readonly string[] = Array.from(
  new Set(work.flatMap((w) => w.tags)),
).sort();

export const caseStudies: readonly CaseStudy[] = work
  .map((w) => w.caseStudy)
  .filter((c): c is CaseStudy => c !== null);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return work.find((w) => w.caseStudy?.slug === slug);
}
