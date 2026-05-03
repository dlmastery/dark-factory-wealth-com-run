import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getHousehold, getTaxBaseline } from "../lib/api.js";

function fmtCurrency(s: string): string {
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function HouseholdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const householdQ = useQuery({
    queryKey: ["household", id],
    queryFn: () => getHousehold(id!),
    enabled: !!id,
  });
  const taxQ = useQuery({
    queryKey: ["tax-baseline", id],
    queryFn: () => getTaxBaseline(id!),
    enabled: !!id,
  });

  if (householdQ.isLoading) return <div>Loading…</div>;
  if (householdQ.isError || !householdQ.data) return <div className="text-red-600">Not found</div>;
  const { household, persons, entities, assets, gross_estate } = householdQ.data;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{household.display_name}</h1>
        <div className="text-xs text-compass-500">{household.primary_residence_state ?? "—"}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="ec-card">
          <h2 className="font-medium mb-2">People</h2>
          <ul className="text-sm divide-y divide-compass-100">
            {persons.map((p) => (
              <li key={p.id} className="py-1.5 flex justify-between">
                <span>{p.full_name}</span>
                <span className="text-xs text-compass-500">{p.relationship_to_primary}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ec-card">
          <h2 className="font-medium mb-2">Entities</h2>
          <ul className="text-sm divide-y divide-compass-100">
            {entities.map((e) => (
              <li key={e.id} className="py-1.5">
                <div>{e.name}</div>
                <div className="text-xs text-compass-500">{e.entity_type} · {e.jurisdiction ?? "—"}</div>
              </li>
            ))}
            {entities.length === 0 && <li className="text-compass-500 text-xs">none</li>}
          </ul>
        </div>
      </div>
      <div className="ec-card">
        <div className="flex justify-between items-baseline mb-2">
          <h2 className="font-medium">Assets</h2>
          <div className="text-sm">Gross estate: <span className="font-mono">{fmtCurrency(gross_estate)}</span></div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-compass-500">
            <tr><th className="text-left">Description</th><th className="text-left">Class</th><th className="text-right">FMV</th></tr>
          </thead>
          <tbody className="divide-y divide-compass-100">
            {assets.map((a) => (
              <tr key={a.id}>
                <td>{a.description}</td>
                <td className="text-xs text-compass-500">{a.asset_class}</td>
                <td className="text-right font-mono">{fmtCurrency(a.fair_market_value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ec-card">
        <h2 className="font-medium mb-2">Federal estate tax — OBBBA baseline</h2>
        {taxQ.isLoading && <div className="text-compass-500 text-sm">Calculating…</div>}
        {taxQ.isError && <div className="text-red-600 text-sm">Calc error</div>}
        {taxQ.data && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>Gross estate</div><div className="font-mono text-right">{fmtCurrency(taxQ.data.gross_estate)}</div>
            <div>Available exemption (OBBBA)</div><div className="font-mono text-right">{fmtCurrency(taxQ.data.available_exemption)}</div>
            <div>Taxable estate</div><div className="font-mono text-right">{fmtCurrency(taxQ.data.taxable_estate)}</div>
            <div className="font-medium">Federal estate tax</div>
            <div className="font-mono text-right font-medium">{fmtCurrency(taxQ.data.federal_estate_tax)}</div>
            <div className="col-span-2 text-xs text-compass-500 mt-1">
              Rule {taxQ.data.rule_id} · {taxQ.data.computation_version}
            </div>
          </div>
        )}
      </div>
      <div>
        <Link to={`/households/${id}/scenario`} className="ec-btn">
          Run GRAT vs do-nothing scenario →
        </Link>
      </div>
    </div>
  );
}
