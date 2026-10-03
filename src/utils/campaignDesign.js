export const sectionLabels = { features: "Product highlights", story: "Brand story", steps: "How it works", faq: "Questions", rewards: "Referral rewards", leaderboard: "Leaderboard" };
export function defaultPageDesign() {
  return {
    layout: "centered", backgroundColor: "#faf9f6", surfaceColor: "#ffffff",
    fontFamily: "sans", cornerStyle: "rounded", backgroundStyle: "solid",
    eyebrow: "Be part of what comes next", signupHeading: "Get early access",
    featureHeading: "Made for what's next", rewardHeading: "Bring your people. Unlock more.",
    logoUrl: "", sectionOrder: ["features", "rewards", "leaderboard"],
    story: { title: "Our story", body: "" }, steps: [], faq: [],
  };
}
export function editableCampaign(campaign = {}) {
  return {
    heroHeadline: campaign.heroHeadline || "", heroSubheadline: campaign.heroSubheadline || "",
    heroImageUrl: campaign.heroImageUrl || "", accentColor: safeColor(campaign.accentColor, "#4438ca"),
    ctaText: campaign.ctaText || "Join the waitlist", features: campaign.features || [],
    milestones: campaign.milestones || [], thankYouMessage: campaign.thankYouMessage || "",
    pageDesign: { ...defaultPageDesign(), ...campaign.pageDesign },
  };
}
export function safeColor(value, fallback) { return /^#[a-fA-F0-9]{6}$/.test(value || "") ? value : fallback; }
export function safeImage(value) { try { return new URL(value).protocol === "https:" ? value : ""; } catch { return ""; } }
export function foreground(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((v) => parseInt(v, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? "#000000" : "#ffffff";
}
export function campaignPayload(value) {
  return {
    ...value,
    features: value.features.filter((f) => f.title.trim()).map(({ icon, title, description }) => ({ icon, title: title.trim(), description })),
    milestones: value.milestones.filter((m) => m.reward.trim() && m.referrals > 0).map(({ referrals, reward }) => ({ referrals, reward })).sort((a, b) => a.referrals - b.referrals),
    pageDesign: { ...value.pageDesign, steps: value.pageDesign.steps.filter((s) => s.title.trim()), faq: value.pageDesign.faq.filter((f) => f.question.trim()) },
  };
}
export function campaignStyles(campaign, design) {
  const background = safeColor(design.backgroundColor, "#faf9f6");
  const surface = safeColor(design.surfaceColor, "#ffffff");
  const accent = safeColor(campaign.accentColor, "#4438ca");
  const text = foreground(background); const surfaceText = foreground(surface);
  return {
    "--campaign-bg": background, "--campaign-surface": surface, "--campaign-accent": accent,
    "--campaign-text": text, "--campaign-surface-text": surfaceText, "--campaign-button-text": foreground(accent),
    "--campaign-border": `${text}30`, "--campaign-radius": { sharp: "2px", rounded: "20px", pill: "32px" }[design.cornerStyle] || "20px",
    "--campaign-font": { sans: "Inter, system-ui, sans-serif", serif: "Georgia, 'Times New Roman', serif", mono: "'Courier New', monospace" }[design.fontFamily] || "system-ui, sans-serif",
    "--color-white": surface, "--color-black": surfaceText, "--color-medium-gray": surfaceText,
    "--color-border-gray": `${surfaceText}30`, "--color-bg-gray": surface, "--color-bg-subtle": surface,
  };
}
