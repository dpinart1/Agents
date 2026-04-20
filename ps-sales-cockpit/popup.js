/* PS Sales Cockpit — popup logic
 * - Tab navigation (with default-tab persistence)
 * - Heute/Hero widget with personalisation + KPI placeholders
 * - Card grids from data/links.js
 * - Prompt library with category chips, search, bookmarking, target-routing
 * - Sales-Flow trigger-mail buttons
 * - Top-20 customers: list + rich detail view + bookmarking
 * - Yearly Sales-Focus tabs
 * - Merkliste tab (favourites for prompts & customers)
 * - Einstellungen tab (profile, default tab, default agent)
 * - Persistence via chrome.storage.local with localStorage fallback
 */

(function () {
  "use strict";

  const HUB_URL = "https://tuev-sued.sharepoint.com/sites/AIHUB";
  const ROXTRA_URL = "https://roxtra.tuev-sued.com/Roxtra/index.aspx";
  const STORAGE_KEY = "psSalesCockpit.v1";

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

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ————— PERSISTENCE —————
  const defaultState = {
    profile: { displayName: "", role: "", region: "", defaultTab: "dashboard", defaultAgent: "copilot" },
    bookmarks: { prompts: [], customers: [] },
  };
  let state = JSON.parse(JSON.stringify(defaultState));

  function loadState() {
    return new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([STORAGE_KEY], (res) => {
          if (res && res[STORAGE_KEY]) Object.assign(state, mergeState(state, res[STORAGE_KEY]));
          resolve();
        });
      } else {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) Object.assign(state, mergeState(state, JSON.parse(raw)));
        } catch (_) {}
        resolve();
      }
    });
  }

  function saveState() {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: state });
    } else {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    }
  }

  function mergeState(base, incoming) {
    const out = JSON.parse(JSON.stringify(base));
    if (incoming.profile) Object.assign(out.profile, incoming.profile);
    if (incoming.bookmarks) {
      out.bookmarks.prompts = Array.isArray(incoming.bookmarks.prompts) ? incoming.bookmarks.prompts : [];
      out.bookmarks.customers = Array.isArray(incoming.bookmarks.customers) ? incoming.bookmarks.customers : [];
    }
    return out;
  }

  // ————— TABS —————
  function activateTab(name) {
    $$(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.tab === name));
    $$(".panel").forEach((p) => p.classList.toggle("is-active", p.id === `panel-${name}`));
  }

  function initTabs() {
    $$(".tab").forEach((tab) => {
      tab.addEventListener("click", () => activateTab(tab.dataset.tab));
    });
  }

  // ————— HERO / HEUTE WIDGET —————
  function renderHero() {
    const greeting = $("#hero-greeting");
    const sub = $("#hero-sub");
    const dateEl = $("#hero-date");
    const now = new Date();
    const hour = now.getHours();
    const tod = hour < 11 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
    const name = (state.profile.displayName || "").trim();
    greeting.textContent = name ? `${tod}, ${name}` : `${tod}!`;

    const role = state.profile.role;
    const region = state.profile.region;
    const ctxBits = [role, region].filter(Boolean).join(" · ");
    sub.textContent = ctxBits
      ? `${ctxBits} — Ihr persönlicher Vertriebs-Tagesimpuls`
      : "Ihr persönlicher Vertriebs-Tagesimpuls — Profil unter Einstellungen ergänzen";

    const fmt = new Intl.DateTimeFormat("de-DE", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });
    dateEl.textContent = fmt.format(now);
  }

  // ————— CARD GRIDS —————
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

  function renderPromptList(targetId = "prompt-list", source = null) {
    const list = $("#" + targetId);
    if (!list) return;
    const all = source || window.SC_PROMPTS;
    const q = promptFilter.query.trim().toLowerCase();
    const filtered = source
      ? all
      : all.filter((p) => {
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

    filtered.forEach((p) => list.appendChild(renderPromptItem(p)));
  }

  function renderPromptItem(p) {
    const item = document.createElement("div");
    item.className = "prompt-item";
    const targetLabel =
      p.target === "researcher" ? "Microsoft Researcher" :
      p.target === "agent" ? "Microsoft Agent" : "Copilot Chat";
    const targetClass =
      p.target === "researcher" ? "researcher" :
      p.target === "agent" ? "agent" : "copilot";
    const isFav = state.bookmarks.prompts.includes(p.id);

    item.innerHTML = `
      <div class="prompt-item-head">
        <div class="prompt-cat">${escapeHtml(p.category)}</div>
        <span class="prompt-target ${targetClass}">${escapeHtml(targetLabel)}</span>
        <button class="bookmark-btn ${isFav ? "is-on" : ""}" data-act="fav" title="Auf Merkliste setzen">${isFav ? "★" : "☆"}</button>
      </div>
      <div class="prompt-title">${escapeHtml(p.title)}</div>
      <p class="prompt-desc">${escapeHtml(p.desc)}</p>
      <div class="prompt-actions">
        <button class="btn primary" data-act="open">In ${escapeHtml(targetLabel)} öffnen</button>
        <button class="btn" data-act="copy">Prompt kopieren</button>
      </div>`;

    item.querySelector('[data-act="open"]').addEventListener("click", () => openUrl(buildPromptUrl(p)));
    item.querySelector('[data-act="copy"]').addEventListener("click", () => {
      copyToClipboard(p.prompt).then(() => showToast("Prompt in Zwischenablage kopiert"));
    });
    item.querySelector('[data-act="fav"]').addEventListener("click", (e) => {
      e.stopPropagation();
      togglePromptBookmark(p.id);
    });
    return item;
  }

  function buildPromptUrl(p) {
    const encoded = encodeURIComponent(p.prompt);
    if (p.target === "researcher")
      return `https://m365.cloud.microsoft/chat?agent=researcher&q=${encoded}`;
    if (p.target === "agent")
      return `https://m365.cloud.microsoft/chat?agent=sales-data&q=${encoded}`;
    return `https://m365.cloud.microsoft/chat?q=${encoded}`;
  }

  function togglePromptBookmark(id) {
    const arr = state.bookmarks.prompts;
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(id);
    saveState();
    renderPromptList();
    renderWatchlist();
    showToast(idx >= 0 ? "Aus Merkliste entfernt" : "Zur Merkliste hinzugefügt");
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

  function renderCustomers(targetId = "customer-list", source = null) {
    const list = $("#" + targetId);
    if (!list) return;
    const data = source || window.SC_CUSTOMERS;
    const q = customerQuery.trim().toLowerCase();
    const filtered = source
      ? data
      : data.filter(
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
    filtered.forEach((c) => list.appendChild(renderCustomerRow(c)));
  }

  function renderCustomerRow(c) {
    const wrap = document.createElement("div");
    wrap.style.position = "relative";
    const isFav = state.bookmarks.customers.includes(c.rank);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "customer-row";
    row.innerHTML = `
      <div class="customer-rank">${c.rank}</div>
      <div class="customer-info">
        <div class="customer-name">${escapeHtml(c.name)}</div>
        <div class="customer-meta">${escapeHtml(c.industry)} · ${escapeHtml(c.region)} · ${escapeHtml(c.status)}</div>
      </div>
      <button class="bookmark-btn ${isFav ? "is-on" : ""}" data-act="fav" title="Auf Merkliste setzen">${isFav ? "★" : "☆"}</button>
      <div class="customer-arrow">›</div>`;
    row.addEventListener("click", (e) => {
      if (e.target.closest('[data-act="fav"]')) return;
      showCustomerDetail(c);
    });
    row.querySelector('[data-act="fav"]').addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCustomerBookmark(c.rank);
    });
    wrap.appendChild(row);
    return wrap;
  }

  function toggleCustomerBookmark(rank) {
    const arr = state.bookmarks.customers;
    const idx = arr.indexOf(rank);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(rank);
    saveState();
    renderCustomers();
    renderWatchlist();
    showToast(idx >= 0 ? "Aus Merkliste entfernt" : "Zur Merkliste hinzugefügt");
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
          <div class="detail-cell"><div class="label">Umsatz (12M)</div><div class="value">${escapeHtml(c.revenue || "—")}</div></div>
          <div class="detail-cell"><div class="label">Wachstum YoY</div><div class="value">${escapeHtml(c.growth || "—")}</div></div>
          <div class="detail-cell"><div class="label">Offene Opportunities</div><div class="value">${c.openOpps != null ? c.openOpps : "—"}</div></div>
          <div class="detail-cell"><div class="label">Letzter Kontakt</div><div class="value">${escapeHtml(c.lastContact || "—")}</div></div>
        </div>

        <div class="detail-section">
          <h4>Schlüssel-Kontakt</h4>
          <p>${escapeHtml(c.keyContact || "—")}</p>
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

        <div class="detail-section">
          <h4>Quick-Actions</h4>
          <div class="detail-actions">
            <button class="btn" data-go="meeting">Gesprächsvorbereitung</button>
            <button class="btn" data-go="qbr">QBR-Agenda erstellen</button>
            <button class="btn accent" data-go="flow">Go-Forward-Sales auslösen</button>
          </div>
        </div>
      </div>`;

    wrap.querySelector('[data-go="msd"]').addEventListener("click", () => openUrl(links.msdSearch(c.name)));
    wrap.querySelector('[data-go="sp"]').addEventListener("click", () => openUrl(links.sharepointSearch(c.name)));
    wrap.querySelector('[data-go="copilot"]').addEventListener("click", () => openUrl(links.copilotBrief(c.name)));
    wrap.querySelector('[data-go="researcher"]').addEventListener("click", () => openUrl(links.researcher(c.name)));

    wrap.querySelector('[data-go="meeting"]').addEventListener("click", () => {
      const prompt = window.SC_PROMPTS.find((p) => p.id === "p01");
      if (!prompt) return;
      const filled = prompt.prompt.replace("{KUNDE}", c.name).replace("{BRANCHE}", c.industry);
      openUrl(`https://m365.cloud.microsoft/chat?q=${encodeURIComponent(filled)}`);
    });
    wrap.querySelector('[data-go="qbr"]').addEventListener("click", () => {
      const prompt = window.SC_PROMPTS.find((p) => p.id === "p18");
      if (!prompt) return;
      const filled = prompt.prompt.replace("{KUNDE}", c.name);
      openUrl(`https://m365.cloud.microsoft/chat?q=${encodeURIComponent(filled)}`);
    });
    wrap.querySelector('[data-go="flow"]').addEventListener("click", () => {
      const flow = window.SC_FLOWS.find((f) => f.id === "f01");
      if (!flow) return;
      const body = (flow.body || "").replace("Account: ", `Account: ${c.name}`);
      openUrl(window.SC_BUILD_MAILTO(flow.subject, body));
    });

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

  // ————— MERKLISTE —————
  function renderWatchlist() {
    const promptIds = state.bookmarks.prompts;
    const customerRanks = state.bookmarks.customers;
    const promptItems = promptIds
      .map((id) => window.SC_PROMPTS.find((p) => p.id === id))
      .filter(Boolean);
    const customerItems = customerRanks
      .map((r) => window.SC_CUSTOMERS.find((c) => c.rank === r))
      .filter(Boolean);

    renderPromptList("watchlist-prompts", promptItems);
    renderCustomers("watchlist-customers", customerItems);

    const empty = promptItems.length === 0 && customerItems.length === 0;
    $("#watchlist-empty").hidden = !empty;
  }

  // ————— EINSTELLUNGEN —————
  function fillSettingsForm() {
    const form = $("#settings-form");
    const p = state.profile;
    form.elements.displayName.value = p.displayName || "";
    form.elements.role.value = p.role || "";
    form.elements.region.value = p.region || "";
    form.elements.defaultTab.value = p.defaultTab || "dashboard";
    form.elements.defaultAgent.value = p.defaultAgent || "copilot";
  }

  function initSettings() {
    const form = $("#settings-form");
    fillSettingsForm();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      state.profile = {
        displayName: form.elements.displayName.value.trim(),
        role: form.elements.role.value,
        region: form.elements.region.value,
        defaultTab: form.elements.defaultTab.value,
        defaultAgent: form.elements.defaultAgent.value,
      };
      saveState();
      renderHero();
      showToast("Einstellungen gespeichert");
    });
    $("#settings-reset").addEventListener("click", () => {
      state.profile = JSON.parse(JSON.stringify(defaultState.profile));
      saveState();
      fillSettingsForm();
      renderHero();
      showToast("Einstellungen zurückgesetzt");
    });
    $("#open-roxtra").addEventListener("click", (e) => {
      e.preventDefault();
      openUrl(ROXTRA_URL);
    });
  }

  // ————— FOOTER & GLOBAL —————
  function initFooter() {
    $("#open-hub").addEventListener("click", (e) => {
      e.preventDefault();
      openUrl(HUB_URL);
    });
    $$("[data-open]").forEach((el) =>
      el.addEventListener("click", () => openUrl(el.dataset.open))
    );
  }

  // ————— INIT —————
  document.addEventListener("DOMContentLoaded", async () => {
    await loadState();

    initTabs();
    renderHero();

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

    // Merkliste & Einstellungen
    renderWatchlist();
    initSettings();

    initFooter();

    // Default tab
    const startTab = state.profile.defaultTab && $(`.tab[data-tab="${state.profile.defaultTab}"]`)
      ? state.profile.defaultTab
      : "dashboard";
    activateTab(startTab);
  });
})();
