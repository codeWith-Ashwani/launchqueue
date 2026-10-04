import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppNav from "../components/AppNav";
import ProductLeaderboard from "../components/ProductLeaderboard";
import { useAuth } from "../hooks/useAuth";
import { usePageMotion } from "../hooks/usePageMotion";
export default function Home() {
  const { founder } = useAuth();
  const [params] = useSearchParams();
  const root = useRef(null);
  usePageMotion(root);
  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("lq_active_ref_code", ref);
      localStorage.setItem("lq_active_ref_code", ref);
    }
  }, [params]);
  return (
    <div className="discovery-home" ref={root}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <AppNav />
      <main id="main-content">
        <header className="discovery-hero platform-container">
          <div className="discovery-hero-copy">
            <span className="platform-eyebrow" data-hero>
              <span className="status-dot" />
              FOR THE ONES WHO GET THERE FIRST
            </span>
            <h1 data-hero>
              Be early to
              <br />
              what’s <span className="hero-highlight">next.</span>
            </h1>
            <p data-hero>
              A home for bold ideas and the people who believe in them. Discover
              emerging products, join their waitlists, and help shape their
              launch.
            </p>
            <div className="hero-actions" data-hero>
              <a href="#leaderboard" className="lq-btn lq-btn-primary">
                Explore the leaderboard ↓
              </a>
              <Link
                to={founder ? "/dashboard" : "/register"}
                className="lq-btn lq-btn-secondary"
              >
                {founder
                  ? "Your founder workspace ↗"
                  : "I’m building something ↗"}
              </Link>
            </div>
            <p className="hero-small" data-hero>
              For founders: your first 500 signups are free.
            </p>
          </div>
          <div
            className="discovery-art"
            data-hero
            aria-label="LaunchQueue connects ideas to early communities"
          >
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <span className="art-spark art-spark-one" aria-hidden="true">
              ✦
            </span>
            <span className="art-spark art-spark-two" aria-hidden="true">
              ✳
            </span>
            <div className="art-label">YOUR NEXT BIG THING</div>
            <div className="art-core">
              <span>
                Ideas
                <br />
                in orbit.
              </span>
              <span className="art-core-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="art-note art-note-one">
              <span className="status-dot" />
              First in line.
              <br />
              <strong>Part of the story.</strong>
            </div>
            <div className="art-note art-note-two">
              <span aria-hidden="true">＋</span> One idea.
              <br />
              <strong>A whole community.</strong>
            </div>
            <span className="art-caption">Built to be discovered.</span>
          </div>
        </header>
        <div className="discovery-marquee" aria-hidden="true">
          <span>EARLY ACCESS</span>
          <span>✦</span>
          <span>BOLD IDEAS</span>
          <span>✦</span>
          <span>REAL COMMUNITIES</span>
          <span>✦</span>
          <span>YOUR NEXT FAVORITE</span>
        </div>
        <div className="platform-container">
          <ProductLeaderboard />
        </div>
        <section
          id="how-it-works"
          className="discovery-how platform-container"
          data-reveal
        >
          <div className="platform-section-heading">
            <div>
              <span className="platform-eyebrow">
                FROM INTEREST TO MOMENTUM
              </span>
              <h2>
                A better way
                <br />
                to begin.
              </h2>
            </div>
            <p>
              You don’t need a huge audience.
              <br />
              You need your first believers.
            </p>
          </div>
          <div className="discovery-step-grid">
            {[
              [
                "01",
                "Find your people",
                "Discover a product that speaks to you and join its community before launch.",
              ],
              [
                "02",
                "Bring a friend",
                "Your invite link moves you up the queue when a friend confirms their email.",
              ],
              [
                "03",
                "Build your beginning",
                "Founders get a branded page, referral rewards, and a clear view of their audience.",
              ],
            ].map(([number, title, text]) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="features" className="founder-invitation" data-reveal>
          <div className="platform-container">
            <span className="platform-eyebrow">
              FOUNDERS, THIS IS YOUR SPACE
            </span>
            <h2>
              You build the idea.
              <br />
              We help build the <em>anticipation.</em>
            </h2>
            <p>
              Design your campaign with AI, make it your own, and turn your
              earliest signups into your biggest advocates.
            </p>
            <Link
              to={founder ? "/dashboard/new" : "/register"}
              className="lq-btn"
            >
              Start your next chapter ↗
            </Link>
            <span className="founder-invitation-note">
              Custom pages · Referral rewards · Founder analytics
            </span>
          </div>
        </section>
      </main>
      <footer className="discovery-footer platform-container">
        <Link to="/" className="platform-brand">
          LaunchQueue.
        </Link>
        <p>For what comes next. Built by codeWith-Ashwani.</p>
        <div>
          <a href="#leaderboard">Discover</a>
          <Link to={founder ? "/profile" : "/login"}>
            {founder ? "My profile" : "Founder login"}
          </Link>
        </div>
      </footer>
    </div>
  );
}
