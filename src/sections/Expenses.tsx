import { useEffect, useRef, type CSSProperties } from "react";
import { Section } from "../components/layout/Section";
import { Container } from "../components/ui/Container";
import {
  EXPENSE_DEMO_RECORDS,
  EXPENSE_DEMO_PERIOD_LABEL,
} from "../data/expenseDemoRecords";
import { calculateTotal, calculateByCategory, calculateByPet } from "../lib/expenseCalculations";
import { formatBRL } from "../lib/formatCurrency";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { playExpensesStagesEntrance } from "../motion/expensesTimeline";
import { gsap } from "../motion/gsap";
import styles from "./Expenses.module.css";

const FRAGMENT_IDS = ["racao-mel", "banho-thor", "consulta-mel", "medicamento-thor"];
const CATEGORY_TONES = ["coral", "coralDark", "coralDeep", "sandDeep", "sage", "inkDeep"] as const;

/**
 * Registros/categorias/campos do relatório confirmados em legacy/app.js
 * e legacy/index.html (Prompt 8 §3-4) — não inventados. A "folha" do
 * relatório (StageReport) é uma composição própria do site com os
 * mesmos campos reais (título, período, pets, contagem, total, colunas
 * Data/Pet/Categoria/Valor), não uma captura de tela: nenhuma UI real do
 * app foi capturada ainda, então nada aqui finge ser screenshot.
 */
export function Expenses() {
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const totalValueRef = useRef<HTMLSpanElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const total = calculateTotal(EXPENSE_DEMO_RECORDS);
  const byCategory = calculateByCategory(EXPENSE_DEMO_RECORDS);
  const byPet = calculateByPet(EXPENSE_DEMO_RECORDS);
  const fragments = FRAGMENT_IDS.map((id) => EXPENSE_DEMO_RECORDS.find((r) => r.id === id)!);

  useEffect(() => {
    const stageTargets = {
      fragments: fragmentsRef.current,
      total: totalRef.current,
      categories: categoriesRef.current,
      report: reportRef.current,
    };

    if (reducedMotion) {
      gsap.set(Object.values(stageTargets), { opacity: 1, y: 0 });
      if (totalValueRef.current) totalValueRef.current.textContent = formatBRL(total);
      return;
    }

    const cleanupStages = playExpensesStagesEntrance(stageTargets);

    // Contagem curta e legível (Prompt 8 §40-41) — não é um cassino: parte
    // de perto do valor final, ~0.6s, formatada em BRL a cada frame.
    let cleanupCount = () => {};
    if (totalValueRef.current) {
      const proxy = { value: 0 };
      const tween = gsap.to(proxy, {
        value: total,
        duration: 0.6,
        ease: "power1.out",
        scrollTrigger: {
          trigger: totalRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (totalValueRef.current) totalValueRef.current.textContent = formatBRL(proxy.value);
        },
      });
      cleanupCount = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }

    return () => {
      cleanupStages();
      cleanupCount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <Section ref={sectionRef} id="despesas" tone="base" ariaLabel="Despesas e relatórios">
      <Container>
        <div className={styles.layout}>
          <div className={styles.stickyText}>
            <h2 className={styles.headline}>Ração, consulta, banho, remédio. Quanto isso deu no mês?</h2>
            <p className={styles.copy}>
              Cada gasto fica registrado no pet certo, com categoria, data e valor. No fim do mês, o
              SocialPet reúne tudo num relatório — pronto pra consultar quando você quiser entender para
              onde o dinheiro foi.
            </p>
          </div>

          <div className={styles.stages}>
            <div ref={fragmentsRef} className={styles.fragmentsStage}>
              <p className="visually-hidden">Exemplos de lançamentos:</p>
              <ul className={styles.fragmentList}>
                {fragments.map((record, index) => (
                  <li
                    key={record.id}
                    className={styles.fragment}
                    style={{ "--frag-rotate": `${index % 2 === 0 ? -2 : 2}deg` } as CSSProperties}
                  >
                    <span className={styles.fragmentCategory}>{record.category}</span>
                    <span className={styles.fragmentAmount}>{formatBRL(record.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={totalRef} className={styles.totalStage}>
              <span className={styles.totalPeriod}>{EXPENSE_DEMO_PERIOD_LABEL}</span>
              <span ref={totalValueRef} className={styles.totalValue}>
                {formatBRL(total)}
              </span>
              <span className={styles.totalLabel}>Gastos no período</span>
              <p className={styles.totalByPet}>
                {byPet.map((entry, index) => (
                  <span key={entry.pet}>
                    {index > 0 && " · "}
                    {entry.pet}: {formatBRL(entry.total)}
                  </span>
                ))}
              </p>
            </div>

            <div ref={categoriesRef} className={styles.categoriesStage}>
              <h3 className={styles.stageTitle}>Como os gastos se dividem</h3>
              <div className={styles.compositeBar} aria-hidden="true">
                {byCategory.map((entry, index) => (
                  <span
                    key={entry.category}
                    className={styles.barSegment}
                    style={{
                      width: `${entry.percentage}%`,
                      background: `var(--expense-tone-${CATEGORY_TONES[index % CATEGORY_TONES.length]})`,
                    }}
                  />
                ))}
              </div>
              <ul className={styles.categoryLegend}>
                {byCategory.map((entry, index) => (
                  <li key={entry.category} className={styles.categoryLegendItem}>
                    <span
                      className={styles.categorySwatch}
                      style={{ background: `var(--expense-tone-${CATEGORY_TONES[index % CATEGORY_TONES.length]})` }}
                      aria-hidden="true"
                    />
                    <span className={styles.categoryName}>{entry.category}</span>
                    <span className={styles.categoryValue}>
                      {formatBRL(entry.total)}
                      <span className={styles.categoryPercentage}> · {Math.round(entry.percentage)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div ref={reportRef} className={styles.reportStage}>
              <ReportSheet total={total} count={EXPENSE_DEMO_RECORDS.length} pets={byPet.length} />
              <p className={styles.reportNote}>
                Você pode guardar essa visão do período pra consultar depois, ou preparar o relatório para
                impressão quando precisar.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

interface ReportSheetProps {
  total: number;
  count: number;
  pets: number;
}

/**
 * Representação editorial dos campos reais do relatório (título, período,
 * pets incluídos, contagem, total, colunas Data/Pet/Categoria/Valor) —
 * não é uma captura de tela do app. Nenhuma UI real foi fotografada ainda
 * (mesma regra honesta do Hero/Vacinação: sem captura seleta, sem
 * inventar uma tela).
 */
function ReportSheet({ total, count, pets }: ReportSheetProps) {
  const sampleRows = [
    { date: "03/08/2026", pet: "Mel", category: "Ração", amount: 129.9 },
    { date: "12/08/2026", pet: "Mel", category: "Consulta veterinária", amount: 180.0 },
    { date: "24/08/2026", pet: "Thor", category: "Vacina", amount: 95.0 },
  ];

  return (
    <div className={styles.sheet}>
      <div className={styles.sheetHeader}>
        <span className={styles.sheetEyebrow}>SocialPet — Relatório de despesas</span>
        <h3 className={styles.sheetTitle}>Relatório de despesas</h3>
        <p className={styles.sheetMeta}>
          Período: {EXPENSE_DEMO_PERIOD_LABEL} · Pets incluídos: Mel, Thor
        </p>
      </div>

      <div className={styles.sheetSummary}>
        <span>{count} lançamentos</span>
        <span>{pets} pets</span>
        <span className={styles.sheetSummaryTotal}>{formatBRL(total)}</span>
      </div>

      <table className={styles.sheetTable}>
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Pet</th>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
          </tr>
        </thead>
        <tbody>
          {sampleRows.map((row) => (
            <tr key={`${row.date}-${row.category}`}>
              <td>{row.date}</td>
              <td>{row.pet}</td>
              <td>{row.category}</td>
              <td>{formatBRL(row.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.sheetFooter}>Relatório gerado pelo SocialPet</p>
    </div>
  );
}
