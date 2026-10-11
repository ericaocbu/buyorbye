
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Search, Plus } from "lucide-react";
import Sidebar from "./Sidebar";

const pageTitles = {
  "/app": "Dashboard",
  "/app/explore": "Explore products",
  "/app/compare": "Compare products",
  "/app/list": "My list",
  "/app/evaluations": "Purchase evaluations",
  "/app/history": "Decision history",
  "/app/settings": "Settings",
};

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Buy or Bye";

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div>
              <span className="topbar-eyebrow">YOUR SPACE</span>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="topbar-search"
              onClick={() => {
                window.location.href = "/app/explore";
              }}
            >
              <Search size={17} />
              <span>Find something...</span>
              <kbd>/</kbd>
            </button>

            <button
              className="button button-primary topbar-add"
              onClick={() => {
                window.location.href = "/app/explore";
              }}
            >
              <Plus size={17} />
              <span>Add item</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>buy or bye</span>
          <span>A more thoughtful way to shop.</span>
        </footer>
      </div>
    </div>
  );
}
