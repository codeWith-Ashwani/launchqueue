import { useState } from "react";
import api from "../api/axios";

export default function CheckStatusModal({ isOpen, onClose, slug = "launchqueue" }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleLookup(e) {
    e.preventDefault();
    if (!identifier.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post(`/w/${slug}/status-link`, { email: identifier.trim().toLowerCase() });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to request a status link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lq-modal-overlay" onClick={onClose}>
      <div className="lq-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lq-modal-title-row">
          <h3 className="lq-modal-title-text">Check Your Position</h3>
          <button className="lq-modal-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--color-medium-gray)", marginBottom: 20 }}>
          Enter your email. We will send a private link to view your queue rank and rewards.
        </p>

        <form onSubmit={handleLookup}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="email"
              placeholder="name@company.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="lq-input"
              style={{ width: "100%" }}
            />
          </div>

          {message && <p role="status">{message}</p>}
          {error && <div className="lq-form-error-msg" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              className="lq-btn lq-btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="lq-btn lq-btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? "Sending..." : "Email My Status Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
