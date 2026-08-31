// Script de QA — NÃO faz parte do bundle de produção (fora de src/, usa
// Playwright, que é devDependency). Abre o Chrome já instalado no sistema
// (channel: "chrome") em vez de baixar um Chromium extra, e tira uma
// screenshot por viewport definido em VIEWPORTS.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "screenshots");
mkdirSync(outDir, { recursive: true });

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1080", width: 2560, height: 1080 },
];

const ROUTES = ["/", "/planos", "/privacidade"];

const browser = await chromium.launch({ channel: "chrome", headless: true });

const consoleIssues = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleIssues.push({ viewport: viewport.name, type: msg.type(), text: msg.text() });
    }
  });
  page.on("pageerror", (err) => {
    consoleIssues.push({ viewport: viewport.name, type: "pageerror", text: String(err) });
  });

  for (const route of ROUTES) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200); // deixa a entrada do Hero (GSAP) terminar
    const routeName = route === "/" ? "home" : route.replace("/", "");
    const filePath = path.join(outDir, `${viewport.name}__${routeName}.png`);
    await page.screenshot({ path: filePath, fullPage: route !== "/" ? true : false });
    console.log(`saved ${filePath}`);
  }

  await context.close();
}

await browser.close();

console.log("\n=== CONSOLE ISSUES ===");
console.log(JSON.stringify(consoleIssues, null, 2));
