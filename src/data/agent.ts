import type { AgentStep } from "../types";

export const US_AGENT_STEPS: AgentStep[] = [
  { key: "retrieve", label: "Retrieve", detail: "Pull candidate authorities for “non-compete enforceability” from the corpus." },
  { key: "rank", label: "Rank", detail: "Score candidates by relevance and recency; surface the four strongest." },
  { key: "draft", label: "Draft", detail: "Insert the clause language and attach the ranked citations inline." },
  { key: "selfCheck", label: "Self-check", detail: "Re-run each citation against the contract's actual governing law before finalizing." },
  { key: "escalate", label: "Escalate", detail: "Hand off to a human reviewer — no citation is accepted without sign-off, regardless of self-check result." },
];

export const DE_AGENT_STEPS: AgentStep[] = [
  { key: "retrieve", label: "Retrieve", detail: "Pull the §630h BGB categories and any confirmed decisions for the incident described." },
  { key: "rank", label: "Rank", detail: "Match the incident's fact pattern to the most applicable burden-of-proof category." },
  { key: "draft", label: "Draft", detail: "Attach the matched statute text and any confirmed case law to the incident file." },
  { key: "selfCheck", label: "Self-check", detail: "Check whether a confirmed published decision actually exists for this exact category — report the gap if not." },
  { key: "escalate", label: "Escalate", detail: "Hand off to a human reviewer — a category mapping is never treated as settled without sign-off." },
];
