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
      .then((res) => setWaitlists(res.data.waitlists))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "#666", fontSize: 14 }}>
            {founder?.email} · {founder?.plan} plan
          </p>
        </div>
        <button
          onClick={logout}
          style={{ padding: "8px 16px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer" }}
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

      {loading ? (
        <p>Loading...</p>
      ) : waitlists.length === 0 ? (
        <p style={{ color: "#999" }}>No waitlists yet — create your first one above.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
              <span style={{ color: "#666", fontSize: 13 }}>{w.signupCount} signups</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}