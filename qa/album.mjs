// QA — seção Álbum + Memórias (Prompt 10).
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
  { name: "1366x768", width: 1366, height: 768 },
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

  await page.goto(`${BASE_URL}/#memorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.locator("#memorias").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `qa/screenshots/album__${vp.name}__inicio.png` });

  const anchorOffset = await page.locator("#memorias").evaluate((el) => el.getBoundingClientRect().top);
  console.log(`[${vp.name}] topo da seção após #memorias: ${anchorOffset}`);

  await context.close();
}

// Desktop: capturar os momentos rolando gradualmente (entrada, primeiras
// fotos, coleção completa, interface real/placeholder).
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#memorias").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  await page.evaluate((y) => window.scrollTo(0, y - 80), top);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "qa/screenshots/album__desktop-1-entrada.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 200), top);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "qa/screenshots/album__desktop-2-primeiras-fotos.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 450), top);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "qa/screenshots/album__desktop-3-colecao.png" });

  await page.evaluate((y) => window.scrollTo(0, y + 750), top);
  await page.waitForTimeout(900);
  await page.screenshot({ path: "qa/screenshots/album__desktop-4-interface.png" });

  await context.close();
}

// Reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#memorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator("#memorias").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: "qa/screenshots/album__reduced-motion.png" });

  const state = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[class*="_photoLarge_"], [class*="_photoB_"], [class*="_photoC_"], [class*="_collection_"], [class*="_interfaceBlock_"]'));
    return els.map((el) => ({ cls: el.className, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }));
  });
  console.log("estado reduced-motion:", JSON.stringify(state));

  await context.close();
}

// Robustez: scroll lento, rápido, reverso, reload no meio, acesso direto, resize
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const top = await page.locator("#memorias").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  // scroll rápido direto até o fim da seção
  await page.evaluate((y) => window.scrollTo(0, y + 900), top);
  await page.waitForTimeout(200);
  const fastState = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_interfaceBlock_"]')).map((el) => getComputedStyle(el).opacity),
  );
  console.log("opacidade do bloco de interface após scroll rápido:", fastState);

  // reload no meio da seção, depois rolar até ela de novo (reload reseta scroll pro topo)
  await page.evaluate((y) => window.scrollTo(0, y + 300), top);
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator("#memorias").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const afterReload = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_photoLarge_"]')).map((el) => getComputedStyle(el).opacity),
  );
  console.log("opacidade da foto grande após reload + rolar até a seção:", afterReload);

  // acesso direto por âncora (nova aba/contexto)
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/#memorias`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const directAccessState = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[class*="_photoLarge_"]')).map((el) => getComputedStyle(el).opacity),
  );
  console.log("opacidade da foto grande em acesso direto por âncora:", directAccessState);

  // scroll reverso: ida, volta, ida de novo
  const top = await page.locator("#memorias").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 1200), top);
  await page.waitForTimeout(500);
  await page.evaluate((y) => window.scrollTo(0, y - 600), top);
  await page.waitForTimeout(300);
  await page.evaluate((y) => window.scrollTo(0, y + 1200), top);
  await page.waitForTimeout(500);
  const finalState = await page.evaluate(() => ({
    photoLarge: getComputedStyle(document.querySelector('[class*="_photoLarge_"]')).opacity,
    interfaceBlock: getComputedStyle(document.querySelector('[class*="_interfaceBlock_"]')).opacity,
  }));
  console.log("estado final após scroll ida/volta/ida:", JSON.stringify(finalState));

  // resize (desktop -> mobile) no meio da sessão
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "qa/screenshots/album__resize-to-mobile.png" });
  const photoDVisibleAfterResize = await page.evaluate(() => {
    const el = document.querySelector('[class*="_photoD_"]');
    return el ? getComputedStyle(el).display : null;
  });
  console.log("display de photoD depois de redimensionar pra mobile:", photoDVisibleAfterResize);

  await context.close();
}

await browser.close();
console.log("\n=== ISSUES ===");
console.log(JSON.stringify(issues, null, 2));
