import { CiteChip } from "./CiteChip";
import { StatusBanner } from "./StatusBanner";

/**
 * The demo's own component set, laid out the way it would hand off to a
 * design system doc site or Storybook (see .storybook/ for the real thing).
 * Every visual state used elsewhere in the app is enumerated here once,
 * rather than left implicit in whichever screen happens to trigger it.
 */
export function ComponentCatalog() {
  return (
    <div className="catalog-grid">
      <div className="catalog-item">
        <div className="label">CiteChip — status variants</div>
        <div className="swatch-row">
          <CiteChip label="Case A" status="binding" index={1} />
          <CiteChip label="Case B" status="persuasive" index={2} />
          <CiteChip label="Case C" status="blocked" index={3} />
        </div>
      </div>

      <div className="catalog-item">
        <div className="label">Buttons — primary actions</div>
        <div className="swatch-row">
          <button type="button" className="act accept">
            Accept
          </button>
          <button type="button" className="act flag">
            Flag
          </button>
          <button type="button" className="act">
            Neutral
          </button>
        </div>
      </div>

      <div className="catalog-item">
        <div className="label">Status line — exhibit verdicts</div>
        <div className="swatch-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
          <span className="status-line binding">Binding</span>
          <span className="status-line persuasive">Persuasive only</span>
          <span className="status-line blocked">Void doctrine</span>
        </div>
      </div>

      <div className="catalog-item" style={{ gridColumn: "1 / -1" }}>
        <div className="label">StatusBanner — blocking / gap flag</div>
        <StatusBanner flag="Example flag">This is the banner shell reused for both the US clause-blocked warning and the DE gap-flag warning.</StatusBanner>
      </div>
    </div>
  );
}
