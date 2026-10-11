
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

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <ShoppingBag size={21} />
          </div>
          <div>
            <span className="brand-name">buy or bye</span>
            <span className="brand-tagline">Shop with intention.</span>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-section-label">WORKSPACE</div>

        <nav className="nav-list">
          {navigation.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-sparkle">✳</span>
            <p>Start shopping without regret!</p>
          </div>

          <NavLink to="/app/settings" onClick={onClose} className="nav-link">
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>

          <div className="profile-row">
            <div className="avatar">B</div>
            <div>
              <strong>Your workspace</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
