// Informations légales de l'éditeur, affichées dans les mentions légales et les CGU/CGV.
// Source : documents officiels de la société (déclaration de constitution au RCCM et
// déclaration fiscale d'existence). Chaque valeur peut être remplacée par une variable
// d'environnement (Vercel > Settings > Environment Variables) ; une valeur vide n'est pas
// affichée et aucune information n'est inventée.

export const LEGAL_LAST_UPDATE = "9 octobre 2026";

function env(name: string, fallback: string | null = null): string | null {
  return process.env[name]?.trim() || fallback;
}

export function getLegal() {
  return {
    brand: "PubAfric", // nom commercial du site
    name: env("LEGAL_COMPANY_NAME", "AKWABA CORPORATION") as string,
    form: env("LEGAL_COMPANY_FORM", "SARL pluri-personnelle"),
    capital: env("LEGAL_CAPITAL", "5 000 000 FCFA"),
    registration: env("LEGAL_RCCM", "CI-ABJ-2019-B-03563"), // numéro RCCM
    taxId: env("LEGAL_TAX_ID", "1908771 N"), // numéro de compte contribuable (confirmé par l'éditeur)
    address: env(
      "LEGAL_ADDRESS",
      "Lot 2350, îlot 137, Riviera II (derrière Poulet Chaud), Cocody, Abidjan, Côte d'Ivoire — BP 90 Bonoua"
    ),
    director: env("LEGAL_DIRECTOR", "N'GUESSAN Assa Étienne, gérant"),
    email: env("LEGAL_CONTACT_EMAIL", "contact@pubafric.com") as string,
    phone: env("LEGAL_CONTACT_PHONE"),
  };
}
