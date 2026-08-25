import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(
        res.data.message ||
          "If an account exists for this email, a reset link has been sent."
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request password reset.");
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
          <h1 className="lq-form-title">Reset Password</h1>
          <p className="lq-form-subtitle">
            Enter your founder account email to receive a password reset link
          </p>
        </div>

        <div className="lq-form-card">
          {message ? (
            <div>
              <div className="lq-msg-success">{message}</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-medium-gray)", margin: "16px 0" }}>
                Check your inbox for the reset link. It expires in 1 hour.
              </p>
              <Link to="/login" className="lq-btn lq-btn-secondary lq-form-btn-full">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="lq-form-group lq-form-group-spaced">
                <label className="lq-form-label">
                  Work email
                </label>
                <input
                  type="email"
                  placeholder="founder@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="lq-input lq-input-full"
                />
              </div>

              {error && <div className="lq-form-error-msg lq-form-error-spaced">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="lq-btn lq-btn-primary lq-form-btn-full"
              >
                {loading ? "Sending link..." : "Send Reset Link →"}
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
