import { test, expect } from "@playwright/test";
const backend = "http://127.0.0.1:5051";
test.beforeEach(async ({ page, request }) => {
  await page.route(
    /^https:\/\/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|accounts\.google\.com)\//,
    (route) => route.abort(),
  );
  expect((await request.post(`${backend}/__demo/reset`)).ok()).toBe(true);
});
async function signIn(page, admin = false) {
  await page.goto("/login");
  await page
    .getByLabel("Email address")
    .fill(admin ? "admin@example.com" : "demo@example.com");
  await page
    .getByLabel("Password", { exact: true })
    .fill(admin ? "DemoAdmin123!" : "DemoPassword123!");
  await page.getByRole("button", { name: /Log in to Dashboard/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
async function capture(page, path) {
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await expect
    .poll(() =>
      page
        .locator("[data-reveal]")
        .evaluateAll((elements) =>
          elements.every((el) => getComputedStyle(el).opacity === "1"),
        ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path, fullPage: true });
}
test("public discovery links real products and works on mobile with reduced motion", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Be early to",
  );
  await expect(
    page.getByRole("list", { name: "Product rankings" }),
  ).toContainText("Interview Demo");
  await expect(
    page.getByText("subscriber0@example.com", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "All time", exact: true }).click();
  await expect(page.locator(".product-score strong")).toHaveText("120");
  await expect
    .poll(() =>
      page
        .getByRole("heading", { level: 1 })
        .evaluate((el) => getComputedStyle(el).opacity),
    )
    .toBe("1");
  await expect(page.locator("#features h2")).toHaveCSS(
    "color",
    "rgb(250, 249, 246)",
  );
  await capture(page, "test-results/discovery-desktop.png");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page.getByRole("list", { name: "Product rankings" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Log in", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  await capture(page, "test-results/discovery-mobile.png");
  await page.getByRole("link", { name: /Interview Demo/ }).click();
  await expect(page).toHaveURL(/\/w\/interview-demo$/);
  expect(errors).toEqual([]);
});
test("founder profile manages details, campaigns, discovery and signup availability", async ({
  page,
}) => {
  await signIn(page);
  await page.getByRole("link", { name: "My profile" }).click();
  await expect(page.locator("#my-campaigns")).toContainText("Interview Demo");
  await expect(page.locator("#subscription")).toContainText(
    "25,000 signups per campaign",
  );
  await page.getByLabel("Full Name").fill("Ashwani Demo");
  await page.getByRole("button", { name: "Save Profile" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Ashwani Demo",
  );
  await page.getByRole("button", { name: "Pause signups" }).click();
  await expect(page.locator("#my-campaigns")).toContainText("Paused");
  await page.getByRole("button", { name: "Resume signups" }).click();
  await expect(page.locator("#my-campaigns")).toContainText(
    "Accepting signups",
  );
  await page.getByRole("button", { name: "Remove from discovery" }).click();
  await expect(page.locator("#my-campaigns")).toContainText("Unlisted");
  await page.getByRole("button", { name: "List on discovery" }).click();
  await expect(page.locator("#my-campaigns")).toContainText(
    "On the discovery board",
  );
  await capture(page, "test-results/founder-profile-desktop.png");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await capture(page, "test-results/founder-profile-mobile.png");
  await page.getByRole("link", { name: "Edit campaign" }).click();
  await expect(
    page.getByLabel("Feature my product on the LaunchQueue leaderboard"),
  ).toBeChecked();
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Administrator access required" }),
  ).toBeVisible();
});
test("admin explores founders, paginated users and audited product moderation", async ({
  page,
  request,
}) => {
  await signIn(page, true);
  await page.getByRole("link", { name: "Admin", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "The whole picture." }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Search founders" })
    .fill("demo@example.com");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "View campaigns" }).click();
  await expect(page.locator("tbody")).toContainText("Interview Demo");
  await page.getByRole("button", { name: "View users" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(20);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText(/Page 2 of 6/)).toBeVisible();
  await page.getByRole("button", { name: "campaigns", exact: true }).click();
  await page.getByRole("button", { name: "Hide from discovery" }).click();
  await expect(page.locator("tbody")).toContainText("Hidden by admin");
  expect(
    (await (await request.get(`${backend}/api/discover/leaderboard`)).json())
      .products,
  ).toHaveLength(0);
  await page.getByRole("button", { name: "Restore discovery" }).click();
  await expect(page.locator("tbody")).toContainText("Public discovery");
  await capture(page, "test-results/admin-desktop.png");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await capture(page, "test-results/admin-mobile.png");
});
test("Google option remains visible and a delayed SDK renders using backend configuration", async ({
  page,
}) => {
  await page.goto("/register");
  await expect(
    page.getByRole("button", { name: "Continue with Google", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    "Google sign-in is currently unavailable",
  );
  await page.route("**/api/auth/config", (route) =>
    route.fulfill({
      json: { googleClientId: "browser-test.apps.googleusercontent.com" },
    }),
  );
  await page.route("https://accounts.google.com/gsi/client", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.google = { accounts: { id: { initialize: () => {}, renderButton: (host) => { const button = document.createElement('button'); button.textContent = 'Continue with Google'; host.appendChild(button); } } } };`,
    }),
  );
  await page.getByRole("button", { name: "Try Google again" }).click();
  await expect(page.locator(".lq-google-btn-wrapper button")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with Google", exact: true }),
  ).toBeEnabled();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/register-mobile.png",
    fullPage: true,
  });
});
