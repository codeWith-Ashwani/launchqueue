import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import SignupsChart from "../components/SignupsChart";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";

export default function WaitlistDetail() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/waitlists/${id}/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleExport() {
    const res = await api.get(`/waitlists/${id}/export`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${stats.waitlist.slug}-signups.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <Link to="/dashboard" style={{ fontSize: 13, color: "#666" }}>
        ← Back to dashboard
      </Link>
      <h1 style={{ marginTop: 8 }}>{stats.waitlist.name}</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Public link:{" "}
        <a href={`/w/${stats.waitlist.slug}`} target="_blank" rel="noreferrer">
          /w/{stats.waitlist.slug}
        </a>
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <StatCard label="Total signups" value={stats.totalSignups} />
        <StatCard label="Signups today" value={stats.signupsToday} />
        <StatCard label="Referral rate" value={`${stats.referralRate}%`} />
      </div>

      <h3 style={{ marginBottom: 12 }}>Signups over time</h3>
      <SignupsChart data={stats.chartData} />

      <h3 style={{ marginTop: 32, marginBottom: 12 }}>Top referrers</h3>
      <ReferrerLeaderboard referrers={stats.topReferrers} />

      <button
        onClick={handleExport}
        style={{
          marginTop: 32,
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Export signups as CSV
      </button>
    </div>
  );
}