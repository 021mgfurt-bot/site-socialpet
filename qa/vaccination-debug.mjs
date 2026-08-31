import { chromium } from "playwright";
const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";
const browser = await chromium.launch({ channel: "chrome", headless: true });

// Caso A: navegação direta pra #vacinacao (link externo/aba nova).
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#vacinacao`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#vacinacao ul li")).map((el) => getComputedStyle(el).opacity),
  );
  console.log("Caso A (goto direto #vacinacao) opacidades:", opacities);
  await page.screenshot({ path: "qa/screenshots/debug-caso-a-direto.png" });
  await context.close();
}

// Caso B: scroll gradual (wheel).
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(600);
  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#vacinacao ul li")).map((el) => getComputedStyle(el).opacity),
  );
  console.log("Caso B (wheel gradual) opacidades:", opacities);
  await context.close();
}

// Caso C: reload no meio da seção (mesmo cenário do bug, mas via reload em vez de goto com hash).
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#vacinacao").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 200), top);
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#vacinacao ul li")).map((el) => getComputedStyle(el).opacity),
  );
  console.log("Caso C (reload no meio da seção) opacidades:", opacities);
  await context.close();
}

// Caso D: mobile (sem pin) via goto direto com hash.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#vacinacao`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#vacinacao ul li")).map((el) => getComputedStyle(el).opacity),
  );
  console.log("Caso D (mobile, goto direto #vacinacao) opacidades:", opacities);
  await context.close();
}

await browser.close();
