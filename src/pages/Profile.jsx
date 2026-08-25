import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";

export default function Profile() {
  const { founder, updateFounder } = useAuth();

  const [name, setName] = useState(founder?.name || "");
  const [email, setEmail] = useState(founder?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [portalLoading, setPortalLoading] = useState(false);
  const [portalMessage, setPortalMessage] = useState("");

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const res = await api.patch("/auth/profile", { name, email });
      updateFounder(res.data.founder);
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      setProfileError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.patch("/auth/password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleManageBilling() {
    setPortalMessage("");
    setPortalLoading(true);
    try {
      const res = await api.get("/payments/portal");
      if (res.data.portalUrl) {
        window.open(res.data.portalUrl, "_blank");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPortalMessage("You don't have an active subscription yet.");
      } else {
        setPortalMessage(err.response?.data?.error || "Failed to access billing portal.");
      }
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="lq-profile-container">
      <div className="lq-page-top-nav">
        <HomeButton />
        <Link to="/dashboard" className="lq-btn lq-btn-ghost lq-btn-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="lq-profile-header">
        <h1 className="lq-dashboard-title">Account Settings</h1>
        <p className="lq-dashboard-sub">
          Manage your founder profile, login security, and subscription
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="lq-profile-card">
        <div className="lq-profile-card-header">
          <h2 className="lq-profile-card-title">Founder Profile</h2>
          <span className="lq-profile-badge">{founder?.plan || "Free"}</span>
        </div>

        {profileSuccess && <div className="lq-msg-success">{profileSuccess}</div>}
        {profileError && <div className="lq-msg-error">{profileError}</div>}

        <form onSubmit={handleProfileSubmit}>
          <div className="lq-form-group">
            <label className="lq-form-label">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Founder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="lq-input lq-input-full"
            />
          </div>

          <div className="lq-form-group lq-form-group-spaced">
            <label className="lq-form-label">Email Address</label>
            <input
              type="email"
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="lq-input lq-input-full"
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="lq-btn lq-btn-primary"
          >
            {profileLoading ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Subscription & Billing Card */}
      <div className="lq-profile-card">
        <div className="lq-profile-card-header">
          <h2 className="lq-profile-card-title">Plan & Billing</h2>
        </div>

        <div className="lq-profile-plan-row">
          <div className="lq-profile-plan-info">
            <span className="lq-profile-plan-name">{founder?.plan || "Free"} Plan</span>
            <span className="lq-profile-plan-sub">
              {founder?.plan === "free"
                ? "Free tier with up to 500 waitlist signups"
                : `Active ${founder?.plan} subscription tier`}
            </span>
          </div>
          <Link to="/pricing" className="lq-btn lq-btn-secondary">
            Switch Plan
          </Link>
        </div>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--color-border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-near-black)", margin: 0 }}>
                Payment Method & Invoices
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-medium-gray)", margin: "2px 0 0 0" }}>
                Update credit card or download VAT receipts
              </p>
            </div>
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="lq-btn lq-btn-secondary"
            >
              {portalLoading ? "Opening..." : "Manage Payment Method"}
            </button>
          </div>

          {portalMessage && (
            <div style={{ marginTop: 12 }} className="lq-msg-error">
              {portalMessage}{" "}
              <Link to="/pricing" style={{ textDecoration: "underline", color: "inherit", fontWeight: 600 }}>
                Upgrade here
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="lq-profile-card">
        <div className="lq-profile-card-header">
          <h2 className="lq-profile-card-title">Change Password</h2>
        </div>

        {passwordSuccess && <div className="lq-msg-success">{passwordSuccess}</div>}
        {passwordError && <div className="lq-msg-error">{passwordError}</div>}

        <form onSubmit={handlePasswordSubmit}>
          <div className="lq-form-group">
            <label className="lq-form-label">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="lq-input lq-input-full"
            />
          </div>

          <div className="lq-form-group">
            <label className="lq-form-label">New Password (min 6 characters)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="lq-input lq-input-full"
            />
          </div>

          <div className="lq-form-group lq-form-group-spaced">
            <label className="lq-form-label">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="lq-input lq-input-full"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="lq-btn lq-btn-secondary"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
