import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Welcome() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  const position = searchParams.get("position");
  const refCode = searchParams.get("refCode");
  const shareUrl = `${window.location.origin}/w/${slug}?ref=${refCode}`;

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <p style={{ fontSize: 48, fontWeight: 600, margin: 0 }}>#{position}</p>
      <p style={{ color: "#666", marginBottom: 32 }}>your position on the waitlist</p>

      <div
        style={{
          background: "#f5f5f5",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 13,
          color: "#666",
          marginBottom: 12,
          wordBreak: "break-all",
        }}
      >
        {shareUrl}
      </div>
      <button
        onClick={copyLink}
        style={{
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        {copied ? "Copied!" : "Copy your link"}
      </button>

      <p style={{ fontSize: 13, color: "#999", marginTop: 24 }}>
        Share your link — every signup moves you up the list.
      </p>
    </div>
  );
}