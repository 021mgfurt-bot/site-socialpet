// Pipeline de captura de vídeo do SocialPet real, pra alimentar o
// <ProductVideo> das seções Vacinação/Despesas/Agenda (Prompt 10.5).
//
// NÃO RODA por padrão: exige SOCIALPET_DEMO_EMAIL/SOCIALPET_DEMO_PASSWORD
// de uma conta que contenha SOMENTE dados fictícios. Até hoje, essa conta
// não existe (nenhuma foi criada por este script nem por nenhuma outra
// automação — ver docs/product-demos.md) — sem as duas variáveis, o script
// para imediatamente, sem tentar nada.
//
// As credenciais nunca vão pro bundle do site (nenhum prefixo VITE_ aqui) —
// só existem no processo Node local de quem roda esta captura.
//
// Uso:
//   SOCIALPET_DEMO_EMAIL=... SOCIALPET_DEMO_PASSWORD=... \
//     node qa/capture-product-demo.mjs [vaccination|expenses|agenda]
//
// Seletores de login (#loginForm/#loginEmail/#loginPassword) e das abas de
// navegação (#expensesTab, #vaccinesTab, #notificationsTab) foram
// confirmados por leitura direta de legacy/index.html no repositório
// read-only do app. A navegação DENTRO de cada área (qual pet abrir, até
// onde rolar) precisa ser verificada/ajustada contra a conta demo real
// quando ela existir — não dá pra confirmar isso sem rodar contra dados de
// verdade, e por isso os passos abaixo estão comentados como TODO em vez de
// fingidos como prontos.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const EMAIL = process.env.SOCIALPET_DEMO_EMAIL;
const PASSWORD = process.env.SOCIALPET_DEMO_PASSWORD;
const APP_URL = process.env.VITE_SOCIALPET_APP_URL ?? process.env.SOCIALPET_APP_URL;

if (!EMAIL || !PASSWORD) {
  console.error(
    "\nSOCIALPET_DEMO_EMAIL e/ou SOCIALPET_DEMO_PASSWORD não estão definidas.\n" +
      "Não existe, até agora, uma conta demo segura do SocialPet (só dados\n" +
      "fictícios) documentada em nenhum lugar do repositório do app — ver\n" +
      "docs/product-demos.md. Este script não tenta capturar nada sem essas\n" +
      "variáveis: não crie uma conta só para desbloquear isso (Prompt 10.5 §4).\n",
  );
  process.exit(1);
}

if (!APP_URL) {
  console.error("\nVITE_SOCIALPET_APP_URL (ou SOCIALPET_APP_URL) não está definida — veja .env.example.\n");
  process.exit(1);
}

const TARGETS = {
  vaccination: { tabSelector: "#vaccinesTab", outDir: "public/product-demos/vaccination", name: "vaccination" },
  expenses: { tabSelector: "#expensesTab", outDir: "public/product-demos/expenses", name: "expenses" },
  agenda: { tabSelector: "#notificationsTab", outDir: "public/product-demos/agenda", name: "agenda" },
};

const requested = process.argv[2];
const keys = requested ? [requested] : Object.keys(TARGETS);
for (const key of keys) {
  if (!TARGETS[key]) {
    console.error(`Alvo desconhecido: "${key}". Use vaccination, expenses ou agenda.`);
    process.exit(1);
  }
}

mkdirSync("qa/tmp", { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const key of keys) {
  const target = TARGETS[key];
  console.log(`\n=== Capturando: ${key} ===`);

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: "qa/tmp", size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();

  await page.goto(APP_URL, { waitUntil: "networkidle" });

  // Login (seletores confirmados em legacy/index.html:280-296).
  await page.locator("#loginEmail").fill(EMAIL);
  await page.locator("#loginPassword").fill(PASSWORD);
  await page.locator("#loginForm button[type=submit]").click();
  await page.waitForTimeout(1500);

  // Navega até a área da funcionalidade.
  await page.locator(target.tabSelector).click();
  await page.waitForTimeout(1200);

  // TODO (verificar contra a conta demo real, quando existir): abrir um pet
  // fictício específico, esperar a lista carregar, e — só pra Vacinação —
  // garantir que pelo menos um status diferente (válida/vencendo/vencida)
  // está visível na tela antes de encerrar a gravação. O roteiro completo
  // de cada funcionalidade está em docs/product-demos.md.
  await page.waitForTimeout(6000);

  await page.close();
  await context.close();

  console.log(`Vídeo bruto salvo em qa/tmp/ — revise frame a frame antes de converter (Prompt 10.5 §49).`);
  console.log(`Destino final, depois de revisado e convertido: ${target.outDir}/socialpet-${target.name}-demo.mp4`);
}

await browser.close();
