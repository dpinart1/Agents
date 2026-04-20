// 20 kuratierte Vertriebs-Prompts entlang der Wertschöpfungskette.
// target = "copilot" | "researcher" | "agent"
//   - researcher  → Microsoft Researcher (Kunden-/Wettbewerbs-/Marktrecherche)
//   - agent       → Microsoft 365 Agent (datengetriebene Auswertungen)
//   - copilot     → Microsoft 365 Copilot Chat (Standard)

window.SC_PROMPTS = [
  // —— GESPRÄCHSVORBEREITUNG ——
  {
    id: "p01",
    category: "Gesprächsvorbereitung",
    target: "copilot",
    title: "Erstgespräch — Strukturierte Briefing-Note",
    desc: "Erstellt einen Gesprächsleitfaden mit Stakeholder-Map, Pain Points und Discovery-Fragen.",
    prompt:
      "Du bist mein Senior Sales Coach. Erstelle eine Briefing-Note für ein Erstgespräch mit dem Kunden {KUNDE} aus der Branche {BRANCHE}. Liefere: 1) Kurzprofil & Marktposition, 2) wahrscheinliche Pain Points, 3) Stakeholder-Landkarte (Buyer, User, Decision-Maker), 4) 8 wirkungsvolle Discovery-Fragen nach SPIN, 5) drei Hypothesen für unseren Mehrwert. Antworte strukturiert in deutscher Sprache mit klaren Überschriften.",
  },
  {
    id: "p02",
    category: "Gesprächsvorbereitung",
    target: "copilot",
    title: "Folgegespräch — Next-Best-Action",
    desc: "Verdichtet bisherige Touchpoints aus E-Mails/CRM zu einer Empfehlung für das nächste Gespräch.",
    prompt:
      "Analysiere alle bisherigen Touchpoints (E-Mails, Termine, Notizen) mit dem Kunden {KUNDE}. Fasse den Status in 5 Bullet Points zusammen, identifiziere offene Themen, bewerte den Deal-Status (Heat-Score 1-5) und empfehle drei Next-Best-Actions inkl. Verantwortlicher und Zeithorizont. Output als kompakte Tabelle.",
  },
  {
    id: "p03",
    category: "Gesprächsvorbereitung",
    target: "copilot",
    title: "Stakeholder-Profil aus LinkedIn-Notizen",
    desc: "Erstellt ein neutrales Kurzprofil eines Gesprächspartners auf Basis öffentlich verfügbarer Notizen.",
    prompt:
      "Erstelle ein professionelles Kurzprofil von {NAME}, {ROLLE} bei {KUNDE}. Berücksichtige Werdegang, fachliche Schwerpunkte, mögliche Motivations-Trigger und Kommunikationsstil. Bitte sachlich, neutral, ohne Spekulationen, max. 200 Wörter.",
  },

  // —— KUNDEN- & MARKTRECHERCHE (RESEARCHER) ——
  {
    id: "p04",
    category: "Kundenanalyse",
    target: "researcher",
    title: "360°-Kundenrecherche",
    desc: "Tiefenrecherche zu Geschäftsmodell, Strategie, Finanzen und News des Zielkunden.",
    prompt:
      "Führe eine fundierte 360°-Recherche zum Unternehmen {KUNDE} durch. Liefere: Geschäftsmodell, Geschäftszahlen (Umsatz, EBIT, Mitarbeiter), strategische Initiativen der letzten 12 Monate, jüngste Pressemeldungen, Top-3-Wettbewerber sowie potenzielle Anknüpfungspunkte für TÜV SÜD Dienstleistungen. Quellen bitte zitieren.",
  },
  {
    id: "p05",
    category: "Wettbewerberanalyse",
    target: "researcher",
    title: "Wettbewerbs-Benchmark",
    desc: "Vergleichende Analyse Marktbegleiter inkl. Stärken, Schwächen und Differenzierungspotenzial.",
    prompt:
      "Erstelle einen Wettbewerbs-Benchmark für die Anbieter {WETTBEWERBER_LISTE} im Marktsegment {SEGMENT}. Bitte vergleichende Tabelle mit Portfolio, Pricing-Indikator, Marktanteil (Schätzung), USPs und Schwächen. Schließe mit drei Empfehlungen, wie sich TÜV SÜD differenzieren kann.",
  },
  {
    id: "p06",
    category: "Marktanalyse",
    target: "researcher",
    title: "Branchen- & Trendanalyse",
    desc: "Strukturierter Marktüberblick mit Treibern, Risiken und 12-Monats-Ausblick.",
    prompt:
      "Recherchiere die wichtigsten Trends in der Branche {BRANCHE} der DACH-Region. Strukturiere nach: Markttreiber, regulatorische Veränderungen, technologische Disruption, Risikofaktoren, 12-Monats-Ausblick. Markiere alle Aussagen mit Quelle und Datum.",
  },
  {
    id: "p07",
    category: "Marktanalyse",
    target: "researcher",
    title: "Regulatorisches Frühwarn-Briefing",
    desc: "Identifiziert relevante neue Gesetze, Normen und Standards für ein Kundensegment.",
    prompt:
      "Erstelle ein regulatorisches Frühwarn-Briefing für Kunden im Segment {SEGMENT} in {REGION}. Liste neue/änderte Normen, Gesetze und Standards der nächsten 12-24 Monate, beschreibe deren Auswirkungen auf den Kunden und nenne mögliche Service-Anknüpfungspunkte für TÜV SÜD.",
  },

  // —— TEXT- & E-MAIL-ANALYSE ——
  {
    id: "p08",
    category: "Text & E-Mail",
    target: "copilot",
    title: "E-Mail-Analyse — Intent & Tonalität",
    desc: "Klassifiziert eine eingehende Kunden-E-Mail nach Intent, Tonalität und Dringlichkeit.",
    prompt:
      "Analysiere die folgende Kunden-E-Mail. Klassifiziere: 1) Hauptintent (z. B. Anfrage, Beschwerde, Verhandlung), 2) Tonalität (sachlich/positiv/eskalierend), 3) Dringlichkeit (1-5), 4) implizite Erwartung des Absenders, 5) drei Empfehlungen für die Antwort. E-Mail:\n\n{EMAIL_TEXT}",
  },
  {
    id: "p09",
    category: "Text & E-Mail",
    target: "copilot",
    title: "Antwortentwurf — verbindlich & professionell",
    desc: "Erstellt einen verbindlichen Antwortentwurf in TÜV SÜD-Tonalität.",
    prompt:
      "Verfasse einen professionellen Antwortentwurf auf folgende E-Mail. Tonalität: verbindlich, kompetent, kundenorientiert. Nutze TÜV SÜD-Sprachstil (klar, präzise, vertrauenswürdig). Antwort als deutsche E-Mail mit Anrede, max. 180 Wörtern, klarem Call-to-Action und Signatur-Platzhalter.\n\nEingehende E-Mail:\n{EMAIL_TEXT}",
  },
  {
    id: "p10",
    category: "Text & E-Mail",
    target: "copilot",
    title: "Cold-Outreach-Sequenz (3-Touch)",
    desc: "Generiert eine 3-Touch-Outreach-Sequenz mit jeweils unterschiedlichem Hook.",
    prompt:
      "Erstelle eine 3-stufige Cold-Outreach-Sequenz für die Zielperson {ROLLE} bei {KUNDE} im Segment {SEGMENT}. Touch 1: Insight-Hook, Touch 2: Case-Study-Bezug, Touch 3: Verbindlicher Terminvorschlag. Pro Mail max. 90 Wörter, Betreffzeile + Body, deutsche Sprache.",
  },
  {
    id: "p11",
    category: "Text & E-Mail",
    target: "copilot",
    title: "Angebots-Anschreiben (Begleitmail)",
    desc: "Strukturiertes Anschreiben für die Angebotsversendung mit Nutzenversprechen.",
    prompt:
      "Schreibe das Anschreiben zur Angebotsversendung an {KUNDE}. Inhalt: Bezug auf letztes Gespräch am {DATUM}, kompakte Zusammenfassung der Lösung, drei Kunden-Nutzen, Hinweis auf Anlagen, klare nächste Schritte. Max. 200 Wörter, deutsch, professionell.",
  },

  // —— DATENANALYSE (AGENT) ——
  {
    id: "p12",
    category: "Datenanalyse",
    target: "agent",
    title: "Pipeline-Health-Check",
    desc: "Microsoft-Agent prüft Pipeline-Qualität anhand von Stage, Probability, Aging.",
    prompt:
      "Übergib an den Sales-Daten-Agenten: Analysiere meine aktive Pipeline. Bewerte Pipeline-Health entlang Stage-Verteilung, Win-Probability, Aging je Stage und Coverage gegenüber Quote. Identifiziere die 5 risikoreichsten und die 5 vielversprechendsten Opportunities. Output: Tabelle + 3 Handlungsempfehlungen.",
  },
  {
    id: "p13",
    category: "Datenanalyse",
    target: "agent",
    title: "Forecast-Plausibilitätsprüfung",
    desc: "Microsoft-Agent vergleicht Forecast vs. historische Closing-Quoten.",
    prompt:
      "Übergib an den Sales-Daten-Agenten: Vergleiche den aktuellen Quartals-Forecast mit der historischen Closing-Quote pro Stage und pro Sales-Owner der letzten 4 Quartale. Markiere Outlier (>20% Abweichung), benenne die Top-3-Treiber für Forecast-Risiko und schlage Korrekturen vor.",
  },
  {
    id: "p14",
    category: "Datenanalyse",
    target: "agent",
    title: "Kundenportfolio-Cluster",
    desc: "Microsoft-Agent clustert das Kundenportfolio nach Umsatz, Wachstum, Risiko.",
    prompt:
      "Übergib an den Sales-Daten-Agenten: Cluster meine Top-100-Kunden nach Umsatz (12M), Wachstum (YoY) und Risiko-Score. Visualisiere als 2×2-Matrix (Wachstum × Umsatz), markiere Risiko mit Farbe und liste je Cluster die empfohlene Account-Strategie (Invest, Defend, Optimize, Exit).",
  },
  {
    id: "p15",
    category: "Datenanalyse",
    target: "agent",
    title: "Cross- & Up-Sell-Potenzial",
    desc: "Microsoft-Agent identifiziert White-Space im Bestandsportfolio.",
    prompt:
      "Übergib an den Sales-Daten-Agenten: Identifiziere für meine Top-20-Kunden ungenutztes Cross-/Up-Sell-Potenzial. Vergleiche das aktuelle Service-Portfolio je Kunde mit dem TÜV SÜD-Gesamtangebot, schätze das Potenzial in EUR und priorisiere die 10 stärksten Opportunities.",
  },

  // —— VERHANDLUNG, CLOSING, RETENTION ——
  {
    id: "p16",
    category: "Verhandlung & Closing",
    target: "copilot",
    title: "Einwandbehandlung — Top-5-Antworten",
    desc: "Generiert souveräne Antworten auf typische Einwände.",
    prompt:
      "Mein Kunde {KUNDE} äußert folgenden Einwand: '{EINWAND}'. Liefere die Top-5-Antwortstrategien (jeweils 2-3 Sätze), eingeordnet nach: Reframe, Beweisführung, Risiko-Adressierung, Sozial-Beweis, Kompromiss. Ergänze, welche Strategie wann passt.",
  },
  {
    id: "p17",
    category: "Verhandlung & Closing",
    target: "copilot",
    title: "Verhandlungs-Strategie & ZOPA",
    desc: "Strukturiert Vorbereitung mit BATNA, ZOPA und Eröffnungs-Anker.",
    prompt:
      "Bereite eine Verhandlungsstrategie für den Deal mit {KUNDE} (Volumen {VOLUMEN}) vor. Definiere: BATNA, Reservation Price, ZOPA, drei Eröffnungs-Anker, mögliche Trade-Offs (Preis vs. Laufzeit, Scope, Service-Level). Output als 1-Seiter.",
  },
  {
    id: "p18",
    category: "Account Management",
    target: "copilot",
    title: "QBR — Quarterly Business Review",
    desc: "Erstellt Agenda und Talking-Points für ein QBR mit Kunde.",
    prompt:
      "Erstelle eine QBR-Agenda für den Kunden {KUNDE}. Inhalte: Review letzter Zeitraum (KPIs, Meilensteine, Tickets), Strategie-Update Kunde, Roadmap TÜV SÜD, Next-Best-Initiatives, Risiken & Maßnahmen. Pro Block: Ziel, Verantwortlich, Talking-Points (3-5).",
  },
  {
    id: "p19",
    category: "Account Management",
    target: "copilot",
    title: "Win/Loss-Review",
    desc: "Strukturiert eine Lessons-Learned-Auswertung nach Deal-Abschluss.",
    prompt:
      "Erstelle eine Win/Loss-Review-Vorlage für den Deal {DEAL} ({STATUS}). Strukturiere nach: Buyer-Kontext, Entscheidungstreiber, Wettbewerbssituation, eigene Stärken & Schwächen im Prozess, drei konkrete Verbesserungsmaßnahmen für künftige Deals.",
  },
  {
    id: "p20",
    category: "Account Management",
    target: "copilot",
    title: "Meeting-Zusammenfassung & Action-Items",
    desc: "Komprimiert Meeting-Notizen zu Entscheidungen und Action-Items.",
    prompt:
      "Fasse die folgenden Meeting-Notizen zusammen. Output: 1) Key-Insights (max 5), 2) getroffene Entscheidungen, 3) Action-Items mit Owner & Fälligkeit, 4) offene Risiken. Sprache: deutsch, kompakt.\n\nNotizen:\n{NOTIZEN}",
  },
];
