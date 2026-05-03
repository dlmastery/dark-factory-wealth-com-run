import { Route, Routes, Link, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login.js";
import { DashboardPage } from "./pages/Dashboard.js";
import { HouseholdDetailPage } from "./pages/HouseholdDetail.js";
import { ScenarioPage } from "./pages/Scenario.js";
import { Disclaimer } from "./components/Disclaimer.js";
import { getToken, clearToken } from "./lib/api.js";

function NavBar() {
  const authed = !!getToken();
  return (
    <nav className="bg-compass-900 text-compass-50 px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-semibold tracking-tight">
          EstateCompass
        </Link>
        <span className="text-xs text-compass-100/60">Advisor Workbench · Demo MVP</span>
      </div>
      {authed && (
        <button
          className="text-xs text-compass-100/80 hover:text-white"
          onClick={() => {
            clearToken();
            window.location.href = "/login";
          }}
        >
          Sign out
        </button>
      )}
    </nav>
  );
}

function Protected({ children }: { children: JSX.Element }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Disclaimer />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/households/:id" element={<Protected><HouseholdDetailPage /></Protected>} />
          <Route path="/households/:id/scenario" element={<Protected><ScenarioPage /></Protected>} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-compass-500 py-3 border-t border-compass-100">
        EstateCompass v0 demo. Synthetic data only. Not legal or tax advice.
      </footer>
    </div>
  );
}
