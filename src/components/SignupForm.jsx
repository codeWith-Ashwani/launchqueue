import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function SignupForm({ slug, accentColor = "#111", ctaText = "Join waitlist", onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post(`/w/${slug}/signup`, { email, ref });
      onSuccess(res.data); // instead of navigate()
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ flex: 1, padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{ padding: "10px 20px", background: accentColor, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, whiteSpace: "nowrap" }}
      >
        {loading ? "Joining..." : ctaText}
      </button>
      {error && <p style={{ color: "red", fontSize: 13, position: "absolute", marginTop: 44 }}>{error}</p>}
    </form>
  );
}