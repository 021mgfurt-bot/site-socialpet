// Gera public/og-image.png a partir de qa/og-image/template.html, em
// 1200x630 (Prompt 14 §45/§47). Reexecutável sempre que o template mudar.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(__dirname, "template.html");
const outputArg = process.argv[2] ?? path.join(__dirname, "..", "..", "public", "og-image.png");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("file://" + templatePath.replace(/\\/g, "/"));
await page.waitForTimeout(300);
await page.screenshot({ path: outputArg });
await browser.close();
console.log("saved:", outputArg);
