"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, type LoginState } from "./actions";
import GoogleButton from "./GoogleButton";

const initialState: LoginState = {};

export default function ConnexionForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, formAction, pending] = useActionState(loginUser, initialState);
  const params = useSearchParams();
  const justRegistered = params.get("inscription") === "ok";
  const justVerified = params.get("verifie") === "ok";
  const googleError = params.get("erreur");

  return (
    <>
      {justRegistered && (
        <p className="mt-6 bg-brand-teal/10 px-4 py-3 text-center text-sm font-semibold text-brand-teal">
          Compte créé avec succès, connectez-vous.
        </p>
      )}
      {justVerified && (
        <p className="mt-6 bg-brand-teal/10 px-4 py-3 text-center text-sm font-semibold text-brand-teal">
          Compte vérifié avec succès, connectez-vous.
        </p>
      )}

      {googleError && (
        <p className="mt-6 bg-brand-coral/10 px-4 py-3 text-center text-sm font-semibold text-brand-coral">
          {googleError === "google-email"
            ? "Votre compte Google n'a pas d'adresse email vérifiée. Utilisez un autre compte."
            : "La connexion avec Google a échoué. Réessayez ou utilisez votre email."}
        </p>
      )}

      {googleEnabled && (
        <div className="mt-8 flex flex-col gap-4">
          <GoogleButton label="Se connecter avec Google" />
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#9aa2b1]">
            <span className="h-px flex-1 bg-border-soft" />
            OU
            <span className="h-px flex-1 bg-border-soft" />
          </div>
        </div>
      )}

      <form action={formAction} className={`${googleEnabled ? "mt-4" : "mt-8"} flex flex-col gap-4`}>
        <input
          name="identifier"
          placeholder="Email ou téléphone"
          className="border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          className="border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
          required
        />

        {state?.error && (
          <p className="text-sm font-semibold text-brand-coral">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 bg-brand-blue py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {pending ? "CONNEXION..." : "SE CONNECTER"}
        </button>

        <p className="text-center text-xs text-[#7c8797]">
          Pas encore de compte ?{" "}
          <a href="/inscription" className="font-semibold text-brand-blue">
            S&apos;inscrire
          </a>
        </p>
      </form>
    </>
  );
}
