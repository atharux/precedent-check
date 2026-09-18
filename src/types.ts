export type JurisdictionCode = "CA" | "NY" | "TX" | "FL" | "WI" | "TN" | "AZ";

export type Posture = "hostile" | "reasonableness";

export interface Jurisdiction {
  code: JurisdictionCode;
  name: string;
  posture: Posture;
  basis: string;
}

export interface CaseRecord {
  key: string;
  caseName: string;
  court: string;
  dateFiled: string;
  citation: string;
  clusterId: number;
  url: string;
  timesCitedOverall: number;
  jurisdiction: JurisdictionCode;
  snippet: string;
}

export type CitationStatus = "binding" | "persuasive" | "blocked";

export type ReviewVerdict = "accepted" | "flagged";

export interface CypherQuery {
  question: string;
  cypher: string;
  output: string;
  isEmpty?: boolean;
}

export interface AgentStep {
  key: string;
  label: string;
  detail: string;
}
