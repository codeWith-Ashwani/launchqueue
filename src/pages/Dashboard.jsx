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
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "#666", fontSize: 14 }}>
            {founder?.email} · {founder?.plan} plan
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            background: "#fff",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>

      <Link
        to="/dashboard/new"
        style={{
          display: "inline-block",
          marginBottom: 24,
          padding: "8px 16px",
          background: "#111",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 14,
        }}
      >
        + Create a waitlist
      </Link>

      {!loading && waitlists.length === 0 && (
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: 12 }}>
            Get started in 3 steps
          </p>

          <ol
            style={{
              paddingLeft: 18,
              fontSize: 14,
              color: "#444",
              lineHeight: 1.8,
            }}
          >
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
        <p>Loading...</p>
      ) : waitlists.length === 0 ? (
        <p style={{ color: "#999" }}>
          No waitlists yet — create your first one above.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {waitlists.map((w) => (
            <Link
              key={w._id}
              to={`/dashboard/${w._id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 16px",
                border: "1px solid #eee",
                borderRadius: 8,
                textDecoration: "none",
                color: "#111",
              }}
            >
              <span>{w.name}</span>

              <span style={{ color: "#666", fontSize: 13 }}>
                {w.signupCount} signups
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}