export interface VaccineDemoRecord {
  id: string;
  petName: string;
  vaccineName: string;
  applicationDate: string;
  nextDueDate: string;
}

/**
 * Dados fictícios, só para demonstrar a seção Vacinação do site — não
 * vêm de nenhuma conta real, não entram na aplicação original (Prompt 7
 * §20/§21). Datas de validade fixas escolhidas pra cobrir os três estados
 * reais da aplicação (vencida / vencendo / válida) em torno da data atual;
 * o rótulo exibido é sempre calculado de verdade por `vaccineStatus.ts`,
 * então continua correto mesmo quando o tempo passar.
 */
export const VACCINE_DEMO_RECORDS: VaccineDemoRecord[] = [
  {
    id: "antirrabica-mel",
    petName: "Mel",
    vaccineName: "Antirrábica",
    applicationDate: "2025-08-20",
    nextDueDate: "2026-08-20",
  },
  {
    id: "giardia-thor",
    petName: "Thor",
    vaccineName: "Giárdia",
    applicationDate: "2025-09-10",
    nextDueDate: "2026-09-10",
  },
  {
    id: "v10-mel",
    petName: "Mel",
    vaccineName: "V10",
    applicationDate: "2026-03-15",
    nextDueDate: "2027-03-15",
  },
];
