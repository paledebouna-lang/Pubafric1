export const TRANSACTION_TYPE_LABEL: Record<string, string> = {
  DEPOT: "Dépôt",
  RETRAIT: "Retrait",
  DEBIT_MISSION: "Mission débitée",
  CREDIT_MISSION: "Mission créditée",
  FRAIS_PLATEFORME: "Frais PubAFric",
  COMMISSION_PARRAINAGE: "Commission de parrainage",
  // Legacy values from before the admin-approval redesign — kept so old rows still render.
  ACHAT_CREDITS: "Achat de crédits",
  DEMANDE_RETRAIT: "Demande de versement",
  RETRAIT_VERSE: "Versement effectué",
};

export const TRANSACTION_STATUS_LABEL: Record<string, string> = {
  EN_ATTENTE: "En attente",
  APPROUVEE: "Approuvée",
  REJETEE: "Rejetée",
};

export const TRANSACTION_STATUS_COLOR: Record<string, string> = {
  EN_ATTENTE: "bg-brand-gold/10 text-brand-gold",
  APPROUVEE: "bg-brand-teal/10 text-brand-teal",
  REJETEE: "bg-brand-coral/10 text-brand-coral",
};
