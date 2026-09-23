"use client";

import { Suspense, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {};

function InscriptionForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const [role, setRole] = useState<"INTERNAUTE" | "ENTREPRISE">("INTERNAUTE");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email");
  const params = useSearchParams();
  const parrainCode = params.get("parrain")?.toUpperCase() ?? "";

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-[#2b2f38]">Vous êtes</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="INTERNAUTE"
              checked={role === "INTERNAUTE"}
              onChange={() => setRole("INTERNAUTE")}
            />
            internaute
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="ENTREPRISE"
              checked={role === "ENTREPRISE"}
              onChange={() => setRole("ENTREPRISE")}
            />
            Business
          </label>
        </div>
      </div>

      <input
        name="name"
        placeholder="Nom ou raison sociale"
        className="border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
        required
      />

      <div>
        <div className="mb-2 flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={identifierType === "email"}
              onChange={() => setIdentifierType("email")}
            />
            S&apos;inscrire par email
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={identifierType === "phone"}
              onChange={() => setIdentifierType("phone")}
            />
            S&apos;inscrire par téléphone
          </label>
        </div>
        {identifierType === "email" ? (
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
            required
          />
        ) : (
          <input
            name="phone"
            type="tel"
            placeholder="Numéro de téléphone"
            className="w-full border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
            required
          />
        )}
      </div>

      {role === "INTERNAUTE" && (
        <input
          name="parrainCode"
          placeholder="Code de parrainage (optionnel)"
          defaultValue={parrainCode}
          className="border border-border-soft bg-muted-bg px-4 py-3 text-sm uppercase outline-none focus:border-brand-blue"
        />
      )}

      {role === "ENTREPRISE" && (
        <label className="text-xs text-[#7c8797]">
          Logo de l&apos;entreprise (optionnel — affiché sur la page Partenaires)
          <input
            name="logo"
            type="file"
            accept="image/*"
            className="mt-1 block w-full border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
          />
        </label>
      )}

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        className="border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
        required
        minLength={8}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirmation mot de passe"
        className="border border-border-soft bg-muted-bg px-4 py-3 text-sm outline-none focus:border-brand-blue"
        required
        minLength={8}
      />

      <label className="flex items-center gap-2 text-sm text-[#2b2f38]">
        <input type="checkbox" name="terms" required />
        J&apos;accepte les conditions générales
      </label>

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-brand-teal py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90 disabled:opacity-60"
      >
        {pending ? "CRÉATION EN COURS..." : "CRÉER MON COMPTE"}
      </button>

      <p className="text-center text-xs text-[#7c8797]">
        Déjà inscrit ?{" "}
        <a href="/connexion" className="font-semibold text-brand-blue">
          Se connecter
        </a>
      </p>
    </form>
  );
}

export default function InscriptionPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-extrabold">
        <span className="text-brand-red">P</span>ubAFric
      </h1>
      <p className="mt-1 text-center text-xs font-bold tracking-widest text-[#7c8797]">
        CRÉER NOUVEAU COMPTE
      </p>

      <Suspense fallback={null}>
        <InscriptionForm />
      </Suspense>
    </main>
  );
}
