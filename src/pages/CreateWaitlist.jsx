import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";
import CampaignDesigner from "../components/CampaignDesigner";
import { editableCampaign, campaignPayload } from "../utils/campaignDesign";

export default function CreateWaitlist() {
  const [name, setName] = useState(""); const [description, setDescription] = useState("");
  const [campaign, setCampaign] = useState(() => editableCampaign());
  const [error, setError] = useState(""); const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [loading, setLoading] = useState(false); const [designing, setDesigning] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setUpgradeRequired(false); setLoading(true);
    try {
      const res = await api.post("/waitlists", { name, description, ...campaignPayload(campaign) });
      navigate(`/dashboard/${res.data.waitlist._id}`);
    } catch (err) {
      setUpgradeRequired(Boolean(err.response?.data?.upgradeRequired));
      setError(err.response?.data?.error || "Could not create your campaign. Your draft is preserved.");
    } finally { setLoading(false); }
  }
  return <div style={{ maxWidth: 1420, margin: "32px auto", padding: "0 24px" }}>
    <div className="lq-page-top-nav"><HomeButton /><Link to="/dashboard" className="lq-btn lq-btn-ghost lq-btn-sm">← Back to Dashboard</Link></div>
    <h1 className="lq-dashboard-title">Create your campaign</h1><p style={{ color: "#666", margin: "12px 0 24px" }}>Your product. Your personality. A launch page that feels like you.</p>
    <form onSubmit={handleSubmit}>
      <div className="lq-form-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
        <div className="lq-form-group"><label className="lq-form-label" htmlFor="campaign-name">Campaign name</label><input id="campaign-name" className="lq-input lq-input-full" required maxLength={100} value={name} disabled={loading || designing} onChange={(e) => setName(e.target.value)} placeholder="e.g. RocketPay" /></div>
        <div className="lq-form-group"><label className="lq-form-label" htmlFor="campaign-description">What are you launching?</label><textarea id="campaign-description" className="lq-form-textarea" rows={3} maxLength={4000} value={description} disabled={loading || designing} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product, what it does, and what makes it different." /></div>
      </div>
      <CampaignDesigner value={campaign} onChange={setCampaign} name={name} description={description} disabled={loading} onBusyChange={setDesigning} />
      {error && <p role="alert" className="lq-form-error-msg">{error}</p>}
      {upgradeRequired && <Link to="/pricing">View plans to increase your campaign limit</Link>}
      <button type="submit" disabled={loading || designing} className="lq-btn lq-btn-primary" style={{ marginBottom: 40 }}>{loading ? "Publishing…" : "Create and publish campaign →"}</button>
    </form>
  </div>;
}
