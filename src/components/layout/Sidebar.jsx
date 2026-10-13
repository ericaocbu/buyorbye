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
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/app", icon: LayoutDashboard, end: true },
  { label: "Explore", path: "/app/explore", icon: Search },
  { label: "Compare", path: "/app/compare", icon: GitCompareArrows },
  { label: "My List", path: "/app/list", icon: Heart },
  { label: "Evaluations", path: "/app/evaluations", icon: ClipboardCheck },
  { label: "Decision History", path: "/app/history", icon: History },
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
            <ShoppingBag size={21} aria-hidden="true" />
          </div>

          <div>
            <span className="brand-name">buy or bye</span>
            <span className="brand-tagline">Shop with intention.</span>
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

        <div className="nav-section-label">WORKSPACE</div>

        <nav className="nav-list" aria-label="Workspace">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={getNavLinkClass}
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-sparkle" aria-hidden="true">✳</span>
            <p>Start shopping without regret!</p>
          </div>

          <NavLink
            to="/app/settings"
            onClick={onClose}
            className={getNavLinkClass}
          >
            <Settings size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>Settings</span>
          </NavLink>

          <div className="profile-row">
            <div className="avatar" aria-hidden="true">Y</div>
            <div>
              <strong>Your workspace</strong>
              <span>Personal workspace</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}