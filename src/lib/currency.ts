export const CURRENCIES = [
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "USD", label: "Dollar US ($)", symbol: "$" },
  { code: "XOF", label: "Franc CFA (FCFA)", symbol: "FCFA" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value);
}

// NOTE: this is a display-only formatter — amounts are stored as a currency-agnostic
// integer of cents and simply relabeled with the viewer's chosen currency symbol.
// There is no real foreign-exchange conversion between EUR/USD/XOF here; wiring one up
// (e.g. a live FX rate API) is needed before this can represent real money movement
// across different currencies.
export function formatMoney(cents: number, currencyCode: string) {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const amount = (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2 });
  return currency.code === "USD" ? `${currency.symbol}${amount}` : `${amount} ${currency.symbol}`;
}
