import {
  BRIEFING,
  DEMO_META,
  EXECUTIVE_KPIS,
  INBOX_ITEMS,
  NAV_SECTIONS,
  OCCUPANCY,
  SECTION_COPY,
} from "./data.js";

const $ = (sel) => document.querySelector(sel);
const fmtMoney = (n) => `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

let activeSection = "health";
let inboxFilter = "pending";

function renderRail() {
  const rail = $("#rail");
  rail.innerHTML = NAV_SECTIONS.map((s) => {
    const active = s.id === activeSection ? "active" : "";
    const badge = s.badge
      ? `<span class="rail-badge" style="position:relative">${s.badge}</span>`
      : "";
    return `<button type="button" class="rail-btn ${active}" data-section="${s.id}" title="${s.label}">
      <span class="icon">${s.icon}</span>
      <span>${s.label}</span>
      ${badge}
    </button>`;
  }).join("");

  rail.querySelectorAll("[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSection = btn.dataset.section;
      if (activeSection !== "inbox") inboxFilter = "pending";
      render();
    });
  });
}

function renderPanelNav() {
  const nav = $("#panel-nav");
  const items = {
    health: [
      { id: "delinquent", label: `Delinquent (${BRIEFING.delinquent.length})` },
      { id: "vacant", label: `Vacant (${BRIEFING.vacant.length})` },
      { id: "maintenance", label: `Maintenance (${BRIEFING.maintenance.length})` },
      { id: "expiring", label: `Expiring (${BRIEFING.expiring.length})` },
    ],
    inbox: [
      { id: "pending", label: "Pending (4)" },
      { id: "all", label: "All" },
      { id: "acted", label: "Acted" },
    ],
    executive: [{ id: "kpi", label: "KPI overview" }],
    occupancy: [{ id: "summary", label: "By property" }],
  }[activeSection] || [];

  nav.innerHTML = `
    <h2>${SECTION_COPY[activeSection]?.title || "Navigate"}</h2>
    ${items
      .map((item) => {
        const active =
          activeSection === "inbox"
            ? item.id === inboxFilter || (item.id === "all" && inboxFilter === "all")
            : false;
        return `<button type="button" class="panel-item ${active ? "active" : ""}" data-panel="${item.id}">${item.label}</button>`;
      })
      .join("")}
  `;

  nav.querySelectorAll(".panel-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (activeSection === "inbox") {
        inboxFilter = btn.dataset.panel;
        renderContent();
        renderPanelNav();
      } else {
        const el = document.getElementById(btn.dataset.panel);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function renderTopbar() {
  const copy = SECTION_COPY[activeSection];
  $("#page-title").textContent = copy.title;
  $("#page-subtitle").textContent = copy.subtitle;
  $("#as-of").textContent = DEMO_META.asOfLabel;
}

function kpiGrid(kpis) {
  return `<div class="kpi-grid">${kpis
    .map((k) => {
      const deltaClass = k.delta?.startsWith("-") ? "neg" : "";
      return `<article class="kpi ${k.tone}">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value">${k.value}</div>
        ${k.delta ? `<div class="kpi-delta ${deltaClass}">${k.delta}</div>` : ""}
        <div class="kpi-sub">${k.subtext || ""}</div>
      </article>`;
    })
    .join("")}</div>`;
}

function briefingTable(title, count, headers, rows, id) {
  return `<section class="panel" id="${id}">
    <div class="panel-head"><h3>${title}</h3><span class="count">${count}</span></div>
    <div class="panel-body">
      <div class="row header">${headers.map((h) => `<span>${h}</span>`).join("")}</div>
      ${rows}
    </div>
  </section>`;
}

function renderHealth() {
  const delinquentRows = BRIEFING.delinquent
    .map(
      (r) => `<div class="row">
        <span>${r.tenant}</span><span>${r.property} ${r.unit}</span>
        <span class="money">${fmtMoney(r.balance)}</span><span>${r.days}d</span>
      </div>`
    )
    .join("");

  const vacantRows = BRIEFING.vacant
    .map(
      (r) => `<div class="row">
        <span>${r.property}</span><span>${r.unit}</span>
        <span>${r.daysVacant}d vacant</span><span>${r.listed ? "Listed" : "Unlisted"}</span>
      </div>`
    )
    .join("");

  const maintRows = BRIEFING.maintenance
    .map(
      (r) => `<div class="row">
        <span>${r.property} ${r.unit}</span><span>${r.summary}</span>
        <span>${r.hoursOpen}h</span><span class="pill ${r.priority}">${r.priority}</span>
      </div>`
    )
    .join("");

  const expiringRows = BRIEFING.expiring
    .map(
      (r) => `<div class="row">
        <span>${r.tenant}</span><span>${r.property} ${r.unit}</span>
        <span>${r.daysLeft} days</span><span>—</span>
      </div>`
    )
    .join("");

  return (
    kpiGrid(EXECUTIVE_KPIS.slice(0, 4)) +
    briefingTable("Delinquent tenants", BRIEFING.delinquent.length, ["Tenant", "Unit", "Balance", "Age"], delinquentRows, "delinquent") +
    briefingTable("Vacant units", BRIEFING.vacant.length, ["Property", "Unit", "Vacancy", "Status"], vacantRows, "vacant") +
    briefingTable("Overdue maintenance", BRIEFING.maintenance.length, ["Location", "Issue", "Open", "Priority"], maintRows, "maintenance") +
    briefingTable("Expiring leases", BRIEFING.expiring.length, ["Tenant", "Unit", "Days left", ""], expiringRows, "expiring")
  );
}

function renderExecutive() {
  return kpiGrid(EXECUTIVE_KPIS);
}

function renderInbox() {
  const filtered =
    inboxFilter === "all"
      ? INBOX_ITEMS
      : inboxFilter === "acted"
        ? INBOX_ITEMS.filter((i) => i.status === "acted")
        : INBOX_ITEMS.filter((i) => i.status === "pending");

  const cards = filtered
    .map(
      (item) => `<article class="inbox-card ${item.priority}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <h4>${item.type}</h4>
          <span class="pill ${item.status}">${item.status}</span>
        </div>
        <div class="meta">${item.tenant !== "—" ? item.tenant + " · " : ""}${item.property} ${item.unit} · ${item.ageDays}d in queue</div>
        <div class="action">${item.action}</div>
      </article>`
    )
    .join("");

  return `<section class="panel">
    <div class="panel-head"><h3>Workflow queue</h3><span class="count">${filtered.length} items</span></div>
    <div class="panel-body">${cards || "<p style='padding:16px;color:#9aa7b8'>No items</p>"}</div>
  </section>`;
}

function renderOccupancy() {
  const summary = `<div class="kpi-grid">
    <article class="kpi success"><div class="kpi-label">Occupancy</div><div class="kpi-value">${OCCUPANCY.rate}%</div><div class="kpi-sub">${OCCUPANCY.occupied} / ${OCCUPANCY.totalUnits} units</div></article>
    <article class="kpi info"><div class="kpi-label">Vacant</div><div class="kpi-value">${OCCUPANCY.vacant}</div><div class="kpi-sub">units available</div></article>
  </div>`;

  const rows = OCCUPANCY.byProperty
    .map(
      (p) => `<div class="row">
        <span>${p.name}</span><span>${p.units} units</span>
        <span>${p.occupied} occupied</span><span>${p.rate}%</span>
      </div>`
    )
    .join("");

  return (
    summary +
    briefingTable("Occupancy by property", OCCUPANCY.byProperty.length, ["Property", "Total", "Occupied", "Rate"], rows, "summary")
  );
}

function renderContent() {
  const root = $("#content");
  const html = {
    health: renderHealth,
    executive: renderExecutive,
    inbox: renderInbox,
    occupancy: renderOccupancy,
  }[activeSection]?.();

  root.innerHTML = html || "<p>Section not found.</p>";
}

function render() {
  renderRail();
  renderPanelNav();
  renderTopbar();
  renderContent();
}

render();
