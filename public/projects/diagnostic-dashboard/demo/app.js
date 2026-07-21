import { ALERTS, CLIENTS, ENDPOINTS, META, clientStats } from "./data.js";

const $ = (sel) => document.querySelector(sel);

let activeClient = "acme";

function statusClass(s) {
  return `status-${s === "online" ? "online" : s === "offline" ? "offline" : s}`;
}

function renderClientSelect() {
  $("#client-select").innerHTML = CLIENTS.map((c) =>
    `<option value="${c.id}" ${c.id === activeClient ? "selected" : ""}>${c.name}</option>`
  ).join("");
}

function renderStats() {
  const s = clientStats(activeClient);
  $("#stats").innerHTML = `
    <article class="kpi ok"><div class="kpi-label">Endpoints online</div><div class="kpi-value">${s.online}/${s.total}</div></article>
    <article class="kpi"><div class="kpi-label">Avg CPU</div><div class="kpi-value">${s.avgCpu}%</div></article>
    <article class="kpi ${s.avgMem > 70 ? "warn" : ""}"><div class="kpi-label">Avg memory</div><div class="kpi-value">${s.avgMem}%</div></article>
    <article class="kpi ${s.alerts ? "danger" : "ok"}"><div class="kpi-label">Open alerts</div><div class="kpi-value">${s.alerts}</div></article>
  `;
}

function renderEndpoints() {
  const eps = ENDPOINTS[activeClient] || [];
  const rows = eps.map((e) => `
    <div class="row">
      <span>${e.host}</span>
      <span>${e.cpu != null ? e.cpu + "%" : "—"}</span>
      <span>${e.mem != null ? e.mem + "%" : "—"}</span>
      <span>${e.disk != null ? e.disk + "%" : "—"}</span>
      <span class="${statusClass(e.status)}">${e.status}</span>
    </div>
  `).join("");

  $("#endpoints").innerHTML = `
    <div class="panel-head"><h3>Endpoint health</h3></div>
    <div class="row header"><span>Hostname</span><span>CPU</span><span>Mem</span><span>Disk</span><span>Status</span></div>
    ${rows}
  `;
}

function renderAlerts() {
  const alerts = ALERTS[activeClient] || [];
  $("#alerts").innerHTML = `
    <div class="panel-head"><h3>Active alerts</h3></div>
    ${alerts.length ? alerts.map((a) => `
      <div class="alert ${a.level}">
        ${a.msg}
        <div class="alert-meta">${a.level} · ${a.ago}</div>
      </div>
    `).join("") : '<div class="empty">No open alerts for this client.</div>'}
  `;
}

function render() {
  renderStats();
  renderEndpoints();
  renderAlerts();
}

$("#as-of").textContent = META.asOfLabel;
renderClientSelect();

$("#client-select").addEventListener("change", (e) => {
  activeClient = e.target.value;
  render();
});

render();
