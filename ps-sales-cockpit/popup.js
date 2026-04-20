/* PS Sales Cockpit — popup logic
 * - Tab navigation
 * - Renders all card grids from data/links.js
 * - Renders the prompt library with category chips and search
 * - Renders the Sales Flow trigger-mail buttons
 * - Renders the Top-20 customer list + detail view
 * - Renders the yearly Sales Focus
 */

(function () {
  "use strict";

  const HUB_URL = "https://tuev-sued.sharepoint.com/sites/AIHUB";

  // ————— UTIL —————
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function openUrl(url) {
    if (!url) return;
    if (url.startsWith("mailto:")) {
      window.location.href = url;
      return;
    }
    if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  function showToast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      el.hidden = true;
    }, 1800);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // ————— TABS —————
  function initTabs() {
    $$(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        $$(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
        $$(".panel").forEach((p) =>
          p.classList.toggle("is-active", p.id === `panel-${target}`)
        );
      });
    });
  }

  // ————— CARD GRIDS (Dashboard / KI / Wissen) —————
  function renderCards(containerId, items) {
    const root = $("#" + containerId);
    if (!root) return;
    root.innerHTML = "";
    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "card";
      btn.type = "button";
      btn.innerHTML = `
        <div class="card-icon ${item.iconClass || ""}">${escapeHtml(item.key)}</div>
        <div class="card-body">
          <div class="card-title">${escapeHtml(item.title)}</div>
          <div class="card-meta ${item.metaClass || ""}">${escapeHtml(item.meta || "")}</div>
        </div>`;
      btn.addEventListener("click", () => openUrl(item.url));
      root.appendChild(btn);
    });
  }

  // ————— PROMPT LIBRARY —————
  let promptFilter = { category: "Alle", query: "" };

  function renderPromptChips() {
    const chipsEl = $("#prompt-chips");
    if (!chipsEl) return;
    const cats = ["Alle", ...new Set(window.SC_PROMPTS.map((p) => p.category))];
    chipsEl.innerHTML = "";
    cats.forEach((c) => {
      const chip = document.createElement("button");
      chip.className = "chip" + (c === promptFilter.category ? " is-active" : "");
      chip.type = "button";
      chip.textContent = c;
      chip.addEventListener("click", () => {
        promptFilter.category = c;
        renderPromptChips();
        renderPromptList();
      });
      chipsEl.appendChild(chip);
    });
  }

  function renderPromptList() {
    const list = $("#prompt-list");
    if (!list) return;
    const q = promptFilter.query.trim().toLowerCase();
    const filtered = window.SC_PROMPTS.filter((p) => {
      const catOk = promptFilter.category === "Alle" || p.category === promptFilter.category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });

    list.innerHTML = "";
    if (filtered.length === 0) {
      list.innerHTML = `<div class="section-hint">Keine Prompts gefunden.</div>`;
      return;
    }

    filtered.forEach((p) => {
      const item = document.createElement("div");
      item.className = "prompt-item";

      const targetLabel =
        p.target === "researcher"
          ? "Microsoft Researcher"
          : p.target === "agent"
          ? "Microsoft Agent"
          : "Copilot Chat";
      const targetClass =
        p.target === "researcher" ? "researcher" : p.target === "agent" ? "agent" : "copilot";

      item.innerHTML = `
        <div class="prompt-item-head">
          <div class="prompt-cat">${escapeHtml(p.category)}</div>
          <span class="prompt-target ${targetClass}">${escapeHtml(targetLabel)}</span>
        </div>
        <div class="prompt-title">${escapeHtml(p.title)}</div>
        <p class="prompt-desc">${escapeHtml(p.desc)}</p>
        <div class="prompt-actions">
          <button class="btn primary" data-act="open">In ${escapeHtml(targetLabel)} öffnen</button>
          <button class="btn" data-act="copy">Prompt kopieren</button>
        </div>`;

      item.querySelector('[data-act="open"]').addEventListener("click", () => {
        const url = buildPromptUrl(p);
        openUrl(url);
      });
      item.querySelector('[data-act="copy"]').addEventListener("click", () => {
        copyToClipboard(p.prompt).then(() => showToast("Prompt in Zwischenablage kopiert"));
      });

      list.appendChild(item);
    });
  }

  function buildPromptUrl(p) {
    const encoded = encodeURIComponent(p.prompt);
    if (p.target === "researcher") {
      return `https://m365.cloud.microsoft/chat?agent=researcher&q=${encoded}`;
    }
    if (p.target === "agent") {
      return `https://m365.cloud.microsoft/chat?agent=sales-data&q=${encoded}`;
    }
    return `https://m365.cloud.microsoft/chat?q=${encoded}`;
  }

  function initPromptSearch() {
    const input = $("#prompt-search");
    if (!input) return;
    input.addEventListener("input", () => {
      promptFilter.query = input.value;
      renderPromptList();
    });
  }

  // ————— FLOWS —————
  function renderFlows() {
    const root = $("#flow-list");
    if (!root) return;
    root.innerHTML = "";
    window.SC_FLOWS.forEach((flow) => {
      const item = document.createElement("div");
      item.className = "flow-item";
      const mailto = window.SC_BUILD_MAILTO(flow.subject, flow.body);
      item.innerHTML = `
        <div class="flow-head">
          <span class="flow-tag">${escapeHtml(flow.tag)}</span>
          <span class="flow-title">${escapeHtml(flow.title)}</span>
        </div>
        <p class="flow-desc">${escapeHtml(flow.desc)}</p>
        <div class="flow-meta">Subject: ${escapeHtml(flow.subject)} → automation_ps@enterprise.com</div>
        <div class="prompt-actions">
          <button class="btn accent" data-act="trigger">${escapeHtml(flow.cta)}</button>
          <button class="btn" data-act="copy-subject">Subject kopieren</button>
        </div>`;
      item.querySelector('[data-act="trigger"]').addEventListener("click", () => openUrl(mailto));
      item.querySelector('[data-act="copy-subject"]').addEventListener("click", () => {
        copyToClipboard(flow.subject).then(() => showToast("Subject in Zwischenablage kopiert"));
      });
      root.appendChild(item);
    });
  }

  // ————— TOP-20 KUNDEN —————
  let customerQuery = "";

  function renderCustomers() {
    const list = $("#customer-list");
    if (!list) return;
    const q = customerQuery.trim().toLowerCase();
    const filtered = window.SC_CUSTOMERS.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.owner || "").toLowerCase().includes(q)
    );
    list.innerHTML = "";
    if (filtered.length === 0) {
      list.innerHTML = `<div class="section-hint">Kein Kunde gefunden.</div>`;
      return;
    }
    filtered.forEach((c) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "customer-row";
      row.innerHTML = `
        <div class="customer-rank">${c.rank}</div>
        <div class="customer-info">
          <div class="customer-name">${escapeHtml(c.name)}</div>
          <div class="customer-meta">${escapeHtml(c.industry)} · ${escapeHtml(c.region)} · ${escapeHtml(c.status)}</div>
        </div>
        <div class="customer-arrow">›</div>`;
      row.addEventListener("click", () => showCustomerDetail(c));
      list.appendChild(row);
    });
  }

  function showCustomerDetail(c) {
    const wrap = $("#customer-detail");
    const links = window.SC_CUSTOMER_LINKS;
    wrap.innerHTML = `
      <div class="detail-card">
        <div class="detail-title">${escapeHtml(c.name)}</div>
        <div class="detail-sub">Rang #${c.rank} · ${escapeHtml(c.industry)} · ${escapeHtml(c.region)}</div>

        <div class="detail-grid">
          <div class="detail-cell"><div class="label">Status</div><div class="value">${escapeHtml(c.status)}</div></div>
          <div class="detail-cell"><div class="label">Account-Owner</div><div class="value">${escapeHtml(c.owner)}</div></div>
          <div class="detail-cell"><div class="label">Potenzial</div><div class="value">${escapeHtml(c.potential)}</div></div>
          <div class="detail-cell"><div class="label">Region</div><div class="value">${escapeHtml(c.region)}</div></div>
        </div>

        <div class="detail-section">
          <h4>Kurzprofil</h4>
          <p>${escapeHtml(c.note)}</p>
        </div>

        <div class="detail-section">
          <h4>Stammdaten &amp; Briefings</h4>
          <div class="detail-actions">
            <button class="btn primary" data-go="msd">Microsoft Dynamics 365</button>
            <button class="btn" data-go="sp">SharePoint-Akte</button>
            <button class="btn" data-go="copilot">Copilot-Briefing</button>
            <button class="btn" data-go="researcher">Microsoft Researcher</button>
          </div>
        </div>
      </div>`;

    wrap.querySelector('[data-go="msd"]').addEventListener("click", () => openUrl(links.msdSearch(c.name)));
    wrap.querySelector('[data-go="sp"]').addEventListener("click", () => openUrl(links.sharepointSearch(c.name)));
    wrap.querySelector('[data-go="copilot"]').addEventListener("click", () => openUrl(links.copilotBrief(c.name)));
    wrap.querySelector('[data-go="researcher"]').addEventListener("click", () => openUrl(links.researcher(c.name)));

    $("#kunden-list-view").hidden = true;
    $("#kunden-detail-view").hidden = false;
  }

  function initCustomers() {
    $("#customer-search").addEventListener("input", (e) => {
      customerQuery = e.target.value;
      renderCustomers();
    });
    $("#customer-back").addEventListener("click", () => {
      $("#kunden-detail-view").hidden = true;
      $("#kunden-list-view").hidden = false;
    });
  }

  // ————— FOKUS —————
  let activeYearIdx = window.SC_FOCUS.findIndex((f) => f.year === new Date().getFullYear());
  if (activeYearIdx < 0) activeYearIdx = window.SC_FOCUS.length - 1;

  function renderYearTabs() {
    const root = $("#year-tabs");
    root.innerHTML = "";
    window.SC_FOCUS.forEach((f, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "year-btn" + (i === activeYearIdx ? " is-active" : "");
      btn.innerHTML = `<span class="y-num">${f.year}</span><span class="y-label">${escapeHtml(
        i === activeYearIdx ? "Ausgewählt" : "Geschäftsjahr"
      )}</span>`;
      btn.addEventListener("click", () => {
        activeYearIdx = i;
        renderYearTabs();
        renderFocusContent();
      });
      root.appendChild(btn);
    });
  }

  function renderFocusContent() {
    const root = $("#focus-content");
    const f = window.SC_FOCUS[activeYearIdx];
    root.innerHTML = `
      <div class="focus-card">
        <h3>${escapeHtml(f.label)}</h3>
        <p class="motto">${escapeHtml(f.motto)}</p>
        <div class="focus-stats">
          <div class="focus-stat"><span class="num">${escapeHtml(f.budget)}</span><span class="lbl">Budget</span></div>
          <div class="focus-stat"><span class="num">${escapeHtml(f.growth)}</span><span class="lbl">Wachstum</span></div>
          <div class="focus-stat"><span class="num">${escapeHtml(f.quota)}</span><span class="lbl">Quota</span></div>
        </div>
        <ul class="focus-list">
          ${f.pillars.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
        </ul>
      </div>`;
  }

  // ————— FOOTER —————
  function initFooter() {
    $("#open-hub").addEventListener("click", (e) => {
      e.preventDefault();
      openUrl(HUB_URL);
    });
    $$("[data-open]").forEach((el) =>
      el.addEventListener("click", () => openUrl(el.dataset.open))
    );
  }

  // ————— ESCAPE —————
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ————— INIT —————
  document.addEventListener("DOMContentLoaded", () => {
    initTabs();

    // Dashboard
    renderCards("dashboard-grid", window.SC_LINKS.dashboard);
    renderCards("analytics-grid", window.SC_LINKS.analytics);

    // Sales KI
    renderCards("agents-grid", window.SC_LINKS.agents);
    renderPromptChips();
    renderPromptList();
    initPromptSearch();

    // Flows
    renderFlows();

    // Customers
    renderCustomers();
    initCustomers();

    // Focus
    renderYearTabs();
    renderFocusContent();

    // Wissen
    renderCards("knowledge-grid", window.SC_LINKS.knowledge);
    renderCards("playbook-grid", window.SC_LINKS.playbooks);
    renderCards("compliance-grid", window.SC_LINKS.compliance);

    initFooter();
  });
})();
