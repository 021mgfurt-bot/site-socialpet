import styles from "./MockupPlaceholder.module.css";

// mockup awaiting real SocialPet capture
//
// Nenhuma tela real do produto foi usada aqui: capturar a interface real
// exige uma conta autenticada, e a auditoria (Prompt 1) não confirmou com
// segurança qual backend está de fato em produção hoje. Até essa captura
// existir, o espaço reserva a moldura (DeviceMockup) sem simular um
// dashboard falso — regra dura do Wireframe & Visual System §30/§37.
export function MockupPlaceholder() {
  return (
    <div className={styles.placeholder} data-placeholder="mockup-awaiting-real-capture">
      <div className={styles.glyph} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14.5c-2.9 0-6 2.1-6 4.6 0 1.2 1 2 2.3 2 1.1 0 1.9-.5 3.7-.5s2.6.5 3.7.5c1.3 0 2.3-.8 2.3-2 0-2.5-3.1-4.6-6-4.6Z" />
          <ellipse cx="5.5" cy="10.5" rx="2" ry="2.6" />
          <ellipse cx="9.2" cy="7" rx="2" ry="2.6" />
          <ellipse cx="14.8" cy="7" rx="2" ry="2.6" />
          <ellipse cx="18.5" cy="10.5" rx="2" ry="2.6" />
        </svg>
      </div>
    </div>
  );
}
