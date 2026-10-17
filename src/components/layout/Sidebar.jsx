
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  GitCompareArrows,
  Heart,
  ClipboardCheck,
  History,
  Settings,
  ShoppingBag,
  X,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Explore products",
    path: "/explore",
    icon: Search,
  },
  {
    label: "Compare products",
    path: "/compare",
    icon: GitCompareArrows,
  },
  {
    label: "My wishlist",
    path: "/list",
    icon: Heart,
  },
  {
    label: "Purchase evaluations",
    path: "/evaluations",
    icon: ClipboardCheck,
  },
  {
    label: "Decision history",
    path: "/history",
    icon: History,
  },
];

function getNavLinkClass({ isActive }) {
  return `nav-link ${isActive ? "nav-link-active" : ""}`;
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        id="app-sidebar"
        className={`sidebar ${open ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="brand">
          <div className="brand-icon">
            <ShoppingBag size={21} strokeWidth={1.8} aria-hidden="true" />
          </div>

          <div className="brand-copy">
            <span className="brand-name">
              buy <span>or</span> bye
            </span>
            <span className="brand-tagline">
              Shop with intention.
            </span>
          </div>

          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-workspace-label">
          <span className="sidebar-section-dot" />
          YOUR WORKSPACE
        </div>

        <nav className="nav-list" aria-label="Workspace">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={getNavLinkClass}
            >
              <Icon
                className="nav-link-icon"
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="sidebar-note-icon">
              <Sparkles size={16} aria-hidden="true" />
            </div>

            <p className="sidebar-note-title">
              Pause before you purchase.
            </p>

            <p className="sidebar-note-copy">
              Look for alternatives and compare.
            </p>

            <NavLink
              to="/explore"
              onClick={onClose}
              className="sidebar-note-link"
            >
              Explore products
              <ArrowUpRight size={14} aria-hidden="true" />
            </NavLink>
          </div>

          <div className="sidebar-settings">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={getNavLinkClass}
            >
              <Settings
                className="nav-link-icon"
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Settings</span>
            </NavLink>
          </div>

          <div className="profile-row">
            <div className="avatar" aria-hidden="true">
              Y
            </div>

            <div className="profile-copy">
              <strong>Your workspace</strong>
              <span>Personal shopping space</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}