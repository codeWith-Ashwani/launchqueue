# LaunchQueue Frontend

React 19 and Vite frontend for referral waitlists and founder dashboards.

[Live demo](https://launchqueue-omega.vercel.app/) · [Backend repository](https://github.com/codeWith-Ashwani/launchqueue-backend)

## Features

- Public campaign pages with referral links, masked leaderboards, and activity feeds.
- Email verification before queue access and referral credit. Private status links support recovery without exposing status through public email or referral lookups.
- Founder authentication, branding settings, paginated subscriber controls, invitation delivery states, and paid CSV export.
- Pricing reflects server-enforced campaign and signup limits. Provider checkout confirms final pricing.
- Route splitting loads dashboard charts on demand, with loading and unknown-route states.

## Development

Use Node 22. Install with `npm ci`. Set `VITE_API_URL` to the backend URL including `/api`; optionally set `VITE_GOOGLE_CLIENT_ID` for Google Sign-In. Run `npm run dev` or `npm run build`.

For the isolated interview demo, run `npm run demo` from the backend's `server/` folder and set `VITE_API_URL=http://localhost:5051/api`. Sign in using `demo@example.com` / `DemoPassword123!`. The demo seeds 120 synthetic verified subscribers; test emails are captured at the backend's `/__demo/inbox` endpoint. It uses an ephemeral database and is local-only.

## Checks

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

There are 38 component tests and two Playwright browser flows. Browser fixtures start the real Express API with an isolated MongoDB replica set and captured email. Install backend dependencies first. The default backend path is the sibling `launchqueue/server` folder; set `LAUNCHQUEUE_BACKEND_DIR` to another absolute backend `server` path if needed. On Windows, `PLAYWRIGHT_CHANNEL=msedge` can use installed Edge instead of downloading Chromium.

CI checks lint, component tests, production build, dependency audit, and browser flows against a pinned backend commit. Update that pin when adopting backend changes. Browser SMTP is captured; BullMQ and shared Redis counters have separate real-Redis integration tests in the backend.

## Data and Deployment

Founder sessions use HttpOnly cookies. The Axios client adds the required browser request header. Subscriber proof arrives in URL fragments, is removed from the address bar, and is exchanged for campaign-scoped status access. Referral storage is scoped to each campaign. Subscriber table pages contain at most 50 records; changing pages clears selection.

Analytics use UTC dates and label the verified signup/visitor ratio explicitly. Missing visitor tracking is not replaced by invented counts. Queued invitation receipts refresh while the dashboard is visible. Branding, custom domains and white-label features should only be advertised when implemented.

The main JavaScript bundle is about 286 KB / 94 KB gzip, compared with 744 KB before route splitting. Founder detail charts load separately. Both npm audits reported zero vulnerabilities at the final build.

The frontend can stay on Vercel. The Render backend needs a MongoDB replica set; queued delivery also requires Redis with no eviction and a persistent background worker. Configure those services before enabling queue mode. Local planning and performance notes live in gitignored `docs/`.
