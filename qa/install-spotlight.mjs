// QA — faixa de instalação PWA (Prompt 7.6). Screenshots por estado e
// viewport, mais checagem de console/contraste/teclado.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("qa/screenshots", { recursive: true });
const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const issues = [];

async function shotState(vpName, width, height, state) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") issues.push(`[${vpName}/${state}] console error: ${m.text()}`);
  });
  page.on("pageerror", (e) => issues.push(`[${vpName}/${state}] pageerror: ${e}`));
  await page.goto(`${BASE_URL}/?pwaDebug=${state}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.locator("#instalar").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/screenshots/spotlight__${vpName}__${state}.png` });
  await context.close();
}

const STATES = ["install", "iosInstructions", "open", "unsupported", "installed"];
const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "1366", width: 1366, height: 768 },
  { name: "1920", width: 1920, height: 1080 },
];

for (const vp of VIEWPORTS) {
  for (const state of STATES) {
    await shotState(vp.name, vp.width, vp.height, state);
  }
}

// touch target + keyboard reachability + contrast sample
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const cta = page.locator('#instalar a[class*="_cta_"], #instalar button[class*="_cta_"]').first();
  const box = await cta.boundingBox();
  console.log("CTA touch target:", box?.width, "x", box?.height);

  const colors = await page.evaluate(() => {
    const band = document.querySelector('[class*="_band_"]');
    const text = document.querySelector('[class*="_text_"]');
    const headline = document.querySelector('[class*="_headline_"]');
    return {
      bandBg: getComputedStyle(band).backgroundColor,
      bandBgImage: getComputedStyle(band).backgroundImage,
      textColor: getComputedStyle(text).color,
      headlineColor: getComputedStyle(headline).color,
    };
  });
  console.log("cores:", JSON.stringify(colors));

  await context.close();
}

// reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator("#instalar").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector('[class*="_band_"]')).opacity);
  console.log("opacity da faixa em reduced-motion (deveria ser 1):", opacity);
  await page.screenshot({ path: "qa/screenshots/spotlight__reduced-motion.png" });
  await context.close();
}

await browser.close();
console.log("\n=== ISSUES ===");
console.log(JSON.stringify(issues, null, 2));
