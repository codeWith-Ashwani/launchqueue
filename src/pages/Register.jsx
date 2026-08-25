import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
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
          <h1 className="lq-form-title">Create Founder Account</h1>
          <p className="lq-form-subtitle">
            Free for your first 500 signups. No credit card required.
          </p>
        </div>

        <div className="lq-form-card">
          <form onSubmit={handleSubmit}>
            <div className="lq-form-group">
              <label className="lq-form-label">
                Work email
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
                Password (min 6 characters)
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
              {loading ? "Creating account..." : "Start Building Free →"}
            </button>
          </form>
        </div>

        <p className="lq-form-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}