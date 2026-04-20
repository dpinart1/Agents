# PS Sales Cockpit — Edge / Chrome Extension

Ein zentrales Vertriebs-Cockpit für TÜV SÜD Sales — Teil der **PS AI HUB** Extension-Suite.

Schnellzugriff auf Vertriebssysteme (MSD, PSE 2.0, Visual Planner, CBW, SAC), kuratierte Sales-Prompts für Microsoft 365 Copilot / Researcher / Agents, automatisierte Sales-Flows, Top-20-Kundenprofile sowie strategischer Jahres-Fokus inkl. Budget.

## Inhalte

| Tab | Inhalt |
|-----|--------|
| **Dashboard** | Personalisiertes *Heute*-Widget (Begrüßung, Datum, KPI-Snapshot) + Schnellstart-Kacheln zu Vertriebssystemen + Reporting/Analytics |
| **Sales KI** | KI-Assistenten (Copilot, Researcher, Sales Agents) + Prompt-Bibliothek mit 20 kuratierten Vertriebs-Prompts entlang der Wertschöpfungskette |
| **Flows** | Automatisierte Sales-Workflows per Trigger-Mail an `automation_ps@enterprise.com` (z. B. *Go Forward Sales*, *Lead Handover*, *Deal Approval*) |
| **Top 20** | Strategische Schlüsselkunden mit Detail-Ansicht (Umsatz, Wachstum, offene Opportunities, Schlüssel-Kontakt, Quick-Actions) und Deeplinks zu MSD, SharePoint, Copilot-Briefing & Microsoft Researcher |
| **Fokus** | Strategische Stoßrichtungen, Wachstumsfelder & Budgetallokation je Geschäftsjahr |
| **Wissen** | RoXtra-KI-Richtlinie, PS AI HUB, Sales-Playbooks, Compliance & Governance |
| **Merkliste** | Persönliche Sammlung favorisierter Prompts und Schlüsselkunden (★) — persistent via `chrome.storage.local` |
| **Einstellungen** | Persönliches Profil (Name, Rolle, Region), Standard-Tab beim Öffnen, bevorzugter KI-Assistent |

## Prompt-Routing

Jeder Prompt der Bibliothek wird gezielt an das passende Werkzeug geleitet:

- **Microsoft Researcher** → Kunden-, Wettbewerber-, Markt- und Regulatorik-Recherche
- **Microsoft Agent (Sales-Daten-Agent)** → Pipeline-Health, Forecast, Cluster, Cross-/Up-Sell
- **Microsoft 365 Copilot Chat** → alle übrigen Vertriebs-Use-Cases (Gesprächsvorbereitung, E-Mail, Verhandlung, QBR …)

## Installation (Edge / Chrome / Brave)

1. `edge://extensions` (bzw. `chrome://extensions`) öffnen
2. **Entwicklermodus** aktivieren
3. **Entpackte Erweiterung laden** → diesen Ordner (`ps-sales-cockpit/`) auswählen
4. Icon im Toolbar anheften

## Aufbau

```
ps-sales-cockpit/
├── manifest.json         # Manifest V3
├── popup.html            # UI-Skelett (Tabs, Panels)
├── popup.css             # Design im PS-AI-HUB-Look
├── popup.js              # Renderer & Interaktionen
├── data/
│   ├── links.js          # Tile-Links (Dashboard, KI, Wissen, Compliance)
│   ├── prompts.js        # 20 Sales-Prompts
│   ├── customers.js      # Top-20-Kunden
│   ├── focus.js          # Jahres-Fokus & Budget
│   └── flows.js          # Sales-Flows (Trigger-Mails)
└── icons/                # Toolbar-Icons (16/32/48/128 PNG)
```

## Anpassung

- **Links / Quellsysteme** → `data/links.js` und `data/customers.js`
- **Prompts erweitern** → `data/prompts.js` (Felder: `category`, `target`, `title`, `desc`, `prompt`)
- **Sales Flows** → `data/flows.js` (Subject-Konvention `#Flow Name#`)
- **Jahres-Fokus** → `data/focus.js`

## Hinweise

- Alle Inhalte und Verarbeitungen laufen lokal in der Erweiterung — keine Server-Komponente.
- Deeplinks zu Microsoft Dynamics 365, SharePoint und Microsoft 365 Copilot setzen aktive Anmeldung im jeweiligen Tenant voraus.
- KI-Richtlinie (RoXtra) und Datenschutzanforderungen sind verbindlich.

---

**by Daniel Plum, PS AI HUB** · v1.0.0 · Manifest V3 · Edge / Chrome / Brave
