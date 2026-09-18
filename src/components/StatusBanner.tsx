import type { ReactNode } from "react";

interface StatusBannerProps {
  flag: string;
  children: ReactNode;
}

/** A blocking-doctrine or gap-flag banner. Distinct from a citation's own status line. */
export function StatusBanner({ flag, children }: StatusBannerProps) {
  return (
    <div className="banner">
      <span className="flag">{flag}</span>
      <p>{children}</p>
    </div>
  );
}
