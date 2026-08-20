import { useState, useEffect } from "react";
import api from "../api/axios";

function formatRelativeTime(dateString) {
  if (!dateString) return "just now";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.max(0, Math.floor((now - past) / 1000));

  if (diffInSeconds < 45) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default function LiveActivityFeed({ slug }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    function fetchActivity() {
      api
        .get(`/w/${slug}/activity`)
        .then((res) => {
          if (isMounted) {
            setActivities(res.data?.activities || []);
          }
        })
        .catch(() => {
          // Silent catch to prevent breaking the parent page
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    fetchActivity();
    // Poll every 45 seconds
    const interval = setInterval(fetchActivity, 45000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [slug]);

  if (loading || !activities || activities.length === 0) {
    return null; // Gracefully hide when no activity yet or loading
  }

  // Show up to the 3 most recent real activities
  const recent = activities.slice(0, 3);

  return (
    <div
      style={{
        maxWidth: 580,
        margin: "0 auto 24px",
        padding: "10px 16px",
        background: "var(--color-bg-gray, #f9f9f9)",
        border: "1px solid var(--color-border-gray, #e5e5e5)",
        borderRadius: "var(--radius-md, 8px)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "var(--color-medium-gray, #666)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 6px #22c55e",
            display: "inline-block",
          }}
        />
        <span>Live Activity</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {recent.map((item, idx) => (
          <div
            key={item.id || idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8125rem",
              color: "var(--color-black, #111)",
            }}
          >
            <span>
              <strong>Someone</strong> ({item.userMasked}) joined at #{item.position}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-medium-gray, #888)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
