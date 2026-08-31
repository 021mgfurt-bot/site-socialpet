// QA da seção Vacinação (Prompt 7) — screenshots por viewport, os 3
// momentos desktop pedidos (início / foco de status / final), reduced
// motion, e um teste de robustez de scroll (ida/volta, reload, resize
// pelo breakpoint 1024px, navegação de rota e volta).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "screenshots");
mkdirSync(outDir, { recursive: true });

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(outDir, name) });
  console.log("saved", name);
}

function attachConsoleListeners(page, label) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.log(`[${label}][console:${msg.type()}]`, msg.text());
    }
  });
  page.on("pageerror", (err) => console.log(`[${label}][pageerror]`, String(err)));
}

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1080", width: 2560, height: 1080 },
];

// ---------- 1. Screenshot da seção em cada viewport ----------
for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  attachConsoleListeners(page, viewport.name);

  await page.goto(`${BASE_URL}/#vacinacao`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const section = page.locator("#vacinacao");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900); // deixa a entrada GSAP terminar

  await shot(page, `vacinacao__${viewport.name}.png`);

  const anchorOffset = await section.evaluate((el) => el.getBoundingClientRect().top);
  console.log(`[${viewport.name}] topo da seção após #vacinacao + scrollIntoView:`, anchorOffset);

  await context.close();
}

// ---------- 2. Três momentos desktop (início / foco de status / final) ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  attachConsoleListeners(page, "desktop-moments");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const section = page.locator("#vacinacao");
  const box = await section.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height };
  });

  // Momento 1: início do pin (topo da seção logo abaixo do header)
  await page.evaluate((y) => window.scrollTo(0, y - 40), box.top);
  await page.waitForTimeout(900);
  await shot(page, "vacinacao__desktop-1-inicio.png");

  // Momento 2: meio do pin, quando o segundo status deveria estar em foco
  await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 0.45), box.top);
  await page.waitForTimeout(500);
  await shot(page, "vacinacao__desktop-2-foco-status.png");

  // Momento 3: fim do pin, estado final assentado
  await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * 1.0), box.top);
  await page.waitForTimeout(500);
  await shot(page, "vacinacao__desktop-3-final.png");

  await context.close();
}

// ---------- 3. Reduced motion: tudo estático e legível, sem pin ----------
{
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  attachConsoleListeners(page, "reduced-motion");
  await page.goto(`${BASE_URL}/#vacinacao`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.locator("#vacinacao").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await shot(page, "vacinacao__reduced-motion.png");

  const opacities = await page.evaluate(() => {
    const entries = Array.from(document.querySelectorAll("#vacinacao li"));
    return entries.map((el) => getComputedStyle(el).opacity);
  });
  console.log("opacidades dos status em reduced-motion (todas deveriam ser 1):", opacities);

  const pinSpacers = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  console.log("pin-spacers em reduced-motion (deveria ser 0 pros criados por Vacinação):", pinSpacers);

  await context.close();
}

// ---------- 4. Robustez de scroll: cima/baixo, reload no meio, navegação de rota, resize pelo breakpoint ----------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  attachConsoleListeners(page, "robustez");
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const section = page.locator("#vacinacao");
  const top = await section.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);

  // scroll rápido pra dentro e pra fora, repetidamente
  for (let i = 0; i < 3; i++) {
    await page.evaluate((y) => window.scrollTo(0, y + 400), top);
    await page.waitForTimeout(120);
    await page.evaluate((y) => window.scrollTo(0, y - 400), top);
    await page.waitForTimeout(120);
  }
  console.log("scroll rápido ida/volta: ok, sem travar");

  // reload no meio da seção
  await page.evaluate((y) => window.scrollTo(0, y + 300), top);
  await page.waitForTimeout(300);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const pinSpacersAfterReload = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  console.log("pin-spacers após reload no meio da seção:", pinSpacersAfterReload);

  // navegar pra outra rota e voltar
  await page.goto(`${BASE_URL}/planos`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const pinSpacersAfterNav = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  console.log("pin-spacers após navegar pra /planos e voltar:", pinSpacersAfterNav);

  // resize cruzando o breakpoint 1024px (desktop -> mobile -> desktop)
  await page.setViewportSize({ width: 900, height: 900 });
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  const pinSpacersAfterResize = await page.evaluate(() => document.querySelectorAll(".pin-spacer").length);
  console.log("pin-spacers após resize cruzando 1024px:", pinSpacersAfterResize);

  await shot(page, "vacinacao__pos-robustez.png");

  await context.close();
}

await browser.close();
console.log("\n=== QA Vacinação concluído ===");
