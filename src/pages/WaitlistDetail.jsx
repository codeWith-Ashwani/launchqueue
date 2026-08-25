import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import SignupsChart from "../components/SignupsChart";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";
import HomeButton from "../components/HomeButton";

export default function WaitlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    try {
      const res = await api.get(`/waitlists/${id}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stats.waitlist.slug}-signups.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/pricing");
      }
    }
  }
  if (loading) return <div className="lq-detail-container"><p className="lq-empty-text">Loading...</p></div>;
  if (error) return <div className="lq-detail-container"><p className="lq-form-error-msg">{error}</p></div>;

  return (
    <div className="lq-detail-container">
      <div className="lq-page-top-nav">
        <HomeButton />
        <Link to="/dashboard" className="lq-detail-backlink-action">
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="lq-detail-title">{stats.waitlist.name}</h1>
      <p className="lq-detail-publiclink">
        Public link:{" "}
        <a href={`/w/${stats.waitlist.slug}`} target="_blank" rel="noreferrer">
          /w/{stats.waitlist.slug}
        </a>
      </p>

      <div className="lq-detail-stats-grid">
        <StatCard label="Visitors" value={stats.totalVisitors || 0} />
        <StatCard label="Signups" value={stats.totalSignups || 0} />
        <StatCard label="Conversion rate" value={`${stats.conversionRate !== undefined ? stats.conversionRate : 0}%`} />
        <StatCard label="Signups today" value={stats.signupsToday || 0} />
        <StatCard label="Referral rate" value={`${stats.referralRate || 0}%`} />
      </div>

      <h3 className="lq-detail-section-title">Signups over time</h3>
      <SignupsChart data={stats.chartData} />

      <h3 className="lq-detail-section-title-spaced">Top referrers</h3>
      <ReferrerLeaderboard referrers={stats.topReferrers} />

      <div className="lq-detail-actions">
        <button
          onClick={handleExport}
          className="lq-btn lq-btn-primary"
        >
          Export signups as CSV
        </button>
        <Link
          to={`/dashboard/${id}/settings`}
          className="lq-detail-backlink-action"
        >
          Edit landing page →
        </Link>
      </div>
    </div>
  );
}
