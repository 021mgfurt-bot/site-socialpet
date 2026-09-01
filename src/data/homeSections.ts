export interface HomeSectionConfig {
  id: string;
  title: string;
  tone: "base" | "paper";
}

/**
 * Seções da Home ainda não implementadas, na ordem da narrativa definida
 * no Wireframe & Visual System (Prompt 3). "problema"/"socialpet" saíram
 * daqui no Prompt 6, "vacinacao" no Prompt 7, "despesas" no Prompt 8,
 * "agenda" no Prompt 9, e "memorias" (Álbum + Memórias) no Prompt 10 —
 * cada uma tem componente próprio, renderizado direto em Home.tsx. As
 * demais continuam como placeholders estruturais até serem desenhadas e
 * implementadas.
 */
export const HOME_SECTIONS: HomeSectionConfig[] = [
  { id: "pwa", title: "SocialPet no celular", tone: "paper" },
  { id: "privacidade", title: "Privacidade e confiança", tone: "base" },
  { id: "planos", title: "Planos", tone: "paper" },
  { id: "faq", title: "Perguntas frequentes", tone: "base" },
  { id: "cta", title: "Comece agora", tone: "paper" },
];
