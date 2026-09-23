// PubAfric fonctionne uniquement en FCFA (XOF).
//
// Les montants sont stockés en base comme des entiers en "unité mineure" : pour le FCFA,
// qui n'a pas de centimes, 1 unité stockée = 1 FCFA. Les colonnes gardent leur ancien nom
// (walletCents, rewardCents, amountCents) pour ne pas casser le schéma : le suffixe
// "Cents" est historique et ne veut plus dire "centimes".
export const CURRENCY_CODE = "XOF";
export const CURRENCY_LABEL = "FCFA";

const NBSP = " ";

// « 1 000 FCFA » : séparateur de milliers = espace insécable, pas de décimales.
export function formatMoney(amount: number): string {
  const digits = Math.abs(Math.round(amount)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${amount < 0 ? "-" : ""}${grouped}${NBSP}${CURRENCY_LABEL}`;
}

// Lit un montant saisi dans un formulaire (FCFA entier). Retourne null si invalide.
export function parseFcfa(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.replace(/[\s  ]/g, "").replace(",", ".");
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}
