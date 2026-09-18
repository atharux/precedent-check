import { useState } from "react";
import { Plate } from "./components/Plate";
import { CiteChip } from "./components/CiteChip";
import { StatusBanner } from "./components/StatusBanner";
import { ExhibitCard } from "./components/ExhibitCard";
import { ReviewQueue, type ReviewQueueItem } from "./components/ReviewQueue";
import { AgentTrace } from "./components/AgentTrace";
import { UnderTheHood } from "./components/UnderTheHood";
import { ComponentCatalog } from "./components/ComponentCatalog";
import { JURISDICTIONS, CASES, CITED_KEYS, CITATION_CHAIN, US_QUERIES } from "./data/us";
import { DE_CATEGORIES, DE_CASES, DE_QUERIES } from "./data/de";
import { US_AGENT_STEPS, DE_AGENT_STEPS } from "./data/agent";
import type { CitationStatus, ReviewVerdict, JurisdictionCode } from "./types";

type Mode = "us" | "de";

function findSameJurisdictionAlternative(jur: JurisdictionCode, exclude: string[]) {
  return Object.values(CASES).find((c) => c.jurisdiction === jur && !exclude.includes(c.key));
}

export default function App() {
  const [mode, setMode] = useState<Mode>("us");
  const [liveMessage, setLiveMessage] = useState("");

  // ---- US state ----
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>("NY");
  const [usOpenKey, setUsOpenKey] = useState<string | null>(null);
  const [usReview, setUsReview] = useState<Record<string, ReviewVerdict>>({});

  // ---- DE state ----
  const [category, setCategory] = useState("voll_beherrschbares_risiko");
  const [deOpenKey, setDeOpenKey] = useState<string | null>(null);
  const [deReview, setDeReview] = useState<Record<string, ReviewVerdict>>({});

  const announce = (msg: string) => setLiveMessage(msg);

  function usStatus(caseKey: string, jur: JurisdictionCode): CitationStatus {
    const c = CASES[caseKey];
    const posture = JURISDICTIONS[jur].posture;
    if (posture === "hostile" && c.jurisdiction === jur) return "blocked";
    return c.jurisdiction === jur ? "binding" : "persuasive";
  }

  const jurisdictionData = JURISDICTIONS[jurisdiction];
  const categoryData = DE_CATEGORIES[category];
  const deMatches = Object.values(DE_CASES).filter((c) => c.category === category);

  const usQueueItems: ReviewQueueItem[] = Object.entries(usReview).map(([key, verdict]) => ({
    key,
    label: CASES[key].caseName,
    verdict,
  }));
  const deQueueItems: ReviewQueueItem[] = Object.entries(deReview).map(([key, verdict]) => ({
    key,
    label: `${DE_CATEGORIES[key].paragraph} — ${DE_CATEGORIES[key].name}`,
    verdict,
  }));

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <span className="dot" aria-hidden="true" /> PROTOTYPE — NOT LEGAL ADVICE
        </div>
        <h1>Precedent Check</h1>
        <p className="thesis">
          An AI drafting tool cites a case or statute to justify a clause. Before that citation
          reaches a real document, it has to survive one question: <em>does it actually hold up
          where the document will be used</em>? Two legal systems, one verification engine.
        </p>

        <div className="controls" role="tablist" aria-label="Legal system">
          <button
            type="button"
            className="act"
            aria-pressed={mode === "us"}
            style={mode === "us" ? { borderColor: "var(--binding)", color: "var(--binding)" } : undefined}
            onClick={() => setMode("us")}
          >
            US · Non-Compete
          </button>
          <button
            type="button"
            className="act"
            aria-pressed={mode === "de"}
            style={mode === "de" ? { borderColor: "var(--binding)", color: "var(--binding)" } : undefined}
            onClick={() => setMode("de")}
          >
            DE · Arzthaftung (§630h BGB)
          </button>
        </div>

        {mode === "us" && (
          <div className="controls" style={{ marginTop: 10 }}>
            <div className="field">
              <label htmlFor="jurisdiction">Governing law of the contract</label>
              <select
                id="jurisdiction"
                className="jurisdiction-select"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as JurisdictionCode)}
              >
                {Object.values(JURISDICTIONS).map((j) => (
                  <option key={j.code} value={j.code}>
                    {j.name} ({j.code})
                  </option>
                ))}
              </select>
            </div>
            <p className="field-note">Verification recomputes live — not a fixed label baked into the draft.</p>
          </div>
        )}
        {mode === "de" && (
          <div className="controls" style={{ marginTop: 10 }}>
            <div className="field">
              <label htmlFor="category">Error category (§630h BGB, Abs. 1–5)</label>
              <select id="category" className="jurisdiction-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.values(DE_CATEGORIES).map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.paragraph} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="field-note">Switch the category to see which paragraph — and which real cases — apply.</p>
          </div>
        )}

        {mode === "us" && jurisdictionData.posture === "hostile" && (
          <StatusBanner flag="Clause blocked">
            Governing law is {jurisdictionData.name} — <code>{jurisdictionData.basis}</code>. The
            citations below can still be binding or persuasive as case law, but the covenant itself
            is likely unenforceable as drafted, independent of which cases support it.
          </StatusBanner>
        )}
        {mode === "de" && deMatches.length === 0 && (
          <StatusBanner flag="Gap flagged">
            {categoryData.paragraph} is the category that most directly covers this incident. The
            statute text is real and current. <b>No confirmed published German case matching this
            category was found in this corpus</b> — that gap is shown, not hidden.
          </StatusBanner>
        )}
      </header>

      <Plate number="00" label="Agent Trace" title="Watch the Drafting Agent Run" titleId="p0-title" className="full-bleed">
        <p className="hood-note">
          The plates below show a citation being <em>judged</em>. This is the step before that: the
          agent that <em>produced</em> the draft and its candidate citations, made legible while it
          runs. <b>Simulated sequence</b> — no live model call executes in this static build; a
          real version would call an LLM through a backend. The point is the interaction pattern,
          not the model.
        </p>
        <AgentTrace
          key={mode}
          steps={mode === "us" ? US_AGENT_STEPS : DE_AGENT_STEPS}
          onAnnounce={announce}
        />
      </Plate>

      <div className="stage">
        <Plate number="01" label="THE DRAFT" title={mode === "us" ? "Restrictive Covenant — Draft Clause" : "Illustrative Incident File"} titleId="p1-title">
          {mode === "us" ? (
            <>
              <div className="doc">
                <div className="draftmeta">Employment Agreement · §8 Restrictive Covenants · AI-drafted, unreviewed</div>
                <p>
                  During the term of Employee&rsquo;s employment and for a period of twelve (12)
                  months following termination for any reason, Employee shall not, directly or
                  indirectly, own, manage, operate, or provide services to any business that
                  competes with the Company within the Territory. Employee acknowledges that this
                  restriction is reasonable in duration and scope and is necessary to protect the
                  Company&rsquo;s confidential client relationships and goodwill{" "}
                  {CITED_KEYS.map((key, i) => {
                    const c = CASES[key];
                    const status = usStatus(key, jurisdiction);
                    return (
                      <CiteChip
                        key={key}
                        label={c.caseName.length > 30 ? c.caseName.slice(0, 27) + "…" : c.caseName}
                        status={status}
                        index={i + 1}
                        pressed={usOpenKey === key}
                        onClick={() => {
                          setUsOpenKey(key);
                          announce(`${c.caseName}: ${status}`);
                        }}
                        ariaLabel={`${c.caseName}, ${status}, open exhibit`}
                      />
                    );
                  })}
                  .
                </p>
                <p>
                  The parties agree that if any portion of this covenant is found unenforceable,
                  the remainder shall be given effect to the fullest extent permitted by the
                  governing law selected above.
                </p>
              </div>
              <div className="legend" aria-hidden="true">
                <span className="legend-item">
                  <span className="swatch" style={{ background: "var(--binding)" }} /> Binding in selected jurisdiction
                </span>
                <span className="legend-item">
                  <span className="swatch" style={{ background: "var(--persuasive)" }} /> Real precedent, wrong jurisdiction
                </span>
                <span className="legend-item">
                  <span className="swatch" style={{ background: "var(--blocked)" }} /> Governing-law doctrine defeats the clause
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="doc">
                <div className="draftmeta">Illustrative File · Generic Hypothetical · Not a Real Person</div>
                <p>
                  Patient A&rsquo;s blood sample is mislabeled during a busy shift and processed
                  under Patient B&rsquo;s chart. The lab report attached to Patient A&rsquo;s file
                  reflects Patient B&rsquo;s results, and the discrepancy is not caught until a
                  follow-up test is ordered.{" "}
                  <CiteChip
                    label={`${categoryData.paragraph} — ${categoryData.name}`}
                    status={deMatches.length ? "binding" : "persuasive"}
                    pressed={deOpenKey === category}
                    onClick={() => {
                      setDeOpenKey(category);
                      announce(`${categoryData.name}: ${deMatches.length ? "confirmed case in corpus" : "no matching case"}`);
                    }}
                  />
                </p>
                <p>
                  This file is deliberately generic: it exists to test one error category against
                  real German statute text and real published decisions, not to describe or
                  represent any specific real event.
                </p>
              </div>
              <div className="legend" aria-hidden="true">
                <span className="legend-item">
                  <span className="swatch" style={{ background: "var(--binding)" }} /> Confirmed case in this category
                </span>
                <span className="legend-item">
                  <span className="swatch" style={{ background: "var(--persuasive)" }} /> Statute confirmed, no matching case found
                </span>
              </div>
            </>
          )}
        </Plate>

        <Plate number="02" label="THE EXHIBIT" title="Citation Under Review" titleId="p2-title">
          {mode === "us" ? (
            usOpenKey ? (
              (() => {
                const key = usOpenKey;
                const c = CASES[key];
                const status = usStatus(key, jurisdiction);
                const statusLabel =
                  status === "binding"
                    ? "Binding — same jurisdiction"
                    : status === "blocked"
                      ? "Binding, but the doctrine defeats the clause"
                      : "Persuasive only — jurisdiction mismatch";
                const reasoning =
                  status === "binding"
                    ? `Decided by a ${c.jurisdiction} court. Contract's governing law is also ${jurisdiction}. Same-jurisdiction match → treat as controlling authority, subject to counsel review of the facts.`
                    : status === "blocked"
                      ? `Decided in ${c.jurisdiction} and the contract is governed by ${jurisdiction} law, which is hostile to this clause type. Being binding doesn't help — the statute this jurisdiction relies on cuts against the covenant.`
                      : `Decided by a ${c.jurisdiction} court; the contract is governed by ${jurisdiction} law. Not the same jurisdiction → persuasive reasoning at best, not controlling authority here.`;
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
                        <br />
                        Cited {c.timesCitedOverall}× across all US case law (CourtListener citeCount)
                      </>
                    }
                    quote={c.snippet}
                    figcaption="Verbatim excerpt, public-domain opinion text."
                    verdict={usReview[key]}
                    onAccept={() => {
                      setUsReview((r) => ({ ...r, [key]: "accepted" }));
                      announce(`${c.caseName} accepted`);
                    }}
                    onFlag={() => {
                      setUsReview((r) => ({ ...r, [key]: "flagged" }));
                      announce(`${c.caseName} flagged for counsel`);
                    }}
                  >
                    <div className="reasoning">
                      <b>Why this status:</b> {reasoning}
                    </div>
                    {chainTarget && (
                      <div className="chain">
                        Precedent chain (confirmed via CourtListener citation data): <b>{c.caseName}</b>
                        <span className="arrow">{"→ cites →"}</span>
                        <b>{CASES[chainTarget].caseName}</b> ({CASES[chainTarget].court}, {CASES[chainTarget].dateFiled})
                      </div>
                    )}
                    {altKey && (
                      <div className="suggestion">
                        <b>Same-jurisdiction authority available in corpus:</b> {altKey.caseName} (
                        {altKey.citation}, {altKey.court}, {altKey.dateFiled}) — not currently cited.
                      </div>
                    )}
                  </ExhibitCard>
                );
              })()
            ) : (
              <p className="exhibit-empty">
                Select a citation in the draft to open its exhibit — court, date, real excerpt, and
                why it was scored the way it was.
              </p>
            )
          ) : deOpenKey ? (
            <ExhibitCard
              status={deMatches.length ? "binding" : "persuasive"}
              statusLabel={deMatches.length ? `${deMatches.length} confirmed case(s) in this corpus` : "Statute confirmed — no matching case"}
              title={`${categoryData.paragraph} — ${categoryData.name}`}
              meta={
                <>
                  Patientenrechtegesetz (BGB) · current consolidated text ·{" "}
                  <a href="https://www.gesetze-im-internet.de/bgb/__630h.html" target="_blank" rel="noopener noreferrer">
                    gesetze-im-internet.de
                  </a>
                </>
              }
              quote={categoryData.statute}
              figcaption="Verbatim statute text, official federal law portal."
              acceptLabel="Accept category mapping"
              verdict={deReview[category]}
              onAccept={() => {
                setDeReview((r) => ({ ...r, [category]: "accepted" }));
                announce(`${categoryData.name} accepted`);
              }}
              onFlag={() => {
                setDeReview((r) => ({ ...r, [category]: "flagged" }));
                announce(`${categoryData.name} flagged for counsel`);
              }}
            >
              <div className="reasoning">
                <b>Why this category:</b> {categoryData.note}
              </div>
              {deMatches.length === 0 ? (
                <div className="reasoning">
                  <b>Honest gap, not a bug:</b> statute text for {categoryData.paragraph} is real and
                  current. Search did not surface a confirmed published German decision squarely on
                  this category — shown as a gap rather than an invented citation.
                </div>
              ) : (
                deMatches.map((c) => (
                  <div key={c.key} className="reasoning">
                    <span className={`status-line ${c.confidence === "primary" ? "binding" : "persuasive"}`}>
                      {c.confidence === "primary" ? "Primary source" : "Secondary-confirmed only"}
                    </span>
                    <div style={{ marginTop: 8 }}>
                      <b>{c.caseName}</b> — {c.court}, decided {c.dateFiled}, {c.citation}
                    </div>
                    <blockquote>&ldquo;{c.snippet}&rdquo;</blockquote>
                  </div>
                ))
              )}
            </ExhibitCard>
          ) : (
            <p className="exhibit-empty">
              Select the category above to open its exhibit — statute text, real cases, and any
              confirmed gap.
            </p>
          )}
        </Plate>
      </div>

      <Plate number="03" label="REVIEW QUEUE" title="Human Sign-off" titleId="p3-title" className="full-bleed">
        <p className="hood-note" style={{ marginTop: -6 }}>
          Nothing above is treated as final until a human accepts or flags it here — the same
          gate as Hydra&rsquo;s Review Gatekeeper step, applied to citations instead of job
          applications.
        </p>
        <ReviewQueue items={mode === "us" ? usQueueItems : deQueueItems} />
      </Plate>

      <Plate number="04" label="COMPONENT CATALOG" title="This Demo's Component Set" titleId="p4-title" className="full-bleed">
        <p className="hood-note">
          Every visual state used above, enumerated once. Organized this way so it maps directly
          onto Storybook stories (see <code>.storybook/</code> in the repo) rather than living only
          as implicit states scattered across screens.
        </p>
        <ComponentCatalog />
      </Plate>

      <Plate number="05" label="UNDER THE HOOD" title="Real Cypher, Real Output" titleId="p5-title" className="full-bleed">
        <UnderTheHood
          queries={mode === "us" ? US_QUERIES : DE_QUERIES}
          note={
            mode === "us"
              ? "At eight cases, this is provable in a spreadsheet. The reason to model citations as a graph shows up at scale: verifying one citation is a walk — case → jurisdiction → does that match the contract's governing law; a real “is this still good law” check is N hops of CITES/OVERRULED_BY/DISTINGUISHED_BY edges. These queries ran for real, against real case data, in a local Neo4j 5 instance."
              : "Both graphs ran for real in a local Neo4j 5 instance. This graph is real BGB statute sections and two real, currently-good-law German court decisions. One query below returns an empty result on purpose — the honest output of asking whether a confirmed case exists for a category, when the corpus doesn't have one."
          }
        />
      </Plate>

      <footer>
        <p>
          <strong>US data provenance</strong> — all 8 cases are real opinions pulled live from the
          CourtListener REST API (Free Law Project), public-domain court text. The one CITES edge
          (BDO Seidman {"→"} Karpinski) was confirmed from the opinion&rsquo;s own citation data.
        </p>
        <p>
          <strong>DE data provenance</strong> — §630h BGB text pulled live from the official
          federal law portal, gesetze-im-internet.de. OLG Köln 5 U 69/24 pulled from the official
          NRW court-decisions portal (primary source). BGH VI ZR 108/23 confirmed via a legal
          case-law index and secondary commentary, not the primary court document server — flagged
          rather than hidden.
        </p>
        <p>
          <strong>Scope</strong> — this is an interaction-design prototype, not a production legal
          tool or filing system. The illustrative incident file above is invented and generic; it
          does not describe or represent any real person&rsquo;s case. Nothing on this page is legal
          advice.
        </p>
      </footer>

      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>
    </div>
  );
}
