import { Link } from "react-router-dom";
import { campaignStyles, defaultPageDesign, safeImage } from "../utils/campaignDesign";
import "../styles/campaign.css";

export default function CampaignPage({ campaign, signup, activity, leaderboard, preview = false }) {
  const design = { ...defaultPageDesign(), ...campaign.pageDesign };
  const layout = ["centered", "split", "editorial"].includes(design.layout) ? design.layout : "centered";
  const logo = safeImage(design.logoUrl); const image = safeImage(campaign.heroImageUrl);
  const sections = [...new Set(design.sectionOrder || [])];
  function section(type) {
    if (type === "features" && campaign.features?.some((f) => f.title.trim())) return <>
      <div className="campaign-section-top"><span className="campaign-kicker">The difference</span><h2>{design.featureHeading || "Product highlights"}</h2></div>
      <div className="campaign-feature-grid">{campaign.features.filter((f) => f.title.trim()).map((f, i) => <article className="campaign-card" key={i}><span className="campaign-feature-icon" aria-hidden="true">{f.icon || "✦"}</span><h3>{f.title}</h3><p>{f.description}</p></article>)}</div>
    </>;
    if (type === "story" && design.story?.body) return <div className="campaign-story"><span className="campaign-kicker">A little about us</span><h2>{design.story.title}</h2><p>{design.story.body}</p></div>;
    if (type === "steps" && design.steps?.length) return <><div className="campaign-section-top"><span className="campaign-kicker">Your next steps</span><h2>How it works</h2></div><div className="campaign-feature-grid">{design.steps.map((step, i) => <article className="campaign-card" key={i}><span className="campaign-step-number">{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></>;
    if (type === "faq" && design.faq?.length) return <><div className="campaign-section-top"><span className="campaign-kicker">Good to know</span><h2>Your questions, answered</h2></div><div className="campaign-faq">{design.faq.map((item, i) => <details key={i}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></>;
    if (type === "rewards" && campaign.milestones?.some((m) => m.reward.trim() && m.referrals > 0)) return <><div className="campaign-section-top"><span className="campaign-kicker">Better together</span><h2>{design.rewardHeading}</h2><p>Each friend who verifies their email adds a five-point priority boost. Your rank depends on the queue.</p></div><div className="campaign-rewards">{campaign.milestones.filter((m) => m.reward.trim() && m.referrals > 0).map((m, i) => <div className="campaign-card campaign-reward" key={i}><strong>{m.reward}</strong><span>{m.referrals} {m.referrals === 1 ? "referral" : "referrals"}</span></div>)}</div></>;
    if (type === "leaderboard") return <><div className="campaign-section-top"><span className="campaign-kicker">Our community</span><h2>Referral Leaderboard</h2><p>Meet the people bringing their community along.</p></div><div className="campaign-card">{leaderboard || <p>Community rankings appear here as verified subscribers invite friends.</p>}</div></>;
    return null;
  }
  return <div className={`campaign-page campaign-layout-${layout} campaign-background-${design.backgroundStyle}`} style={campaignStyles(campaign, design)} data-layout={layout}>
    <nav className="campaign-nav" aria-label={preview ? "Preview brand" : "Campaign brand"}>
      <div className="campaign-brand">{logo ? <img src={logo} alt={`${campaign.name} logo`} /> : <span className="campaign-brand-mark">{campaign.name?.charAt(0).toUpperCase() || "L"}</span>}<span>{campaign.name || "Your campaign"}</span></div>
      {preview ? <span className="campaign-preview-label">Live preview</span> : <Link to="/">Powered by LaunchQueue ↗</Link>}
    </nav>
    <header className="campaign-hero">
      <div className="campaign-hero-copy"><span className="campaign-eyebrow"><span aria-hidden="true">✦</span> {design.eyebrow}</span><h1>{campaign.heroHeadline || campaign.name || "Your next big launch starts here."}</h1><p className="campaign-subtitle">{campaign.heroSubheadline || campaign.description}</p>
        {layout === "split" && <div className="campaign-visual">{image ? <img src={image} alt={`${campaign.name} product`} /> : <div className="campaign-art" aria-hidden="true"><div className="campaign-orbit" /><span>{campaign.name || "Your brand"}</span><small>A new chapter starts here</small></div>}</div>}
      </div>
      {image && layout !== "split" && <img className="campaign-hero-image" src={image} alt={`${campaign.name} product`} />}
      <div className="campaign-signup"><div className="campaign-signup-card"><span className="campaign-kicker">You're invited</span><h2>{design.signupHeading || "Get early access"}</h2>{signup || <div className="campaign-preview-signup"><input aria-label="Preview email" placeholder="name@company.com" disabled /><button type="button" disabled>{campaign.ctaText || "Join the waitlist"}</button><p>Preview · Signups are disabled</p></div>}</div>{activity}</div>
    </header>
    <main>{sections.map((type) => { const content = section(type); return content ? <section className="campaign-section" key={type} data-section={type}>{content}</section> : null; })}</main>
    <footer className="campaign-footer"><span>© {new Date().getFullYear()} {campaign.name}. Built with LaunchQueue.</span>{!preview && <Link to="/">Create your own waitlist ↗</Link>}</footer>
  </div>;
}
