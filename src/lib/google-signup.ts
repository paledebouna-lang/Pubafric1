// Connexion / inscription avec Google. Le bouton n'apparaît que si les deux clés
// AUTH_GOOGLE_ID et AUTH_GOOGLE_SECRET sont renseignées dans l'environnement.
export const GOOGLE_ENABLED = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

// Cookie court (10 min) posé avant de partir chez Google : il mémorise le profil choisi
// (internaute / entreprise) et le code de parrainage pour la création du compte au retour.
export const SIGNUP_COOKIE = "pubafric_signup";
export const SIGNUP_COOKIE_MAX_AGE_SECONDS = 600;

export type GoogleSignup = { role: "INTERNAUTE" | "ENTREPRISE"; parrain: string | null };

export function parseSignupCookie(raw: string | undefined): GoogleSignup | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { role?: unknown; parrain?: unknown };
    if (data.role !== "INTERNAUTE" && data.role !== "ENTREPRISE") return null;
    const parrain = typeof data.parrain === "string" && data.parrain ? data.parrain.toUpperCase() : null;
    return { role: data.role, parrain };
  } catch {
    return null;
  }
}
