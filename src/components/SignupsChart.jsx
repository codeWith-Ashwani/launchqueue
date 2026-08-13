import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SignupsChart({ data }) {
  if (!data || data.length === 0) {
    return <p style={{ color: "#999", fontSize: 13 }}>No signups yet — the chart fills in once people join.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Line type="monotone" dataKey="signups" stroke="#111" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}