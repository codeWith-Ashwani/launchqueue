import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function SignupForm({
  slug,
  ctaText = "Join the Waitlist →",
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeRef, setActiveRef] = useState("");
  const refStorageKey = `lq_active_ref_code_${slug}`;

  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      sessionStorage.setItem(refStorageKey, urlRef);
      localStorage.setItem(refStorageKey, urlRef);
      setActiveRef(urlRef);
    } else {
      const stored = sessionStorage.getItem(refStorageKey) || localStorage.getItem(refStorageKey) || "";
      if (stored) setActiveRef(stored);
    }
  }, [searchParams, refStorageKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const refToSend = activeRef || searchParams.get("ref") || sessionStorage.getItem(refStorageKey) || localStorage.getItem(refStorageKey) || undefined;
      const res = await api.post(`/w/${slug}/signup`, {
        email: email.trim().toLowerCase(),
        ref: refToSend,
      });

      // Clear the temporary active ref code from session once signed up
      sessionStorage.removeItem(refStorageKey);
      localStorage.removeItem(refStorageKey);

      if (res.data.statusLinkSent) {
        setMessage(res.data.message);
      } else if (onSuccess) {
        onSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      {activeRef && (
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <span className="lq-toast-pill" style={{ background: "var(--color-bg-gray)", border: "1px solid var(--color-border-gray)", color: "var(--color-black)", fontSize: "0.75rem" }}>
            🎁 Invited via referral code: <strong>{activeRef}</strong>
          </span>
        </div>
      )}

      <div className="lq-join-form-row">
        <input
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="lq-input"
        />
        <button
          type="submit"
          disabled={loading}
          className="lq-btn lq-btn-primary lq-btn-lg"
        >
          {loading ? "Joining..." : ctaText}
        </button>
      </div>
      {message && <p role="status">{message}</p>}
      {error && <div className="lq-form-error-msg">{error}</div>}
    </form>
  );
}