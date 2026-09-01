// QA — checagem de responsividade pontual depois da revisão de copy do
// Prompt 9.5 (Hero e Agenda tiveram texto alterado). Não faz parte do
// bundle de produção.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("qa/screenshots", { recursive: true });
const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const issues = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && !m.text().includes("THREE.Clock"))) {
      issues.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
    }
  });
  page.on("pageerror", (e) => issues.push(`[${vp.name}] pageerror: ${e}`));

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Hero: checar overflow/clipping do novo texto
  const heroCopy = page.locator("#hero p").first();
  const heroBox = await heroCopy.boundingBox();
  const heroOverflow = await heroCopy.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
  console.log(`[${vp.name}] Hero copy box:`, heroBox, "overflow:", heroOverflow);
  await page.screenshot({ path: `qa/screenshots/copyreview__${vp.name}__hero.png` });

  // Agenda: rolar até a seção e checar layout do bloco "próximo compromisso"
  await page.locator("#agenda").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const nextBlock = page.locator('[class*="_nextBlock_"]');
  const nextBox = await nextBlock.boundingBox();
  const nextChildrenCount = await nextBlock.evaluate((el) => el.children.length);
  console.log(`[${vp.name}] Agenda nextBlock box:`, nextBox, "children:", nextChildrenCount);
  await page.screenshot({ path: `qa/screenshots/copyreview__${vp.name}__agenda.png` });

  // Logo aria-label novo
  const logoLabel = await page.locator('a[aria-label="Página inicial do SocialPet"]').count();
  if (logoLabel === 0) issues.push(`[${vp.name}] aria-label do Logo não encontrado`);

  await context.close();
}

await browser.close();
console.log("\n=== ISSUES ===");
console.log(JSON.stringify(issues, null, 2));
