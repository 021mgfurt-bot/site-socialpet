// QA — testa interações reais: menu mobile, teclado, zoom aproximado.
// Não faz parte do bundle de produção.
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

// ---------- 1. Menu mobile: abrir, focus trap, Escape, restauração ----------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on("console", (msg) => console.log("[console]", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("[pageerror]", String(err)));
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const menuButton = page.getByRole("button", { name: /abrir menu/i });
  await menuButton.click();
  await page.waitForTimeout(700);
  await shot(page, "interaction__menu-open-settled.png");
  await page.waitForTimeout(50);
  console.log(
    "activeElement 50ms após clique:",
    await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.tagName),
  );
  await page.waitForTimeout(400);
  await shot(page, "interaction__menu-open.png");

  const dialog = page.locator("#mobile-menu");
  const isVisible = await dialog.evaluate((el) => getComputedStyle(el).visibility);
  console.log("menu visibility after open:", isVisible);

  // Foco deveria estar dentro do menu (primeiro link)
  const activeInsideMenu = await page.evaluate(() => {
    const menu = document.getElementById("mobile-menu");
    return menu?.contains(document.activeElement);
  });
  console.log("foco preso dentro do menu ao abrir:", activeInsideMenu);
  const activeElDebug = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    text: document.activeElement?.textContent?.trim()?.slice(0, 40),
    ariaLabel: document.activeElement?.getAttribute("aria-label"),
    id: document.activeElement?.id,
    className: document.activeElement?.className,
  }));
  console.log("activeElement real após abrir o menu:", JSON.stringify(activeElDebug));

  // Tab várias vezes não deve escapar do menu
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
  }
  const stillInsideAfterTabs = await page.evaluate(() => {
    const menu = document.getElementById("mobile-menu");
    return menu?.contains(document.activeElement);
  });
  console.log("foco ainda preso após 8 Tabs:", stillInsideAfterTabs);

  // scroll lock: body deveria estar position:fixed
  const bodyPosition = await page.evaluate(() => getComputedStyle(document.body).position);
  console.log("body position com menu aberto:", bodyPosition);

  // Escape fecha
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const visibilityAfterEscape = await dialog.evaluate((el) => getComputedStyle(el).visibility);
  console.log("menu visibility após Escape:", visibilityAfterEscape);

  const bodyPositionAfterClose = await page.evaluate(() => getComputedStyle(document.body).position);
  console.log("body position após fechar:", bodyPositionAfterClose);

  // Foco deveria voltar pro botão que abriu
  const focusReturnedToButton = await page.evaluate(
    () => document.activeElement?.getAttribute("aria-label") === "Abrir menu",
  );
  console.log("foco restaurado no botão do menu:", focusReturnedToButton);

  await shot(page, "interaction__menu-closed-after-escape.png");

  // Reabrir e fechar clicando em um link
  await menuButton.click();
  await page.waitForTimeout(400);
  await page.getByLabel("Navegação mobile").getByRole("link", { name: "FAQ" }).click();
  await page.waitForTimeout(500);
  const visibilityAfterLinkClick = await dialog.evaluate((el) => getComputedStyle(el).visibility);
  console.log("menu visibility após clicar num link:", visibilityAfterLinkClick);
  console.log("hash após clicar em FAQ:", await page.evaluate(() => location.hash));

  await context.close();
}

// ---------- 2. Teclado: skip link, ordem de foco, Header/Footer ----------
{
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Primeiro Tab deve focar o skip link
  await page.keyboard.press("Tab");
  const firstFocused = await page.evaluate(() => ({
    text: document.activeElement?.textContent?.trim(),
    tag: document.activeElement?.tagName,
  }));
  console.log("primeiro elemento focado (deveria ser skip link):", firstFocused);
  await shot(page, "interaction__keyboard-skip-link.png");

  // Ativar skip link deveria mover o foco pro main
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);

  // Continuar tabulando pelo header
  const focusOrder = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const el = await page.evaluate(() => ({
      text: document.activeElement?.textContent?.trim()?.slice(0, 30),
      tag: document.activeElement?.tagName,
      visibleOutline: getComputedStyle(document.activeElement).outlineStyle,
    }));
    focusOrder.push(el);
  }
  console.log("ordem de foco (8 tabs após skip link):", JSON.stringify(focusOrder, null, 2));

  await context.close();
}

// ---------- 3. Zoom aproximado (125%/150%/200%) via viewport reduzido ----------
{
  const baseWidth = 1366;
  const baseHeight = 768;
  for (const zoom of [1.25, 1.5, 2.0]) {
    const context = await browser.newContext({
      viewport: { width: Math.round(baseWidth / zoom), height: Math.round(baseHeight / zoom) },
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await shot(page, `interaction__zoom-${Math.round(zoom * 100)}pct-home.png`);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    console.log(`zoom ${zoom * 100}% overflow check:`, overflow);

    await page.goto(`${BASE_URL}/privacidade`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await shot(page, `interaction__zoom-${Math.round(zoom * 100)}pct-privacidade.png`);

    await context.close();
  }
}

await browser.close();
