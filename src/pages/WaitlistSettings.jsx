import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function WaitlistSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/waitlists/${id}`).then((res) => {
      const w = res.data.waitlist;
      setForm({
        heroHeadline: w.heroHeadline || "",
        heroSubheadline: w.heroSubheadline || "",
        heroImageUrl: w.heroImageUrl || "",
        accentColor: w.accentColor || "#111111",
        ctaText: w.ctaText || "Join the waitlist",
        features: w.features?.length ? w.features : [
          { icon: "🚀", title: "", description: "" },
          { icon: "⚡", title: "", description: "" },
          { icon: "🎯", title: "", description: "" },
        ],
      });
    });
  }, [id]);

  function updateFeature(index, key, value) {
    const updated = [...form.features];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, features: updated });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/waitlists/${id}`, {
        ...form,
        features: form.features.filter((f) => f.title.trim() !== ""),
      });
      navigate(`/dashboard/${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24 }}>
      <Link to={`/dashboard/${id}`} style={{ fontSize: 13, color: "#666" }}>← Back</Link>
      <h1 style={{ margin: "8px 0 24px" }}>Landing page settings</h1>
      <form onSubmit={handleSave}>
        <label style={labelStyle}>Headline</label>
        <input style={inputStyle} value={form.heroHeadline} placeholder="Your product name or tagline"
          onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />

        <label style={labelStyle}>Subheadline</label>
        <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={form.heroSubheadline}
          placeholder="One sentence on what it does"
          onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} />

        <label style={labelStyle}>Hero image URL</label>
        <input style={inputStyle} value={form.heroImageUrl} placeholder="https://..."
          onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} />

        <label style={labelStyle}>Accent color</label>
        <input type="color" value={form.accentColor} style={{ width: 60, height: 36, marginBottom: 12 }}
          onChange={(e) => setForm({ ...form, accentColor: e.target.value })} />

        <label style={labelStyle}>Button text</label>
        <input style={inputStyle} value={form.ctaText}
          onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />

        <label style={labelStyle}>Three features</label>
        {form.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input style={{ ...inputStyle, width: 50, marginBottom: 0 }} value={f.icon}
              onChange={(e) => updateFeature(i, "icon", e.target.value)} />
            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Feature title" value={f.title}
              onChange={(e) => updateFeature(i, "title", e.target.value)} />
            <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="Short description" value={f.description}
              onChange={(e) => updateFeature(i, "description", e.target.value)} />
          </div>
        ))}

        <button type="submit" disabled={saving} style={buttonStyle}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginTop: 16, marginBottom: 6 };
const inputStyle = { display: "block", width: "100%", padding: "9px 11px", marginBottom: 12, border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "10px 12px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, marginTop: 20 };