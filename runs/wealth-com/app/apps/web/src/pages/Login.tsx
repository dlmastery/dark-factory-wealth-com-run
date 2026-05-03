import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../lib/api.js";

export function LoginPage() {
  const nav = useNavigate();
  const [tenant_slug, setTenantSlug] = useState("acme-ria");
  const [email, setEmail] = useState("advisor@acme-ria.demo");
  const [password, setPassword] = useState("synthetic");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password, tenant_slug);
      setToken(result.access_token);
      nav("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 ec-card">
      <h1 className="text-xl font-semibold mb-2">Sign in</h1>
      <p className="text-sm text-compass-500 mb-4">Synthetic-data demo only.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Tenant slug</span>
          <input className="ec-input" value={tenant_slug} onChange={(e) => setTenantSlug(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="ec-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label className="block">
          <span className="text-sm">Password</span>
          <input className="ec-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="ec-btn w-full justify-center" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-compass-500">
          Demo seed: <code>advisor@acme-ria.demo</code> / any password (when DEV_ALLOW_SYNTHETIC_LOGIN=1).
        </p>
      </form>
    </div>
  );
}
