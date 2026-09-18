import type { ReactNode } from "react";

interface PlateProps {
  number: string;
  label: string;
  title: string;
  titleId: string;
  children: ReactNode;
  className?: string;
}

/** The recurring numbered-plate wrapper used across the demo — lightMuseum lineage. */
export function Plate({ number, label, title, titleId, children, className }: PlateProps) {
  return (
    <section className={`plate ${className ?? ""}`} aria-labelledby={titleId}>
      <div className="plate-no">
        <span>PLATE {number}</span>
        <span className="rule" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <h2 className="plate-title" id={titleId}>
        {title}
      </h2>
      {children}
    </section>
  );
}
