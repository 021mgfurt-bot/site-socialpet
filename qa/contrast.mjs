// QA — calcula contraste WCAG real dos pares de cor usados no site.
// Não faz parte do bundle de produção.

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function blend(fgHex, alpha, bgHex) {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(c1, c2) {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

function verdict(ratio, isLargeOrUi = false) {
  const min = isLargeOrUi ? 3.0 : 4.5;
  return ratio >= min ? "PASSA" : "FALHA";
}

const TOKENS = {
  creamBase: "#fffaf6",
  creamPaper: "#fbf1e8",
  coral: "#f57c55",
  coralDark: "#d95934",
  coralDeep: "#a8451f",
  ctaHover: "#8f3a19",
  ink: "#322b29",
  inkDeep: "#221c1a",
  muted: "#6f6259",
  line: "#eadbd4",
  warning: "#8f5700",
};

const PAIRS = [
  {
    name: "CTA primário — texto normal (cream sobre coral-deep)",
    fg: hexToRgb(TOKENS.creamBase),
    bg: hexToRgb(TOKENS.coralDeep),
    largeOrUi: false,
  },
  {
    name: "CTA primário — hover (cream sobre cta-hover)",
    fg: hexToRgb(TOKENS.creamBase),
    bg: hexToRgb(TOKENS.ctaHover),
    largeOrUi: false,
  },
  {
    name: "CTA secundário (ink-deep sobre cream-base)",
    fg: hexToRgb(TOKENS.inkDeep),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "Body text (ink sobre cream-base)",
    fg: hexToRgb(TOKENS.ink),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "Muted text (muted sobre cream-base)",
    fg: hexToRgb(TOKENS.muted),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "Muted text sobre cream-paper (cards)",
    fg: hexToRgb(TOKENS.muted),
    bg: hexToRgb(TOKENS.creamPaper),
    largeOrUi: false,
  },
  {
    name: "Link/Eyebrow (coral-deep sobre cream-base)",
    fg: hexToRgb(TOKENS.coralDeep),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "TextLink (ink-deep sobre cream-base)",
    fg: hexToRgb(TOKENS.inkDeep),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "Focus ring (coral-deep, contraste não-texto vs cream-base)",
    fg: hexToRgb(TOKENS.coralDeep),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: true,
  },
  {
    name: "reviewNotice text (warning sobre cream-base)",
    fg: hexToRgb(TOKENS.warning),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
  {
    name: "Footer link 85% (cream 85% sobre ink-deep)",
    fg: blend(TOKENS.creamBase, 0.85, TOKENS.inkDeep),
    bg: hexToRgb(TOKENS.inkDeep),
    largeOrUi: false,
  },
  {
    name: "Footer tagline 72% (cream 72% sobre ink-deep)",
    fg: blend(TOKENS.creamBase, 0.72, TOKENS.inkDeep),
    bg: hexToRgb(TOKENS.inkDeep),
    largeOrUi: false,
  },
  {
    name: "Footer copyright/columnTitle 55% (cream 55% sobre ink-deep)",
    fg: blend(TOKENS.creamBase, 0.55, TOKENS.inkDeep),
    bg: hexToRgb(TOKENS.inkDeep),
    largeOrUi: false,
  },
  {
    name: "Header nav link (ink sobre cream-base, header transparente)",
    fg: hexToRgb(TOKENS.ink),
    bg: hexToRgb(TOKENS.creamBase),
    largeOrUi: false,
  },
];

console.log("Par".padEnd(58), "Ratio".padEnd(8), "Mínimo AA", "Resultado");
console.log("-".repeat(90));
for (const pair of PAIRS) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const min = pair.largeOrUi ? "3.0:1 (UI/large)" : "4.5:1 (texto)";
  console.log(
    pair.name.padEnd(58),
    ratio.toFixed(2).padEnd(8),
    min.padEnd(18),
    verdict(ratio, pair.largeOrUi),
  );
}
