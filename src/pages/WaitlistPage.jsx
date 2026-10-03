import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useWaitlist } from "../hooks/useWaitlist";
import api from "../api/axios";
import SignupForm from "../components/SignupForm";
import PersonalizedWaitlistCard from "../components/PersonalizedWaitlistCard";
import CheckStatusModal from "../components/CheckStatusModal";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";
import LiveActivityFeed from "../components/LiveActivityFeed";
import CampaignPage from "../components/CampaignPage";

export default function WaitlistPage() {
  const { slug } = useParams();
  const { waitlist, loading, error } = useWaitlist(slug);
  const [statusError, setStatusError] = useState("");
  const [signupData, setSignupData] = useState(null);
  const [privateLink, setPrivateLink] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    return { status: params.get("status"), verify: params.get("verify"), revision: 0 };
  });
  const statusTokenFromLink = privateLink.status;
  const verificationTokenFromLink = privateLink.verify;
  const privateRequest = useRef(null);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

  const [searchParams] = useSearchParams();
  const refFromUrl = searchParams.get("ref");

  useEffect(() => {
    const receiveLink = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      if (params.has("status") || params.has("verify")) setPrivateLink((previous) => ({
        status: params.get("status"), verify: params.get("verify"), revision: previous.revision + 1,
      }));
    };
    window.addEventListener("hashchange", receiveLink);
    return () => window.removeEventListener("hashchange", receiveLink);
  }, []);

  // Restore saved session for this waitlist
  useEffect(() => {
    let active = true;
    const privateToken = statusTokenFromLink;
    if (privateToken || verificationTokenFromLink) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      const key = `${slug}:${verificationTokenFromLink || privateToken}`;
      if (privateRequest.current?.key !== key) privateRequest.current = { key, promise: verificationTokenFromLink
        ? api.post(`/w/${slug}/verify`, { token: verificationTokenFromLink })
        : api.get(`/w/${slug}/position`, { headers: { "X-Subscriber-Token": privateToken } }) };
      privateRequest.current.promise
        .then((res) => {
          if (!active) return;
          setStatusError("");
          setSignupData(res.data);
          localStorage.setItem(`lq_user_signup_${slug}`, JSON.stringify(res.data));
        }).catch(() => { if (active) setStatusError("This private link is invalid or expired. Request a new link using Check existing rank."); });
      return () => { active = false; };
    }
    try {
      const savedStr = localStorage.getItem(`lq_user_signup_${slug}`);
      const saved = savedStr ? JSON.parse(savedStr) : null;

      if (refFromUrl) {
        sessionStorage.setItem(`lq_active_ref_code_${slug}`, refFromUrl);
        // If there's an existing saved session, only keep it if it is this user's own completed signup (own refCode !== the referrer's refCode)
        if (saved && saved.statusToken && saved.refCode && saved.refCode !== refFromUrl && saved.email) {
          setSignupData(saved);
        } else {
          // It's a new visitor arriving via the referrer's link -> show public signup form!
          localStorage.removeItem(`lq_user_signup_${slug}`);
          setSignupData(null);
        }
      } else if (saved?.statusToken) {
        setSignupData(saved);
      }
    } catch {
      // ignore
    }
  }, [slug, refFromUrl, statusTokenFromLink, verificationTokenFromLink, privateLink.revision]);

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

  const signup = <>
    {statusError && <p role="alert">{statusError}</p>}
    {signupData ? <PersonalizedWaitlistCard signupData={signupData} slug={slug} onReset={handleReset} onUpdate={handleUpdate} /> : <>
      {waitlist.paused ? <p>This campaign is currently paused. Check back for updates.</p> : <SignupForm slug={slug} ctaText={waitlist.ctaText || "Join the waitlist"} onSuccess={handleSignupSuccess} />}
      <div className="lq-join-helper"><span>{waitlist.totalSignups} subscribers in queue</span><button type="button" className="lq-text-link" onClick={() => setIsCheckModalOpen(true)}>Check existing rank</button></div>
    </>}
  </>;
  return <>
    <CampaignPage campaign={waitlist} signup={signup} activity={<LiveActivityFeed slug={slug} />} leaderboard={<ReferrerLeaderboard referrers={leaderboard} loading={leaderboardLoading} error={leaderboardError} isPublic />} />
    <CheckStatusModal isOpen={isCheckModalOpen} onClose={() => setIsCheckModalOpen(false)} slug={slug} onFound={handleSignupSuccess} />
  </>;
}
