export function formatEUR(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";
}
