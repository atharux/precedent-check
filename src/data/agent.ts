import type { AgentStep } from "../types";

export const US_AGENT_STEPS: AgentStep[] = [
  { key: "retrieve", label: "Retrieve", detail: "Pull candidate authorities for “non-compete enforceability” from the corpus." },
  { key: "rank", label: "Rank", detail: "Score candidates by relevance and recency; surface the four strongest." },
  { key: "draft", label: "Draft", detail: "Insert the clause language and attach the ranked citations inline." },
  { key: "selfCheck", label: "Self-check", detail: "Re-run each citation against the contract's actual governing law before finalizing." },
  { key: "escalate", label: "Escalate", detail: "Hand off to a human reviewer. No citation is accepted without sign-off, regardless of self-check result." },
];
