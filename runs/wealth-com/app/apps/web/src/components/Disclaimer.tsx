/**
 * Disclaimer — FR-UI-DISCLAIMER-001 from spec-decomposition.
 * Renders on every advisor screen per HD-007 + ADR-003 UPL boundary.
 */

export function Disclaimer() {
  return (
    <div className="ec-disclaimer">
      EstateCompass produces educational drafts and informational summaries.
      An attorney of record must review all documents before execution.
      EstateCompass is not a law firm and does not provide legal or tax advice.
    </div>
  );
}
