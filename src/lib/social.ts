// Liens officiels des réseaux sociaux de PubAfric.
// Une variable d'environnement (SOCIAL_*_URL sur Vercel) remplace toujours la valeur par défaut.

const DEFAULTS: Record<string, string> = {
  SOCIAL_FACEBOOK_URL: "https://www.facebook.com/profile.php?id=100083283250244",
  SOCIAL_YOUTUBE_URL: "https://www.youtube.com/@pubafric",
};

export function socialUrl(envName: string): string | null {
  return process.env[envName]?.trim() || DEFAULTS[envName] || null;
}
