import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Missing or invalid reset token. Please request a new password reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccessMessage(
        res.data.message || "Password has been successfully reset. You can now log in."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Invalid or expired reset link. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lq-form-page">
      <nav className="lq-navbar">
        <div className="lq-container lq-navbar-inner">
          <Link to="/" className="lq-logo">
            <div className="lq-logo-mark">LQ</div>
            <span>LaunchQueue</span>
          </Link>
          <Link to="/login" className="lq-btn lq-btn-ghost lq-btn-sm">
            ← Back to Login
          </Link>
        </div>
      </nav>

      <div className="lq-form-container">
        <div className="lq-form-header">
          <h1 className="lq-form-title">Set New Password</h1>
          <p className="lq-form-subtitle">
            Choose a new, secure password for your founder account
          </p>
        </div>

        <div className="lq-form-card">
          {successMessage ? (
            <div>
              <div className="lq-msg-success">{successMessage}</div>
              <Link to="/login" className="lq-btn lq-btn-primary lq-form-btn-full" style={{ marginTop: 16 }}>
                Log in with New Password →
              </Link>
            </div>
          ) : !token ? (
            <div>
              <div className="lq-msg-error">
                No reset token provided. Please use the link sent to your email.
              </div>
              <Link to="/forgot-password" className="lq-btn lq-btn-secondary lq-form-btn-full" style={{ marginTop: 16 }}>
                Request New Reset Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="lq-form-group">
                <label className="lq-form-label">
                  New Password (min 6 characters)
                </label>
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
                <label className="lq-form-label">
                  Confirm New Password
                </label>
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

              {error && (
                <div className="lq-msg-error">
                  {error}
                  {error.toLowerCase().includes("invalid") || error.toLowerCase().includes("expired") ? (
                    <div style={{ marginTop: 8 }}>
                      <Link to="/forgot-password" style={{ textDecoration: "underline", fontWeight: 600, color: "inherit" }}>
                        Request a new reset link →
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="lq-btn lq-btn-primary lq-form-btn-full"
              >
                {loading ? "Resetting Password..." : "Update Password →"}
              </button>
            </form>
          )}
        </div>

        <p className="lq-form-footer">
          Remember your password?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
