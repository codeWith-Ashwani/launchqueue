export default function StatCard({ label, value }) {
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "16px 20px", flex: 1 }}>
      <p style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{value}</p>
      <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{label}</p>
    </div>
  );
}