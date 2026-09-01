export type ReminderType = "medication" | "appointment" | "care" | "other";

export interface ReminderDemoRecord {
  id: string;
  pet: string;
  type: ReminderType;
  /** Rótulo real do tipo, mesmo enum fixo de 4 valores do formulário
   * real (legacy/index.html, #reminderType): Medicamento, Consulta,
   * Cuidado, Outro. O título em si é texto livre, como no produto real —
   * "Banho" aqui é o título de um lembrete do tipo Cuidado, não uma
   * categoria própria (não existe tipo "Banho" no formulário real). */
  typeLabel: string;
  title: string;
  /** Mesmos 3 valores reais do formulário (#reminderRepeatType): uma
   * única vez, todos os dias, ou dias da semana específicos. Não existe
   * "a cada N dias" no produto real. */
  repeatType: "once" | "daily" | "weekdays";
  /** 0 (domingo) a 6 (sábado) — só relevante quando repeatType="weekdays". */
  weekdays?: number[];
  /** Até 3 horários por lembrete (mesmo limite real: 3 campos fixos no
   * formulário, mínimo 1 preenchido). Formato "HH:MM". */
  times: string[];
}

/**
 * Dados fictícios só para esta seção do site — nunca vêm de uma conta
 * real, não entram no produto. Mesmos pets fictícios de Vacinação e
 * Despesas (Mel, Thor), por continuidade narrativa. Nenhuma data fixa é
 * usada: "hoje" e o próximo dia da semana são sempre calculados a partir
 * do relógio real (ver src/lib/reminderCalculations.ts), então a seção
 * nunca fica com uma referência de tempo desatualizada.
 */
export const REMINDER_DEMO_RECORDS: ReminderDemoRecord[] = [
  {
    id: "medicamento-mel",
    pet: "Mel",
    type: "medication",
    typeLabel: "Medicamento",
    title: "Anti-inflamatório",
    repeatType: "daily",
    times: ["08:00", "20:00"],
  },
  {
    id: "cuidado-thor-dentes",
    pet: "Thor",
    type: "care",
    typeLabel: "Cuidado",
    title: "Escovar dentes",
    repeatType: "daily",
    times: ["19:30"],
  },
  {
    id: "cuidado-thor-banho",
    pet: "Thor",
    type: "care",
    typeLabel: "Cuidado",
    title: "Banho",
    repeatType: "weekdays",
    weekdays: [2, 5],
    times: ["09:00"],
  },
  {
    id: "consulta-mel",
    pet: "Mel",
    type: "appointment",
    typeLabel: "Consulta",
    title: "Checkup",
    repeatType: "once",
    times: ["10:30"],
  },
];

/** Ocorrência já "achatada" (um horário específico de um lembrete) — o
 * mesmo conceito que `buildReminderOccurrences()` calcula no app real,
 * só que aqui pré-computado pros 2 lembretes diários de demonstração. */
export interface ReminderDemoOccurrence {
  id: string;
  pet: string;
  typeLabel: string;
  title: string;
  time: string;
  /** Só os dois lembretes "daily" viram ocorrências de hoje — os outros
   * dois (weekdays/once) são usados nos estágios de recorrência e
   * "próximo compromisso", não fingidos como parte do dia de hoje. */
  done: boolean;
}

export const TODAY_OCCURRENCES: ReminderDemoOccurrence[] = [
  {
    id: "medicamento-mel-08",
    pet: "Mel",
    typeLabel: "Medicamento",
    title: "Anti-inflamatório",
    time: "08:00",
    done: true,
  },
  {
    id: "cuidado-thor-1930",
    pet: "Thor",
    typeLabel: "Cuidado",
    title: "Escovar dentes",
    time: "19:30",
    done: false,
  },
  {
    id: "medicamento-mel-20",
    pet: "Mel",
    typeLabel: "Medicamento",
    title: "Anti-inflamatório",
    time: "20:00",
    done: false,
  },
];
