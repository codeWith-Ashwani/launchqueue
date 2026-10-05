import { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login({ adminLogin = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const completeLogin = useCallback((founder) => {
    if (adminLogin && !founder?.isAdmin) {
      setError("Your account has not been approved for admin access.");
      return;
    }
    navigate(adminLogin ? "/admin" : "/dashboard");
  }, [adminLogin, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const founder = await login(email, password);
      completeLogin(founder);
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
          <Link to="/" className="lq-btn lq-btn-ghost lq-btn-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="lq-form-container">
        <div className="lq-form-header">
          <h1 className="lq-form-title">{adminLogin ? "Admin Login" : "Founder Login"}</h1>
          <p className="lq-form-subtitle">
            {adminLogin ? "Sign in with an account approved for admin access." : "Access your waitlist analytics and manage campaigns"}
          </p>
        </div>

        <div className="lq-form-card">
          <GoogleSignInButton onSuccess={completeLogin} />

          <div className="lq-divider">or continue with email</div>

          <form onSubmit={handleSubmit}>
            <div className="lq-form-group">
              <label className="lq-form-label" htmlFor="login-email">
                Email address
              </label>
              <input
                id="login-email" autoComplete="email"
                type="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="lq-input lq-input-full"
              />
            </div>

            <div className="lq-form-group lq-form-group-spaced">
              <div className="lq-form-label-row">
                <label className="lq-form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
                  Password
                </label>
                <Link to="/forgot-password" className="lq-form-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password" autoComplete="current-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="lq-input lq-input-full"
              />
            </div>

            {error && <div role="alert" className="lq-form-error-msg lq-form-error-spaced">{error}</div>}

            <button type="submit" disabled={loading} className="lq-btn lq-btn-primary lq-form-btn-full">
              {loading ? "Logging in..." : adminLogin ? "Log in to Admin →" : "Log in to Dashboard →"}
            </button>
          </form>
        </div>

        <p className="lq-form-footer">
          {adminLogin ? "Looking for your campaigns? " : "Don't have an account? "}
          <Link to={adminLogin ? "/login" : "/register"}>
            {adminLogin ? "Founder login" : "Create one free"}
          </Link>
        </p>
      </div>
    </div>
  );
}
