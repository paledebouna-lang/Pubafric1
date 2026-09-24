// Informations légales de l'éditeur, affichées dans les mentions légales et les CGU/CGV.
// Elles se renseignent dans les variables d'environnement (Vercel > Settings > Environment
// Variables) : un champ vide n'est simplement pas affiché, aucune information n'est inventée.

export const LEGAL_LAST_UPDATE = "24 septembre 2026";

function env(name: string): string | null {
  return process.env[name]?.trim() || null;
}

export function getLegal() {
  return {
    name: env("LEGAL_COMPANY_NAME") ?? "PubAfric",
    form: env("LEGAL_COMPANY_FORM"), // ex : « SARL », « SAS », « Entreprise individuelle »
    capital: env("LEGAL_CAPITAL"), // ex : « 1 000 000 FCFA »
    registration: env("LEGAL_RCCM"), // numéro RCCM
    taxId: env("LEGAL_TAX_ID"), // numéro de compte contribuable
    address: env("LEGAL_ADDRESS"),
    director: env("LEGAL_DIRECTOR"),
    email: env("LEGAL_CONTACT_EMAIL") ?? "contact@pubafric.com",
    phone: env("LEGAL_CONTACT_PHONE"),
  };
}
