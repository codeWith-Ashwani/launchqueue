import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useWaitlist } from "../hooks/useWaitlist";
import api from "../api/axios";
import SignupForm from "../components/SignupForm";
import PersonalizedWaitlistCard from "../components/PersonalizedWaitlistCard";
import CheckStatusModal from "../components/CheckStatusModal";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";
import LiveActivityFeed from "../components/LiveActivityFeed";

export default function WaitlistPage() {
  const { slug } = useParams();
  const { waitlist, loading, error } = useWaitlist(slug);
  const [signupData, setSignupData] = useState(null);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get("ref");

  // Restore saved session for this waitlist
  useEffect(() => {
    try {
      const savedStr = localStorage.getItem(`lq_user_signup_${slug}`);
      const saved = savedStr ? JSON.parse(savedStr) : null;

      if (refFromUrl) {
        sessionStorage.setItem("lq_active_ref_code", refFromUrl);
        // If there's an existing saved session, only keep it if it is this user's own completed signup (own refCode !== the referrer's refCode)
        if (saved && saved.refCode && saved.refCode !== refFromUrl && saved.email) {
          setSignupData(saved);
        } else {
          // It's a new visitor arriving via the referrer's link -> show public signup form!
          localStorage.removeItem(`lq_user_signup_${slug}`);
          setSignupData(null);
        }
      } else if (saved) {
        setSignupData(saved);
      }
    } catch {
      // ignore
    }
  }, [slug, refFromUrl]);

  // Fetch public leaderboard
  useEffect(() => {
    if (!slug) return;
    api
      .get(`/w/${slug}/leaderboard`)
      .then((res) => {
        setLeaderboard(res.data?.leaderboard || []);
      })
      .catch((err) => {
        console.error("Leaderboard load failed:", err);
        setLeaderboardError("Failed to load leaderboard");
      })
      .finally(() => {
        setLeaderboardLoading(false);
      });
  }, [slug]);

  // Lightweight pageview tracking with deduplication
  useEffect(() => {
    if (!slug) return;
    try {
      let visitorId = localStorage.getItem("lq_visitor_id");
      if (!visitorId) {
        visitorId = "vis_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        localStorage.setItem("lq_visitor_id", visitorId);
      }
      api.post(`/w/${slug}/visit`, { visitorId }).catch(() => {});
    } catch {
      // silent catch
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--color-medium-gray)", fontSize: "0.9375rem" }}>Loading launch page...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <h2 style={{ color: "var(--color-black)" }}>Waitlist Not Found</h2>
        <p style={{ color: "var(--color-medium-gray)" }}>{error}</p>
        <Link to="/" className="lq-btn lq-btn-secondary">
          ← Return to LaunchQueue
        </Link>
      </div>
    );
  }

  const headline = waitlist.heroHeadline || waitlist.name;
  const subheadline = waitlist.heroSubheadline || waitlist.description;
  const features = waitlist.features?.length ? waitlist.features : [];
  const milestones = waitlist.milestones?.length ? waitlist.milestones : [];

  function handleSignupSuccess(data) {
    const enriched = {
      ...data,
      waitlistName: waitlist.name,
      milestones: waitlist.milestones,
    };
    setSignupData(enriched);
    localStorage.setItem(`lq_user_signup_${slug}`, JSON.stringify(enriched));
  }

  function handleReset() {
    localStorage.removeItem(`lq_user_signup_${slug}`);
    setSignupData(null);
  }

  function handleUpdate(updated) {
    setSignupData(updated);
    localStorage.setItem(`lq_user_signup_${slug}`, JSON.stringify(updated));
  }

  return (
    <div style={{ background: "var(--color-white)", minHeight: "100vh" }}>
      {/* Monochrome Navbar */}
      <nav className="lq-navbar">
        <div className="lq-container lq-navbar-inner">
          <div className="lq-logo">
            <div className="lq-logo-mark">
              {waitlist.name.charAt(0).toUpperCase()}
            </div>
            <span>{waitlist.name}</span>
          </div>

          <div className="lq-nav-actions">
            <Link to="/" className="lq-btn lq-btn-ghost" style={{ fontSize: "0.8125rem" }}>
              Powered by LaunchQueue
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="lq-hero">
        <div className="lq-container">
          <div className="lq-pill">
            <span className="lq-pill-dot" />
            <span>Official Early Access Queue</span>
          </div>

          <h1 className="lq-hero-title">{headline}</h1>

          {subheadline && (
            <p className="lq-hero-subtitle">{subheadline}</p>
          )}

          {/* Same-page personalized in-place view */}
          <div style={{ maxWidth: 580, margin: "0 auto 32px" }}>
            {signupData ? (
              <PersonalizedWaitlistCard
                signupData={signupData}
                slug={slug}
                onReset={handleReset}
                onUpdate={handleUpdate}
              />
            ) : (
              <div className="lq-join-box">
                <SignupForm
                  slug={slug}
                  ctaText={waitlist.ctaText || "Join the Waitlist →"}
                  onSuccess={handleSignupSuccess}
                />
                <div className="lq-join-helper">
                  <span>{waitlist.totalSignups} subscribers in queue</span>
                  <button
                    type="button"
                    onClick={() => setIsCheckModalOpen(true)}
                    className="lq-text-link"
                  >
                    Check existing rank
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Activity Feed */}
          <LiveActivityFeed slug={slug} />
        </div>
      </header>

      {/* Features Grid if present */}
      {features.length > 0 && (
        <section className="lq-section" style={{ borderTop: "1px solid var(--color-border-gray)" }}>
          <div className="lq-container">
            <div className="lq-section-header">
              <div className="lq-section-eyebrow">Product Overview</div>
              <h2 className="lq-section-title">What to expect from {waitlist.name}</h2>
            </div>

            <div className="lq-grid-2x2">
              {features.map((f, i) => (
                <div key={i} className="lq-feature-item">
                  <div className="lq-feature-icon">0{i + 1}</div>
                  <h3 className="lq-feature-name">{f.title}</h3>
                  <p className="lq-feature-text">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Milestones if present */}
      {milestones.length > 0 && (
        <section className="lq-section" style={{ background: "var(--color-bg-subtle)", borderTop: "1px solid var(--color-border-gray)" }}>
          <div className="lq-container" style={{ maxWidth: 720 }}>
            <div className="lq-section-header" style={{ textAlign: "center", margin: "0 auto 48px" }}>
              <div className="lq-section-eyebrow">Referral Rewards</div>
              <h2 className="lq-section-title" style={{ fontSize: "2rem" }}>Invite friends to unlock perks</h2>
              <p className="lq-section-desc">
                Every friend who joins using your invite link jumps you 5 spots ahead.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {milestones.map((m, idx) => (
                <div key={idx} style={{ background: "var(--color-white)", border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-black)" }}>{m.reward}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>
                    {m.referrals} {m.referrals === 1 ? "Referral" : "Referrals"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Public Referrer Leaderboard Section */}
      <section className="lq-section" style={{ borderTop: "1px solid var(--color-border-gray)" }}>
        <div className="lq-container" style={{ maxWidth: 720 }}>
          <div className="lq-section-header" style={{ textAlign: "center", margin: "0 auto 36px" }}>
            <div className="lq-section-eyebrow">Top Referrers</div>
            <h2 className="lq-section-title" style={{ fontSize: "2rem" }}>Referral Leaderboard</h2>
            <p className="lq-section-desc">
              Top community advocates climbing the queue by inviting friends.
            </p>
          </div>

          <div style={{ background: "var(--color-white)", border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-md)", padding: 20, boxShadow: "var(--shadow-sm)" }}>
            <ReferrerLeaderboard
              referrers={leaderboard}
              loading={leaderboardLoading}
              error={leaderboardError}
              isPublic={true}
            />
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="lq-footer">
        <div className="lq-container lq-footer-inner">
          <div>
            © {new Date().getFullYear()} {waitlist.name}. Built with LaunchQueue.
          </div>
          <div>
            <Link to="/" className="lq-btn lq-btn-secondary" style={{ fontSize: "0.75rem" }}>
              Create your own waitlist →
            </Link>
          </div>
        </div>
      </footer>

      {/* Check status modal */}
      <CheckStatusModal
        isOpen={isCheckModalOpen}
        onClose={() => setIsCheckModalOpen(false)}
        slug={slug}
        onFound={handleSignupSuccess}
      />
    </div>
  );
}