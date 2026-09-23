// PubAFric's cut: 15% on money entreprises pay out for missions, 10% on what
// internautes earn. Both are real ledger deductions (not just display copy).
// Les pourcentages sont des entiers pour que tous les calculs restent en arithmétique
// entière (pas d'erreur d'arrondi flottant sur des montants en FCFA).
export const ENTREPRISE_FEE_PERCENT = 15;
export const INTERNAUTE_FEE_PERCENT = 10;
export const ENTREPRISE_FEE_RATE = ENTREPRISE_FEE_PERCENT / 100;
export const INTERNAUTE_FEE_RATE = INTERNAUTE_FEE_PERCENT / 100;

// Le coût facturé à l'entreprise (récompense + 15 %) est arrondi aux 5 FCFA supérieurs.
const ENTREPRISE_COST_ROUNDING = 5;

export function entrepriseCost(rewardFcfa: number): number {
  const raw = rewardFcfa * (100 + ENTREPRISE_FEE_PERCENT); // en centièmes de FCFA
  const unit = 100 * ENTREPRISE_COST_ROUNDING;
  return Math.ceil(raw / unit) * ENTREPRISE_COST_ROUNDING;
}

// Ce que l'internaute reçoit : récompense − 10 % (arrondi au FCFA le plus proche).
export function internauteNet(rewardFcfa: number): number {
  return rewardFcfa - Math.round((rewardFcfa * INTERNAUTE_FEE_PERCENT) / 100);
}
