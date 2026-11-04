---
name: ui-change-evidence
description: Use after any frontend/UI change. Captures before/after screenshots and a short screen recording of the changed flows, saves them as artifacts, and embeds them in the PR description as visual proof.
---

# UI Change Evidence

Every UI change must ship with visual proof. Never open or update a PR for frontend work without completing these steps.

## 1. Setup (once per run)
- Install Playwright if missing: `npm i -D @playwright/test && npx playwright install chromium`
- Start the app (`npm run dev`) in the background and wait until it responds on its local URL.
- If pages need auth, log in with seeded/test accounts only (organizer + end user). Never use real credentials.

## 2. Capture "before"
- Before editing, `git stash` or check out the base branch, start the app, and screenshot every page you are about to change.
- Save to `artifacts/before/<page>-<viewport>.png`.

## 3. Capture "after"
For each changed page, capture:
- Desktop (1440x900) and mobile (390x844) full-page screenshots, in light and dark mode if the app supports it.
- Interaction states where relevant: hover, focus, loading skeleton, empty state, error state, selected seat, modal open.
- Save to `artifacts/after/<page>-<viewport>[-state].png` (same names as "before" so they pair up).

## 4. Record video of key flows
Use Playwright with `recordVideo: { dir: 'artifacts/videos', size: { width: 1280, height: 720 } }` and script the real user flows touched by the change, at a human pace (`slowMo: 300`) so animations are visible:
- End user: landing, search, event detail, seat selection, checkout, confirmation.
- Organizer: dashboard, create event wizard, venue layout builder, attendees.
Only record the flows the change affects. Keep each video under ~30 seconds. Name them `artifacts/videos/<flow>.webm`.

Keep the capture script at `scripts/capture-evidence.ts` and reuse/extend it rather than rewriting it each time.

## 5. Report in the PR
Add a "Visual evidence" section to the PR description:
- A table pairing before | after screenshots per page and viewport.
- Links or embeds for each video, with one line saying what it shows.
- A short list of what changed visually and any known gaps.

## 6. Checks before finishing
- Every changed page has an after screenshot on desktop and mobile.
- No screenshot shows a crash, blank screen, console error overlay, or broken image; if one does, fix it and recapture.
- Do not commit `artifacts/` to the repo (add it to `.gitignore`); attach them to the PR or agent artifacts instead.
