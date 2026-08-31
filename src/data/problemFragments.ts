export interface ProblemFragment {
  id: string;
  text: string;
  tone: "serif" | "sans" | "sans-strong";
  color: "ink" | "muted" | "coral";
  /** Posição no desktop (pinado), em % da área do estágio. */
  top: string;
  left: string;
  /** Rotação inicial, graus. */
  rotate: number;
  /** Escala de fonte relativa (multiplica o tamanho base do tone). */
  scale: number;
  /**
   * Deslocamento (px) que o fragmento percorre até convergir perto do
   * centro no estágio de reorganização — sinal aponta pra dentro (um
   * fragmento no canto superior-esquerdo converge com x/y positivos).
   */
  convergeX: number;
  convergeY: number;
  /** Em qual onda o fragmento aparece: 1 (logo no início) ou 2 (a composição adensa). */
  wave: 1 | 2;
}

/**
 * Situações reais de tutor, não slogans — o material da seção Problema
 * (Prompt 6 §12-15). Cada fragmento é texto de verdade no DOM (não
 * decorativo, não aria-hidden): um leitor de tela lê a lista inteira em
 * ordem, independente de onde cada um fica posicionado visualmente.
 */
export const PROBLEM_FRAGMENTS: ProblemFragment[] = [
  {
    id: "carteira",
    text: "Carteira de vacinação",
    tone: "serif",
    color: "ink",
    top: "10%",
    left: "5%",
    rotate: -4,
    scale: 1.15,
    convergeX: 420,
    convergeY: 180,
    wave: 1,
  },
  {
    id: "ultima-vacina",
    text: "Quando foi a última vacina?",
    tone: "sans",
    color: "muted",
    top: "60%",
    left: "3%",
    rotate: 2,
    scale: 1,
    convergeX: 440,
    convergeY: -140,
    wave: 1,
  },
  {
    id: "fotos",
    text: "Fotos",
    tone: "sans-strong",
    color: "coral",
    top: "8%",
    left: "74%",
    rotate: 6,
    scale: 1.1,
    convergeX: -380,
    convergeY: 200,
    wave: 1,
  },
  {
    id: "quanto-gastei",
    text: "Quanto gastei esse mês?",
    tone: "serif",
    color: "ink",
    top: "44%",
    left: "56%",
    rotate: -3,
    scale: 1.05,
    convergeX: -340,
    convergeY: -20,
    wave: 2,
  },
  {
    id: "remedio",
    text: "Em que dia começa o remédio?",
    tone: "sans",
    color: "muted",
    top: "78%",
    left: "14%",
    rotate: 4,
    scale: 1,
    convergeX: 380,
    convergeY: -230,
    wave: 2,
  },
  {
    id: "consulta",
    text: "Consulta marcada",
    tone: "serif",
    color: "coral",
    top: "76%",
    left: "64%",
    rotate: -5,
    scale: 1.1,
    convergeX: -300,
    convergeY: -210,
    wave: 2,
  },
  {
    id: "despesas",
    text: "Despesas",
    tone: "sans-strong",
    color: "ink",
    top: "26%",
    left: "82%",
    rotate: 3,
    scale: 1,
    convergeX: -460,
    convergeY: 90,
    wave: 2,
  },
];
