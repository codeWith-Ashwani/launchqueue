export default function ReferrerLeaderboard({ referrers }) {
  if (!referrers || referrers.length === 0) {
    return <p style={{ color: "#999", fontSize: 13 }}>No referrals yet.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
      <thead>
        <tr style={{ textAlign: "left", color: "#999", fontSize: 12 }}>
          <th style={{ paddingBottom: 8 }}>Email</th>
          <th style={{ paddingBottom: 8 }}>Referrals</th>
          <th style={{ paddingBottom: 8 }}>Position</th>
        </tr>
      </thead>
      <tbody>
        {referrers.map((r) => (
          <tr key={r._id} style={{ borderTop: "1px solid #eee" }}>
            <td style={{ padding: "8px 0" }}>{r.email}</td>
            <td style={{ padding: "8px 0" }}>{r.referralCount}</td>
            <td style={{ padding: "8px 0" }}>#{r.currentPosition}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}