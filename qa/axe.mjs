// QA — auditoria automatizada de acessibilidade via axe-core. Não faz
// parte do bundle de produção.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:5174";
const ROUTES = ["/", "/planos", "/privacidade", "/cookies", "/termos", "/contato", "/pagina-que-nao-existe"];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await context.newPage();

for (const route of ROUTES) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page }).analyze();
  console.log(`\n=== ${route} — ${results.violations.length} violação(ões) ===`);
  for (const v of results.violations) {
    console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nó(s))`);
    for (const n of v.nodes.slice(0, 3)) {
      console.log(`    ${n.target.join(" ")}`);
    }
  }
}

await browser.close();
