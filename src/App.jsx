import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import ComparePage from "./pages/ComparePage";
import WishlistPage from "./pages/WishlistPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="list" element={<WishlistPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/app/*" element={<LegacyAppRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LegacyAppRedirect() {
  const location = useLocation();
  const newPath = location.pathname.replace(/^\/app(?=\/|$)/, "");

  return (
    <Navigate
      to={{ pathname: newPath || "/", search: location.search, hash: location.hash }}
      replace
    />
  );
}