import { test, expect } from "@playwright/test";
const backend = "http://127.0.0.1:5051";
test.beforeEach(async ({ request, page }) => {
  // These password-login flows use local fonts and do not need Google's sign-in script.
  await page.route(/^https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|accounts\.google\.com)\//, (route) => route.abort());
  expect((await request.post(`${backend}/__demo/reset`)).ok()).toBe(true);
});
async function emailLink(request, to, marker) {
  const response = await request.get(`${backend}/__demo/inbox`, { params: { to } });
  const { emails } = await response.json();
  const message = emails.find((email) => email.html.includes(marker));
  expect(message).toBeTruthy();
  return message.html.match(/href="([^"]+)"/)[1].replaceAll("&amp;", "&");
}
test("subscriber verifies, earns one referral credit and recovers private status", async ({ page, request }) => {
  await page.goto("/w/interview-demo?ref=DEMO0");
  await page.getByPlaceholder("name@company.com").fill("browser@example.com");
  await page.getByRole("button", { name: /join the waitlist/i }).click();
  await expect(page.getByRole("status")).toContainText("Check your inbox");
  await expect(page.getByText("browser@example.com", { exact: true })).toHaveCount(0);
  const link = await emailLink(request, "browser@example.com", "#verify=");
  await page.goto(link);
  await expect(page.getByText("browser@example.com", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/w\/interview-demo$/);
  await page.goto(link);
  await expect(page.getByText("browser@example.com", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/w\/interview-demo$/);
  const leaderboard = await (await request.get(`${backend}/api/w/interview-demo/leaderboard`)).json();
  expect(leaderboard.leaderboard[0].referralCount).toBe(1);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Check existing rank" }).click();
  await page.locator(".lq-modal-dialog").getByPlaceholder("name@company.com").fill("browser@example.com");
  await page.getByRole("button", { name: /email my status link/i }).click();
  await expect(page.locator(".lq-modal-dialog").getByRole("status")).toContainText("Check your inbox");
  const statusLink = await emailLink(request, "browser@example.com", "#status=");
  await page.goto(statusLink);
  await expect(page.getByText("browser@example.com", { exact: true })).toBeVisible();
});
test("founder logs in, pages subscribers, invites and downloads CSV", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("founder@company.com").fill("demo@example.com");
  await page.locator('input[type="password"]').fill("DemoPassword123!");
  await page.getByRole("button", { name: /log in to dashboard/i }).click();
  await page.getByRole("link", { name: /Interview Demo/ }).click();
  await expect(page.getByText("Showing 50 of 120 subscribers")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Page 2 of 3")).toBeVisible();
  await page.getByLabel("Select subscriber50@example.com").check();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /batch invite selected/i }).click();
  await expect(page.getByText("Delivered 1 invitation(s).")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /export signups as csv/i }).click();
  expect((await download).suggestedFilename()).toBe("interview-demo-signups.csv");
});

test("founder generates a draft, publishes branding and keeps the live signup flow", async ({ page, request }) => {
  await page.goto("/login");
  await page.getByPlaceholder("founder@company.com").fill("demo@example.com");
  await page.locator('input[type="password"]').fill("DemoPassword123!");
  await page.getByRole("button", { name: /log in to dashboard/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/dashboard/new");
  await page.getByLabel("Campaign name").fill("Maker Studio");
  await page.getByLabel("What are you launching?").fill("A focused workspace for independent makers.");
  await page.getByLabel("Your brand direction").fill("Calm editorial design in olive and cream with a story section.");
  // Only the external AI response is a fixture; saving and public rendering use the real API.
  await page.route("**/api/waitlists/design", (route) => route.fulfill({ json: { design: {
    heroHeadline: "A quieter way to build.", heroSubheadline: "A focused workspace for independent makers.",
    ctaText: "Join the studio", accentColor: "#476344",
    features: [{ icon: "✦", title: "Find your focus", description: "Keep your project details together." }],
    pageDesign: { layout: "editorial", backgroundColor: "#f6f2e9", surfaceColor: "#ffffff", fontFamily: "serif", cornerStyle: "sharp", backgroundStyle: "solid", eyebrow: "For independent makers", signupHeading: "Your next chapter", featureHeading: "A workspace with purpose", rewardHeading: "Bring a friend", logoUrl: "", sectionOrder: ["story", "features", "faq"], story: { title: "Built around you", body: "A focused workspace for independent projects." }, steps: [], faq: [{ question: "Who is this for?", answer: "Independent makers." }] },
  } } }));
  await page.getByRole("button", { name: /Generate branded page/ }).click();
  await expect(page.getByText(/Your AI draft is ready/)).toBeVisible();
  await expect(page.getByLabel("Headline", { exact: true })).toHaveValue("A quieter way to build.");
  await page.getByLabel("Headline", { exact: true }).fill("Make room for your next idea.");
  await page.getByRole("button", { name: /Create and publish campaign/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/[a-f0-9]{24}$/);
  const id = page.url().split("/").pop();
  await page.goto("/w/maker-studio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Make room for your next idea.");
  await expect(page.locator(".campaign-page")).toHaveAttribute("data-layout", "editorial");
  await expect(page.getByRole("heading", { name: "Built around you" })).toBeVisible();
  await page.getByText("Who is this for?", { exact: true }).click();
  await expect(page.getByText("Independent makers.", { exact: true })).toBeVisible();
  await page.getByPlaceholder("name@company.com").fill("branded@example.com");
  await page.getByRole("button", { name: "Join the studio" }).click();
  await expect(page.getByRole("status")).toContainText("Check your inbox");
  const link = await emailLink(request, "branded@example.com", "#verify=");
  await page.goto(link);
  await expect(page.getByText("branded@example.com", { exact: true })).toBeVisible();
  await page.goto(`/dashboard/${id}/settings`);
  await expect(page.getByLabel("Headline", { exact: true })).toHaveValue("Make room for your next idea.");
  await page.getByLabel("Page layout").selectOption("split");
  await page.getByLabel("Typography").selectOption("sans");
  await page.getByRole("button", { name: "Save and publish changes" }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/${id}$`));
  await page.goto("/w/maker-studio");
  await expect(page.locator(".campaign-page")).toHaveAttribute("data-layout", "split");
  await page.screenshot({ path: "test-results/branded-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/branded-mobile.png", fullPage: true });
});

test("founder can manually customize a campaign when AI is unavailable", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("founder@company.com").fill("demo@example.com");
  await page.locator('input[type="password"]').fill("DemoPassword123!");
  await page.getByRole("button", { name: /log in to dashboard/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("/dashboard/new");
  await page.getByLabel("Campaign name").fill("Orbit");
  await page.getByLabel("Your brand direction").fill("A bold dark technical page for developers.");
  await page.getByRole("button", { name: /Generate branded page/ }).click();
  await expect(page.getByRole("alert")).toContainText("AI design is not configured");
  await page.getByLabel("Headline", { exact: true }).fill("Ship your next idea.");
  await page.getByLabel("Page layout").selectOption("centered");
  await page.getByLabel("Typography").selectOption("mono");
  await page.getByLabel("Background color").fill("#10121b");
  await page.getByLabel("Cards color").fill("#191d2b");
  await page.getByLabel("Accent color", { exact: true }).fill("#b7ff62");
  await page.getByRole("button", { name: /Create and publish campaign/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/[a-f0-9]{24}$/);
  await page.goto("/w/orbit");
  await expect(page.getByRole("heading", { name: "Ship your next idea." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Join the waitlist" })).toHaveCSS("background-color", "rgb(183, 255, 98)");
  await page.screenshot({ path: "test-results/branded-dark.png", fullPage: true });
});
