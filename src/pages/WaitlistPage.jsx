import { useParams } from "react-router-dom";
import { useWaitlist } from "../hooks/useWaitlist";
import SignupForm from "../components/SignupForm";

export default function WaitlistPage() {
  const { slug } = useParams();
  const { waitlist, loading, error } = useWaitlist(slug);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center" }}>{error}</div>;

  const accent = waitlist.accentColor || "#111111";
  const headline = waitlist.heroHeadline || waitlist.name;
  const subheadline = waitlist.heroSubheadline || waitlist.description;
  const features = waitlist.features?.length ? waitlist.features : [];

  return (
    <div style={{ fontFamily: "-apple-system, sans-serif" }}>
      <div
        style={{
          background: waitlist.heroImageUrl
            ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${waitlist.heroImageUrl}) center/cover`
            : `linear-gradient(135deg, ${accent}, #333)`,
          color: "#fff",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 40, marginBottom: 12, maxWidth: 640, marginInline: "auto" }}>{headline}</h1>
        {subheadline && (
          <p style={{ fontSize: 17, opacity: 0.9, maxWidth: 480, marginInline: "auto", marginBottom: 32 }}>
            {subheadline}
          </p>
        )}
        <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 20 }}>
          {waitlist.totalSignups} people already on the list
        </p>
        <div style={{ maxWidth: 420, marginInline: "auto" }}>
          <SignupForm slug={slug} accentColor={accent} ctaText={waitlist.ctaText} />
        </div>
      </div>

      {features.length > 0 && (
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "60px 24px",
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(features.length, 3)}, 1fr)`,
            gap: 32,
          }}
        >
          {features.map((f, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon || "✨"}</div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#666" }}>{f.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}