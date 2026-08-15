import { useState } from "react";
import api from "../api/axios";

const plans = [
  { id: "starter", name: "Starter", price: "$19/mo", features: ["No badge", "CSV export", "5,000 signups"] },
  { id: "pro", name: "Pro", price: "$49/mo", features: ["Custom domain", "25,000 signups", "Priority support"] },
  { id: "agency", name: "Agency", price: "$99/mo", features: ["White-label", "Unlimited everything"] },
];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  async function handleUpgrade(planId) {
    setLoadingPlan(planId);
    try {
      const res = await api.post("/payments/checkout", { plan: planId });
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert("Something went wrong starting checkout");
      setLoadingPlan(null);
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: "60px auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Upgrade your plan</h1>
      <div style={{ display: "flex", gap: 16 }}>
        {plans.map((p) => (
          <div key={p.id} style={{ flex: 1, border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginBottom: 4 }}>{p.name}</h3>
            <p style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{p.price}</p>
            <ul style={{ paddingLeft: 18, marginBottom: 20, fontSize: 13, color: "#666" }}>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(p.id)}
              disabled={loadingPlan === p.id}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {loadingPlan === p.id ? "Redirecting..." : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}