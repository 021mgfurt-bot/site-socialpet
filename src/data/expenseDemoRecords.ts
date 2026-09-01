export interface ExpenseDemoRecord {
  id: string;
  pet: string;
  /** Rótulo exibido — mesmas 8 categorias fixas do formulário real
   * (legacy/index.html, #expenseCategory): Ração, Consulta veterinária,
   * Vacina, Medicamento, Banho e tosa, Exame, Acessórios, Outros. O valor
   * salvo no banco para "Consulta veterinária" é literalmente "Consulta"
   * (confirmado em legacy/app.js) — aqui guardamos o rótulo visível, não
   * o value interno, já que isto não é um registro real. */
  category: string;
  date: string;
  amount: number;
}

/**
 * Dados fictícios só para esta seção do site — nunca vêm de uma conta
 * real, não entram no produto. Mesmos pets fictícios usados na seção de
 * Vacinação (Mel, Thor), pelo mesmo motivo: continuidade da narrativa
 * dentro do site, não porque são "os mesmos pets" de verdade em algum
 * banco. Período usado: agosto de 2026 (mês corrente na época deste
 * desenvolvimento).
 */
export const EXPENSE_DEMO_RECORDS: ExpenseDemoRecord[] = [
  { id: "racao-mel", pet: "Mel", category: "Ração", date: "2026-08-03", amount: 129.9 },
  { id: "banho-thor", pet: "Thor", category: "Banho e tosa", date: "2026-08-07", amount: 65.0 },
  { id: "consulta-mel", pet: "Mel", category: "Consulta veterinária", date: "2026-08-12", amount: 180.0 },
  { id: "medicamento-thor", pet: "Thor", category: "Medicamento", date: "2026-08-15", amount: 42.5 },
  { id: "acessorios-mel", pet: "Mel", category: "Acessórios", date: "2026-08-20", amount: 89.9 },
  { id: "vacina-thor", pet: "Thor", category: "Vacina", date: "2026-08-24", amount: 95.0 },
];

/** Rótulo do período de demonstração — mesmo mês dos registros acima. */
export const EXPENSE_DEMO_PERIOD_LABEL = "Agosto de 2026";
