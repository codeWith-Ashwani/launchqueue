# 🚀 LaunchQueue — Frontend Client

> **The modern, high-converting client application for LaunchQueue.**  
> Built with React 19, Vite, and a minimal monochrome design system inspired by Vercel, Linear, and Stripe.

[![CI](https://github.com/codeWith-Ashwani/launchqueue/actions/workflows/ci.yml/badge.svg)](https://github.com/codeWith-Ashwani/launchqueue/actions/workflows/ci.yml)
[![Stack: React 19 + Vite](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite-black?style=flat-square)](https://github.com)
[![Design: Monochrome SaaS](https://img.shields.io/badge/Design-Monochrome%20SaaS-111111?style=flat-square)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 📖 Overview

This repository contains the single-page application (SPA) client for **LaunchQueue**. It provides:
1. **Public Marketing Landing Page**: High-contrast, editorial SaaS landing page showcasing features, mechanics, rewards, and pricing.
2. **Public Waitlist Campaign Pages (`/w/:slug`)**: Branded waitlist pages featuring instant inline personalization, referral link generation, real-time activity feeds, and community leaderboards.
3. **Personalized Subscriber Queue Cards**: Shows queue rank (`#127`), positions gained, ASCII progress bars, one-click social sharing, and milestone checklists.
4. **Founder Analytics Studio (`/dashboard`)**: Campaign tracking, unique visitor metrics, conversion rates, Recharts 30-day growth curves, and one-click CSV lead exports.
5. **Live Settings Studio (`/dashboard/:id/settings`)**: Responsive 2-column live preview that updates synchronously from local state as the founder customizes their copy, accent colors, features, and rewards.

---

## 🛠️ Tech Stack & Highlights

- **React 19**: Modern hooks (`useState`, `useEffect`, `useMemo`), Context API for JWT state management.
- **Vite 8**: Ultra-fast build times and hot module replacement (HMR).
- **React Router 7**: Declarative routing with protected founder route guards (`<ProtectedRoute />`).
- **Axios**: Configured HTTP client with automated Bearer token injection.
- **Recharts**: Responsive SVG-based time-series analytics charts.
- **Pure Grayscale Design System**: Minimal monochrome CSS architecture adhering to strict typographic scale, generous whitespace, and subtle borders without distracting neon gradients.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the client directory:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
# -> Local server started on http://localhost:5173
```

### 4. Production Build
```bash
npm run build
```

---

## 📁 Directory Structure

```text
client/
├── src/
│   ├── api/
│   │   └── axios.js                     # Configured Axios client with auth interceptor
│   ├── components/
│   │   ├── CheckStatusModal.jsx         # Same-page rank lookup dialog
│   │   ├── LiveActivityFeed.jsx         # Real-time activity ticker with polling
│   │   ├── PersonalizedWaitlistCard.jsx # Subscriber dashboard with position & referral tools
│   │   ├── ProtectedRoute.jsx           # Founder route authentication guard
│   │   ├── ReferralRewardCard.jsx       # Reward milestones card
│   │   ├── ReferrerLeaderboard.jsx      # Top 10 community leaderboard
│   │   ├── ShareModal.jsx               # Multi-platform social sharing dialog
│   │   ├── SignupForm.jsx               # Waitlist email input with referral persistence
│   │   ├── SignupsChart.jsx             # Recharts 30-day signup trajectory
│   │   └── StatCard.jsx                 # Minimal metric card
│   ├── context/
│   │   └── AuthContext.jsx              # Global founder authentication & session state
│   ├── hooks/
│   │   ├── useAuth.js                   # Auth hook
│   │   └── useWaitlist.js               # Waitlist hook
│   ├── pages/
│   │   ├── CreateWaitlist.jsx           # Waitlist creation wizard
│   │   ├── Dashboard.jsx                # Founder campaign management
│   │   ├── Home.jsx                     # Public marketing landing page
│   │   ├── Login.jsx                    # Founder login
│   │   ├── Pricing.jsx                  # Subscription plans
│   │   ├── Register.jsx                 # Founder registration
│   │   ├── WaitlistDetail.jsx           # Campaign analytics & CSV export
│   │   ├── WaitlistPage.jsx             # Public waitlist campaign (/w/:slug)
│   │   ├── WaitlistSettings.jsx         # Live 2-column settings & real-time preview
│   │   └── Welcome.jsx                  # Standalone confirmation page
│   ├── index.css                        # Monochrome SaaS Design System
│   ├── main.jsx                         # Application entry point
│   └── App.jsx                          # Route configuration
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 License

MIT License.
