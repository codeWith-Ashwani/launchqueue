import { useState } from "react";
import api from "../api/axios";

export default function CheckStatusModal({ isOpen, onClose, slug = "launchqueue", onFound }) {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleLookup(e) {
    e.preventDefault();
    if (!identifier.trim()) return;

    setError("");
    setLoading(true);

    try {
      const isEmail = identifier.includes("@");
      const params = isEmail ? { email: identifier.trim() } : { ref: identifier.trim() };
      const res = await api.get(`/w/${slug}/position`, { params });

      onFound(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "No signup found with this email or referral code.");
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
          Enter your email or referral code to view your queue rank and rewards.
        </p>

        <form onSubmit={handleLookup}>
          <div style={{ marginBottom: 14 }}>
            <input
              type="text"
              placeholder="name@company.com or REF-CODE"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="lq-input"
              style={{ width: "100%" }}
            />
          </div>

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
              {loading ? "Checking..." : "Look Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
