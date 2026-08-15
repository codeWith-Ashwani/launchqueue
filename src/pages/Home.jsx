import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ fontFamily: "-apple-system, sans-serif" }}>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px" }}>
        <strong>LaunchQueue</strong>
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/login" style={{ color: "#111", textDecoration: "none" }}>Log in</Link>
          <Link
            to="/register"
            style={{ background: "#111", color: "#fff", padding: "8px 16px", borderRadius: 8, textDecoration: "none" }}
          >
            Get started free
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 40, marginBottom: 16, lineHeight: 1.2 }}>
          Waitlists that grow themselves
        </h1>
        <p style={{ fontSize: 17, color: "#666", marginBottom: 32 }}>
          Give people a reason to share your waitlist — a live position they can climb.
          Set up in two minutes, embeds on any site with one line of code.
        </p>
        <Link
          to="/register"
          style={{
            display: "inline-block",
            background: "#111",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          Create your first waitlist — it's free
        </Link>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 780, margin: "80px auto", padding: "0 24px", display: "flex", gap: 24 }}>
        {[
          ["Live referral ranking", "Every signup gets a personal link. Sharing it moves them up the list in real time."],
          ["One-line embed", "Drop a working waitlist into any existing website — no rebuild required."],
          ["Real founder dashboard", "Signups over time, top referrers, and CSV export whenever you need it."],
        ].map(([title, desc]) => (
          <div key={title} style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h3>
            <p style={{ fontSize: 14, color: "#666" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ textAlign: "center", padding: "60px 24px", background: "#fafafa", marginTop: 60 }}>
        <p style={{ marginBottom: 16, color: "#666" }}>Free for your first 500 signups. No credit card required.</p>
        <Link to="/register" style={{ color: "#111", fontWeight: 600, textDecoration: "underline" }}>
          Start building your waitlist →
        </Link>
      </div>

    </div>
  );
}