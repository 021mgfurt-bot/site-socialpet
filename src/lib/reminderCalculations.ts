import type { ReminderDemoOccurrence } from "../data/reminderDemoRecords";

const WEEKDAY_LONG = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });
const WEEKDAY_SHORT = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const DAY_MONTH = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" });

/** Ordena ocorrências por horário — "08:00" antes de "14:00" antes de
 * "20:00", nunca por ordem de inserção no array. */
export function sortByTime<T extends { time: string }>(occurrences: T[]): T[] {
  return [...occurrences].sort((a, b) => a.time.localeCompare(b.time));
}

/** "08:00" → "08:00" formatado de fato via Intl (nunca string montada na
 * mão) — garante o mesmo padrão 24h em toda a seção (Prompt 9 §73). */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

/** "Hoje, quinta-feira" — o dia da semana vem sempre do relógio real. */
export function getTodayLabel(): string {
  const weekday = WEEKDAY_LONG.format(new Date());
  return `Hoje, ${weekday}`;
}

/** Nomes curtos dos dias da semana selecionados (0=domingo…6=sábado),
 * pra descrever recorrência do tipo "weekdays" sem tabela de calendário —
 * ex.: [2, 5] → "terça e sexta". */
export function describeWeekdays(weekdays: number[]): string {
  const base = new Date();
  const names = weekdays
    .slice()
    .sort((a, b) => a - b)
    .map((day) => {
      const date = new Date(base);
      date.setDate(base.getDate() + ((day - base.getDay() + 7) % 7));
      return WEEKDAY_SHORT.format(date).replace(".", "");
    });

  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

/** Próxima data (a partir de hoje, incluindo hoje) em que cai um dado dia
 * da semana — usado só pra rotular um lembrete "once" de forma relativa
 * ("sexta, 12 de setembro"), nunca uma data fixa no código. */
export function nextWeekdayLabel(targetWeekday: number): string {
  const today = new Date();
  const offset = (targetWeekday - today.getDay() + 7) % 7;
  const target = new Date(today);
  target.setDate(today.getDate() + offset);
  const weekday = WEEKDAY_LONG.format(target);
  return `${weekday}, ${DAY_MONTH.format(target)}`;
}

export function sortTodayOccurrences(occurrences: ReminderDemoOccurrence[]): ReminderDemoOccurrence[] {
  return sortByTime(occurrences);
}
