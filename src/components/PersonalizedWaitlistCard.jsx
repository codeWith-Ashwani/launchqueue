import { useState, useMemo } from "react";
import api from "../api/axios";
import ShareModal from "./ShareModal";

export default function PersonalizedWaitlistCard({
  signupData,
  slug = "launchqueue",
  onReset,
  onUpdate,
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const position = signupData?.position || 1;
  const referralCount = signupData?.referralCount || 0;
  const basePosition = signupData?.basePosition || position;

  // Calculate positions gained (base - current or explicit)
  const explicitGain = signupData?.positionsGained !== undefined ? signupData.positionsGained : 0;
  const positionsGained = Math.max(explicitGain, Math.max(0, basePosition - position), referralCount * 5);

  const refCode = signupData?.refCode || "ABC123";

  // Share URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isCustomSlug = slug && slug !== "launchqueue";
  const shareUrl = isCustomSlug
    ? `${origin}/w/${slug}?ref=${refCode}`
    : `${origin}/?ref=${refCode}`;

  // Default monochrome milestone ladder
  const defaultMilestones = [
    { referrals: 1, reward: "Move Up Queue (Priority Placement)" },
    { referrals: 3, reward: "Bigger Position Boost (+15 Spots)" },
    { referrals: 5, reward: "Early Product Beta Access" },
    { referrals: 10, reward: "VIP Founder Circle Perks" },
  ];

  const milestones = useMemo(() => {
    const list = signupData?.milestones?.length ? signupData.milestones : defaultMilestones;
    return [...list].sort((a, b) => a.referrals - b.referrals);
  }, [signupData]);

  // Find next milestone target
  const nextMilestone = milestones.find((m) => m.referrals > referralCount);
  const targetReferrals = nextMilestone ? nextMilestone.referrals : milestones[milestones.length - 1]?.referrals || 5;
  const neededReferrals = nextMilestone ? nextMilestone.referrals - referralCount : 0;

  // Progress fraction & ASCII Bar
  const progressPercent = nextMilestone
    ? Math.min(100, Math.round((referralCount / targetReferrals) * 100))
    : 100;

  const asciiBar = useMemo(() => {
    const totalBlocks = 10;
    const filledBlocks = Math.min(
      totalBlocks,
      Math.max(0, Math.round((referralCount / targetReferrals) * totalBlocks))
    );
    const emptyBlocks = totalBlocks - filledBlocks;
    const bar = "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
    return `${bar} ${referralCount} / ${targetReferrals}`;
  }, [referralCount, targetReferrals]);

  function handleCopyCode() {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setToastMessage("Referral code copied ✓");
    setTimeout(() => {
      setCopiedCode(false);
      setToastMessage("");
    }, 2200);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setToastMessage("Referral link copied ✓");
    setTimeout(() => {
      setCopiedLink(false);
      setToastMessage("");
    }, 2200);
  }

  function handleWhatsAppShare() {
    const text = `I just joined the waitlist for ${signupData?.waitlistName || "LaunchQueue"} at #${position}! Use my referral link to skip ahead: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function handleShareAction() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Join ${signupData?.waitlistName || "LaunchQueue"} Waitlist`,
          text: `I just joined at #${position}! Use my referral link to skip ahead:`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          setIsShareModalOpen(true);
        }
        return;
      }
    }
    setIsShareModalOpen(true);
  }

  async function handleRefreshRank() {
    setRefreshing(true);
    try {
      const res = await api.get(`/w/${slug}/position`, {
        params: { ref: refCode },
      });
      if (res.data && onUpdate) {
        onUpdate({
          ...signupData,
          position: res.data.position,
          referralCount: res.data.referralCount,
          positionsGained: res.data.positionsGained,
          basePosition: res.data.basePosition,
        });
        setToastMessage("Position refreshed ✓");
        setTimeout(() => setToastMessage(""), 2200);
      }
    } catch {
      setToastMessage("Could not refresh position");
      setTimeout(() => setToastMessage(""), 2200);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="lq-card-personalized">
      {/* Top status bar */}
      <div className="lq-card-topbar">
        <div>
          <div className="lq-status-title">You're on the list.</div>
          {signupData?.email && (
            <div className="lq-status-email">{signupData.email}</div>
          )}
        </div>

        <button
          onClick={handleRefreshRank}
          disabled={refreshing}
          className="lq-btn lq-btn-ghost"
          style={{ fontSize: "0.75rem", padding: "4px 8px" }}
          title="Refresh position"
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {/* Inline Toast */}
      {toastMessage && (
        <div style={{ marginBottom: 16 }}>
          <span className="lq-toast-pill">{toastMessage}</span>
        </div>
      )}

      {/* Big Position Display */}
      <div className="lq-position-hero">
        <div className="lq-position-badge-group">
          <span className="lq-position-label">Current Position</span>
          <span className="lq-position-value">#{position}</span>
        </div>

        {positionsGained > 0 ? (
          <span className="lq-position-gain-tag">
            ↑ {positionsGained} places gained
          </span>
        ) : (
          <span className="lq-position-gain-tag">
            Invite friends to climb
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="lq-stat-row">
        <div className="lq-stat-box">
          <div className="lq-stat-box-label">Referrals</div>
          <div className="lq-stat-box-num">{referralCount} {referralCount === 1 ? "referral" : "referrals"}</div>
        </div>

        <div className="lq-stat-box">
          <div className="lq-stat-box-label">Positions Gained</div>
          <div className="lq-stat-box-num">+{positionsGained} places</div>
        </div>
      </div>

      {/* Referral Code & Links */}
      <div className="lq-code-container">
        <div className="lq-code-header">
          <span className="lq-code-header-label">Your Referral Code</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--color-medium-gray)" }}>+5 spots per invite</span>
        </div>

        <div className="lq-code-row">
          <span className="lq-code-pill">{refCode}</span>
          <button
            onClick={handleCopyCode}
            className="lq-btn lq-btn-secondary"
            style={{ flex: 1 }}
          >
            {copiedCode ? "Copied ✓" : "Copy Code"}
          </button>
          <button
            onClick={handleCopyLink}
            className="lq-btn lq-btn-secondary"
            style={{ flex: 1 }}
          >
            {copiedLink ? "Copied ✓" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Referral Reward & Progress System */}
      <div className="lq-reward-progress-box">
        <div className="lq-reward-header">
          <span className="lq-reward-label">Referral Progress</span>
          <span className="lq-reward-fraction">{referralCount} / {targetReferrals} referrals</span>
        </div>

        {/* ASCII progress representation */}
        <div className="lq-ascii-track">{asciiBar}</div>

        {/* Grayscale progress bar */}
        <div className="lq-bar-track">
          <div
            className="lq-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Next reward description */}
        <div className="lq-next-reward-text">
          {nextMilestone ? (
            <>
              <strong>Next Reward:</strong> {nextMilestone.reward} ({neededReferrals} more referral{neededReferrals === 1 ? "" : "s"} needed)
            </>
          ) : (
            <strong>All milestone rewards unlocked.</strong>
          )}
        </div>

        {/* Compact Milestone Checklist */}
        <div className="lq-milestones-compact">
          {milestones.map((m) => {
            const isUnlocked = referralCount >= m.referrals;
            return (
              <div
                key={m.referrals}
                className={`lq-milestone-row ${isUnlocked ? "is-unlocked" : ""}`}
              >
                <span>{isUnlocked ? "✓" : "○"} {m.reward}</span>
                <span className="lq-milestone-pts">{m.referrals} {m.referrals === 1 ? "ref" : "refs"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="lq-card-actions">
        <button
          onClick={handleShareAction}
          className="lq-btn lq-btn-primary"
          style={{ flex: 2 }}
        >
          Share & Move Up →
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="lq-btn lq-btn-secondary"
          style={{ flex: 1 }}
        >
          WhatsApp
        </button>
      </div>

      {/* Switch email helper link */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        {onReset && (
          <button onClick={onReset} className="lq-text-link">
            Not your email? Check a different address
          </button>
        )}
      </div>

      {/* Share modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        waitlistName={signupData?.waitlistName || "LaunchQueue"}
        position={position}
      />
    </div>
  );
}
