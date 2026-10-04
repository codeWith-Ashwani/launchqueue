import { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ProfileCampaign = memo(function ProfileCampaign({ campaign, onChange }) {
  const pending = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function toggle(field) {
    if (pending.current) return;
    pending.current = true;
    setSaving(true);
    setError("");
    const previous = campaign[field];
    onChange(campaign._id, { [field]: !previous });
    try {
      const { data } = await api.patch(`/waitlists/${campaign._id}`, { [field]: !previous });
      onChange(campaign._id, {
        [field]: data.waitlist[field],
        discoveryHidden: data.waitlist.discoveryHidden,
      });
    } catch (err) {
      onChange(campaign._id, { [field]: previous });
      setError(err.response?.data?.error || "Couldn’t save this change. Please try again.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }
  return (
    <article className="profile-campaign" aria-busy={saving}>
      <div>
        <h3>{campaign.name}</h3>
        <Link to={`/w/${campaign.slug}`}>/w/{campaign.slug} ↗</Link>
        <p>
          <span className="account-status">{campaign.paused ? "Paused" : "Accepting signups"}</span>
          <span className="account-status">{campaign.discoveryHidden ? "Discovery hidden by admin" : campaign.discoverable ? "On the discovery board" : "Unlisted"}</span>
        </p>
        {saving && <span role="status">Saving…</span>}
        {error && <p role="alert" className="lq-msg-error">{error}</p>}
      </div>
      <div className="profile-campaign-count">
        <strong>{campaign.signupCount.toLocaleString()}</strong>
        <span>signups · {campaign.confirmedCount} confirmed</span>
      </div>
      <div className="profile-campaign-actions">
        <Link to={`/dashboard/${campaign._id}`} className="lq-btn lq-btn-secondary">View analytics</Link>
        <Link to={`/dashboard/${campaign._id}/settings`} className="lq-btn lq-btn-primary">Edit campaign ↗</Link>
        <button type="button" className="platform-text-button" disabled={saving} onClick={() => toggle("paused")}>{campaign.paused ? "Resume signups" : "Pause signups"}</button>
        <button type="button" className="platform-text-button" disabled={saving} onClick={() => toggle("discoverable")}>{campaign.discoverable ? "Remove from discovery" : "List on discovery"}</button>
      </div>
    </article>
  );
});
export default ProfileCampaign;
