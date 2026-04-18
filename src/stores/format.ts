/**
 * Formats a number as Brazilian Real currency (R$ 1.234,56).
 */
export function formatBRL(value: number): string {
  return `R$ ${value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/**
 * Like `formatBRL` but without the trailing space (R$1.234,56).
 */
export function formatBRLTight(value: number): string {
  return formatBRL(value).replace("R$ ", "R$");
}
