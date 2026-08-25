import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
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
          <Link to="/" className="lq-btn lq-btn-ghost" style={{ fontSize: "0.8125rem" }}>
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="lq-form-container">
        <div className="lq-form-header">
          <h1 className="lq-form-title">Founder Login</h1>
          <p className="lq-form-subtitle">
            Access your waitlist analytics and manage campaigns
          </p>
        </div>

        <div className="lq-form-card">
          <form onSubmit={handleSubmit}>
            <div className="lq-form-group">
              <label className="lq-form-label">
                Email address
              </label>
              <input
                type="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="lq-input"
                style={{ width: "100%" }}
              />
            </div>

            <div className="lq-form-group" style={{ marginBottom: 20 }}>
              <label className="lq-form-label">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="lq-input"
                style={{ width: "100%" }}
              />
            </div>

            {error && <div className="lq-form-error-msg" style={{ marginBottom: 16 }}>{error}</div>}

            <button type="submit" disabled={loading} className="lq-btn lq-btn-primary lq-form-btn-full">
              {loading ? "Logging in..." : "Log in to Dashboard →"}
            </button>
          </form>
        </div>

        <p className="lq-form-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}