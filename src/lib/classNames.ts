type ClassValue = string | false | null | undefined;

/** Junta nomes de classe condicionalmente, sem depender de uma lib externa. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
