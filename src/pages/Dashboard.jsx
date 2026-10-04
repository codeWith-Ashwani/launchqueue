import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import AppNav from "../components/AppNav";

export default function Dashboard() {
  const { founder } = useAuth();
  const [waitlists, setWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get("/waitlists")
      .then((res) => {
        if (active) setWaitlists(res.data.waitlists || []);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.error ||
              "Couldn’t load your campaigns. Please try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [revision]);

  return (
    <div className="platform-account-page">
      <AppNav />
      <main className="platform-container founder-dashboard">
        <div className="lq-dashboard-header">
          <div>
            <h1 className="lq-dashboard-title">Dashboard</h1>
            <p className="lq-dashboard-sub">
              {founder?.name
                ? `${founder.name} (${founder.email})`
                : founder?.email}{" "}
              · {founder?.plan} plan
            </p>
          </div>
        </div>
        <div className="account-stat-grid">
          <div className="account-stat">
            <span>Your campaigns</span>
            <strong>{loading || error ? "—" : waitlists.length}</strong>
          </div>
          <div className="account-stat">
            <span>Total signups</span>
            <strong>
              {loading || error
                ? "—"
                : waitlists
                    .reduce(
                      (sum, campaign) => sum + (campaign.signupCount || 0),
                      0,
                    )
                    .toLocaleString()}
            </strong>
          </div>
          <div className="account-stat">
            <span>Accepting signups</span>
            <strong>
              {loading || error
                ? "—"
                : waitlists.filter((campaign) => !campaign.paused).length}
            </strong>
          </div>
          <div className="account-stat">
            <span>Your plan</span>
            <strong style={{ textTransform: "capitalize" }}>
              {founder?.plan || "free"}
            </strong>
          </div>
        </div>
        {error && (
          <div role="alert" className="lq-msg-error">
            {error}
            <button
              className="platform-text-button"
              onClick={() => setRevision(revision + 1)}
            >
              Try again
            </button>
          </div>
        )}

        <Link
          to="/dashboard/new"
          className="lq-btn lq-btn-primary lq-dashboard-create-btn"
        >
          + Create a waitlist
        </Link>

        {!loading && !error && waitlists.length === 0 && (
          <div className="lq-onboarding-card">
            <p className="lq-onboarding-title">Get started in 3 steps</p>

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
        ) : error ? null : waitlists.length === 0 ? (
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
      </main>
    </div>
  );
}
