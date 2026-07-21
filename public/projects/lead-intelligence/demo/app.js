import { CATEGORIES, LEADS, META, PIPELINE_STEPS, STATS } from "./data.js";

const $ = (sel) => document.querySelector(sel);

function renderStats() {
  $("#stats").innerHTML = STATS.map((s) => `
    <article class="kpi ${s.tone === "success" ? "success" : s.tone === "warning" ? "warning" : ""}">
      <div class="kpi-label">${s.label}</div>
      <div class="kpi-value">${s.value}</div>
    </article>
  `).join("");
}

function renderLeads() {
  const rows = LEADS.map((l) => `
    <div class="row">
      <span>${l.name}</span>
      <span>${l.category}</span>
      <span style="font-family:JetBrains Mono,monospace;font-size:12px">${l.phone}</span>
      <span>${l.city}</span>
      <span style="color:var(--text-soft)">${l.source}</span>
    </div>
  `).join("");

  $("#leads").innerHTML = `
    <div class="panel-head"><h3>Structured output</h3><span class="count">${LEADS.length} shown · 498 total</span></div>
    <div class="row header"><span>Business</span><span>Category</span><span>Phone</span><span>City</span><span>Source</span></div>
    ${rows}
  `;
}

function renderCategories() {
  const max = Math.max(...CATEGORIES.map((c) => c.count));
  $("#categories").innerHTML = `
    <div class="panel-head"><h3>Category breakdown</h3><span class="count">38 categories</span></div>
    ${CATEGORIES.map((c) => `
      <div class="bar-row">
        <span style="width:140px">${c.name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(c.count / max) * 100}%"></div></div>
        <span style="font-family:JetBrains Mono,monospace;font-size:12px;width:36px;text-align:right">${c.count}</span>
      </div>
    `).join("")}
  `;
}

function renderSteps() {
  $("#steps").innerHTML = PIPELINE_STEPS.map((s, i) => `
    <div class="step">
      <div class="step-num">0${i + 1} · ${s.status}</div>
      <h4>${s.step}</h4>
      <p>${s.detail}</p>
    </div>
  `).join("");
}

$("#as-of").textContent = META.asOfLabel;
$("#last-run").textContent = `Last run: ${META.lastRun}`;
renderStats();
renderLeads();
renderCategories();
renderSteps();
