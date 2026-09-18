import type { CitationStatus } from "../types";

export interface CiteChipProps {
  label: string;
  status: CitationStatus;
  index?: number;
  pressed?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

const STATUS_TEXT: Record<CitationStatus, string> = {
  binding: "binding",
  persuasive: "persuasive only",
  blocked: "void doctrine",
};

/** A single citation, colour- and text-coded by verification status. Never relies on colour alone. */
export function CiteChip({ label, status, index, pressed, onClick, ariaLabel }: CiteChipProps) {
  return (
    <button
      type="button"
      className={`cite-chip status-${status}`}
      aria-pressed={pressed ?? false}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className="swatch" aria-hidden="true" />
      {index !== undefined && <span className="n">[{index}]</span>}
      {label} {"—"} {STATUS_TEXT[status]}
    </button>
  );
}
