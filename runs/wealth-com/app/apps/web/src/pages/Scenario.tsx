import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { runGRATScenario, type GRATScenarioResult } from "../lib/api.js";

function fmtCurrency(s: string): string {
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function ScenarioPage() {
  const { id } = useParams<{ id: string }>();
  const [grat_principal, setPrincipal] = useState("5000000");
  const [section_7520_rate, set7520] = useState("0.052");
  const [projected_growth_rate, setGrowth] = useState("0.08");
  const [term_years, setTerm] = useState(5);
  const [result, setResult] = useState<GRATScenarioResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRun() {
    if (!id) return;
    setRunning(true);
    setError(null);
    try {
      const r = await runGRATScenario(id, {
        grat_principal,
        section_7520_rate,
        projected_growth_rate,
        term_years,
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "scenario failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to={`/households/${id}`} className="text-sm text-compass-500">← back</Link>
        <h1 className="text-xl font-semibold mt-1">GRAT vs do-nothing</h1>
        <p className="text-xs text-compass-500">Educational projection only. Attorney of record must review.</p>
      </div>

      <div className="ec-card grid md:grid-cols-4 gap-3 text-sm">
        <label className="block">
          <span className="text-xs text-compass-500">GRAT principal</span>
          <input className="ec-input" value={grat_principal} onChange={(e) => setPrincipal(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs text-compass-500">§7520 rate</span>
          <input className="ec-input" value={section_7520_rate} onChange={(e) => set7520(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs text-compass-500">Growth rate</span>
          <input className="ec-input" value={projected_growth_rate} onChange={(e) => setGrowth(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-xs text-compass-500">Term (years)</span>
          <input className="ec-input" type="number" value={term_years} onChange={(e) => setTerm(Number(e.target.value))} min={1} max={30} />
        </label>
        <div className="md:col-span-4">
          <button className="ec-btn" onClick={onRun} disabled={running}>
            {running ? "Running…" : "Run scenario"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {result && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="ec-card">
              <h3 className="font-medium mb-2">{result.grat_path.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Estate at term</div><div className="font-mono text-right">{fmtCurrency(result.grat_path.gross_estate_at_term)}</div>
                <div>Federal estate tax</div><div className="font-mono text-right">{fmtCurrency(result.grat_path.federal_estate_tax)}</div>
                <div>Outside estate</div><div className="font-mono text-right">{fmtCurrency(result.grat_path.transferred_to_beneficiaries_outside_estate)}</div>
                <div className="font-medium">Net to beneficiaries</div>
                <div className="font-mono text-right font-medium">{fmtCurrency(result.grat_path.net_to_beneficiaries)}</div>
              </div>
            </div>
            <div className="ec-card">
              <h3 className="font-medium mb-2">{result.do_nothing_path.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Estate at term</div><div className="font-mono text-right">{fmtCurrency(result.do_nothing_path.gross_estate_at_term)}</div>
                <div>Federal estate tax</div><div className="font-mono text-right">{fmtCurrency(result.do_nothing_path.federal_estate_tax)}</div>
                <div>Outside estate</div><div className="font-mono text-right">{fmtCurrency(result.do_nothing_path.transferred_to_beneficiaries_outside_estate)}</div>
                <div className="font-medium">Net to beneficiaries</div>
                <div className="font-mono text-right font-medium">{fmtCurrency(result.do_nothing_path.net_to_beneficiaries)}</div>
              </div>
            </div>
          </div>
          <div className="ec-card">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Tax savings (GRAT - do-nothing)</div>
              <div className="font-mono text-right font-medium">{fmtCurrency(result.tax_savings)}</div>
            </div>
            {result.grat_failed && <div className="text-red-600 text-sm mt-2">GRAT FAILED — annuity exhausted the corpus.</div>}
            {result.notes.length > 0 && (
              <ul className="mt-3 text-xs text-compass-500 space-y-1 list-disc list-inside">
                {result.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
