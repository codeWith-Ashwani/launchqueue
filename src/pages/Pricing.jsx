import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";

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
    } catch (_err) {
      alert("Something went wrong starting checkout");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="lq-pricing-container">
      <div className="lq-page-top-nav">
        <HomeButton />
        <Link to="/dashboard" className="lq-btn lq-btn-ghost lq-btn-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="lq-pricing-header-title">Upgrade your plan</h1>
      <div className="lq-pricing-grid">
        {plans.map((p) => (
          <div key={p.id} className="lq-pricing-card">
            <h3 className="lq-pricing-card-title">{p.name}</h3>
            <p className="lq-pricing-card-price">{p.price}</p>
            <ul className="lq-pricing-card-features">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(p.id)}
              disabled={loadingPlan === p.id}
              className="lq-btn lq-btn-primary lq-pricing-card-btn"
            >
              {loadingPlan === p.id ? "Redirecting..." : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}