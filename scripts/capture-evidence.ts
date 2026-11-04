/**
 * Visual evidence for UI phases.
 * Usage: node --experimental-strip-types scripts/capture-evidence.ts <before|after|videos>
 * Requires the Vite dev server at BASE_URL (default http://127.0.0.1:5173).
 */
import { chromium, type Browser, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const phase = process.argv[2] || "before";
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const root = path.resolve("artifacts");

const PLACEHOLDER_ID = "507f1f77bcf86cd799439011";

const pages: { name: string; path: string }[] = [
  { name: "home", path: "/" },
  { name: "login", path: "/login" },
  { name: "signup-user", path: "/signup-user" },
  { name: "signup-organizer", path: "/signup-organizer" },
  { name: "events", path: "/get-all-events" },
  { name: "book-events", path: "/book-events" },
  { name: "explore", path: "/explore" },
  { name: "organizer", path: "/Organizer" },
  { name: "profile", path: "/profile" },
  { name: "my-bookings", path: "/my-bookings" },
  { name: "create-event", path: "/create-event" },
  { name: "create-venue", path: "/create-venue" },
  { name: "my-events", path: "/my-events" },
  { name: "my-venues", path: "/my-venues" },
  { name: "event-detail", path: `/event/${PLACEHOLDER_ID}` },
  { name: "venue-detail", path: `/venue-by-id/${PLACEHOLDER_ID}` },
  { name: "booking", path: `/booking/${PLACEHOLDER_ID}` },
  { name: "ticket", path: `/ticket/${PLACEHOLDER_ID}` },
  { name: "event-analytics", path: `/event-analytics/${PLACEHOLDER_ID}` },
  { name: "create-event-final", path: `/create-event-final/${PLACEHOLDER_ID}` },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

type ConsoleHit = { page: string; viewport: string; type: string; text: string };

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

async function settle(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1600);
}

async function shoot(browser: Browser, outDir: string) {
  const hits: ConsoleHit[] = [];
  const manifest: { name: string; viewport: string; requested: string; finalUrl: string; file: string }[] = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        hits.push({
          page: page.url(),
          viewport: viewport.name,
          type: msg.type(),
          text: msg.text(),
        });
      }
    });
    page.on("pageerror", (err) => {
      hits.push({
        page: page.url(),
        viewport: viewport.name,
        type: "pageerror",
        text: String(err),
      });
    });

    for (const entry of pages) {
      const target = new URL(entry.path, base).toString();
      await page.goto(target, { waitUntil: "domcontentloaded", timeout: 20000 });
      await settle(page);
      const file = `${entry.name}-${viewport.name}.png`;
      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
      manifest.push({
        name: entry.name,
        viewport: viewport.name,
        requested: entry.path,
        finalUrl: page.url(),
        file,
      });
      console.log(`saved ${file} <- ${page.url()}`);
    }
    await context.close();
  }

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({ base, manifest, hits }, null, 2));
  const errors = hits.filter((hit) => hit.type === "error" || hit.type === "pageerror");
  console.log(`console errors: ${errors.length}, warnings: ${hits.length - errors.length}`);
}

async function recordFlows(browser: Browser) {
  const dir = path.join(root, "videos");
  ensureDir(dir);

  const flows: { name: string; run: (page: Page) => Promise<void> }[] = [
    {
      name: "browse-events",
      run: async (page) => {
        await page.goto(base + "/", { waitUntil: "domcontentloaded" });
        await page.getByRole("heading", { name: "Book the show." }).waitFor();
        await page.waitForTimeout(1000);
        await page.locator('nav a[href="/get-all-events"]').click();
        await page.getByRole("heading", { name: "All events" }).waitFor();
        await page.waitForTimeout(1800);
        await page.locator('nav a[href="/book-events"]').click();
        await page.getByRole("heading", { name: "Book tickets" }).waitFor();
        await page.waitForTimeout(1500);
      },
    },
    {
      name: "auth-pages",
      run: async (page) => {
        await page.goto(base + "/login", { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(800);
        await page.getByLabel("Username").fill("guest");
        await page.getByLabel("Password").fill("not-submitted");
        await page.getByRole("link", { name: "Create an account" }).click();
        await page.waitForTimeout(900);
        await page.getByRole("main").getByRole("link", { name: "Sign in" }).click();
        await page.waitForTimeout(600);
        await page.getByRole("link", { name: "Host events" }).click();
        await page.waitForTimeout(900);
      },
    },
    {
      name: "checkout-guard",
      run: async (page) => {
        await page.goto(base + `/booking/${PLACEHOLDER_ID}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(900);
        await page.getByRole("button", { name: "Choose seats" }).click();
        await page.waitForTimeout(1200);
      },
    },
  ];

  for (const flow of flows) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();
    await flow.run(page);
    const video = page.video();
    await context.close();
    const saved = video ? await video.path() : "";
    if (saved) {
      const target = path.join(dir, `${flow.name}.webm`);
      fs.copyFileSync(saved, target);
      fs.rmSync(saved, { force: true });
      console.log(`saved ${target}`);
    }
  }
}

async function main() {
  if (!["before", "after", "videos"].includes(phase)) {
    throw new Error("phase must be before, after, or videos");
  }
  const browser = await chromium.launch({
    headless: true,
    slowMo: phase === "videos" ? 300 : 0,
  });
  try {
    if (phase === "videos") {
      await recordFlows(browser);
    } else {
      const outDir = path.join(root, phase);
      ensureDir(outDir);
      await shoot(browser, outDir);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
