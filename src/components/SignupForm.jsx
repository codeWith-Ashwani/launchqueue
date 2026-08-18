import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function SignupForm({
  slug,
  ctaText = "Join the Waitlist →",
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeRef, setActiveRef] = useState("");

  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      sessionStorage.setItem("lq_active_ref_code", urlRef);
      localStorage.setItem("lq_active_ref_code", urlRef);
      setActiveRef(urlRef);
    } else {
      const stored = sessionStorage.getItem("lq_active_ref_code") || localStorage.getItem("lq_active_ref_code") || "";
      if (stored) setActiveRef(stored);
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const refToSend = activeRef || searchParams.get("ref") || sessionStorage.getItem("lq_active_ref_code") || localStorage.getItem("lq_active_ref_code") || undefined;
      const res = await api.post(`/w/${slug}/signup`, {
        email: email.trim().toLowerCase(),
        ref: refToSend,
      });

      // Clear the temporary active ref code from session once signed up
      sessionStorage.removeItem("lq_active_ref_code");
      localStorage.removeItem("lq_active_ref_code");

      if (onSuccess) {
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
      {error && <div className="lq-form-error-msg">{error}</div>}
    </form>
  );
}