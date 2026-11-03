---
name: eventsphere-ops
description: Operates EventSphere BookingApp frontend deploy, auth, Stripe, and Vercel/Render setup. Use when deploying to Vercel, debugging login/session, updating Stripe keys, merging to production, or continuing EventSphere UI/ops work from prior sessions.
disable-model-invocation: true
---

# EventSphere ops

Project-specific runbook for **BookingApp-Frontend** (EventSphere) and its Render backend.

## Repos and URLs

| Piece | Value |
|-------|--------|
| Frontend repo | `AryanSi12/BookingApp-Frontend` |
| Backend repo | `AryanSi12/BookingApp-BackEnd` |
| Production Vercel | https://booking-app-frontend-kappa.vercel.app |
| Backend API | `https://bookingapp-backend-hsy3.onrender.com` |
| Stripe provider | [`src/Components/StripeProvider.jsx`](src/Components/StripeProvider.jsx) |
| Auth helpers | [`src/lib/api.js`](src/lib/api.js) |

Preview URLs look like:
`https://booking-app-frontend-git-<branch>-aryans-projects-bbec6789.vercel.app`

## Deploy / Vercel

1. **Production** tracks `main`. Push or merge to `main` → Vercel Production redeploys.
2. **PR branches** get Preview deploys only. Changing a PR does **not** update production.
3. SPA routing uses [`vercel.json`](vercel.json) rewrite to `/index.html`.
4. After push, confirm with:
   - `gh pr view <n> --json statusCheckRollup`
   - `gh api repos/AryanSi12/BookingApp-Frontend/commits/<sha>/status`
   - Production deployments: environment `Production` on the latest `main` SHA
5. If the user says “Vercel didn’t update”, check whether they opened **production** vs **preview**, and whether `main` includes the commit.

Branch naming used by cloud agents: `cursor/<name>-739b`.

## Auth (login “success” but still signed out)

Backend `POST /Public/LoginUser` returns the **JWT as a raw string body**, not `{ token: "..." }`.

Must:

1. Extract with `extractAuthToken(response.data)` / `completeLogin()` from `src/lib/api.js`
2. Persist via `setAuthToken` → `localStorage.jwtToken` + `axios.defaults.headers.common.Authorization = Bearer …`
3. Load real profile with `GET /User/getUserDetails` (Bearer or cookie)
4. Dispatch Redux `setUserDetails({ userDetails, token })` — never store password as `userDetails`

Navbar validates with `GET /User/getCurrUser`. Without Bearer, cross-site cookies from Vercel → Render often fail and the navbar **clears** the session after the success toast.

Backend JwtFilter accepts **Bearer** or `jwtToken` cookie (`SameSite=None; Secure`). Prefer Bearer on the frontend.

CORS allowlist lives in backend `SecurityConfig` (specific origins). New Vercel preview hostnames may need to be added there if login OPTIONS/POST fails.

## Stripe

- Publishable key: `loadStripe("pk_test_…")` in `StripeProvider.jsx`
- Checkout UI: `Booking.jsx` → backend `POST /User/bookSeat/:eventId` then Stripe confirm
- Publishable key alone is not enough; backend secret key must be the **same Stripe account**

## UI / product notes from polish work

- Light marketplace shell: Outfit + DM Sans, brand rose, shared `PageShell` / surface cards
- Seat map: `SeatMap.jsx` — rows, center aisle, screen, best-available, max 10 seats
- Shared dates: `parseEventDate` / `formatEventWhen` in `src/lib/utils.js` (handles Jackson `[y,m,d,h,min]` arrays)
- Prices displayed: Regular ₹50, VIP ₹100 (UI); charged amount still from backend `amountPaid`

## When continuing this project

1. Read this skill first for deploy/auth/Stripe paths
2. Prefer fixing auth via `src/lib/api.js`, not more cookie-only logic
3. Ship production by merging/pushing `main`, then verify the Production deployment SHA
4. Do not assume preview URL === production URL
