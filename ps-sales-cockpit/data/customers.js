// Top-20-Schlüsselkunden — Stammdaten als Übersicht.
// Realdaten werden ergänzend über Microsoft Dynamics 365 / SharePoint geladen.
// Die "msdUrl" und "spUrl" verlinken in die jeweiligen Quellsysteme.

window.SC_CUSTOMERS = [
  { rank: 1,  name: "Siemens AG",                      industry: "Industrie & Energie",        region: "DACH",   owner: "Account Team Süd",  potential: "€€€€",  status: "Strategisch", note: "Konzern-Rahmenvertrag, Multi-BU-Engagement, hoher Cross-Sell-Hebel." },
  { rank: 2,  name: "BMW Group",                       industry: "Automotive",                 region: "DACH",   owner: "Account Team Mobility", potential: "€€€€", status: "Strategisch", note: "Fokus E-Mobility-Zertifizierung, Software & Funktionale Sicherheit." },
  { rank: 3,  name: "Volkswagen AG",                   industry: "Automotive",                 region: "DACH",   owner: "Account Team Mobility", potential: "€€€€", status: "Strategisch", note: "Globaler Rollout, ADAS-Programme, Cyber-Security-Audits." },
  { rank: 4,  name: "Mercedes-Benz Group",             industry: "Automotive",                 region: "DACH",   owner: "Account Team Mobility", potential: "€€€€", status: "Strategisch", note: "Neue Plattform-Architekturen, Type-Approval, Battery-Testing." },
  { rank: 5,  name: "Robert Bosch GmbH",               industry: "Industrial / Mobility",      region: "DACH",   owner: "Account Team Industry", potential: "€€€€", status: "Strategisch", note: "BU-übergreifender Account, Innovations-Roadmap mit TÜV SÜD." },
  { rank: 6,  name: "BASF SE",                         industry: "Chemie & Prozess",           region: "DACH",   owner: "Account Team Process", potential: "€€€",  status: "Wachstum",     note: "Asset-Integrity, Pressure Equipment, Funktionale Sicherheit." },
  { rank: 7,  name: "Bayer AG",                        industry: "Pharma & Life Science",      region: "DACH",   owner: "Account Team LifeSci", potential: "€€€",  status: "Wachstum",     note: "GxP-Audits, Validierung, Medical-Device-Compliance." },
  { rank: 8,  name: "ThyssenKrupp AG",                 industry: "Industrie & Stahl",          region: "DACH",   owner: "Account Team Industry", potential: "€€€",  status: "Defend",       note: "Rahmenvertrag wird neu verhandelt — Fokus Pricing & SLA." },
  { rank: 9,  name: "Airbus SE",                       industry: "Aerospace",                  region: "EU",     owner: "Account Team Aero",   potential: "€€€",  status: "Wachstum",     note: "NDT-Services, Werkstoffprüfung, Supply-Chain-Audits." },
  { rank: 10, name: "Deutsche Bahn AG",                industry: "Mobility & Infrastruktur",   region: "DACH",   owner: "Account Team Rail",   potential: "€€€",  status: "Strategisch", note: "Schienenfahrzeuge, Infrastruktur-Inspektionen, Digital-Rail." },
  { rank: 11, name: "EnBW Energie Baden-Württemberg",  industry: "Energie & Utilities",        region: "DACH",   owner: "Account Team Energy", potential: "€€€",  status: "Wachstum",     note: "Erneuerbare Energien, Netz-Inspektion, Wasserstoff-Programme." },
  { rank: 12, name: "RWE AG",                          industry: "Energie & Utilities",        region: "DACH",   owner: "Account Team Energy", potential: "€€€",  status: "Wachstum",     note: "Offshore-Wind, Asset-Lifecycle, ESG-Auditierung." },
  { rank: 13, name: "E.ON SE",                         industry: "Energie & Utilities",        region: "DACH",   owner: "Account Team Energy", potential: "€€",   status: "Defend",       note: "Smart-Meter-Rollout, Cyber-Security im OT-Umfeld." },
  { rank: 14, name: "SAP SE",                          industry: "Software & Tech",            region: "DACH",   owner: "Account Team Tech",   potential: "€€€",  status: "Wachstum",     note: "Cloud-Compliance, AI-Trust-Services, ISO 42001." },
  { rank: 15, name: "Deutsche Telekom AG",             industry: "Telco & Tech",               region: "DACH",   owner: "Account Team Tech",   potential: "€€€",  status: "Wachstum",     note: "Cyber-Security, Datacenter-Audits, AI-Governance." },
  { rank: 16, name: "Allianz SE",                      industry: "Financial Services",         region: "DACH",   owner: "Account Team FS",     potential: "€€",   status: "Wachstum",     note: "Risk-Engineering, ESG-Bewertung, Cyber-Underwriting." },
  { rank: 17, name: "Henkel AG & Co. KGaA",            industry: "Konsumgüter & Chemie",       region: "DACH",   owner: "Account Team Process", potential: "€€",   status: "Defend",       note: "Anlagensicherheit, Nachhaltigkeits-Audits." },
  { rank: 18, name: "MAN Truck & Bus SE",              industry: "Commercial Vehicles",        region: "DACH",   owner: "Account Team Mobility", potential: "€€",   status: "Defend",       note: "Type-Approval, Emissionsmessung, autonomes Fahren." },
  { rank: 19, name: "ZF Friedrichshafen AG",           industry: "Automotive Tier-1",          region: "DACH",   owner: "Account Team Mobility", potential: "€€",   status: "Wachstum",     note: "Funktionale Sicherheit, E-Antriebe, ADAS-Validierung." },
  { rank: 20, name: "Stadtwerke München (SWM)",        industry: "Utilities & Mobility",       region: "DACH",   owner: "Account Team Energy", potential: "€€",   status: "Wachstum",     note: "Wärmewende, ÖPNV-Inspektion, Wasserstoff-Pilotprojekte." },
];

// URL-Builder für Quellsysteme — anpassen, sobald die finalen Deeplinks vorliegen.
window.SC_CUSTOMER_LINKS = {
  msdSearch: (name) =>
    `https://dynamics.microsoft.com/?q=${encodeURIComponent(name)}`,
  sharepointSearch: (name) =>
    `https://tuev-sued.sharepoint.com/sites/AIHUB/_layouts/15/search.aspx/?q=${encodeURIComponent(name)}`,
  copilotBrief: (name) =>
    `https://m365.cloud.microsoft/chat?q=${encodeURIComponent(
      `Erstelle ein Sales-Briefing zum Kunden ${name}: aktuelle Aktivitäten, offene Opportunities, Stakeholder, Risiken und Next-Best-Action.`
    )}`,
  researcher: (name) =>
    `https://m365.cloud.microsoft/chat?agent=researcher&q=${encodeURIComponent(
      `Tiefenrecherche zum Unternehmen ${name}: Geschäftsmodell, aktuelle Strategie, Finanzen, News und Wettbewerber.`
    )}`,
};
