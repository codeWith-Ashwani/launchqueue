import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import SignupsChart from "../components/SignupsChart";
import FunnelChart from "../components/FunnelChart";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";
import HomeButton from "../components/HomeButton";

export default function WaitlistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  // Admin controls state
  const [selectedSignupIds, setSelectedSignupIds] = useState([]);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [editingPositionVal, setEditingPositionVal] = useState("");
  const [posSaveLoading, setPosSaveLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchData = useCallback(() => {
    return Promise.all([
      api.get(`/waitlists/${id}/stats`),
      api.get(`/waitlists/${id}/funnel`),
    ])
      .then(([statsRes, funnelRes]) => {
        setStats(statsRes.data);
        setFunnel(funnelRes.data);
      })
      .catch((err) => setError(err.response?.data?.error || "Failed to load"));
  }, [id]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  async function handleExport() {
    setExportError("");
    setExportLoading(true);
    try {
      const res = await api.get(`/waitlists/${id}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stats?.waitlist?.slug || "waitlist"}-signups.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/pricing");
      } else {
        setExportError(err.response?.data?.error || "Failed to export signups CSV.");
      }
    } finally {
      setExportLoading(false);
    }
  }

  function toggleSelectAll() {
    const signups = stats?.signups || [];
    if (selectedSignupIds.length === signups.length) {
      setSelectedSignupIds([]);
    } else {
      setSelectedSignupIds(signups.map((s) => s._id));
    }
  }

  function toggleSelectOne(signupId) {
    setSelectedSignupIds((prev) =>
      prev.includes(signupId) ? prev.filter((i) => i !== signupId) : [...prev, signupId]
    );
  }

  async function handleSavePosition(signupId) {
    const pos = parseInt(editingPositionVal, 10);
    if (isNaN(pos) || pos < 1) {
      alert("Position must be a positive number.");
      return;
    }

    setPosSaveLoading(true);
    setActionMessage("");
    try {
      await api.patch(`/waitlists/${id}/signups/${signupId}/position`, {
        currentPosition: pos,
      });
      setEditingPositionId(null);
      await fetchData();
      setActionMessage("Position updated successfully.");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update position.");
    } finally {
      setPosSaveLoading(false);
    }
  }

  async function handleBatchInvite() {
    if (selectedSignupIds.length === 0) return;

    const confirmed = window.confirm(
      `Send access invitations to ${selectedSignupIds.length} subscriber(s)?`
    );
    if (!confirmed) return;

    setInviteLoading(true);
    setActionMessage("");
    try {
      const res = await api.post(`/waitlists/${id}/signups/batch-invite`, {
        signupIds: selectedSignupIds,
      });
      setSelectedSignupIds([]);
      await fetchData();
      setActionMessage(`Successfully invited ${res.data.invitedCount} subscriber(s)!`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send invitations.");
    } finally {
      setInviteLoading(false);
    }
  }

  if (loading) return <div className="lq-detail-container"><p className="lq-empty-text">Loading...</p></div>;
  if (error) return <div className="lq-detail-container"><p className="lq-form-error-msg">{error}</p></div>;

  const signups = stats?.signups || [];
  const hasSignups = (stats?.totalSignups || 0) > 0;
  const isAllSelected = signups.length > 0 && selectedSignupIds.length === signups.length;

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

      {/* Conversion Funnel Analytics Card */}
      <h3 className="lq-detail-section-title-spaced">Conversion Funnel & Referral Sources</h3>
      <div className="lq-detail-stats-grid" style={{ marginBottom: 16 }}>
        <StatCard label="Page Views" value={funnel?.totalPageViews || 0} />
        <StatCard label="Direct Signups" value={funnel?.directSignups || 0} />
        <StatCard label="Referred Signups" value={funnel?.referredSignups || 0} />
        <StatCard label="Funnel Conversion" value={`${funnel?.conversionRate ?? 0}%`} />
      </div>

      <FunnelChart funnel={funnel} />

      <h3 className="lq-detail-section-title-spaced">Signups over time</h3>
      <SignupsChart data={stats.chartData} />

      <h3 className="lq-detail-section-title-spaced">Top referrers</h3>
      <ReferrerLeaderboard referrers={funnel?.topReferrers || stats.topReferrers} />

      {/* Admin Controls: Subscribers Table */}
      <h3 className="lq-detail-section-title-spaced">Subscribers & Access Control</h3>
      
      {actionMessage && <div className="lq-msg-success">{actionMessage}</div>}

      <div className="lq-table-card">
        <div className="lq-table-toolbar">
          <p className="lq-table-toolbar-title">
            {signups.length} {signups.length === 1 ? "Subscriber" : "Subscribers"}
          </p>
          <div>
            <button
              onClick={handleBatchInvite}
              disabled={selectedSignupIds.length === 0 || inviteLoading}
              className="lq-btn lq-btn-primary lq-btn-sm"
            >
              {inviteLoading
                ? "Sending Invites..."
                : `Batch Invite Selected (${selectedSignupIds.length})`}
            </button>
          </div>
        </div>

        {signups.length === 0 ? (
          <p className="lq-empty-text" style={{ padding: 24 }}>
            No signups yet for this waitlist.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="lq-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all signups"
                    />
                  </th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Referrals</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => {
                  const isEditing = editingPositionId === s._id;
                  const isChecked = selectedSignupIds.includes(s._id);
                  const isInvited = s.status === "invited";

                  return (
                    <tr key={s._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(s._id)}
                          aria-label={`Select ${s.email}`}
                        />
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="lq-pos-edit-container">
                            <input
                              type="number"
                              min={1}
                              value={editingPositionVal}
                              onChange={(e) => setEditingPositionVal(e.target.value)}
                              className="lq-pos-input"
                              aria-label="Edit position input"
                            />
                            <button
                              onClick={() => handleSavePosition(s._id)}
                              disabled={posSaveLoading}
                              className="lq-btn lq-btn-primary lq-btn-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPositionId(null)}
                              className="lq-btn lq-btn-ghost lq-btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span>#{s.currentPosition}</span>
                        )}
                      </td>
                      <td>{s.email}</td>
                      <td>{s.referralCount || 0}</td>
                      <td>
                        <span
                          className={`lq-badge-status ${
                            isInvited ? "lq-badge-invited" : "lq-badge-waiting"
                          }`}
                        >
                          {s.status || "waiting"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {!isEditing && (
                          <button
                            onClick={() => {
                              setEditingPositionId(s._id);
                              setEditingPositionVal(s.currentPosition);
                            }}
                            className="lq-btn lq-btn-ghost lq-btn-sm"
                          >
                            Edit position
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {exportError && <p className="lq-form-error-msg" style={{ marginTop: 24 }}>{exportError}</p>}

      <div className="lq-detail-actions">
        <button
          onClick={handleExport}
          disabled={exportLoading || !hasSignups}
          className="lq-btn lq-btn-primary"
        >
          {exportLoading ? "Exporting CSV..." : "Export signups as CSV"}
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
