import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e", workers: 1, timeout: 30000, retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:4173", browserName: "chromium", channel: process.env.PLAYWRIGHT_CHANNEL || undefined, trace: "retain-on-failure" },
  webServer: [
    { command: "node e2e/server.cjs", url: "http://127.0.0.1:5051/health", reuseExistingServer: false, timeout: 120000 },
    { command: "npm run dev -- --host localhost --port 4173 --strictPort", url: "http://localhost:4173", reuseExistingServer: false,
      env: { VITE_API_URL: "http://localhost:5051/api", VITE_GOOGLE_CLIENT_ID: "" } },
  ],
});
