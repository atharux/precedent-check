# Precedent Check

A citation-verification prototype for AI-drafted legal documents. An AI drafting
tool cites a case or statute to justify a clause; before that citation reaches a
real document, it has to survive one question: **does it actually hold up where
the document will be used** — binding, merely persuasive, or beside the point?

Two legal systems on the same verification engine:

- **US — employment non-competes.** Jurisdiction-dependent enforceability
  across 7 states, backed by 8 real opinions.
- **DE — medical-liability burden of proof (§630h BGB).** Category-dependent
  burden shifting, backed by real statute text and two real German decisions.

## Why this exists

Built as a portfolio piece exploring the interaction design problem at the
center of AI-native legal tooling: verification has to be visible, not
implicit. Three decisions carry the actual point:

1. **Verified vs. unverified is shown, not smoothed over.** The DE mode has a
   real, confirmed gap — several §630h categories have zero confirmed cases in
   this corpus. That's shown as an empty query result and an explicit gap
   card, not filled in with an approximate citation.
2. **Nothing is accepted without a human.** The review-queue gate (Plate 03)
   mirrors a "Review Gatekeeper" pattern used in a 9-agent job-application
   pipeline built previously — applied here to citations instead of
   applications.
3. **The graph, not just the UI, is real.** Both datasets were loaded into an
   actual local Neo4j 5 instance and queried with real Cypher; the outputs
   shown in Plate 05 are copied from that run, not written to look plausible.

## Data provenance

- **US case law** — 8 real opinions pulled live from the [CourtListener REST
  API v4](https://www.courtlistener.com/help/api/rest/) (Free Law Project),
  public-domain court text. Real case names, courts, dates, reporter
  citations, and CourtListener URLs. The one `CITES` edge (BDO Seidman v.
  Hirshberg → Karpinski v. Ingrasci) was confirmed from the citing opinion's
  own citation data, not asserted by hand.
- **DE statute text** — §630a/c/e/f/h BGB, current consolidated text, pulled
  from the official federal law portal,
  [gesetze-im-internet.de](https://www.gesetze-im-internet.de/bgb/__630h.html).
- **DE case law** — OLG Köln 5 U 69/24 (primary source: the official NRW
  court-decisions portal, nrwe.justiz.nrw.de) and BGH VI ZR 108/23
  (secondary-confirmed via a legal case-law index; the primary BGH document
  server did not return the underlying PDF when this was gathered, so that
  entry is flagged as secondary rather than presented as primary).
- The illustrative "incident file" in DE mode is an invented, generic
  lab-sample mix-up scenario — it does not describe, quote, or represent any
  real person's case.

Jurisdiction/statute characterizations are simplified for this demo. Nothing
here is legal advice.

## What each plate demonstrates

| Plate | What it shows |
|---|---|
| 00 — Agent Trace | A simulated retrieve → rank → draft → self-check → escalate sequence, stepped through visibly rather than shown only as a finished result. No live model call executes in this static build — the point is the interaction pattern for an AI copilot's process, not the model. |
| 01 — The Draft | The document (or incident file) the agent's citations are attached to, always labeled "AI-drafted, unreviewed." |
| 02 — The Exhibit | Each citation judged against real source material, with its reasoning shown, not just a verdict. |
| 03 — Review Queue | The human sign-off gate. Nothing above is treated as final until accepted or flagged here. |
| 04 — Component Catalog | The demo's own component set, enumerated once — maps directly onto the Storybook stories below. |
| 05 — Under the Hood | The real Cypher queries and real output, including one query that returns empty on purpose. |

## Stack

React 19 + TypeScript + Vite. No backend, no external network calls at
runtime — all data is embedded and pre-verified. Design tokens follow the
"lightMuseum" house system: warm paper ground, numbered plates, engraved
hairlines, DM Mono + Space Grotesk + Source Serif 4.

## Development

```bash
npm install
npm run dev          # app at localhost:5173
npm run build         # type-check + production build
npm run storybook     # component catalog at localhost:6006
npm run build-storybook
```

Component stories live next to their components (`src/components/*.stories.tsx`).
