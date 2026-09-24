// Liens officiels des réseaux sociaux de PubAfric.
// Une variable d'environnement (SOCIAL_*_URL sur Vercel) remplace toujours la valeur par défaut.

const DEFAULTS: Record<string, string> = {
  SOCIAL_WHATSAPP_URL: "https://whatsapp.com/channel/0029VbE1mIzHgZWguNIASU36",
  SOCIAL_FACEBOOK_URL: "https://www.facebook.com/profile.php?id=100083283250244",
  SOCIAL_YOUTUBE_URL: "https://www.youtube.com/@pubafric",
  SOCIAL_TIKTOK_URL: "https://www.tiktok.com/@pubafric",
  SOCIAL_INSTAGRAM_URL: "https://www.instagram.com/pubafric/",
};

export function socialUrl(envName: string): string | null {
  return process.env[envName]?.trim() || DEFAULTS[envName] || null;
}
