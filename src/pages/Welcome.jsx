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
    <div className="lq-welcome-container">
      <p className="lq-welcome-position">#{position}</p>
      <p className="lq-welcome-sub">your position on the waitlist</p>

      <div className="lq-welcome-sharebox">
        {shareUrl}
      </div>
      <button onClick={copyLink} className="lq-btn lq-btn-primary">
        {copied ? "Copied! ✓" : "Copy your link"}
      </button>

      <p className="lq-welcome-help">
        Share your link — every signup moves you up the list.
      </p>
    </div>
  );
}