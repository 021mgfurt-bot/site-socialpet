import type { ExpenseDemoRecord } from "../data/expenseDemoRecords";

export interface ExpenseCategoryBreakdown {
  category: string;
  total: number;
  /** 0–100, arredondado só na formatação (ver componente) — o valor aqui
   * continua com casas decimais pra não acumular erro de arredondamento
   * entre categorias. */
  percentage: number;
}

export interface ExpensePetBreakdown {
  pet: string;
  total: number;
}

/** Soma simples — nunca hardcode um total visualmente sem passar por aqui. */
export function calculateTotal(records: ExpenseDemoRecord[]): number {
  return round2(records.reduce((sum, record) => sum + record.amount, 0));
}

export function calculateByCategory(records: ExpenseDemoRecord[]): ExpenseCategoryBreakdown[] {
  const total = calculateTotal(records);
  const totals = new Map<string, number>();

  for (const record of records) {
    totals.set(record.category, round2((totals.get(record.category) ?? 0) + record.amount));
  }

  return Array.from(totals.entries())
    .map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateByPet(records: ExpenseDemoRecord[]): ExpensePetBreakdown[] {
  const totals = new Map<string, number>();

  for (const record of records) {
    totals.set(record.pet, round2((totals.get(record.pet) ?? 0) + record.amount));
  }

  return Array.from(totals.entries())
    .map(([pet, total]) => ({ pet, total }))
    .sort((a, b) => b.total - a.total);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
