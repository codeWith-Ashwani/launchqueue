import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import AppNav from "../components/AppNav";
import { usePageMotion } from "../hooks/usePageMotion";

export default function Profile() {
  const { founder, updateFounder } = useAuth();
  const root = useRef(null);
  usePageMotion(root);
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busyCampaign, setBusyCampaign] = useState("");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setOverviewLoading(true);
    setOverviewError("");
    api
      .get("/auth/overview", { signal: controller.signal })
      .then(({ data }) => {
        if (active) setOverview(data);
      })
      .catch(() => {
        if (active)
          setOverviewError("Couldn’t load your campaigns. Try refreshing.");
      })
      .finally(() => {
        if (active) setOverviewLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [revision]);
  async function updateCampaign(campaign, field) {
    setBusyCampaign(campaign._id);
    setOverviewError("");
    try {
      await api.patch(`/waitlists/${campaign._id}`, {
        [field]: !campaign[field],
      });
      setRevision((value) => value + 1);
    } catch (err) {
      setOverviewError(
        err.response?.data?.error || "Couldn’t save that campaign change.",
      );
    } finally {
      setBusyCampaign("");
    }
  }

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
      setPasswordError(
        err.response?.data?.error || "Failed to update password",
      );
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
        window.open(res.data.portalUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPortalMessage("You don't have an active subscription yet.");
      } else {
        setPortalMessage(
          err.response?.data?.error || "Failed to access billing portal.",
        );
      }
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="platform-account-page" ref={root}>
      <AppNav />
      <main className="platform-container founder-profile">
        <header className="account-heading" data-hero>
          <div>
            <span className="platform-eyebrow">YOUR FOUNDER SPACE</span>
            <h1>{founder?.name || "Make it yours."}</h1>
            <p>Your details, your campaigns, your next chapter.</p>
          </div>
          <div className="founder-identity">
            <span className="founder-avatar" aria-hidden="true">
              {(founder?.name || founder?.email || "F")
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <div>
              <strong>{founder?.email}</strong>
              <span>
                {founder?.createdAt
                  ? `Founder since ${new Date(founder.createdAt).toLocaleDateString()}`
                  : "Founder account"}
              </span>
            </div>
          </div>
        </header>
        <nav className="profile-section-nav" aria-label="Profile sections">
          <a href="#my-campaigns">My campaigns</a>
          <a href="#account-details">Account details</a>
          <a href="#subscription">Subscription</a>
          <a href="#security">Security</a>
        </nav>
        <div className="account-stat-grid" aria-label="Your campaign usage">
          {[
            ["Campaigns", overview?.usage?.campaigns],
            ["Total signups", overview?.usage?.signups],
            ["Confirmed members", overview?.usage?.confirmed],
            [
              "Campaign limit",
              overview?.limits?.campaigns === null
                ? "Unlimited"
                : overview?.limits?.campaigns,
            ],
          ].map(([label, value]) => (
            <div className="account-stat" key={label}>
              <span>{label}</span>
              <strong>
                {value === undefined
                  ? "—"
                  : typeof value === "number"
                    ? value.toLocaleString()
                    : value}
              </strong>
            </div>
          ))}
        </div>
        <section id="my-campaigns" className="lq-profile-card account-card">
          <div className="lq-profile-card-header">
            <div>
              <h2 className="lq-profile-card-title">My campaigns</h2>
              <p className="account-card-subtitle">
                Track progress and fine-tune your launch.
              </p>
            </div>
            <Link to="/dashboard/new" className="lq-btn lq-btn-primary">
              New campaign ↗
            </Link>
          </div>
          {overviewError && (
            <div role="alert" className="lq-msg-error">
              {overviewError}
              <button
                type="button"
                className="platform-text-button"
                onClick={() => setRevision(revision + 1)}
              >
                Refresh campaigns
              </button>
            </div>
          )}
          {overviewLoading ? (
            <p role="status">Loading your campaigns…</p>
          ) : !overview?.campaigns?.length ? (
            <div className="platform-empty">
              <h3>Your next idea starts here.</h3>
              <p>
                Create your first campaign, design its page, and invite your
                community.
              </p>
              <Link to="/dashboard/new" className="lq-btn lq-btn-secondary">
                Create a campaign
              </Link>
            </div>
          ) : (
            <div className="profile-campaign-list">
              {overview.campaigns.map((campaign) => (
                <article key={campaign._id} className="profile-campaign">
                  <div>
                    <h3>{campaign.name}</h3>
                    <Link to={`/w/${campaign.slug}`}>
                      /w/{campaign.slug} ↗
                    </Link>
                    <p>
                      <span className="account-status">
                        {campaign.paused ? "Paused" : "Accepting signups"}
                      </span>
                      <span className="account-status">
                        {campaign.discoveryHidden
                          ? "Discovery hidden by admin"
                          : campaign.discoverable
                            ? "On the discovery board"
                            : "Unlisted"}
                      </span>
                    </p>
                  </div>
                  <div className="profile-campaign-count">
                    <strong>{campaign.signupCount.toLocaleString()}</strong>
                    <span>signups · {campaign.confirmedCount} confirmed</span>
                  </div>
                  <div className="profile-campaign-actions">
                    <Link
                      to={`/dashboard/${campaign._id}`}
                      className="lq-btn lq-btn-secondary"
                    >
                      View analytics
                    </Link>
                    <Link
                      to={`/dashboard/${campaign._id}/settings`}
                      className="lq-btn lq-btn-primary"
                    >
                      Edit campaign ↗
                    </Link>
                    <button
                      type="button"
                      className="platform-text-button"
                      disabled={busyCampaign === campaign._id}
                      onClick={() => updateCampaign(campaign, "paused")}
                    >
                      {campaign.paused ? "Resume signups" : "Pause signups"}
                    </button>
                    <button
                      type="button"
                      className="platform-text-button"
                      disabled={busyCampaign === campaign._id}
                      onClick={() => updateCampaign(campaign, "discoverable")}
                    >
                      {campaign.discoverable
                        ? "Remove from discovery"
                        : "List on discovery"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Profile Details Card */}
        <div id="account-details" className="lq-profile-card account-card">
          <div className="lq-profile-card-header">
            <h2 className="lq-profile-card-title">Founder Profile</h2>
            <span className="lq-profile-badge">{founder?.plan || "Free"}</span>
          </div>
          <p className="account-card-subtitle profile-account-id">
            Account ID: <code>{founder?.id}</code>
          </p>

          {profileSuccess && (
            <div className="lq-msg-success">{profileSuccess}</div>
          )}
          {profileError && <div className="lq-msg-error">{profileError}</div>}

          <form onSubmit={handleProfileSubmit}>
            <div className="lq-form-group">
              <label className="lq-form-label" htmlFor="profile-name">
                Full Name
              </label>
              <input
                id="profile-name"
                autoComplete="name"
                maxLength={100}
                type="text"
                placeholder="e.g. Alex Founder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="lq-input lq-input-full"
              />
            </div>

            <div className="lq-form-group lq-form-group-spaced">
              <label className="lq-form-label" htmlFor="profile-email">
                Email Address
              </label>
              <input
                id="profile-email"
                autoComplete="email"
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
        <div id="subscription" className="lq-profile-card account-card">
          <div className="lq-profile-card-header">
            <h2 className="lq-profile-card-title">Plan & Billing</h2>
          </div>

          <div className="lq-profile-plan-row">
            <div className="lq-profile-plan-info">
              <span className="lq-profile-plan-name">
                {founder?.plan || "Free"} Plan
              </span>
              <span className="lq-profile-plan-sub">
                {overview?.limits
                  ? `${overview.limits.signups === null ? "Unlimited" : overview.limits.signups.toLocaleString()} signups per campaign`
                  : "Your current subscription tier"}
              </span>
              <span className="account-card-subtitle">
                Status:{" "}
                {founder?.subscriptionStatus === "untracked"
                  ? "No billing subscription linked"
                  : founder?.subscriptionStatus || "Not available"}
                {founder?.subscriptionEndsAt &&
                  ` · Access until ${new Date(founder.subscriptionEndsAt).toLocaleDateString()}`}
              </span>
            </div>
            <Link to="/pricing" className="lq-btn lq-btn-secondary">
              Switch Plan
            </Link>
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid var(--color-border-subtle)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--color-near-black)",
                    margin: 0,
                  }}
                >
                  Payment Method & Invoices
                </p>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-medium-gray)",
                    margin: "2px 0 0 0",
                  }}
                >
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
                <Link
                  to="/pricing"
                  style={{
                    textDecoration: "underline",
                    color: "inherit",
                    fontWeight: 600,
                  }}
                >
                  Upgrade here
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div id="security" className="lq-profile-card account-card">
          <div className="lq-profile-card-header">
            <h2 className="lq-profile-card-title">Change Password</h2>
          </div>

          {passwordSuccess && (
            <div className="lq-msg-success">{passwordSuccess}</div>
          )}
          {passwordError && <div className="lq-msg-error">{passwordError}</div>}

          {founder?.authProvider === "google" && (
            <p className="account-card-subtitle">
              You signed up with Google. To set or reset an email password,{" "}
              <Link to="/forgot-password">request a password reset</Link>.
            </p>
          )}
          {founder?.authProvider !== "google" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="lq-form-group">
                <label className="lq-form-label" htmlFor="current-password">
                  Current Password
                </label>
                <input
                  id="current-password"
                  autoComplete="current-password"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="lq-input lq-input-full"
                />
              </div>

              <div className="lq-form-group">
                <label className="lq-form-label" htmlFor="new-password">
                  New Password (min 6 characters)
                </label>
                <input
                  id="new-password"
                  autoComplete="new-password"
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
                <label className="lq-form-label" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  autoComplete="new-password"
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
          )}
        </div>
      </main>
    </div>
  );
}
