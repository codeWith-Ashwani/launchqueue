import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

export default function Home() {
  const { founder, logout } = useAuth();
  const [founderWaitlists, setFounderWaitlists] = useState([]);
  const [loadingWaitlists, setLoadingWaitlists] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [searchParams] = useSearchParams();

  // Preserve any referral code from URL
  useEffect(() => {
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      sessionStorage.setItem("lq_active_ref_code", urlRef);
      localStorage.setItem("lq_active_ref_code", urlRef);
    }
  }, [searchParams]);

  // Fetch founder waitlists when founder is logged in
  useEffect(() => {
    if (!founder) {
      setFounderWaitlists([]);
      return;
    }

    setLoadingWaitlists(true);
    api
      .get("/waitlists")
      .then((res) => {
        setFounderWaitlists(res.data.waitlists || []);
      })
      .catch((err) => {
        console.error("Failed to load founder waitlists:", err);
        setFounderWaitlists([]);
      })
      .finally(() => setLoadingWaitlists(false));
  }, [founder]);

  function handleCopyPublicLink(slug) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/w/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setToastMessage("Public link copied ✓");
    setTimeout(() => {
      setCopiedSlug("");
      setToastMessage("");
    }, 2200);
  }

  function handleFounderLogout() {
    logout();
    setFounderWaitlists([]);
  }

  return (
    <div style={{ background: "var(--color-white)", minHeight: "100vh" }}>
      {/* Minimal Monochrome Navbar */}
      <nav className="lq-navbar">
        <div className="lq-container lq-navbar-inner">
          <Link to="/" className="lq-logo">
            <div className="lq-logo-mark">LQ</div>
            <span>LaunchQueue</span>
          </Link>

          <div className="lq-nav-links">
            <a href="#features" className="lq-nav-link">Features</a>
            <a href="#how-it-works" className="lq-nav-link">How It Works</a>
            <a href="#rewards" className="lq-nav-link">Rewards</a>
          </div>

          <div className="lq-nav-actions">
            {founder ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-medium-gray)", display: "none", sm: "inline" }}>
                  {founder.email}
                </span>
                <Link to="/dashboard" className="lq-btn lq-btn-primary">
                  Dashboard →
                </Link>
                <button
                  onClick={handleFounderLogout}
                  className="lq-btn lq-btn-ghost"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="lq-btn lq-btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="lq-btn lq-btn-primary">
                  Start Free Waitlist
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="lq-hero">
        <div className="lq-container">
          {/* If founder is LOGGED IN: Show their personalized campaign overview */}
          {founder ? (
            <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "left" }}>
              <div className="lq-pill">
                <span className="lq-pill-dot" />
                <span>Founder Active · {founder.plan ? `${founder.plan} plan` : "Active session"}</span>
              </div>

              <h1 className="lq-hero-title" style={{ fontSize: "2.75rem", textAlign: "left", marginBottom: 12 }}>
                Welcome back, {founder.email.split("@")[0]}.
              </h1>

              <p className="lq-hero-subtitle" style={{ textAlign: "left", margin: "0 0 32px" }}>
                Here is your live launch campaign and referral momentum overview.
              </p>

              {/* Toast for copy */}
              {toastMessage && (
                <div style={{ marginBottom: 16 }}>
                  <span className="lq-toast-pill">{toastMessage}</span>
                </div>
              )}

              {/* Founder Active Waitlists Card */}
              <div style={{ border: "1px solid var(--color-black)", borderRadius: "var(--radius-lg)", padding: 28, background: "var(--color-white)", boxShadow: "var(--shadow-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--color-border-gray)" }}>
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-black)" }}>Your Active Waitlists</h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>Live campaigns running on LaunchQueue</p>
                  </div>
                  <Link to="/dashboard/new" className="lq-btn lq-btn-secondary" style={{ fontSize: "0.75rem" }}>
                    + New Waitlist
                  </Link>
                </div>

                {loadingWaitlists ? (
                  <div style={{ padding: "20px 0", color: "var(--color-medium-gray)", fontSize: "0.875rem" }}>
                    Loading your campaign data...
                  </div>
                ) : founderWaitlists.length === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center" }}>
                    <p style={{ color: "var(--color-medium-gray)", fontSize: "0.875rem", marginBottom: 16 }}>
                      You haven't created a waitlist yet.
                    </p>
                    <Link to="/dashboard/new" className="lq-btn lq-btn-primary">
                      Create Your First Waitlist →
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {founderWaitlists.map((w) => (
                      <div
                        key={w._id}
                        style={{
                          border: "1px solid var(--color-border-gray)",
                          borderRadius: "var(--radius-md)",
                          padding: 16,
                          background: "var(--color-bg-subtle)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <div style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--color-black)" }}>{w.name}</div>
                            <div style={{ fontSize: "0.8125rem", color: "var(--color-medium-gray)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                              /w/{w.slug}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-black)" }}>
                              {w.signupCount !== undefined ? w.signupCount : 0}
                            </div>
                            <div style={{ fontSize: "0.6875rem", color: "var(--color-medium-gray)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                              Total Signups
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid var(--color-border-gray)" }}>
                          <button
                            onClick={() => handleCopyPublicLink(w.slug)}
                            className="lq-btn lq-btn-secondary"
                            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                          >
                            {copiedSlug === w.slug ? "Copied ✓" : "Copy Public Link"}
                          </button>
                          <a
                            href={`/w/${w.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="lq-btn lq-btn-secondary"
                            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                          >
                            View Live Page ↗
                          </a>
                          <Link
                            to={`/dashboard/${w._id}`}
                            className="lq-btn lq-btn-primary"
                            style={{ fontSize: "0.75rem", padding: "6px 12px", marginLeft: "auto" }}
                          >
                            Analytics & Settings →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* If founder is LOGGED OUT: Show public marketing hero explaining LaunchQueue */
            <div>
              <div className="lq-pill">
                <span className="lq-pill-dot" />
                <span>The Viral Waitlist Platform for SaaS</span>
              </div>

              <h1 className="lq-hero-title">
                Your launch starts here.
              </h1>

              <p className="lq-hero-subtitle">
                Turn early interest into viral referral growth. Give your audience a live position they can climb by inviting friends. Embeds anywhere in 60 seconds.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                <Link to="/register" className="lq-btn lq-btn-primary lq-btn-lg">
                  Start Free Waitlist →
                </Link>
                <Link to="/login" className="lq-btn lq-btn-secondary lq-btn-lg">
                  Founder Log In
                </Link>
                <a
                  href="#how-it-works"
                  onClick={() => {
                    const el = document.getElementById("how-it-works");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="lq-btn lq-btn-ghost lq-btn-lg"
                >
                  See How It Works ↓
                </a>
              </div>

              <div style={{ fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>
                Free for your first 500 signups. No credit card required.
              </div>
            </div>
          )}
        </div>
      </header>

      {/* PRODUCT PREVIEW MOCKUP (Monochrome Real SaaS Screenshot Style) */}
      <section className="lq-preview-section">
        <div className="lq-container">
          <div className="lq-mockup-frame">
            <div className="lq-mockup-header">
              <div className="lq-mockup-dots">
                <div className="lq-mockup-dot" />
                <div className="lq-mockup-dot" />
                <div className="lq-mockup-dot" />
              </div>
              <div className="lq-mockup-search">launchqueue.com/w/rocketpay</div>
            </div>

            <div className="lq-mockup-body">
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-medium-gray)", fontWeight: 600 }}>
                    Live Queue Dashboard
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-black)", marginTop: 4 }}>
                    You're #127 on the list
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-medium-gray)", marginTop: 2 }}>
                    You moved up 57 places through 3 referrals.
                  </p>
                </div>

                {/* Progress bar in mockup */}
                <div style={{ background: "var(--color-bg-gray)", border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-black)", marginBottom: 6 }}>
                    <span>Referral Progress</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>3 / 5 referrals</span>
                  </div>
                  <div style={{ height: 6, background: "var(--color-border-gray)", borderRadius: 9999, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: "60%", height: "100%", background: "var(--color-black)" }} />
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)" }}>
                    Next reward: <strong>Early Access Beta</strong> (2 more referrals needed)
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, padding: "8px 12px", background: "var(--color-bg-gray)", border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem", fontFamily: "var(--font-mono)" }}>
                    launchqueue.com/?ref=X7K9PQ
                  </div>
                  <button className="lq-btn lq-btn-secondary" style={{ fontSize: "0.75rem" }}>
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Mini analytics cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="lq-mockup-card">
                  <div className="lq-mockup-card-title">Total Signups</div>
                  <div className="lq-mockup-number">4,820</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)", marginTop: 4 }}>+450 this week</div>
                </div>

                <div className="lq-mockup-card">
                  <div className="lq-mockup-card-title">Viral Multiplier</div>
                  <div className="lq-mockup-number">3.4x</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)", marginTop: 4 }}>Average invites per user</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="lq-section" style={{ borderTop: "1px solid var(--color-border-gray)" }}>
        <div className="lq-container">
          <div className="lq-section-header">
            <div className="lq-section-eyebrow">Features</div>
            <h2 className="lq-section-title">Engineered for viral momentum</h2>
            <p className="lq-section-desc">
              Everything required to run a high-converting waitlist with psychological gamification and referral mechanics.
            </p>
          </div>

          <div className="lq-grid-2x2">
            <div className="lq-feature-item">
              <div className="lq-feature-icon">01</div>
              <h3 className="lq-feature-name">Waitlist Management</h3>
              <p className="lq-feature-text">
                Create, customize, and deploy launch waitlists with custom colors, copy, and button branding in minutes.
              </p>
            </div>

            <div className="lq-feature-item">
              <div className="lq-feature-icon">02</div>
              <h3 className="lq-feature-name">Referral Growth</h3>
              <p className="lq-feature-text">
                Every signup receives a personal invite link. Sharing automatically boosts their queue position in real time.
              </p>
            </div>

            <div className="lq-feature-item">
              <div className="lq-feature-icon">03</div>
              <h3 className="lq-feature-name">Analytics & Exports</h3>
              <p className="lq-feature-text">
                Track signup velocity, conversion rates, and referral leaders. Export verified subscriber data to CSV in one click.
              </p>
            </div>

            <div className="lq-feature-item">
              <div className="lq-feature-icon">04</div>
              <h3 className="lq-feature-name">Customization & Embeds</h3>
              <p className="lq-feature-text">
                Drop into Next.js, React, Webflow, or vanilla HTML with a single script. Built-in anti-fraud filters out disposable emails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="lq-section" style={{ background: "var(--color-bg-subtle)", borderTop: "1px solid var(--color-border-gray)" }}>
        <div className="lq-container">
          <div className="lq-section-header">
            <div className="lq-section-eyebrow">How It Works</div>
            <h2 className="lq-section-title">A simple four-step process</h2>
            <p className="lq-section-desc">
              From launch setup to exponential subscriber growth with zero infrastructure overhead.
            </p>
          </div>

          <div className="lq-steps-row">
            <div className="lq-step-box">
              <div className="lq-step-number">01</div>
              <h4 className="lq-step-heading">Create your waitlist</h4>
              <p className="lq-step-info">Configure branding, custom reward tiers, and launch settings in the dashboard.</p>
            </div>

            <div className="lq-step-box">
              <div className="lq-step-number">02</div>
              <h4 className="lq-step-heading">Share your launch</h4>
              <p className="lq-step-info">Embed the waitlist on your site with one line of code, or share your hosted page.</p>
            </div>

            <div className="lq-step-box">
              <div className="lq-step-number">03</div>
              <h4 className="lq-step-heading">Invite friends</h4>
              <p className="lq-step-info">Subscribers receive personal referral codes and live queue positions.</p>
            </div>

            <div className="lq-step-box">
              <div className="lq-step-number">04</div>
              <h4 className="lq-step-heading">Move up the queue</h4>
              <p className="lq-step-info">Friends join, positions advance, and milestone rewards unlock automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REFERRAL REWARD SYSTEM SHOWCASE */}
      <section id="rewards" className="lq-section" style={{ borderTop: "1px solid var(--color-border-gray)" }}>
        <div className="lq-container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
            <div>
              <div className="lq-section-eyebrow">Reward System</div>
              <h2 className="lq-section-title" style={{ fontSize: "2.25rem" }}>
                Incentivize sharing with milestone rewards
              </h2>
              <p className="lq-section-desc" style={{ marginBottom: 24 }}>
                Subscribers share when there is clear utility. Each successful invitation awards +5 positions and unlocks tiered product perks.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "0.9375rem", color: "var(--color-near-black)" }}>
                <div>✓ <strong>+5 positions gained</strong> for every friend referral</div>
                <div>✓ Automated rank-up email triggers when friends join</div>
                <div>✓ Disposable email filter blocks fraudulent self-referrals</div>
              </div>
            </div>

            {/* Milestone Cards Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Move Up Queue</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)" }}>Priority placement</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>1 Referral</div>
              </div>

              <div style={{ border: "1px solid var(--color-black)", background: "var(--color-bg-gray)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Bigger Position Boost</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)" }}>Skip 15 spots instantly</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", fontWeight: 600 }}>3 Referrals</div>
              </div>

              <div style={{ border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Early Beta Access</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)" }}>Guaranteed day-one invite</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>5 Referrals</div>
              </div>

              <div style={{ border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9375rem" }}>VIP / Founder Circle</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-medium-gray)" }}>Lifetime perks & roadmap access</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-medium-gray)" }}>10 Referrals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF & STATS (Dark Rhythm Section) */}
      <section className="lq-section-dark">
        <div className="lq-container">
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <div className="lq-section-eyebrow">Proven Results</div>
            <h2 className="lq-section-title">Built for high-velocity product launches</h2>
            <p className="lq-section-desc">
              Trusted by founders launching developer tools, AI platforms, and fintech apps.
            </p>
          </div>

          <div className="lq-stats-grid">
            <div>
              <div className="lq-stat-item-num">3.4x</div>
              <div className="lq-stat-item-label">Average Viral Multiplier</div>
            </div>
            <div>
              <div className="lq-stat-item-num">250k+</div>
              <div className="lq-stat-item-label">Queue Positions Tracked</div>
            </div>
            <div>
              <div className="lq-stat-item-num">&lt; 60s</div>
              <div className="lq-stat-item-label">Average Time to Deploy</div>
            </div>
            <div>
              <div className="lq-stat-item-num">99.4%</div>
              <div className="lq-stat-item-label">Email Deliverability</div>
            </div>
          </div>

          <div className="lq-quote-box">
            <p className="lq-quote-text">
              "We collected 12,000 signups in 5 days before our launch. Over 68% of users invited at least two friends to jump ahead in the queue. The referral loop turned our launch into an organic movement."
            </p>
            <div className="lq-quote-author">
              — Marcus Reynolds, Founder of CogniFlow
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="lq-final-cta">
        <div className="lq-container">
          <h2 className="lq-final-cta-title">Ready to launch?</h2>
          <p className="lq-final-cta-subtitle">
            Create your waitlist in under a minute. Free for your first 500 signups. No credit card required.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {founder ? (
              <Link to="/dashboard" className="lq-btn lq-btn-primary lq-btn-lg">
                Go to Founder Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="lq-btn lq-btn-primary lq-btn-lg">
                  Start Free Waitlist →
                </Link>
                <Link to="/login" className="lq-btn lq-btn-secondary lq-btn-lg">
                  Founder Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="lq-footer">
        <div className="lq-container lq-footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="lq-logo" style={{ fontSize: "0.9375rem" }}>
              <div className="lq-logo-mark" style={{ width: 20, height: 20, fontSize: 10 }}>LQ</div>
              <span>LaunchQueue</span>
            </div>
            <span>© {new Date().getFullYear()} LaunchQueue Inc.</span>
          </div>

          <div className="lq-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#rewards">Rewards</a>
            {founder ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <>
                <Link to="/login">Founder Login</Link>
                <Link to="/register">Create Waitlist</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}