const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Única fonte de formatação monetária do site — nunca montar "R$ x,xx" na mão. */
export function formatBRL(value: number): string {
  return currencyFormatter.format(value);
}
