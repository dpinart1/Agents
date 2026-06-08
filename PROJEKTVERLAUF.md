# Projektverlauf — PS Sales Cockpit Edge Extension

> Zusammenfassung der Entwicklung aus dem Chat-Verlauf.
> **Repository:** `dpinart1/Agents` · **Branch:** `claude/edge-sales-cockpit-extension-qhrqa`

---

## Ausgangslage

**Anforderung des Users:** Edge-Browser-Erweiterung im Stil der bereits mit Claude erstellten Enterprise Extensions („PS AI HUB", „PS-Datenschutz-Guard", „Tägliche KI-Lern-Impulse"). Vorlage waren fünf Screenshots, die die visuelle Sprache (dunkler Header mit PS-Monogramm, Tab-Navigation, weiße Karten-Grids, Status-Pills) vorgaben.

**Inhaltliche Vorgaben:**

| Bereich | Anforderung |
|--------|-------------|
| Link-Dashboard | MSD, PSE 2.0, Visual Planner, CBW, SAC … als Buttons |
| Sales KI | Prompt-Library mit 20 Sales-Prompts entlang der Wertschöpfungskette (mind. Gesprächsvorbereitung, Text/Mail-Analyse, Datenanalyse). Datenanalyse → Microsoft Agent, Kunden-/Wettbewerbsanalyse → Microsoft Researcher. Plus Copilot Chat, Agent A, Agent B, KI-Richtlinie (RoXtra-Link), PS AI HUB-Link |
| Sales Flows | Flow 1 „Go Forward Sales" als Trigger-Mail an `automation_ps@enterprise.com` mit Subject `#Go Forward Sales#` |
| Top 20 Kunden | Eigene View mit Liste klickbarer Top-20-Kunden, Grobinfos via MSD / SharePoint |
| Sales Fokus | Jahres-Buttons mit Fokus und Budget |
| Weitere | Sinnvolle zusätzliche Sales-Topics, professionelle/moderne Bezeichnungen |
| SharePoint-Link | `https://tuev-sued.sharepoint.com/sites/AIHUB` |

---

## Phase 1 — Initiale Extension (v1.0.0)

**Commit:** `7f83f32` — *Add PS Sales Cockpit Edge/Chrome extension*

### Architektur

```
ps-sales-cockpit/
├── manifest.json          # Manifest V3
├── popup.html             # UI-Skelett (Tabs, Panels)
├── popup.css              # Design im PS-AI-HUB-Look
├── popup.js               # Renderer & Interaktionen
├── data/
│   ├── links.js           # Tile-Links (Dashboard, KI, Wissen, Compliance)
│   ├── prompts.js         # 20 Sales-Prompts
│   ├── customers.js       # Top-20-Kunden
│   ├── focus.js           # Jahres-Fokus & Budget
│   └── flows.js           # Sales-Flows (Trigger-Mails)
└── icons/                 # 16/32/48/128 PNG (dunkles Tile, roter Akzentbalken)
```

### Sechs Tabs

1. **Dashboard** — Schnellstart-Kacheln zu Vertriebssystemen (MSD, PSE 2.0, Visual Planner, CBW, SAC, SharePoint) + Reporting/Analytics (Power BI, Forecast, Win/Loss, Marktdaten).
2. **Sales KI** — KI-Assistenten (Copilot, Researcher, Sales Agents A & B, Prompt-Builder, PS AI HUB) + Prompt-Bibliothek mit **20 kuratierten Vertriebs-Prompts** entlang der Wertschöpfungskette.
3. **Flows** — 6 Trigger-Mail-Workflows an `automation_ps@enterprise.com`: *Go Forward Sales*, *Lead Handover*, *Opportunity Update*, *Deal Approval*, *QBR Preparation*, *Risk Escalation*. Subjects korrekt URL-encoded.
4. **Top 20** — Schlüsselkunden-Liste mit Suche; Detail-View mit Deeplinks zu MSD-Suche, SharePoint-Akte, Copilot-Briefing & Researcher.
5. **Fokus** — Jahres-Karten 2024 / 2025 / 2026 mit Motto, Budget, Wachstum, Quota und strategischen Säulen.
6. **Wissen** — RoXtra-KI-Richtlinie, PS AI HUB, Sales-Playbooks (MEDDIC, SPIN, VBS, Einwandbehandlung), Compliance & Governance.

### Prompt-Routing

Jeder der 20 Prompts wird gezielt an das passende Werkzeug geleitet:

- **Microsoft Researcher** → Kunden-, Wettbewerber-, Markt-, Regulatorik-Recherche (p04–p07)
- **Microsoft Agent (Sales-Daten-Agent)** → Pipeline-Health, Forecast, Cluster, Cross-/Up-Sell (p12–p15)
- **Microsoft 365 Copilot Chat** → alle übrigen Use-Cases (Gesprächsvorbereitung, E-Mail-Analyse, Verhandlung, QBR …)

### Tooling-Details

- **Icons** über ein Python-Skript (`icons/_make_icons.py`) generiert (Pillow): dunkles abgerundetes Tile mit PS-Monogramm, roter Akzentbalken zur Abgrenzung von der Schwester-Extension.
- **JS-Syntaxprüfung** via `nodejs --check` für alle Dateien → grün.

---

## Phase 2 — Erweiterung (v1.1.0)

**Commit:** `f68c951` — *Sales Cockpit: add Merkliste, Einstellungen, Heute-Widget*

Auf den Folgeprompt „Weiter" wurde die Extension um die im PS-AI-HUB-Look noch fehlenden Standard-Tabs sowie um Personalisierung und reichere Kundenstammdaten ergänzt.

### Neue Tabs

- **Merkliste** — Stern-Bookmarking (★) für Prompts und Kunden, persistent über `chrome.storage.local` mit `localStorage`-Fallback.
- **Einstellungen** — Persönliches Profil (Name, Rolle, Region), Standard-Tab beim Öffnen, bevorzugter KI-Assistent, Über-Karte mit Versions- und Compliance-Hinweisen (RoXtra-Deeplink).

### Heute-Widget auf Dashboard

- Zeitabhängige Begrüßung („Guten Morgen / Tag / Abend, {Name}") aus dem gespeicherten Profil.
- Deutsches Langdatum (`Intl.DateTimeFormat`).
- KPI-Snapshot: Pipeline-Volumen, Quota-Coverage, Quota Q-to-Date.

### Erweiterte Kundenstammdaten

Pro Top-20-Kunde zusätzlich: **Umsatz (12M), Wachstum YoY, offene Opportunities, letzter Kontakt, Schlüssel-Stakeholder**. Im Detail-View neue Section „Quick-Actions":

- **Gesprächsvorbereitung** (Prompt p01 mit Kundennamen vorbefüllt → Copilot).
- **QBR-Agenda erstellen** (Prompt p18 vorbefüllt → Copilot).
- **Go-Forward-Sales auslösen** (Flow f01 mit Kundennamen im Mail-Body).

---

## Phase 3 — Distributable Bundle

**Commit:** `f4cc1d0` — *Add distributable ZIP of PS Sales Cockpit extension*

`ps-sales-cockpit.zip` (16 Dateien, ~31 KB gepackt) in den Branch eingecheckt. Direktlink:

```
https://github.com/dpinart1/Agents/raw/claude/edge-sales-cockpit-extension-qhrqa/ps-sales-cockpit.zip
```

### Installation

1. ZIP herunterladen und entpacken.
2. `edge://extensions` (bzw. `chrome://extensions`) → **Entwicklermodus** aktivieren.
3. **Entpackte Erweiterung laden** → entpackten Ordner auswählen.
4. Toolbar-Icon anheften.

---

## Commit-Historie auf dem Branch

| Hash | Beschreibung |
|------|--------------|
| `7f83f32` | v1.0 — initiale Extension (6 Tabs, 20 Prompts, 6 Flows, Top-20, Jahresfokus, Wissen) |
| `f68c951` | v1.1 — Merkliste + Einstellungen + Heute-Widget + erweiterte Kundenstammdaten + Quick-Actions |
| `f4cc1d0` | Distributable ZIP-Bundle (`ps-sales-cockpit.zip`) für direkten Download |

---

## Status

- **Aktuelle Version:** v1.1.0
- **Manifest:** V3
- **Kompatibilität:** Edge / Chrome / Brave (Chromium ≥ 110)
- **Verarbeitung:** 100 % lokal im Browser, keine Server-Komponente
- **Branch:** `claude/edge-sales-cockpit-extension-qhrqa` (gepusht zu `origin`)

---

**by Daniel Plum, PS AI HUB** · entwickelt mit Claude Code
