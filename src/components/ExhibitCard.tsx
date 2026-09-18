import type { ReactNode } from "react";
import type { CitationStatus, ReviewVerdict } from "../types";

interface ExhibitCardProps {
  status: CitationStatus;
  statusLabel: string;
  title: string;
  meta: ReactNode;
  quote: string;
  figcaption: string;
  children?: ReactNode;
  verdict?: ReviewVerdict;
  acceptLabel?: string;
  onAccept?: () => void;
  onFlag?: () => void;
}

/** The right-hand "exhibit" plate: a case or statute under review, with its verification reasoning and a human sign-off gate. */
export function ExhibitCard({
  status,
  statusLabel,
  title,
  meta,
  quote,
  figcaption,
  children,
  verdict,
  acceptLabel = "Accept citation",
  onAccept,
  onFlag,
}: ExhibitCardProps) {
  return (
    <div className="exhibit-card">
      <span className={`status-line ${status}`}>{statusLabel}</span>
      <h4>{title}</h4>
      <div className="exhibit-meta">{meta}</div>
      <blockquote>&ldquo;{quote}&rdquo;</blockquote>
      <div className="figcaption">{figcaption}</div>
      {children}
      {verdict ? (
        <div className={`decided-tag ${verdict}`}>
          {verdict === "accepted" ? "✓ Accepted by reviewer" : "⚠ Flagged for counsel"}
        </div>
      ) : (
        <div className="actions">
          <button type="button" className="act accept" onClick={onAccept}>
            {acceptLabel}
          </button>
          <button type="button" className="act flag" onClick={onFlag}>
            Flag for counsel
          </button>
        </div>
      )}
    </div>
  );
}
