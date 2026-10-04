import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import HomeButton from "../components/HomeButton";
import CampaignDesigner from "../components/CampaignDesigner";
import { editableCampaign, campaignPayload } from "../utils/campaignDesign";

export default function WaitlistSettings() {
  const { id } = useParams(); const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null); const [name, setName] = useState("");
  const [description, setDescription] = useState(""); const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false); const [designing, setDesigning] = useState(false);
  const [error, setError] = useState("");
  const [discoverable, setDiscoverable] = useState(false);
  useEffect(() => {
    let active = true;
    api.get(`/waitlists/${id}`).then((res) => {
      if (!active) return;
      const w = res.data.waitlist; setCampaign(editableCampaign(w));
      setName(w.name); setDescription(w.description || ""); setSlug(w.slug);
      setDiscoverable(Boolean(w.discoverable));
    }).catch(() => { if (active) setError("Could not load this campaign. Return to the dashboard and try again."); });
    return () => { active = false; };
  }, [id]);
  async function save(e) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      await api.patch(`/waitlists/${id}`, { name, description, discoverable, ...campaignPayload(campaign) });
      navigate(`/dashboard/${id}`);
    } catch (err) { setError(err.response?.data?.error || "Could not save. Your draft is preserved."); }
    finally { setSaving(false); }
  }
  return <div style={{ maxWidth: 1420, margin: "32px auto", padding: "0 24px" }}>
    <div className="lq-page-top-nav"><HomeButton /><Link to={`/dashboard/${id}`} className="lq-btn lq-btn-ghost lq-btn-sm">← Back to dashboard</Link></div>
    <h1 className="lq-dashboard-title">Design your campaign page</h1><p style={{ color: "#666", margin: "12px 0 24px" }}>Preview every change before publishing. Your public URL stays /w/{slug}.</p>
    {error && <p role="alert" className="lq-form-error-msg">{error}</p>}
    {!campaign ? <p>{error ? "" : "Loading settings…"}</p> : <form onSubmit={save}>
      <div className="lq-form-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
        <div className="lq-form-group"><label className="lq-form-label" htmlFor="campaign-name">Campaign name</label><input id="campaign-name" required maxLength={100} className="lq-input lq-input-full" value={name} disabled={saving || designing} onChange={(e) => setName(e.target.value)} /></div>
        <div className="lq-form-group"><label className="lq-form-label" htmlFor="campaign-description">Product details</label><textarea id="campaign-description" rows={3} maxLength={4000} className="lq-form-textarea" value={description} disabled={saving || designing} onChange={(e) => setDescription(e.target.value)} /></div>
      </div>
      <CampaignDesigner value={campaign} onChange={setCampaign} name={name} description={description} disabled={saving} onBusyChange={setDesigning} />
      <label className="discovery-consent"><input type="checkbox" checked={discoverable} disabled={saving || designing} onChange={(event) => setDiscoverable(event.target.checked)} /><span><strong>Feature my product on the LaunchQueue leaderboard</strong><span>Your name, description, and confirmed signup counts are public when listed. Subscriber emails stay private.</span></span></label>
      <button type="submit" disabled={saving || designing} className="lq-btn lq-btn-primary" style={{ marginBottom: 40 }}>{saving ? "Saving changes…" : "Save and publish changes"}</button>
    </form>}
  </div>;
}
