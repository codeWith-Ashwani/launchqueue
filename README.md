# LaunchQueue — Frontend

[![CI](https://github.com/codeWith-Ashwani/launchqueue/actions/workflows/ci.yml/badge.svg)](https://github.com/codeWith-Ashwani/launchqueue/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)

LaunchQueue helps founders turn product ideas into branded prelaunch pages and grow early communities through referral waitlists. The frontend combines product discovery, an editable campaign designer, subscriber experiences, founder analytics, and an admin workspace.

[Live application](https://launchqueue-omega.vercel.app/) · [Backend repository](https://github.com/codeWith-Ashwani/launchqueue-backend)

## Features

- **Product discovery:** Weekly and all-time rankings of products that founders choose to list, with links to their public campaign pages.
- **AI campaign designer:** Groq-generated branding drafts based on product details and founder preferences, with a live preview and manual editing before publishing.
- **Custom campaign pages:** Editable layouts, palettes, typography, section order, images, headline copy, features, stories, FAQs, and referral milestones.
- **Referral waitlists:** Email verification, shareable referral links, private queue status recovery, masked referral leaderboards, and activity feeds.
- **Founder workspace:** Campaign analytics, paginated subscribers, queue controls, invitation delivery status, paid CSV export, and branding settings.
- **Founder profile:** Editable account details, campaign usage, subscription status, billing access, security controls, and discovery and pause/resume toggles.
- **Admin workspace:** Platform totals, searchable founder and subscriber records, campaign exploration, and discovery moderation for database-approved accounts.
- **Authentication:** Email/password login, Google sign-in, and password recovery, with a separate admin login entry in the footer.
- **Responsive motion:** GSAP animations respect reduced-motion preferences and keep content readable while animating.
- **Efficient updates:** Campaign toggles update individual rows with immediate feedback and rollback on failure. Leaderboard refreshes retain existing rows, and charts load on demand.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19, CSS |
| Build | Vite 8 |
| Routing | React Router 7 |
| Animation | GSAP, ScrollTrigger |
| API client | Axios with HttpOnly cookie sessions |
| Analytics charts | Recharts |
| Unit and component tests | Vitest, Testing Library, jsdom |
| Browser tests | Playwright |
| Hosting | Vercel |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and product discovery |
| `/register`, `/login` | Founder signup and login |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/dashboard` | Campaign overview |
| `/dashboard/new` | Create and design a campaign |
| `/dashboard/:id` | Campaign analytics and subscriber controls |
| `/dashboard/:id/settings` | Edit and publish campaign branding |
| `/profile` | Account details, campaigns, subscription, and security |
| `/pricing` | Plans and checkout |
| `/w/:slug`, `/w/:slug/welcome` | Public campaign and welcome pages |
| `/admin/login` | Admin sign-in |
| `/admin` | Database-approved administrator workspace |

## Local development

Use Node.js 22 and start the [backend](https://github.com/codeWith-Ashwani/launchqueue-backend) before using authenticated or data-driven features.

```sh
git clone https://github.com/codeWith-Ashwani/launchqueue.git
cd launchqueue
npm ci
cp .env.example .env
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env` instead of `cp`. Vite serves the application at `http://localhost:5173`.

### Environment configuration

```env
VITE_API_URL=http://localhost:5000/api
```

`VITE_API_URL` must include `/api`. Configure `GOOGLE_CLIENT_ID` on the backend; the sign-in component retrieves the public client ID through `/api/auth/config`. `VITE_GOOGLE_CLIENT_ID` is an optional frontend fallback. Groq, email, billing, and database credentials belong only on the backend.

### Local demo

Run `npm run demo` from the backend's `server/` directory and set:

```env
VITE_API_URL=http://localhost:5051/api
```

| Demo account | Email | Password |
| --- | --- | --- |
| Founder | `demo@example.com` | `DemoPassword123!` |
| Approved admin | `admin@example.com` | `DemoAdmin123!` |

The demo seeds 120 synthetic subscribers for `/w/interview-demo` in an ephemeral MongoDB replica set. Email is captured at `http://localhost:5051/__demo/inbox`, and the fixture uses no production accounts or data.

## Admin access

The footer's **Admin login** link provides sign-in at `/admin/login` and direct workspace access for already signed-in admins. Access requires `adminApproved: true` on the account's MongoDB document, set by a trusted database operator. The backend checks this approval on every admin request, so signup, profile edits, and client-side state cannot grant privileges. See the [backend setup](https://github.com/codeWith-Ashwani/launchqueue-backend#admin-access).

## Rendering and data flow

Routes load separately, and analytics charts are downloaded with the campaign detail page. Authentication callbacks and context values stay stable across renders, with a shared startup session request in development.

Profile campaign controls preserve existing rows while a save is pending. A successful response updates that campaign; a failed save restores its previous value and displays an inline error. Product discovery refreshes keep the previous results visible while the next response loads.

GSAP animations use short transform transitions without hiding content, avoid duplicate animation ownership, and honor reduced motion. Read requests avoid the mutation-only security header, while writes retain the required browser request protection.

Subscriber proof is received through URL fragments, cleared from the address bar, and used for campaign-scoped status access. Referral storage is scoped to each campaign. Analytics use UTC dates and identify the verified signup/visitor ratio explicitly.

## Testing and CI

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The latest verified suite contains **57 unit/component tests** and **11 Playwright browser flows** covering referral verification, private status recovery, founder analytics, invitations, CSV exports, AI draft publishing, manual design, discovery, profiles, admin access, Google button availability, and rendering during slow requests.

Browser tests start the real Express API with an isolated MongoDB replica set and captured email. Install backend dependencies first. The default backend path is the sibling `launchqueue/server` directory; set `LAUNCHQUEUE_BACKEND_DIR` to another absolute backend `server` path when needed. On Windows, set `PLAYWRIGHT_CHANNEL=msedge` to use installed Edge.

GitHub Actions runs lint, tests, the production build, a dependency audit, and browser flows against a pinned backend commit. The backend separately tests BullMQ and shared rate-limit counters with a real Redis service.

## Deployment

The application is hosted on [Vercel](https://launchqueue-omega.vercel.app/). Set `VITE_API_URL` to the production backend URL including `/api`, use `npm run build`, and publish `dist/`. Configure the backend's `CLIENT_URL` to match the frontend origin.

Google OAuth uses a web application client ID with the frontend origin registered. AI generation, admin approval, email delivery, and subscriptions are configured on the backend. Production builds follow the hosting project's configured Git branch.

## Author

Built and maintained by [codeWith-Ashwani](https://github.com/codeWith-Ashwani).
