import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function FunnelChart({ funnel }) {
  if (!funnel || (funnel.totalPageViews === 0 && funnel.totalSignups === 0)) {
    return (
      <div className="lq-funnel-empty">
        No funnel data yet — page views and signups will appear as visitors arrive.
      </div>
    );
  }

  const data = [
    { stage: "Page Views", count: funnel.totalPageViews || 0, color: "#9ca3af" },
    { stage: "Total Signups", count: funnel.totalSignups || 0, color: "#111827" },
    { stage: "Direct Signups", count: funnel.directSignups || 0, color: "#4b5563" },
    { stage: "Referred Signups", count: funnel.referredSignups || 0, color: "#047857" },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
