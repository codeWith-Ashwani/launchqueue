import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function AppNav() {
  const { founder, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <nav className="platform-nav" aria-label="Main navigation">
      <div className="platform-nav-inner">
        <Link to="/" className="platform-brand">
          <span className="platform-brand-mark" aria-hidden="true">
            LQ
          </span>
          LaunchQueue
          <span className="platform-brand-dot" aria-hidden="true">
            .
          </span>
        </Link>
        <button
          type="button"
          className="platform-menu-toggle"
          aria-expanded={open}
          aria-controls="platform-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close menu" : "Menu"}
        </button>
        <div
          id="platform-menu"
          className={`platform-menu ${open ? "is-open" : ""}`}
        >
          <a href="/#leaderboard" onClick={() => setOpen(false)}>
            Discover products
          </a>
          {founder ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                My profile
              </NavLink>
              {founder.isAdmin && (
                <NavLink to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </NavLink>
              )}
              <button
                type="button"
                className="lq-btn lq-btn-secondary"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="lq-btn lq-btn-primary">
                Launch your product ↗
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
