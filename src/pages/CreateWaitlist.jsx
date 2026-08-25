import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";

export default function CreateWaitlist() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/waitlists", { name, description });
      navigate(`/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lq-form-container">
      <div className="lq-page-top-nav">
        <HomeButton />
        <Link to="/dashboard" className="lq-btn lq-btn-ghost lq-btn-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="lq-dashboard-title lq-form-header-title">Create a waitlist</h1>
      <form onSubmit={handleSubmit} className="lq-form-card">
        <div className="lq-form-group">
          <label className="lq-form-label">Waitlist Name</label>
          <input
            type="text"
            placeholder="Waitlist name (e.g. RocketPay)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="lq-input lq-input-full"
          />
        </div>
        <div className="lq-form-group">
          <label className="lq-form-label">Description (Optional)</label>
          <textarea
            placeholder="Short description of your project or product"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="lq-form-textarea"
          />
        </div>
        {error && <div className="lq-form-error-msg lq-form-error-spaced">{error}</div>}
        <button type="submit" disabled={loading} className="lq-btn lq-btn-primary lq-form-btn-full">
          {loading ? "Creating..." : "Create waitlist →"}
        </button>
      </form>
    </div>
  );
}