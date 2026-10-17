
import { Route, Routes, Navigate } from "react-router-dom";
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
      {/* Dashboard at the main website URL */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="list" element={<WishlistPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Keep old /app links working */}
      <Route path="/app" element={<Navigate to="/" replace />} />
      <Route path="/app/*" element={<Navigate to="/" replace />} />

      {/* Redirect unknown URLs to the homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}