import type { ReviewVerdict } from "../types";

export interface ReviewQueueItem {
  key: string;
  label: string;
  verdict: ReviewVerdict;
}

interface ReviewQueueProps {
  items: ReviewQueueItem[];
  emptyLabel?: string;
}

/** The attorney sign-off list — the human-in-the-loop gate, mirrored from Hydra's Review Gatekeeper pattern. */
export function ReviewQueue({ items, emptyLabel = "No citations reviewed yet." }: ReviewQueueProps) {
  if (items.length === 0) {
    return <p className="queue-empty">{emptyLabel}</p>;
  }
  return (
    <ul className="queue-list">
      {items.map((item) => (
        <li key={item.key}>
          <span className="qc">{item.label}</span>
          <span
            className="qs"
            style={{ color: item.verdict === "accepted" ? "var(--binding)" : "var(--blocked)" }}
          >
            {item.verdict === "accepted" ? "Accepted" : "Flagged"}
          </span>
        </li>
      ))}
    </ul>
  );
}
