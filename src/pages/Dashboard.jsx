import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

export default function Dashboard() {
  const { founder, logout } = useAuth();
  const [waitlists, setWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/waitlists")
      .then((res) => {
        setWaitlists(res.data.waitlists || []);
      })
      .catch((err) => {
        console.error("Failed to load waitlists:", err);
        setWaitlists([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="lq-dashboard-container">
      <div className="lq-dashboard-header">
        <div>
          <h1 className="lq-dashboard-title">Dashboard</h1>
          <p className="lq-dashboard-sub">
            {founder?.email} · {founder?.plan} plan
          </p>
        </div>

        <button onClick={logout} className="lq-btn lq-btn-secondary">
          Log out
        </button>
      </div>

      <Link to="/dashboard/new" className="lq-btn lq-btn-primary lq-dashboard-create-btn">
        + Create a waitlist
      </Link>

      {!loading && waitlists.length === 0 && (
        <div className="lq-onboarding-card">
          <p className="lq-onboarding-title">
            Get started in 3 steps
          </p>

          <ol className="lq-onboarding-list">
            <li>Create your first waitlist above</li>
            <li>
              Copy your embed code from the waitlist's settings and add it to
              your own site
            </li>
            <li>
              Share your public waitlist link — every referral moves someone
              up the list
            </li>
          </ol>
        </div>
      )}

      {loading ? (
        <p className="lq-empty-text">Loading...</p>
      ) : waitlists.length === 0 ? (
        <p className="lq-empty-text">
          No waitlists yet — create your first one above.
        </p>
      ) : (
        <div className="lq-waitlist-list">
          {waitlists.map((w) => (
            <Link
              key={w._id}
              to={`/dashboard/${w._id}`}
              className="lq-waitlist-item"
            >
              <span>{w.name}</span>

              <span className="lq-waitlist-item-count">
                {w.signupCount} signups
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}