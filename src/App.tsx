import { useState } from "react";
import { CiteChip } from "./components/CiteChip";
import { StatusBanner } from "./components/StatusBanner";
import { ExhibitCard } from "./components/ExhibitCard";
import { ReviewQueue, type ReviewQueueItem } from "./components/ReviewQueue";
import { AgentTrace } from "./components/AgentTrace";
import { UnderTheHood } from "./components/UnderTheHood";
import { JURISDICTIONS, CASES, CITED_KEYS, CITATION_CHAIN, US_QUERIES } from "./data/us";
import { US_AGENT_STEPS } from "./data/agent";
import type { CitationStatus, ReviewVerdict, JurisdictionCode } from "./types";

function findSameJurisdictionAlternative(jur: JurisdictionCode, exclude: string[]) {
  return Object.values(CASES).find((c) => c.jurisdiction === jur && !exclude.includes(c.key));
}

export default function App() {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>("NY");
  const [drafting, setDrafting] = useState(false);
  const [draftVisible, setDraftVisible] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [review, setReview] = useState<Record<string, ReviewVerdict>>({});
  const [liveMessage, setLiveMessage] = useState("");
  const announce = (msg: string) => setLiveMessage(msg);

  function statusOf(caseKey: string, jur: JurisdictionCode): CitationStatus {
    const c = CASES[caseKey];
    const posture = JURISDICTIONS[jur].posture;
    if (posture === "hostile" && c.jurisdiction === jur) return "blocked";
    return c.jurisdiction === jur ? "binding" : "persuasive";
  }

  const jurisdictionData = JURISDICTIONS[jurisdiction];
  const queueItems: ReviewQueueItem[] = Object.entries(review).map(([key, verdict]) => ({
    key,
    label: CASES[key].caseName,
    verdict,
  }));
  const reviewedCount = Object.keys(review).length;

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <span className="dot" aria-hidden="true" /> PROTOTYPE · NOT LEGAL ADVICE
        </div>
        <h1>Precedent Check</h1>
        <p className="thesis">
          An LLM drafts a contract clause and picks its own citations. This is the verification
          layer that sits downstream of it, before anything reaches a real document.
        </p>

        <ol className="mentalmap">
          <li>
            <span className="mm-n">1</span> The <b>LLM</b> drafts the clause and its citations
          </li>
          <li>
            <span className="mm-n">2</span> Each citation is checked against real law
          </li>
          <li>
            <span className="mm-n">3</span> A <b>human</b> accepts or flags every one
          </li>
        </ol>
      </header>

      <section className="single-plate">
        <div className="step-label">STEP 1 · THE LLM DRAFTS</div>

        <div className="controls">
          <div className="field">
            <label htmlFor="jurisdiction">Governing law of the contract</label>
            <select
              id="jurisdiction"
              className="jurisdiction-select"
              value={jurisdiction}
              onChange={(e) => {
                setJurisdiction(e.target.value as JurisdictionCode);
                announce(`Governing law changed to ${JURISDICTIONS[e.target.value].name}`);
              }}
            >
              {Object.values(JURISDICTIONS).map((j) => (
                <option key={j.code} value={j.code}>
                  {j.name} ({j.code})
                </option>
              ))}
            </select>
          </div>
          <p className="field-note">Set this first. Citations re-score live against whatever you pick.</p>
        </div>

        {jurisdictionData.posture === "hostile" && (
          <StatusBanner flag="Clause blocked">
            {jurisdictionData.name}: <code>{jurisdictionData.basis}</code>. Citations can still be
            real case law, but the covenant itself is likely unenforceable as drafted.
          </StatusBanner>
        )}

        <div className="draft-gate">
          {!drafting && (
            <p className="hood-note" style={{ marginBottom: 16 }}>
              Click below to watch an LLM draft the clause: it retrieves candidate case law, ranks
              it, writes the clause, then checks its own citations before handing off to you.
              <b> Simulated sequence.</b> No live model call runs in this static build. The point
              is the interaction pattern for reviewing what a real one would produce.
            </p>
          )}
          <AgentTrace
            steps={US_AGENT_STEPS}
            onAnnounce={announce}
            onStepStart={(key) => {
              setDrafting(true);
              if (key === "draft") setDraftVisible(true);
            }}
            onComplete={() => announce("Draft ready for your review.")}
          />

          {draftVisible && (
            <div className="doc">
              <div className="draftmeta">LLM output · Employment Agreement · §8 Restrictive Covenants · unreviewed</div>
              <p>
                During the term of Employee&rsquo;s employment and for a period of twelve (12)
                months following termination for any reason, Employee shall not, directly or
                indirectly, own, manage, operate, or provide services to any business that
                competes with the Company within the Territory. Employee acknowledges that this
                restriction is reasonable in duration and scope and is necessary to protect the
                Company&rsquo;s confidential client relationships and goodwill{" "}
                {CITED_KEYS.map((key, i) => {
                  const c = CASES[key];
                  const status = statusOf(key, jurisdiction);
                  return (
                    <CiteChip
                      key={key}
                      label={c.caseName.length > 30 ? c.caseName.slice(0, 27) + "…" : c.caseName}
                      status={status}
                      index={i + 1}
                      pressed={openKey === key}
                      onClick={() => {
                        setOpenKey(key);
                        announce(`${c.caseName}: ${status}`);
                      }}
                      ariaLabel={`${c.caseName}, ${status}, open exhibit`}
                    />
                  );
                })}
                . <span className="doc-hint">Click a citation above to check it.</span>
              </p>
            </div>
          )}
        </div>

        {openKey && (
          <div className="exhibit-inline">
            <div className="step-label" style={{ marginTop: 24 }}>
              STEP 2 · YOU VERIFY
            </div>
            {(() => {
              const key = openKey;
              const c = CASES[key];
              const status = statusOf(key, jurisdiction);
              const statusLabel =
                status === "binding"
                  ? "Binding, same jurisdiction"
                  : status === "blocked"
                    ? "Binding, but the doctrine defeats the clause"
                    : "Persuasive only, jurisdiction mismatch";
              const reasoning =
                status === "binding"
                  ? `Decided by a ${c.jurisdiction} court. Contract's governing law is also ${jurisdiction}. Same-jurisdiction match → controlling authority, subject to counsel review of the facts.`
                  : status === "blocked"
                    ? `Decided in ${c.jurisdiction}, but ${jurisdiction} law is hostile to this clause type. Being binding doesn't help. The statute cuts against the covenant.`
                    : `Decided by a ${c.jurisdiction} court; the contract is governed by ${jurisdiction} law. Persuasive reasoning at best, not controlling authority here.`;
              const chainTarget = CITATION_CHAIN[key];
              const altKey = status !== "binding" ? findSameJurisdictionAlternative(jurisdiction, CITED_KEYS) : undefined;

              return (
                <ExhibitCard
                  status={status}
                  statusLabel={statusLabel}
                  title={c.caseName}
                  meta={
                    <>
                      {c.court} · decided {c.dateFiled} · {c.citation} ·{" "}
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        view on CourtListener
                      </a>
                    </>
                  }
                  quote={c.snippet}
                  figcaption="Verbatim excerpt, public-domain opinion text."
                  verdict={review[key]}
                  onAccept={() => {
                    setReview((r) => ({ ...r, [key]: "accepted" }));
                    announce(`${c.caseName} accepted`);
                  }}
                  onFlag={() => {
                    setReview((r) => ({ ...r, [key]: "flagged" }));
                    announce(`${c.caseName} flagged for counsel`);
                  }}
                >
                  <div className="reasoning">
                    <b>Why this status:</b> {reasoning}
                  </div>
                  {chainTarget && (
                    <div className="chain">
                      Confirmed precedent chain: <b>{c.caseName}</b>
                      <span className="arrow">{"→ cites →"}</span>
                      <b>{CASES[chainTarget].caseName}</b> ({CASES[chainTarget].dateFiled})
                    </div>
                  )}
                  {altKey && (
                    <div className="suggestion">
                      <b>Same-jurisdiction authority available:</b> {altKey.caseName} ({altKey.citation}), not currently cited.
                    </div>
                  )}
                </ExhibitCard>
              );
            })()}
          </div>
        )}

        {reviewedCount > 0 && (
          <div className="queue-inline">
            <div className="step-label">STEP 3 · YOU DECIDE ({reviewedCount}/{CITED_KEYS.length} reviewed)</div>
            <ReviewQueue items={queueItems} />
          </div>
        )}
      </section>

      <footer>
        <details className="hood">
          <summary>
            How this was verified <span className="toggle">real Neo4j graph, real Cypher</span>
          </summary>
          <div className="hood-body">
            <UnderTheHood
              queries={US_QUERIES}
              note="These three queries ran for real, against real case data, in a local Neo4j 5 instance. At eight cases this is provable in a spreadsheet. The reason to model it as a graph shows up at scale: verifying a citation is a walk (case to jurisdiction to does it match governing law), and a real 'is this still good law' check is N hops of CITES/OVERRULED_BY edges."
            />
          </div>
        </details>
        <p style={{ marginTop: 18 }}>
          8 real opinions from the CourtListener API (Free Law Project), public-domain text. The
          BDO Seidman {"→"} Karpinski citation chain was confirmed from the opinion's own
          citation data. Component set documented in Storybook (<code>npm run storybook</code>).
          Interaction-design prototype, not a production legal tool. Nothing here is legal
          advice.
        </p>
      </footer>

      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </div>
  );
}
