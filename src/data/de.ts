import type { DeCase, DeCategory, CypherQuery } from "../types";

// Real German statute text (§630h BGB, current consolidated text) pulled live
// from the official federal law portal, gesetze-im-internet.de, on 2026-09-18.
// Real case citations below; see README.md for provenance and confidence notes.
//
// The illustrative incident file used in the UI is a generic, invented lab-sample
// mix-up scenario — not based on, or connected to, any real person's case.

export const DE_CATEGORIES: Record<string, DeCategory> = {
  voll_beherrschbares_risiko: {
    key: "voll_beherrschbares_risiko",
    name: "Voll beherrschbares Risiko",
    paragraph: "§630h Abs. 1 BGB",
    statute:
      "Ein Fehler des Behandelnden wird vermutet, wenn sich ein allgemeines Behandlungsrisiko verwirklicht hat, das für den Behandelnden voll beherrschbar war und das zur Verletzung des Lebens, des Körpers oder der Gesundheit des Patienten geführt hat.",
    note:
      "Covers risks entirely within the provider's organizational control — equipment, hygiene, and identification failures such as sample or patient mix-ups, as opposed to risks inherent to the underlying illness or treatment.",
  },
  aufklaerung: {
    key: "aufklaerung",
    name: "Aufklärungsfehler (informed consent)",
    paragraph: "§630h Abs. 2 BGB",
    statute:
      "Der Behandelnde hat zu beweisen, dass er eine Einwilligung gemäß § 630d eingeholt und entsprechend den Anforderungen des § 630e aufgeklärt hat.",
    note: "Burden shifts to the provider to prove consent was properly obtained — a distinct doctrinal lane from treatment execution errors.",
  },
  dokumentation: {
    key: "dokumentation",
    name: "Dokumentationsmangel",
    paragraph: "§630h Abs. 3 BGB",
    statute:
      "Hat der Behandelnde eine medizinisch gebotene wesentliche Maßnahme und ihr Ergebnis entgegen § 630f Absatz 1 oder Absatz 2 nicht in der Behandlungsakte aufgezeichnet … wird vermutet, dass er diese Maßnahme nicht getroffen hat.",
    note: "An undocumented but medically-required step is presumed never to have happened — this is what makes the §630f documentation duty load-bearing.",
  },
  befaehigung: {
    key: "befaehigung",
    name: "Befähigungsmangel",
    paragraph: "§630h Abs. 4 BGB",
    statute:
      "War ein Behandelnder für die von ihm vorgenommene Behandlung nicht befähigt, wird vermutet, dass die mangelnde Befähigung für den Eintritt der Verletzung … ursächlich war.",
    note: "An unqualified provider performing the procedure gets a presumption of causation, independent of what exactly went wrong.",
  },
  grober_behandlungsfehler: {
    key: "grober_behandlungsfehler",
    name: "Grober Behandlungsfehler",
    paragraph: "§630h Abs. 5 BGB",
    statute:
      "Liegt ein grober Behandlungsfehler vor und ist dieser grundsätzlich geeignet, eine Verletzung … der tatsächlich eingetretenen Art herbeizuführen, wird vermutet, dass der Behandlungsfehler für diese Verletzung ursächlich war.",
    note: "The most litigated of the five — causation is presumed once a gross error is established, which is exactly the doctrine both real cases below turned on.",
  },
};

export const DE_CASES: Record<string, DeCase> = {
  olg_koeln_2025: {
    key: "olg_koeln_2025",
    caseName: "OLG Köln 5 U 69/24",
    court: "Oberlandesgericht Köln",
    dateFiled: "2025-01-27",
    citation: "ECLI:DE:OLGK:2025:0127.5U69.24.00",
    url: "https://nrwe.justiz.nrw.de/olgs/koeln/j2025/5_U_69_24_Urteil_20250127.html",
    category: "grober_behandlungsfehler",
    confidence: "primary",
    snippet:
      "Use of distilled water instead of isotonic distension medium during hysteroscopy — expert testimony confirmed that preventing water from entering the bloodstream is fundamental medical education; hospital and both treating physicians held liable, including for breach of the duty to remonstrate up the hierarchy.",
  },
  bgh_2024: {
    key: "bgh_2024",
    caseName: "BGH VI ZR 108/23",
    court: "Bundesgerichtshof (VI. Zivilsenat)",
    dateFiled: "2024-06-04",
    citation: "VI ZR 108/23",
    url: "https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BGH&Datum=04.06.2024&Aktenzeichen=VI+ZR+108%2F23",
    category: "grober_behandlungsfehler",
    confidence: "secondary",
    snippet:
      "Confirms the Abs. 5 Satz 2 burden-of-proof reversal applies to an established Befunderhebungsfehler (failure to obtain a medically required finding) and clarifies how to distinguish it from an Aufklärungsfehler.",
  },
};

export const DE_QUERIES: CypherQuery[] = [
  {
    question: "Which statute governs a fully-controllable-risk case (e.g. a sample mix-up), and is there a confirmed case for it in this corpus?",
    cypher: `MATCH (c:Category {key:'voll_beherrschbares_risiko'})-[:GOVERNED_BY]->(s:Statute)
OPTIONAL MATCH (case:Case)-[:ESTABLISHES]->(c)
RETURN c.key AS category, s.section AS statute,
       collect(case.name) AS confirmed_cases;`,
    output: `category                     | statute            | confirmed_cases
"voll_beherrschbares_risiko" | "§630h Abs. 1 BGB" | []`,
    isEmpty: true,
  },
  {
    question: "Which real cases establish the gross-treatment-error presumption, and which court decided them?",
    cypher: `MATCH (case:Case)-[:ESTABLISHES]->(c:Category {key:'grober_behandlungsfehler'})-[:GOVERNED_BY]->(s:Statute)
RETURN case.name AS case, case.court AS court, case.date AS date, s.section AS statute;`,
    output: `case                 | court                    | date         | statute
"OLG Köln 5 U 69/24" | "Oberlandesgericht Köln" | "2025-01-27" | "§630h Abs. 5 BGB"
"BGH VI ZR 108/23"    | "Bundesgerichtshof"      | "2024-06-04" | "§630h Abs. 5 BGB"`,
  },
  {
    question: "Count confirmed cases per §630h category — where are the real gaps?",
    cypher: `MATCH (c:Category)-[:GOVERNED_BY]->(s:Statute)
OPTIONAL MATCH (case:Case)-[:ESTABLISHES]->(c)
RETURN c.key AS category, s.section AS statute, count(case) AS confirmed_case_count
ORDER BY category;`,
    output: `category                     | statute            | confirmed_case_count
"aufklaerung"                | "§630h Abs. 2 BGB" | 0
"befaehigung"                | "§630h Abs. 4 BGB" | 0
"dokumentation"              | "§630h Abs. 3 BGB" | 0
"grober_behandlungsfehler"   | "§630h Abs. 5 BGB" | 2
"voll_beherrschbares_risiko" | "§630h Abs. 1 BGB" | 0`,
    isEmpty: true,
  },
];
