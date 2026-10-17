
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import Sidebar from "./Sidebar";

const pageInfo = {
  "/": {
    title: "Dashboard",
    eyebrow: "YOUR OVERVIEW",
  },
  "/explore": {
    title: "Explore products",
    eyebrow: "FIND YOUR NEXT PURCHASE",
  },
  "/compare": {
    title: "Compare products",
    eyebrow: "WEIGH YOUR OPTIONS",
  },
  "/list": {
    title: "My wishlist",
    eyebrow: "SAVED FOR LATER",
  },
  "/evaluations": {
    title: "Purchase evaluations",
    eyebrow: "MAKE YOUR DECISION",
  },
  "/history": {
    title: "Decision history",
    eyebrow: "YOUR PAST DECISIONS",
  },
  "/settings": {
    title: "Settings",
    eyebrow: "MAKE IT YOURS",
  },
};

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = pageInfo[location.pathname] || {
    title: "Buy or Bye",
    eyebrow: "YOUR SHOPPING SPACE",
  };

  return (
    <div className="app-shell">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-controls="app-sidebar"
              aria-expanded={menuOpen}
            >
              <Menu size={21} />
            </button>

            <div className="topbar-heading">
              <span className="topbar-eyebrow">
                {currentPage.eyebrow}
              </span>

              <h1>{currentPage.title}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="button button-primary topbar-add"
              onClick={() => navigate("/explore")}
            >
              <Plus size={17} />
              <span>Find a product</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span className="footer-brand">buy or bye</span>
          <span>Thoughtful purchases start here.</span>
        </footer>
      </div>
    </div>
  );
}