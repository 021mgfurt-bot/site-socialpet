export interface HomeSectionConfig {
  id: string;
  title: string;
  tone: "base" | "paper";
}

/**
 * Seções da Home além do Hero, na ordem da narrativa definida no
 * Wireframe & Visual System (Prompt 3) e confirmada no Prompt 4 §29.
 * Implementadas aqui como placeholders estruturais — a composição real de
 * cada uma é trabalho de um prompt futuro.
 */
export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: "problema", title: "O problema", tone: "base" },
  { id: "socialpet", title: "A virada: SocialPet", tone: "paper" },
  { id: "vacinacao", title: "Vacinação", tone: "base" },
  { id: "despesas", title: "Despesas", tone: "paper" },
  { id: "agenda", title: "Agenda", tone: "base" },
  { id: "memorias", title: "Álbum e memórias", tone: "paper" },
  { id: "pwa", title: "SocialPet no celular", tone: "base" },
  { id: "privacidade", title: "Privacidade e confiança", tone: "paper" },
  { id: "planos", title: "Planos", tone: "base" },
  { id: "faq", title: "Perguntas frequentes", tone: "paper" },
  { id: "cta", title: "Comece agora", tone: "base" },
];
