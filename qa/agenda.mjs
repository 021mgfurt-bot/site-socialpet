// QA — seção Agenda + Lembretes (Prompt 9).
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

  await page.goto(`${BASE_URL}/#agenda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.locator("#agenda").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `qa/screenshots/agenda__${vp.name}__inicio.png` });

  const anchorOffset = await page.locator("#agenda").evaluate((el) => el.getBoundingClientRect().top);
  console.log(`[${vp.name}] topo da seção após #agenda: ${anchorOffset}`);

  await context.close();
}

// Desktop: capturar os momentos rolando gradualmente
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#agenda").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  await page.evaluate((y) => window.scrollTo(0, y - 60), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/agenda__desktop-1-entrada.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 400), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/agenda__desktop-2-horarios.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 750), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/agenda__desktop-3-recorrencia.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 1100), top);
  await page.waitForTimeout(700);
  await page.screenshot({ path: "qa/screenshots/agenda__desktop-4-proximo.png" });

  await context.close();
}

// Reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#agenda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator("#agenda").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "qa/screenshots/agenda__reduced-motion.png" });

  const state = await page.evaluate(() => {
    const events = Array.from(document.querySelectorAll('[class*="_event_"]'));
    const railFill = document.querySelector('[class*="_railFill_"]');
    const recurrence = document.querySelector('[class*="_recurrenceBlock_"]');
    const next = document.querySelector('[class*="_nextBlock_"]');
    return {
      eventOpacities: events.map((el) => getComputedStyle(el).opacity),
      railFillTransform: getComputedStyle(railFill).transform,
      recurrenceOpacity: getComputedStyle(recurrence).opacity,
      nextOpacity: getComputedStyle(next).opacity,
    };
  });
  console.log("estado reduced-motion:", JSON.stringify(state));

  await context.close();
}

// Robustez: reload no meio, nav pra outra rota e volta, scroll reverso
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#agenda").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  await page.evaluate((y) => window.scrollTo(0, y + 300), top);
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  // Reload reseta o scroll pro topo (comportamento padrão do navegador,
  // não é bug do site) — o teste real é: rolando até a seção de novo
  // depois do reload, ela recupera normalmente?
  await page.waitForTimeout(500);
  await page.locator("#agenda").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const afterReload = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_event_"]')).map((el) => getComputedStyle(el).opacity),
  );
  console.log("opacidades dos eventos após reload + rolar até a seção:", afterReload);

  await page.goto(`${BASE_URL}/planos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // scroll até o fim da seção, depois reverso, checar estado final
  await page.evaluate((y) => window.scrollTo(0, y + 2000), top);
  await page.waitForTimeout(600);
  await page.evaluate((y) => window.scrollTo(0, y - 500), top);
  await page.waitForTimeout(300);
  await page.evaluate((y) => window.scrollTo(0, y + 2000), top);
  await page.waitForTimeout(600);
  const finalState = await page.evaluate(() => ({
    events: Array.from(document.querySelectorAll('[class*="_event_"]')).map((el) => getComputedStyle(el).opacity),
    next: getComputedStyle(document.querySelector('[class*="_nextBlock_"]')).opacity,
  }));
  console.log("estado final após scroll ida/volta/ida:", JSON.stringify(finalState));
  await page.screenshot({ path: "qa/screenshots/agenda__pos-robustez.png" });

  await context.close();
}

await browser.close();
console.log("\n=== ISSUES ===");
console.log(JSON.stringify(issues, null, 2));
