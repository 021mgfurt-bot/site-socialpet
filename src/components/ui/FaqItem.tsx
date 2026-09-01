import { useId, useState } from "react";
import { cx } from "../../lib/classNames";
import styles from "./FaqItem.module.css";

interface FaqItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

/**
 * Item de accordion acessível, sem biblioteca nova (Prompt 13 §29/§33):
 * `<button>` real com `aria-expanded`/`aria-controls`, painel com
 * `role="region"`/`aria-labelledby`. Abertura/fechamento é só CSS
 * (`grid-template-rows: 0fr → 1fr`), não GSAP — evita o conflito entre
 * GSAP e altura automática citado no Prompt 13 §31, e já respeita
 * `prefers-reduced-motion` sozinho via `FaqItem.module.css` (transição
 * quase instantânea nesse modo, Prompt 13 §32).
 */
export function FaqItem({ question, answer, defaultOpen = false }: FaqItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <li className={styles.item}>
      <h3 className={styles.heading}>
        <button
          id={buttonId}
          type="button"
          className={styles.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{question}</span>
          <span className={cx(styles.icon, open && styles.iconOpen)} aria-hidden="true" />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className={cx(styles.panelWrap, open && styles.panelWrapOpen)}
      >
        {/* `.panelClip` é o item de grid que some (min-height:0 +
            overflow:hidden); o padding-bottom mora um nível abaixo, em
            `.panelInner`, porque padding no próprio item de grid não é
            zerado por `min-height:0` — o box-model sempre reserva espaço
            pra padding, mesmo com altura de conteúdo zerada, deixando uma
            fresta da resposta visível quando fechado (achado real em QA
            visual, Prompt 13). Um nível a mais resolve: o padding vira
            conteúdo do `overflow:hidden` do pai, e aí sim é cortado. */}
        <div className={styles.panelClip}>
          <p className={styles.panelInner}>{answer}</p>
        </div>
      </div>
    </li>
  );
}
