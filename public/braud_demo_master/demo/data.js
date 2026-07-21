/** Fictional sanitized demo data — not connected to any live system. */

export const DEMO_META = {
  portfolioName: "Demo Portfolio",
  snapshotDate: "2026-06-06",
  asOfLabel: "Demo snapshot · Jun 6, 2026",
};

export const NAV_SECTIONS = [
  { id: "health", icon: "⌂", label: "Home" },
  { id: "inbox", icon: "✉", label: "Inbox", badge: 4 },
  { id: "executive", icon: "◔", label: "Executive" },
  { id: "occupancy", icon: "▣", label: "Occupancy" },
];

export const EXECUTIVE_KPIS = [
  { label: "Occupancy", value: "94.2%", tone: "success", delta: "+0.8%", subtext: "vs last month" },
  { label: "Collection rate", value: "97.1%", tone: "success", delta: "-0.3%", subtext: "MTD collected" },
  { label: "Delinquent balance", value: "$12,480", tone: "warning", subtext: "18 tenants" },
  { label: "Vacant units", value: "7", tone: "info", subtext: "3 listed" },
  { label: "Maint. overdue", value: "5", tone: "danger", subtext: ">48h open" },
  { label: "Inbox pending", value: "4", tone: "warning", subtext: "Action drafts" },
];

export const BRIEFING = {
  delinquent: [
    { tenant: "Alex Morgan", property: "Maple Court", unit: "12B", balance: 825, days: 12 },
    { tenant: "Jordan Lee", property: "Riverside Commons", unit: "4A", balance: 700, days: 8 },
    { tenant: "Sam Rivera", property: "Harbor View", unit: "201", balance: 640, days: 31 },
  ],
  vacant: [
    { property: "Oak Street Duplexes", unit: "B", daysVacant: 14, listed: true },
    { property: "Maple Court", unit: "8C", daysVacant: 42, listed: false },
  ],
  maintenance: [
    { property: "Riverside Commons", unit: "2B", summary: "HVAC not cooling", hoursOpen: 56, priority: "high" },
    { property: "Harbor View", unit: "105", summary: "Kitchen sink leak", hoursOpen: 72, priority: "critical" },
  ],
  expiring: [
    { tenant: "Taylor Brooks", property: "Maple Court", unit: "3A", daysLeft: 28 },
    { tenant: "Casey Nguyen", property: "Oak Street Duplexes", unit: "A", daysLeft: 45 },
  ],
};

export const INBOX_ITEMS = [
  {
    id: 1,
    status: "pending",
    priority: "critical",
    type: "Payment risk forecast",
    tenant: "Jordan Lee",
    property: "Riverside Commons",
    unit: "4A",
    ageDays: 2,
    action: "Call tenant and agree a written payment plan before escalation.",
  },
  {
    id: 2,
    status: "pending",
    priority: "high",
    type: "Maintenance overdue",
    tenant: "—",
    property: "Harbor View",
    unit: "105",
    ageDays: 3,
    action: "Escalate work order after 48-hour SLA breach.",
  },
  {
    id: 3,
    status: "pending",
    priority: "normal",
    type: "Lease renewal",
    tenant: "Taylor Brooks",
    property: "Maple Court",
    unit: "3A",
    ageDays: 5,
    action: "Send renewal offer; lease ends in 28 days.",
  },
  {
    id: 4,
    status: "pending",
    priority: "high",
    type: "Pre-due outreach",
    tenant: "Alex Morgan",
    property: "Maple Court",
    unit: "12B",
    ageDays: 1,
    action: "Friendly rent reminder — historically late payer.",
  },
  {
    id: 5,
    status: "acted",
    priority: "normal",
    type: "Vacancy — price reduction",
    tenant: "—",
    property: "Oak Street Duplexes",
    unit: "B",
    ageDays: 7,
    action: "Review listing price vs market rent.",
  },
];

export const OCCUPANCY = {
  totalUnits: 120,
  occupied: 113,
  vacant: 7,
  rate: 94.2,
  byProperty: [
    { name: "Maple Court", units: 32, occupied: 30, rate: 93.8 },
    { name: "Riverside Commons", units: 28, occupied: 27, rate: 96.4 },
    { name: "Harbor View", units: 24, occupied: 22, rate: 91.7 },
    { name: "Oak Street Duplexes", units: 36, occupied: 34, rate: 94.4 },
  ],
};

export const SECTION_COPY = {
  health: {
    title: "Morning Briefing",
    subtitle: "Demo portfolio — fictional data for sales and training only.",
  },
  inbox: {
    title: "Decision Inbox",
    subtitle: "Shared queue — copy draft into your PMS, then mark acted.",
  },
  executive: {
    title: "Executive Summary",
    subtitle: "Portfolio KPIs at a glance.",
  },
  occupancy: {
    title: "Portfolio Occupancy",
    subtitle: "Occupancy, vacancy pressure, and unit status.",
  },
};
