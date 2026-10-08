// Adresse officielle du site. Les anciennes adresses (hébergement Vercel) sont réécrites à
// l'affichage : des textes enregistrés en base avant le changement de domaine continuent ainsi
// de pointer vers la bonne adresse, sans réimporter les missions.
export const SITE_URL = "https://www.pubafric.com";

const LEGACY_HOSTS = /https?:\/\/pubafric1\.vercel\.app/gi;

export function rewriteLegacyHost(value: string): string {
  return value.replace(LEGACY_HOSTS, SITE_URL);
}
