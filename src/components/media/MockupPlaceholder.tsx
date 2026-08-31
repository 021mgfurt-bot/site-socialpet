import styles from "./MockupPlaceholder.module.css";

// mockup awaiting real SocialPet capture
//
// Nenhuma tela real do produto foi usada aqui: capturar a interface real
// exige uma conta autenticada, e a auditoria (Prompt 1) não confirmou com
// segurança qual backend está de fato em produção hoje. Até essa captura
// existir, o espaço reserva a moldura (DeviceMockup) sem simular um
// dashboard falso — regra dura do Wireframe & Visual System §30/§37.
//
// O símbolo mostrado é o ícone oficial do SocialPet tal como existe na
// aplicação (public/icon-512.png, cópia read-only de legacy/assets/) — não
// é um paw redesenhado em SVG. Regra explícita do Prompt 6 §5: mesmo
// arquivo gráfico, sem recriar/aproximar.
export function MockupPlaceholder() {
  return (
    <div className={styles.placeholder} data-placeholder="mockup-awaiting-real-capture">
      <img src="/icon-512.png" alt="" className={styles.glyph} width={512} height={512} />
    </div>
  );
}
