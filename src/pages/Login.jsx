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
    <div style={{ background: "var(--color-white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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

      <div style={{ maxWidth: 400, width: "100%", margin: "80px auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: 8, color: "var(--color-black)" }}>Founder Login</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-medium-gray)" }}>
            Access your waitlist analytics and manage campaigns
          </p>
        </div>

        <div style={{ border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-lg)", padding: 28, background: "var(--color-white)", boxShadow: "var(--shadow-sm)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-medium-gray)", marginBottom: 6 }}>
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

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-medium-gray)", marginBottom: 6 }}>
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

            <button type="submit" disabled={loading} className="lq-btn lq-btn-primary" style={{ width: "100%", padding: "12px 16px" }}>
              {loading ? "Logging in..." : "Log in to Dashboard →"}
            </button>
          </form>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: "0.875rem", color: "var(--color-medium-gray)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--color-black)", fontWeight: 600, textDecoration: "underline" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}