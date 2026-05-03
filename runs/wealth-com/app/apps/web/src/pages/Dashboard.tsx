import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listHouseholds } from "../lib/api.js";

export function DashboardPage() {
  const q = useQuery({
    queryKey: ["households"],
    queryFn: listHouseholds,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Households</h1>
      {q.isLoading && <div className="text-compass-500">Loading…</div>}
      {q.isError && <div className="text-red-600">Error loading households</div>}
      {q.data && (
        <div className="space-y-2">
          {q.data.households.map((h) => (
            <Link key={h.id} to={`/households/${h.id}`} className="ec-card block hover:border-accent-500">
              <div className="font-medium">{h.display_name}</div>
              <div className="text-xs text-compass-500">
                {h.primary_residence_state ?? "—"} · created {new Date(h.created_at).toLocaleDateString()}
              </div>
            </Link>
          ))}
          {q.data.households.length === 0 && (
            <div className="text-compass-500 text-sm">No households in this tenant.</div>
          )}
        </div>
      )}
    </div>
  );
}
