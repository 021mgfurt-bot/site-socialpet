// QA — seção Despesas + Relatórios (Prompt 8).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
mkdirSync("qa/screenshots", { recursive: true });
const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const issues = [];

const VIEWPORTS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1080", width: 2560, height: 1080 },
];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error" || (m.type() === "warning" && !m.text().includes("THREE.Clock"))) {
      issues.push(`[${vp.name}] ${m.type()}: ${m.text()}`);
    }
  });
  page.on("pageerror", (e) => issues.push(`[${vp.name}] pageerror: ${e}`));

  await page.goto(`${BASE_URL}/#despesas`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.locator("#despesas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/screenshots/expenses__${vp.name}__inicio.png` });

  const anchorOffset = await page.locator("#despesas").evaluate((el) => el.getBoundingClientRect().top);
  console.log(`[${vp.name}] topo da seção após #despesas: ${anchorOffset}`);

  await context.close();
}

// Desktop: capturar os 4 momentos rolando gradualmente
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#despesas").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  await page.evaluate((y) => window.scrollTo(0, y - 60), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/expenses__desktop-1-entrada.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 500), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/expenses__desktop-2-acumulo.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 950), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/expenses__desktop-3-categorias.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 1500), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/expenses__desktop-4-relatorio.png" });

  await context.close();
}

// Reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#despesas`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator("#despesas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "qa/screenshots/expenses__reduced-motion.png" });

  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_fragmentsStage_"], [class*="_totalStage_"], [class*="_categoriesStage_"], [class*="_reportStage_"]')).map(
      (el) => getComputedStyle(el).opacity,
    ),
  );
  console.log("opacidades dos 4 estágios em reduced-motion (deveriam ser 1):", opacities);

  const totalText = await page.evaluate(() => document.querySelector('[class*="_totalValue_"]')?.textContent);
  console.log("valor total em reduced-motion:", totalText);

  await context.close();
}

// Robustez: reload no meio, nav pra outra rota e volta, resize cruzando 1024
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#despesas").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  await page.evaluate((y) => window.scrollTo(0, y + 400), top);
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const totalAfterReload = await page.evaluate(() => document.querySelector('[class*="_totalValue_"]')?.textContent);
  console.log("total após reload no meio da seção:", totalAfterReload);

  await page.goto(`${BASE_URL}/planos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // scroll rápido pra dentro/fora várias vezes, depois checar estado final
  for (let i = 0; i < 3; i++) {
    await page.evaluate((y) => window.scrollTo(0, y + 800), top);
    await page.waitForTimeout(100);
    await page.evaluate((y) => window.scrollTo(0, y - 800), top);
    await page.waitForTimeout(100);
  }
  await page.evaluate((y) => window.scrollTo(0, y + 2500), top);
  await page.waitForTimeout(700);
  const finalOpacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_fragmentsStage_"], [class*="_totalStage_"], [class*="_categoriesStage_"], [class*="_reportStage_"]')).map(
      (el) => getComputedStyle(el).opacity,
    ),
  );
  console.log("opacidades após scroll rápido ida/volta + scroll até o fim:", finalOpacities);
  await page.screenshot({ path: "qa/screenshots/expenses__pos-robustez.png" });

  await context.close();
}

await browser.close();
console.log("\n=== ISSUES ===");
console.log(JSON.stringify(issues, null, 2));
