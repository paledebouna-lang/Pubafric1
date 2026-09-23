"use server";

import { cookies } from "next/headers";
import { signIn } from "@/auth";
import { GOOGLE_ENABLED, SIGNUP_COOKIE, SIGNUP_COOKIE_MAX_AGE_SECONDS } from "@/lib/google-signup";

// Lance la connexion Google. Depuis la page d'inscription, le profil choisi (et le code de
// parrainage éventuel) est mémorisé dans un cookie pour la création du compte au retour.
// Depuis la page de connexion, aucun profil n'est passé : seuls les comptes existants passent.
export async function signInWithGoogle(role: string | null, parrain: string | null) {
  if (!GOOGLE_ENABLED) return;

  const jar = await cookies();
  if (role === "INTERNAUTE" || role === "ENTREPRISE") {
    jar.set(SIGNUP_COOKIE, JSON.stringify({ role, parrain: role === "INTERNAUTE" ? parrain : null }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SIGNUP_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  } else {
    jar.delete(SIGNUP_COOKIE);
  }

  await signIn("google", { redirectTo: "/missions" });
}
