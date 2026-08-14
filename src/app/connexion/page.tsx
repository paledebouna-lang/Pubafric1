"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginUser, type LoginState } from "./actions";

const initialState: LoginState = {};

function ConnexionForm() {
  const [state, formAction, pending] = useActionState(loginUser, initialState);
  const params = useSearchParams();
  const justRegistered = params.get("inscription") === "ok";
  const justVerified = params.get("verifie") === "ok";

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

      <form action={formAction} className="mt-8 flex flex-col gap-4">
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

export default function ConnexionPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-extrabold">
        <span className="text-brand-red">P</span>ubAFric
      </h1>
      <p className="mt-1 text-center text-xs font-bold tracking-widest text-[#7c8797]">
        SE CONNECTER
      </p>

      <Suspense fallback={null}>
        <ConnexionForm />
      </Suspense>
    </main>
  );
}
