import { useState } from "react";

export default function ShareModal({ isOpen, onClose, shareUrl, waitlistName = "LaunchQueue", position }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const defaultText = `I just joined the waitlist for ${waitlistName} at #${position || "1"}! Jump ahead with my invite link:`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(defaultText);

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const shareTargets = [
    {
      name: "WhatsApp",
      symbol: "WA",
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: "X (Twitter)",
      symbol: "X",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      symbol: "in",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      symbol: "TG",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "Reddit",
      symbol: "RD",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    },
    {
      name: "Email",
      symbol: "@",
      url: `mailto:?subject=Join%20${encodeURIComponent(waitlistName)}%20with%20me&body=${encodedText}%0A%0A${encodedUrl}`,
    },
  ];

  return (
    <div className="lq-modal-overlay" onClick={onClose}>
      <div className="lq-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="lq-modal-title-row">
          <h3 className="lq-modal-title-text">Share & Move Up</h3>
          <button className="lq-modal-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--color-medium-gray)", marginBottom: 20 }}>
          Every friend who joins using your link advances your position by <strong>5 spots</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: 20 }}>
          {shareTargets.map((target) => (
            <a
              key={target.name}
              href={target.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lq-btn lq-btn-secondary"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px 8px",
                fontSize: "0.8125rem",
                gap: "4px",
                textAlign: "center",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.9375rem" }}>
                {target.symbol}
              </span>
              <span>{target.name}</span>
            </a>
          ))}
        </div>

        <div style={{ background: "var(--color-bg-gray)", border: "1px solid var(--color-border-gray)", borderRadius: "var(--radius-sm)", padding: 8, display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--color-black)",
              fontSize: "0.8125rem",
              fontFamily: "var(--font-mono)",
              outline: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          />
          <button
            onClick={copyLink}
            className="lq-btn lq-btn-primary"
            style={{ padding: "6px 12px", fontSize: "0.75rem" }}
          >
            {copied ? "Copied ✓" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
