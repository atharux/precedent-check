import type { CaseRecord, Jurisdiction, CypherQuery } from "../types";

// Real data, pulled live from the CourtListener REST API v4 (courtlistener.com,
// Free Law Project) on 2026-09-18. Public-domain court opinion text.
// See README.md for provenance detail.

export const JURISDICTIONS: Record<string, Jurisdiction> = {
  CA: { code: "CA", name: "California", posture: "hostile", basis: "Bus. & Prof. Code §16600 voids employee non-competes with narrow statutory exceptions" },
  NY: { code: "NY", name: "New York", posture: "reasonableness", basis: "common-law reasonableness test (time/geography/scope); partial enforcement via blue-pencil" },
  TX: { code: "TX", name: "Texas", posture: "reasonableness", basis: "Covenants Not to Compete Act: ancillary to an otherwise enforceable agreement plus reasonable limits" },
  FL: { code: "FL", name: "Florida", posture: "reasonableness", basis: "Fla. Stat. §542.335: enforceable if protecting a legitimate business interest, reasonable in time/area/scope" },
  WI: { code: "WI", name: "Wisconsin", posture: "reasonableness", basis: "Wis. Stat. §103.465: unreasonable restraint is void (no judicial blue-penciling)" },
  TN: { code: "TN", name: "Tennessee", posture: "reasonableness", basis: "common-law reasonableness test; continued employment can be sufficient consideration" },
  AZ: { code: "AZ", name: "Arizona", posture: "reasonableness", basis: "common-law reasonableness test, weighed against public interest (patient choice in physician cases)" },
};

export const CASES: Record<string, CaseRecord> = {
  edwards_ca: {
    key: "edwards_ca",
    caseName: "Edwards v. Arthur Andersen LLP",
    court: "California Supreme Court",
    dateFiled: "2008-08-07",
    citation: "44 Cal. 4th 937",
    clusterId: 5608069,
    url: "https://www.courtlistener.com/opinion/5608069/edwards-v-arthur-andersen-llp/",
    timesCitedOverall: 211,
    jurisdiction: "CA",
    snippet: "We granted review to address the validity of noncompetition agreements in California and the permissible scope of employment release agreements. We limited our review to the following issues: (1) To what extent does Business and Professions Code section 16600 prohibit employee noncompetition agreements…",
  },
  bdo_seidman_ny: {
    key: "bdo_seidman_ny",
    caseName: "BDO Seidman v. Hirshberg",
    court: "New York Court of Appeals",
    dateFiled: "1999-05-13",
    citation: "712 N.E.2d 1220",
    clusterId: 2117265,
    url: "https://www.courtlistener.com/opinion/2117265/bdo-seidman-v-hirshberg/",
    timesCitedOverall: 243,
    jurisdiction: "NY",
    snippet: "BDO SEIDMAN, Appellant, v. JEFFREY HIRSHBERG, Respondent. Court of Appeals of the State of New York. Argued March 24, 1999. Decided May 13, 1999.",
  },
  karpinski_ny: {
    key: "karpinski_ny",
    caseName: "Karpinski v. Ingrasci",
    court: "New York Court of Appeals",
    dateFiled: "1971-02-25",
    citation: "28 N.Y.2d 45",
    clusterId: 5678344,
    url: "https://www.courtlistener.com/opinion/5678344/karpinski-v-ingrasci/",
    timesCitedOverall: 87,
    jurisdiction: "NY",
    snippet: "This appeal requires us to determine whether a covenant by a professional man not to compete with his employer is enforceable and, if it is, to what extent. The plaintiff, Dr. Karpinski, an oral surgeon, had been carrying on his practice alone in Auburn—in Cayuga County—for many years…",
  },
  marsh_tx: {
    key: "marsh_tx",
    caseName: "Marsh USA Inc. v. Cook",
    court: "Texas Supreme Court",
    dateFiled: "2011-12-16",
    citation: "354 S.W.3d 764",
    clusterId: 2541088,
    url: "https://www.courtlistener.com/opinion/2541088/marsh-usa-inc-v-cook/",
    timesCitedOverall: 160,
    jurisdiction: "TX",
    snippet: "In this case, we decide whether a covenant not to compete ancillary to the grant of stock options is enforceable under the Texas Covenants Not to Compete Act…",
  },
  valley_med_az: {
    key: "valley_med_az",
    caseName: "Valley Medical Specialists v. Farber",
    court: "Arizona Supreme Court",
    dateFiled: "1999-06-18",
    citation: "982 P.2d 1277",
    clusterId: 1253291,
    url: "https://www.courtlistener.com/opinion/1253291/valley-medical-specialists-v-farber/",
    timesCitedOverall: 99,
    jurisdiction: "AZ",
    snippet: "VALLEY MEDICAL SPECIALISTS, an Arizona professional corporation, Plaintiff-Appellant, v. Steven S. FARBER, D.O. and Susan H. Farber, husband and wife, Defendants-Appellees. Supreme Court of Arizona, En Banc. June 18, 1999.",
  },
  white_fl: {
    key: "white_fl",
    caseName: "White v. Mederi Caretenders Visiting Services",
    court: "Supreme Court of Florida",
    dateFiled: "2017-09-14",
    citation: "226 So. 3d 774",
    clusterId: 4426106,
    url: "https://www.courtlistener.com/opinion/4426106/sc16-400-elizabeth-white-v-mederi-caretenders-visiting-services-of/",
    timesCitedOverall: 31,
    jurisdiction: "FL",
    snippet: "Two cases have been consolidated and are before the Court for review… relying on this Court's decision interpreting section 542.335, Florida Statutes, governing restrictive covenants.",
  },
  fullerton_wi: {
    key: "fullerton_wi",
    caseName: "Fullerton Lumber Co. v. Torborg",
    court: "Wisconsin Supreme Court",
    dateFiled: "1957-01-07",
    citation: "274 Wis. 478",
    clusterId: 2065650,
    url: "https://www.courtlistener.com/opinion/2065650/fullerton-lumber-co-v-torborg/",
    timesCitedOverall: 15,
    jurisdiction: "WI",
    snippet: "FULLERTON LUMBER COMPANY, Appellant, vs. TORBORG, Respondent. Supreme Court of Wisconsin. December 6, 1956. January 7, 1957.",
  },
  central_adj_tn: {
    key: "central_adj_tn",
    caseName: "Central Adjustment Bureau, Inc. v. Ingram",
    court: "Tennessee Supreme Court",
    dateFiled: "1984-09-17",
    citation: "678 S.W.2d 28",
    clusterId: 2437065,
    url: "https://www.courtlistener.com/opinion/2437065/central-adjustment-bureau-inc-v-ingram/",
    timesCitedOverall: 69,
    jurisdiction: "TN",
    snippet: "This appeal… involves non-competition clauses in employment contracts. It raises an issue regarding the consideration necessary to support such a covenant when it is entered into after employment has begun.",
  },
};

// The four cases the draft cites, in reading order.
export const CITED_KEYS = ["edwards_ca", "bdo_seidman_ny", "marsh_tx", "valley_med_az"];

// Confirmed via CourtListener's own citation data (not asserted by hand):
// BDO Seidman's opinion cites Karpinski's opinion.
export const CITATION_CHAIN: Record<string, string> = {
  bdo_seidman_ny: "karpinski_ny",
};

export const US_QUERIES: CypherQuery[] = [
  {
    question: "Is Karpinski v. Ingrasci binding precedent if the contract is governed by Texas law?",
    cypher: `MATCH (c:Case {key:'karpinski_ny'})-[:DECIDED_IN]->(j:Jurisdiction)
RETURN c.case_name AS case, j.code AS decided_in,
       CASE WHEN j.code = 'TX' THEN 'BINDING'
            ELSE 'PERSUASIVE ONLY - jurisdiction mismatch' END AS status_if_TX_contract;`,
    output: `case                    | decided_in | status_if_TX_contract
"Karpinski v. Ingrasci" | "NY"       | "PERSUASIVE ONLY - jurisdiction mismatch"`,
  },
  {
    question: "What does BDO Seidman rely on, and is that chain intra-jurisdiction?",
    cypher: `MATCH (a:Case)-[:CITES]->(b:Case)
MATCH (a)-[:DECIDED_IN]->(ja:Jurisdiction), (b)-[:DECIDED_IN]->(jb:Jurisdiction)
RETURN a.case_name AS citing_case, b.case_name AS cited_case,
       ja.code AS citing_jx, jb.code AS cited_jx,
       ja.code = jb.code AS same_jurisdiction;`,
    output: `citing_case                | cited_case              | citing_jx | cited_jx | same_jurisdiction
"BDO Seidman v. Hirshberg" | "Karpinski v. Ingrasci" | "NY"      | "NY"     | TRUE`,
  },
  {
    question: "Group the 8-case corpus by jurisdiction and enforceability posture.",
    cypher: `MATCH (c:Case)-[:DECIDED_IN]->(j:Jurisdiction)
RETURN j.code AS jx, j.posture AS posture, collect(c.case_name) AS cases
ORDER BY jx;`,
    output: `jx   | posture         | cases
"AZ" | "reasonableness" | ["Valley Medical Specialists v. Farber"]
"CA" | "hostile"        | ["Edwards v. Arthur Andersen LLP"]
"FL" | "reasonableness" | ["White v. Mederi Caretenders…"]
"NY" | "reasonableness" | ["Karpinski v. Ingrasci", "BDO Seidman v. Hirshberg"]
"TN" | "reasonableness" | ["Central Adjustment Bureau, Inc. v. Ingram"]
"TX" | "reasonableness" | ["Marsh USA Inc. v. Cook"]
"WI" | "reasonableness" | ["Fullerton Lumber Co. v. Torborg"]`,
  },
];
