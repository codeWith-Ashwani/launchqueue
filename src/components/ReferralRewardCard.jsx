import { useState } from "react";
import api from "../api/axios";

export default function ReferralRewardCard({ slug, signupData, milestones, accentColor, onUpdate }) {
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${signupData.refCode}`;
  const referralCount = signupData.referralCount || 0;

  const sorted = [...milestones].sort((a, b) => a.referrals - b.referrals);
  const nextMilestone = sorted.find((m) => m.referrals > referralCount);
  const progress = nextMilestone
    ? Math.min(100, (referralCount / nextMilestone.referrals) * 100)
    : 100;

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await api.get(`/w/${slug}/position`, { params: { ref: signupData.refCode } });
      onUpdate({ ...signupData, position: res.data.position, referralCount: res.data.referralCount });
    } finally {
      setRefreshing(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join the waitlist", url: shareUrl });
        return;
      } catch {
        /* user cancelled share sheet, fall through to copy */
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="lq-reward-card">
      <p className="lq-reward-position">#{signupData.position}</p>
      <p className="lq-reward-sub">your position — {referralCount} referral{referralCount === 1 ? "" : "s"} so far</p>

      <div className="lq-share-row">
        <div className="lq-share-url">{shareUrl}</div>
        <button className="lq-share-btn" style={{ background: accentColor }} onClick={handleShare}>
          {copied ? "Copied!" : "Share link"}
        </button>
      </div>

      <div className="lq-milestones">
        {nextMilestone ? (
          <>
            <div className="lq-progress-track">
              <div className="lq-progress-fill" style={{ width: `${progress}%`, background: accentColor }} />
            </div>
            <p className="lq-progress-label">
              {nextMilestone.referrals - referralCount} more referral{nextMilestone.referrals - referralCount === 1 ? "" : "s"} to unlock: <strong>{nextMilestone.reward}</strong>
            </p>
          </>
        ) : (
          <p className="lq-progress-label">🏆 All rewards unlocked!</p>
        )}

        <div className="lq-milestone-list">
          {sorted.map((m) => (
            <div key={m.referrals} className={`lq-milestone-item ${referralCount >= m.referrals ? "unlocked" : ""}`}>
              <span>{referralCount >= m.referrals ? "✅" : "🔒"}</span>
              <span>{m.reward}</span>
              <span className="lq-milestone-count">{m.referrals} ref{m.referrals === 1 ? "" : "s"}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="lq-refresh-btn" onClick={handleRefresh} disabled={refreshing}>
        {refreshing ? "Checking..." : "↻ Refresh my rank"}
      </button>
    </div>
  );
}