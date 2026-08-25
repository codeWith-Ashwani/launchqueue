import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";

export default function WaitlistSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [waitlistSlug, setWaitlistSlug] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/waitlists/${id}`).then((res) => {
      const w = res.data.waitlist;
      setWaitlistSlug(w.slug || "");
      setWaitlistName(w.name || "LaunchQueue");
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
        milestones: w.milestones?.length ? w.milestones : [
          { referrals: 1, reward: "" },
          { referrals: 3, reward: "" },
          { referrals: 5, reward: "" },
        ],
      });
    });
  }, [id]);

  function updateFeature(index, key, value) {
    const updated = [...form.features];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, features: updated });
  }

  function updateMilestone(index, key, value) {
    const updated = [...form.milestones];
    updated[index] = {
      ...updated[index],
      [key]: key === "referrals" ? Number(value) || 0 : value,
    };
    setForm({ ...form, milestones: updated });
  }

  function addMilestone() {
    setForm({
      ...form,
      milestones: [...form.milestones, { referrals: "", reward: "" }],
    });
  }

  function removeMilestone(index) {
    setForm({
      ...form,
      milestones: form.milestones.filter((_, i) => i !== index),
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/waitlists/${id}`, {
        ...form,
        features: form.features.filter((f) => f.title.trim() !== ""),
        milestones: form.milestones
          .filter((m) => m.reward.trim() !== "" && m.referrals > 0)
          .sort((a, b) => a.referrals - b.referrals),
      });
      navigate(`/dashboard/${id}`);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <div style={{ padding: 40, textAlign: "center" }}>Loading settings...</div>;

  const validFeatures = form.features.filter((f) => f.title.trim() !== "");
  const validMilestones = form.milestones.filter((m) => m.reward.trim() !== "" && m.referrals > 0);

  return (
    <div style={{ maxWidth: 1180, margin: "32px auto", padding: "0 24px" }}>
      <div className="lq-page-top-nav" style={{ marginBottom: 16 }}>
        <HomeButton />
        <Link to={`/dashboard/${id}`} className="lq-btn lq-btn-ghost lq-btn-sm">
          ← Back to dashboard
        </Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "8px 0 4px", fontSize: "1.75rem" }}>Landing page settings</h1>
        <p style={{ fontSize: "0.875rem", color: "#666" }}>
          Customize your public waitlist landing page. Preview changes in real time before saving.
        </p>
      </div>

      {/* 2-Column Responsive Layout (Desktop: Side-by-side; Mobile: Stacked) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Left Column: Form Settings */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={handleSave}>
            <label style={labelStyle}>Headline</label>
            <input
              style={inputStyle}
              value={form.heroHeadline}
              placeholder="e.g. Next-gen AI workflow engine"
              onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
            />

            <label style={labelStyle}>Subheadline</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical" }}
              rows={2}
              value={form.heroSubheadline}
              placeholder="e.g. Build and automate complex pipelines 10x faster."
              onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
            />

            <label style={labelStyle}>Hero image URL (optional)</label>
            <input
              style={inputStyle}
              value={form.heroImageUrl}
              placeholder="https://..."
              onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })}
            />

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div>
                <label style={labelStyle}>Accent color</label>
                <input
                  type="color"
                  value={form.accentColor}
                  style={{ width: 56, height: 36, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", display: "block" }}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Button text</label>
                <input
                  style={inputStyle}
                  value={form.ctaText}
                  placeholder="e.g. Join the waitlist →"
                  onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                />
              </div>
            </div>

            <label style={labelStyle}>Product features</label>
            <p style={{ fontSize: 12, color: "#888", marginTop: -2, marginBottom: 8 }}>
              Highlights displayed on your public campaign page.
            </p>
            {form.features.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  style={{ ...inputStyle, width: 44, marginBottom: 0, textAlign: "center" }}
                  value={f.icon}
                  placeholder="✨"
                  onChange={(e) => updateFeature(i, "icon", e.target.value)}
                />
                <input
                  style={{ ...inputStyle, width: "35%", marginBottom: 0 }}
                  placeholder="Title"
                  value={f.title}
                  onChange={(e) => updateFeature(i, "title", e.target.value)}
                />
                <input
                  style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                  placeholder="Description"
                  value={f.description}
                  onChange={(e) => updateFeature(i, "description", e.target.value)}
                />
              </div>
            ))}

            <label style={labelStyle}>Referral reward ladder</label>
            <p style={{ fontSize: 12, color: "#888", marginTop: -2, marginBottom: 10 }}>
              Milestones subscribers unlock by inviting friends to climb the queue.
            </p>
            {form.milestones.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min="1"
                  style={{ ...inputStyle, width: 64, marginBottom: 0 }}
                  value={m.referrals}
                  placeholder="3"
                  onChange={(e) => updateMilestone(i, "referrals", e.target.value)}
                />
                <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>refs →</span>
                <input
                  style={{ ...inputStyle, marginBottom: 0 }}
                  placeholder="e.g. 🎉 Early Beta Access"
                  value={m.reward}
                  onChange={(e) => updateMilestone(i, "reward", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeMilestone(i)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#999",
                    fontSize: 18,
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                  aria-label="Remove milestone"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              style={{
                border: "1px dashed #ddd",
                background: "#fafafa",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#666",
                cursor: "pointer",
                width: "100%",
                marginBottom: 16,
              }}
            >
              + Add reward tier
            </button>

            <button type="submit" disabled={saving} style={buttonStyle}>
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* Right Column: Founder Live Preview */}
        <div
          style={{
            position: "sticky",
            top: 24,
            background: "#fff",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Mock Browser Header */}
          <div
            style={{
              background: "#0a0a0a",
              color: "#fff",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              borderBottom: "1px solid #262626",
            }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ marginLeft: 8, color: "#888", fontFamily: "var(--font-mono, monospace)" }}>
                launchqueue.com/w/{waitlistSlug || "preview"}
              </span>
            </div>
            <span style={{ color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6875rem", fontWeight: 600 }}>
              Live Preview
            </span>
          </div>

          {/* Preview Canvas */}
          <div style={{ padding: "32px 24px", background: "#fff", minHeight: 480, maxHeight: "75vh", overflowY: "auto" }}>
            {/* Pill */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: `1px solid ${form.accentColor}33`,
                  background: `${form.accentColor}0a`,
                  color: "#111",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: form.accentColor }} />
                Official Early Access Queue
              </span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                textAlign: "center",
                margin: "0 0 10px",
                color: "#111",
                lineHeight: 1.25,
              }}
            >
              {form.heroHeadline.trim() || waitlistName || "Your Headline Here"}
            </h2>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "0.9375rem",
                color: "#666",
                textAlign: "center",
                maxWidth: 440,
                margin: "0 auto 24px",
                lineHeight: 1.5,
              }}
            >
              {form.heroSubheadline.trim() || "Add a compelling subheadline describing your product launch."}
            </p>

            {/* Optional Hero Image preview */}
            {form.heroImageUrl.trim() && (
              <div style={{ marginBottom: 20, textAlign: "center" }}>
                <img
                  src={form.heroImageUrl.trim()}
                  alt="Hero Preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "cover" }}
                />
              </div>
            )}

            {/* Mock Signup Box (Disabled in Preview Mode) */}
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: 16,
                background: "#fafafa",
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input
                  type="email"
                  disabled
                  placeholder="name@company.com"
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    fontSize: 13,
                    background: "#fff",
                  }}
                />
                <button
                  type="button"
                  disabled
                  style={{
                    padding: "9px 16px",
                    background: form.accentColor || "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "not-allowed",
                  }}
                >
                  {form.ctaText.trim() || "Join waitlist"}
                </button>
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#888", textAlign: "center" }}>
                Preview Mode · Signups disabled
              </div>
            </div>

            {/* Features Preview */}
            {validFeatures.length > 0 && (
              <div style={{ borderTop: "1px solid #eee", paddingTop: 20, marginBottom: 24 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888", marginBottom: 12, textAlign: "center", letterSpacing: "0.05em" }}>
                  Product Highlights
                </div>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(validFeatures.length, 3)}, 1fr)`, gap: 12 }}>
                  {validFeatures.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 12,
                        background: "#fafafa",
                        border: "1px solid #eee",
                        borderRadius: 8,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{f.icon || "✨"}</div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111", marginBottom: 2 }}>{f.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#666", lineHeight: 1.3 }}>{f.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones Preview */}
            {validMilestones.length > 0 && (
              <div style={{ borderTop: "1px solid #eee", paddingTop: 20 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#888", marginBottom: 12, textAlign: "center", letterSpacing: "0.05em" }}>
                  Referral Rewards
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {validMilestones.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        background: "#fafafa",
                        border: "1px solid #eee",
                        borderRadius: 6,
                        fontSize: "0.8125rem",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#111" }}>{m.reward}</span>
                      <span style={{ fontSize: "0.75rem", color: "#888", fontFamily: "var(--font-mono, monospace)" }}>
                        {m.referrals} {m.referrals === 1 ? "ref" : "refs"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, marginTop: 14, marginBottom: 5 };
const inputStyle = { display: "block", width: "100%", padding: "9px 11px", marginBottom: 10, border: "1px solid #ddd", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "11px 14px", background: "#111", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: 16 };