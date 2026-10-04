import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import CampaignPage from "./CampaignPage";
import { sectionLabels } from "../utils/campaignDesign";
import "../styles/designer.css";

export default function CampaignDesigner({ value, onChange, name, description, disabled = false, onBusyChange }) {
  const [preferences, setPreferences] = useState({ brief: "", audience: "", tone: "professional", layout: "auto", accentColor: "" });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [previous, setPrevious] = useState(null); const [viewport, setViewport] = useState("desktop");
  const latest = useRef({ name, description, value });
  const request = useRef(null);
  useEffect(() => { latest.current = { name, description, value }; }, [name, description, value]);
  useEffect(() => () => request.current?.abort(), []);
  const design = value.pageDesign;
  const update = (field, next) => onChange({ ...value, [field]: next });
  const updateDesign = (field, next) => update("pageDesign", { ...design, [field]: next });
  const editItem = (field, index, key, next) => updateDesign(field, design[field].map((item, i) => i === index ? { ...item, [key]: next } : item));

  async function generate() {
    setError(""); setNotice("");
    if (!name.trim()) { setError("Enter a campaign name first."); return; }
    if (preferences.brief.trim().length < 10) { setError("Describe your brand in at least 10 characters."); return; }
    const snapshot = { ...latest.current };
    const controller = new AbortController(); request.current = controller;
    setGenerating(true);
    onBusyChange?.(true);
    try {
      const response = await api.post("/waitlists/design", { name, description, preferences }, { signal: controller.signal, timeout: 45000 });
      if (latest.current.name !== snapshot.name || latest.current.description !== snapshot.description) { setError("Campaign details changed while generating. Generate again with your updated details."); return; }
      setPrevious(snapshot.value);
      onChange({ ...latest.current.value, ...response.data.design, pageDesign: { ...response.data.design.pageDesign, logoUrl: latest.current.value.pageDesign.logoUrl } });
      setNotice("Your AI draft is ready. Review the preview and edit anything before publishing.");
    } catch (err) {
      if (!controller.signal.aborted) setError(err.response?.data?.error || "Could not generate a design. Your current draft is unchanged.");
    } finally { if (!controller.signal.aborted) { setGenerating(false); onBusyChange?.(false); } }
  }
  function moveSection(index, direction) {
    const sections = [...design.sectionOrder]; const target = index + direction;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    updateDesign("sectionOrder", sections);
  }

  return <div className="designer-grid">
    <div className="designer-controls">
      <section className="designer-ai">
        <span className="designer-tag">AI brand studio</span><h2>Make it feel like your brand.</h2><p>Describe the look, audience, and personality. Generate a complete editable page draft.</p>
        <fieldset disabled={disabled || generating}>
          <label htmlFor="brand-brief">Your brand direction</label><textarea id="brand-brief" maxLength={2000} rows={4} value={preferences.brief} onChange={(e) => setPreferences({ ...preferences, brief: e.target.value })} placeholder="A calm skincare launch with warm cream colors, olive accents, editorial typography, and a story-first page. No hype." />
          <label htmlFor="brand-audience">Who is this for?</label><input id="brand-audience" maxLength={300} value={preferences.audience} onChange={(e) => setPreferences({ ...preferences, audience: e.target.value })} placeholder="e.g. Independent makers and small teams" />
          <div className="designer-row"><div><label htmlFor="brand-tone">Tone</label><select id="brand-tone" value={preferences.tone} onChange={(e) => setPreferences({ ...preferences, tone: e.target.value })}>{["professional", "playful", "calm", "bold"].map((tone) => <option key={tone}>{tone}</option>)}</select></div><div><label htmlFor="preferred-layout">Preferred layout</label><select id="preferred-layout" value={preferences.layout} onChange={(e) => setPreferences({ ...preferences, layout: e.target.value })}><option value="auto">Let AI choose</option><option value="centered">Centered</option><option value="split">Split</option><option value="editorial">Editorial</option></select></div></div>
          <label htmlFor="preferred-color">Preferred accent color (optional)</label><input id="preferred-color" placeholder="#446644" value={preferences.accentColor} maxLength={7} onChange={(e) => setPreferences({ ...preferences, accentColor: e.target.value })} />
          <p className="designer-hint">Generating sends your campaign details and brand brief to Groq. Keep private customer information out of your brief. <a href="https://console.groq.com/docs/your-data" target="_blank" rel="noopener noreferrer">How Groq handles your data</a></p>
          <button type="button" onClick={generate} className="designer-generate">{generating ? "Designing your campaign…" : "✦ Generate branded page"}</button>
        </fieldset>
        {generating && <p role="status">Creating your layout, colors, sections, and copy. This may take a few seconds.</p>}
        {error && <p role="alert" className="designer-error">{error}</p>}
        {notice && <p role="status" className="designer-notice">{notice}</p>}
        {previous && <button type="button" className="designer-link" disabled={disabled || generating} onClick={() => { onChange(previous); setPrevious(null); setNotice("Your previous draft was restored."); }}>Undo AI draft</button>}
      </section>
      <fieldset className="designer-manual" disabled={disabled || generating}>
        <h2>Fine-tune your page</h2><p className="designer-hint">Every detail is editable, with or without AI.</p>
        <div className="designer-row"><div><label htmlFor="page-layout">Page layout</label><select id="page-layout" value={design.layout} onChange={(e) => updateDesign("layout", e.target.value)}><option value="centered">Centered launch</option><option value="split">Split showcase</option><option value="editorial">Editorial story</option></select></div><div><label htmlFor="page-font">Typography</label><select id="page-font" value={design.fontFamily} onChange={(e) => updateDesign("fontFamily", e.target.value)}><option value="sans">Modern sans</option><option value="serif">Editorial serif</option><option value="mono">Technical mono</option></select></div></div>
        <div className="designer-colors">{[["accentColor", "Accent", value.accentColor], ["backgroundColor", "Background", design.backgroundColor], ["surfaceColor", "Cards", design.surfaceColor]].map(([key, label, color]) => <label key={key}>{label}<input aria-label={`${label} color`} type="color" value={color} onChange={(e) => key === "accentColor" ? update(key, e.target.value) : updateDesign(key, e.target.value)} /></label>)}</div>
        <div className="designer-row"><div><label htmlFor="page-corners">Corners</label><select id="page-corners" value={design.cornerStyle} onChange={(e) => updateDesign("cornerStyle", e.target.value)}>{["sharp", "rounded", "pill"].map((corner) => <option key={corner}>{corner}</option>)}</select></div><div><label htmlFor="page-background">Background style</label><select id="page-background" value={design.backgroundStyle} onChange={(e) => updateDesign("backgroundStyle", e.target.value)}>{["solid", "gradient", "grid"].map((style) => <option key={style}>{style}</option>)}</select></div></div>
        <label htmlFor="brand-logo">Logo image URL</label><input id="brand-logo" type="url" value={design.logoUrl} placeholder="https://…" onChange={(e) => updateDesign("logoUrl", e.target.value)} />
        <label htmlFor="hero-image">Product / hero image URL</label><input id="hero-image" type="url" value={value.heroImageUrl} placeholder="https://…" onChange={(e) => update("heroImageUrl", e.target.value)} />
        <p className="designer-hint">Use your own HTTPS images. AI designs the page; it does not generate product photos.</p>
        <label htmlFor="page-eyebrow">Intro badge</label><input id="page-eyebrow" maxLength={80} value={design.eyebrow} onChange={(e) => updateDesign("eyebrow", e.target.value)} />
        <label htmlFor="page-headline">Headline</label><textarea id="page-headline" rows={2} maxLength={180} value={value.heroHeadline} placeholder={name || "Your headline"} onChange={(e) => update("heroHeadline", e.target.value)} />
        <label htmlFor="page-subheadline">Subheadline</label><textarea id="page-subheadline" rows={3} maxLength={600} value={value.heroSubheadline} placeholder={description} onChange={(e) => update("heroSubheadline", e.target.value)} />
        <label htmlFor="signup-heading">Signup heading</label><input id="signup-heading" maxLength={100} value={design.signupHeading} onChange={(e) => updateDesign("signupHeading", e.target.value)} />
        <label htmlFor="page-cta">Button text</label><input id="page-cta" maxLength={60} value={value.ctaText} onChange={(e) => update("ctaText", e.target.value)} />
        <h3>Sections and order</h3><p className="designer-hint">Enable sections and move them into the order that tells your story.</p>
        {Object.entries(sectionLabels).map(([type, label]) => <label className="designer-checkbox" key={type}><input type="checkbox" checked={design.sectionOrder.includes(type)} onChange={(e) => updateDesign("sectionOrder", e.target.checked ? [...design.sectionOrder, type] : design.sectionOrder.filter((item) => item !== type))} />{label}</label>)}
        <ol className="designer-section-order">{design.sectionOrder.map((type, i) => <li key={type}><span>{sectionLabels[type]}</span><button type="button" aria-label={`Move ${sectionLabels[type]} up`} disabled={i === 0} onClick={() => moveSection(i, -1)}>↑</button><button type="button" aria-label={`Move ${sectionLabels[type]} down`} disabled={i === design.sectionOrder.length - 1} onClick={() => moveSection(i, 1)}>↓</button></li>)}</ol>
        <details><summary>Product highlights</summary><label htmlFor="features-heading">Section heading</label><input id="features-heading" maxLength={120} value={design.featureHeading} onChange={(e) => updateDesign("featureHeading", e.target.value)} />
          {value.features.map((item, i) => <div className="designer-item" key={i}><label>Icon<input aria-label={`Feature ${i + 1} icon`} value={item.icon} maxLength={16} onChange={(e) => update("features", value.features.map((f, j) => j === i ? { ...f, icon: e.target.value } : f))} /></label><label>Title<input aria-label={`Feature ${i + 1} title`} maxLength={120} value={item.title} onChange={(e) => update("features", value.features.map((f, j) => j === i ? { ...f, title: e.target.value } : f))} /></label><label>Description<textarea aria-label={`Feature ${i + 1} description`} maxLength={600} value={item.description} onChange={(e) => update("features", value.features.map((f, j) => j === i ? { ...f, description: e.target.value } : f))} /></label><button type="button" onClick={() => update("features", value.features.filter((_, j) => i !== j))}>Remove highlight</button></div>)}
          <button type="button" disabled={value.features.length >= 6} onClick={() => update("features", [...value.features, { icon: "✦", title: "", description: "" }])}>+ Add highlight</button>
        </details>
        <details><summary>Brand story</summary><label htmlFor="story-title">Story heading</label><input id="story-title" maxLength={120} value={design.story.title} onChange={(e) => updateDesign("story", { ...design.story, title: e.target.value })} /><label htmlFor="story-body">Your story</label><textarea id="story-body" rows={5} maxLength={1500} value={design.story.body} onChange={(e) => updateDesign("story", { ...design.story, body: e.target.value })} /></details>
        <details><summary>How it works</summary>{design.steps.map((step, i) => <div className="designer-item" key={i}><label>Step title<input aria-label={`Step ${i + 1} title`} maxLength={120} value={step.title} onChange={(e) => editItem("steps", i, "title", e.target.value)} /></label><label>Description<textarea aria-label={`Step ${i + 1} description`} maxLength={600} value={step.description} onChange={(e) => editItem("steps", i, "description", e.target.value)} /></label><button type="button" onClick={() => updateDesign("steps", design.steps.filter((_, j) => i !== j))}>Remove step</button></div>)}<button type="button" disabled={design.steps.length >= 6} onClick={() => updateDesign("steps", [...design.steps, { title: "", description: "" }])}>+ Add step</button></details>
        <details><summary>Questions and answers</summary>{design.faq.map((faq, i) => <div className="designer-item" key={i}><label>Question<input aria-label={`FAQ ${i + 1} question`} maxLength={160} value={faq.question} onChange={(e) => editItem("faq", i, "question", e.target.value)} /></label><label>Answer<textarea aria-label={`FAQ ${i + 1} answer`} maxLength={600} value={faq.answer} onChange={(e) => editItem("faq", i, "answer", e.target.value)} /></label><button type="button" onClick={() => updateDesign("faq", design.faq.filter((_, j) => i !== j))}>Remove question</button></div>)}<button type="button" disabled={design.faq.length >= 6} onClick={() => updateDesign("faq", [...design.faq, { question: "", answer: "" }])}>+ Add question</button></details>
        <details><summary>Referral rewards</summary><label htmlFor="rewards-heading">Rewards heading</label><input id="rewards-heading" maxLength={120} value={design.rewardHeading} onChange={(e) => updateDesign("rewardHeading", e.target.value)} /><p className="designer-hint">Set rewards you will actually provide. AI does not invent rewards.</p>{value.milestones.map((m, i) => <div className="designer-item" key={i}><label>Referrals needed<input type="number" min="1" step="1" aria-label={`Reward ${i + 1} referrals`} value={m.referrals} onChange={(e) => update("milestones", value.milestones.map((item, j) => i === j ? { ...item, referrals: Number(e.target.value) } : item))} /></label><label>Reward<input aria-label={`Reward ${i + 1} description`} maxLength={200} value={m.reward} onChange={(e) => update("milestones", value.milestones.map((item, j) => i === j ? { ...item, reward: e.target.value } : item))} /></label><button type="button" onClick={() => update("milestones", value.milestones.filter((_, j) => i !== j))}>Remove reward</button></div>)}<button type="button" disabled={value.milestones.length >= 20} onClick={() => update("milestones", [...value.milestones, { referrals: 1, reward: "" }])}>+ Add reward</button></details>
        <label htmlFor="thank-you">Invitation message</label><textarea id="thank-you" rows={2} maxLength={4000} value={value.thankYouMessage} onChange={(e) => update("thankYouMessage", e.target.value)} />
      </fieldset>
    </div>
    <div className="designer-preview"><div className="designer-preview-toolbar"><span>YOUR CAMPAIGN PREVIEW</span><div><button type="button" aria-pressed={viewport === "desktop"} onClick={() => setViewport("desktop")}>Desktop</button><button type="button" aria-pressed={viewport === "mobile"} onClick={() => setViewport("mobile")}>Mobile</button></div></div><div className={`designer-preview-canvas designer-preview-${viewport}`}><CampaignPage campaign={{ ...value, name, description }} preview /></div></div>
  </div>;
}
