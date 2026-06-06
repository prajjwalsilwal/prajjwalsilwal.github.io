/** Fictional sanitized demo data — not connected to any live system. */

export const META = {
  asOfLabel: "Demo snapshot · Jun 6, 2026",
};

export const CLIENTS = [
  { id: "acme", name: "Acme Logistics" },
  { id: "northstar", name: "Northstar Medical" },
  { id: "bayou", name: "Bayou Legal Group" },
];

export const ENDPOINTS = {
  acme: [
    { host: "WS-ACME-01", cpu: 22, mem: 58, disk: 41, status: "online" },
    { host: "WS-ACME-02", cpu: 89, mem: 92, disk: 67, status: "critical" },
    { host: "SRV-ACME-DB", cpu: 45, mem: 78, disk: 55, status: "online" },
    { host: "WS-ACME-04", cpu: null, mem: null, disk: null, status: "offline" },
    { host: "WS-ACME-05", cpu: 31, mem: 64, disk: 38, status: "online" },
    { host: "WS-ACME-06", cpu: 18, mem: 52, disk: 44, status: "online" },
  ],
  northstar: [
    { host: "WS-NSTAR-01", cpu: 28, mem: 61, disk: 50, status: "online" },
    { host: "WS-NSTAR-02", cpu: 35, mem: 55, disk: 42, status: "online" },
    { host: "SRV-NSTAR-EMR", cpu: 62, mem: 84, disk: 71, status: "warning" },
  ],
  bayou: [
    { host: "WS-BAYOU-01", cpu: 15, mem: 48, disk: 35, status: "online" },
    { host: "WS-BAYOU-02", cpu: 24, mem: 51, disk: 40, status: "online" },
  ],
};

export const ALERTS = {
  acme: [
    { level: "critical", msg: "WS-ACME-02 — CPU > 85% for 15min", ago: "12m ago" },
    { level: "warning", msg: "SRV-ACME-DB — Memory > 75%", ago: "34m ago" },
    { level: "critical", msg: "WS-ACME-04 — Agent not responding", ago: "2h ago" },
  ],
  northstar: [
    { level: "warning", msg: "SRV-NSTAR-EMR — Memory > 80%", ago: "8m ago" },
  ],
  bayou: [],
};

export function clientStats(clientId) {
  const eps = ENDPOINTS[clientId] || [];
  const online = eps.filter((e) => e.status === "online").length;
  const cpus = eps.filter((e) => e.cpu != null).map((e) => e.cpu);
  const mems = eps.filter((e) => e.mem != null).map((e) => e.mem);
  const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
  return {
    total: eps.length,
    online,
    offline: eps.length - online,
    avgCpu: avg(cpus),
    avgMem: avg(mems),
    alerts: (ALERTS[clientId] || []).length,
  };
}
