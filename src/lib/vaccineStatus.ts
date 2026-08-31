export type VaccineStatusTone = "ok" | "soon" | "overdue";

export interface VaccineStatus {
  tone: VaccineStatusTone;
  label: string;
}

function daysUntil(dateIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateIso}T00:00:00`);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Mesmo cálculo de status usado pela aplicação real (legacy/app.js,
 * `vaccineStatus()`): vencida (dias < 0), vence hoje/em N dias (0-30),
 * válida até (> 30). Portado de propósito — as datas de demonstração
 * abaixo são fixas, então o status muda sozinho com o passar dos dias
 * reais, exatamente como aconteceria na aplicação.
 */
export function computeVaccineStatus(nextDueDateIso: string): VaccineStatus {
  const days = daysUntil(nextDueDateIso);

  if (days < 0) {
    const abs = Math.abs(days);
    return { tone: "overdue", label: `Vencida há ${abs} dia${abs === 1 ? "" : "s"}` };
  }
  if (days === 0) {
    return { tone: "soon", label: "Vence hoje" };
  }
  if (days <= 30) {
    return { tone: "soon", label: `Vence em ${days} dia${days === 1 ? "" : "s"}` };
  }
  return { tone: "ok", label: `Válida até ${formatDate(nextDueDateIso)}` };
}
