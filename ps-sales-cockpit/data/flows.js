// Sales Flows — automatisierte Vertriebs-Workflows.
// Trigger erfolgt per strukturierter Trigger-Mail an die Automatisierungs-Mailbox.
// Subject-Konvention: #<FlowName>#  (Backend parst die Hashtag-Klammer)

const AUTOMATION_INBOX = "automation_ps@enterprise.com";

const buildMailto = (subject, body) =>
  `mailto:${AUTOMATION_INBOX}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");

window.SC_FLOWS = [
  {
    id: "f01",
    tag: "Flow 1",
    title: "Go Forward Sales",
    desc: "Startet den standardisierten 'Go Forward Sales'-Prozess: Account-Plan, Stakeholder-Mapping und Pipeline-Update werden orchestriert.",
    subject: "#Go Forward Sales#",
    body: "Account: \nOpportunity-ID: \nNächster Meilenstein: \nSupport benötigt von: \n",
    cta: "Flow auslösen",
  },
  {
    id: "f02",
    tag: "Flow 2",
    title: "Lead Handover an Vertrieb",
    desc: "Übergibt einen qualifizierten Marketing-Lead strukturiert in die Sales-Organisation inklusive Routing-Logik.",
    subject: "#Lead Handover#",
    body: "Lead-Quelle: \nKontakt: \nUnternehmen: \nBANT-Status: \nNächster Schritt: \n",
    cta: "Lead übergeben",
  },
  {
    id: "f03",
    tag: "Flow 3",
    title: "Opportunity-Statusupdate",
    desc: "Triggert ein automatisiertes Status-Update einer Opportunity inkl. CRM-Synchronisation und Forecast-Refresh.",
    subject: "#Opportunity Update#",
    body: "Opportunity-ID: \nNeuer Status: \nWahrscheinlichkeit (%): \nBegründung: \n",
    cta: "Update senden",
  },
  {
    id: "f04",
    tag: "Flow 4",
    title: "Deal-Approval-Request",
    desc: "Initiiert einen Genehmigungs-Workflow für Sondervereinbarungen, Rabatte oder strategische Deals.",
    subject: "#Deal Approval#",
    body: "Kunde: \nDeal-Volumen: \nAbweichung von Standard: \nBegründung: \nGewünschter Genehmiger: \n",
    cta: "Genehmigung anfragen",
  },
  {
    id: "f05",
    tag: "Flow 5",
    title: "QBR-Vorbereitung anstoßen",
    desc: "Stößt die automatisierte QBR-Vorbereitung an: KPI-Bericht, Aktionsliste und Folien-Template werden generiert.",
    subject: "#QBR Preparation#",
    body: "Kunde: \nQuartal: \nTeilnehmer: \nFokusthemen: \n",
    cta: "QBR vorbereiten",
  },
  {
    id: "f06",
    tag: "Flow 6",
    title: "Risk-Escalation Account",
    desc: "Eskaliert ein Account-Risiko an die Sales-Leitung mit strukturiertem Kontext und Maßnahmenvorschlag.",
    subject: "#Risk Escalation#",
    body: "Kunde: \nRisikotyp: \nAuswirkung: \nDringlichkeit (1-5): \nVorgeschlagene Maßnahme: \n",
    cta: "Eskalation senden",
  },
];

window.SC_BUILD_MAILTO = buildMailto;
