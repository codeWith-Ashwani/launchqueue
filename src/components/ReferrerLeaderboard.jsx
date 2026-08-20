export default function ReferrerLeaderboard({
  referrers = [],
  loading = false,
  error = "",
  isPublic = false,
}) {
  if (loading) {
    return (
      <div style={{ padding: "20px 0", textAlign: "center", color: "var(--color-medium-gray, #666)", fontSize: "0.875rem" }}>
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "var(--color-medium-gray, #666)", fontSize: "0.875rem" }}>
        Unable to load leaderboard.
      </div>
    );
  }

  if (!referrers || referrers.length === 0) {
    return (
      <div style={{
        padding: "24px 16px",
        textAlign: "center",
        color: "var(--color-medium-gray, #888)",
        background: "var(--color-bg-gray, #f9f9f9)",
        borderRadius: "var(--radius-md, 8px)",
        border: "1px dashed var(--color-border-gray, #eee)",
        fontSize: "0.875rem",
      }}>
        {isPublic
          ? "No referrals yet — share your link to claim the #1 spot!"
          : "No referrals recorded yet."}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--color-medium-gray, #888)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th style={{ padding: "8px 12px", width: "50px" }}>Rank</th>
            <th style={{ padding: "8px 12px" }}>User</th>
            <th style={{ padding: "8px 12px", textAlign: "center" }}>Referrals</th>
            <th style={{ padding: "8px 12px", textAlign: "right" }}>Queue Rank</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map((r, index) => {
            const rank = r.rank || index + 1;
            const displayEmail = r.anonymizedEmail || r.email || "Anonymous";
            return (
              <tr
                key={r._id || index}
                style={{
                  borderTop: "1px solid var(--color-border-gray, #eee)",
                  background: index === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                }}
              >
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                  {rank === 1 ? "🥇 1" : rank === 2 ? "🥈 2" : rank === 3 ? "🥉 3" : `#${rank}`}
                </td>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono, monospace)", fontSize: "0.8125rem" }}>
                  {displayEmail}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "var(--color-black, #111)" }}>
                  {r.referralCount}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--color-medium-gray, #666)" }}>
                  #{r.currentPosition}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}