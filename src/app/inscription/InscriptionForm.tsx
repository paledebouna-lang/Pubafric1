"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { registerUser, type RegisterState } from "./actions";
import GoogleButton from "../connexion/GoogleButton";

const initialState: RegisterState = {};

export default function InscriptionForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const [role, setRole] = useState<"INTERNAUTE" | "ENTREPRISE">("INTERNAUTE");
  const [identifierType, setIdentifierType] = useState<"email" | "phone">("email");
  const params = useSearchParams();
  const parrainCode = params.get("parrain")?.toUpperCase() ?? "";
  const googleNeedsRole = params.get("google") === "profil";

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      {googleNeedsRole && (
        <p className="bg-brand-gold/10 px-4 py-3 text-center text-sm font-semibold text-[#2b2f38]">
          Ce compte Google n&apos;est pas encore inscrit. Choisissez votre profil ci-dessous puis
          cliquez sur « S&apos;inscrire avec Google ».
        </p>
      )}
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

      {googleEnabled && (
        <>
          <GoogleButton
            role={role}
            parrain={role === "INTERNAUTE" ? parrainCode || null : null}
            label="S'inscrire avec Google"
          />
          <p className="text-center text-xs text-[#7c8797]">
            Utilisez le compte Google déjà connecté sur votre téléphone ou ordinateur. En
            continuant, vous acceptez les{" "}
            <a href="/cgu" className="font-semibold text-brand-blue">
              conditions générales
            </a>
            .
          </p>
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#9aa2b1]">
            <span className="h-px flex-1 bg-border-soft" />
            OU
            <span className="h-px flex-1 bg-border-soft" />
          </div>
        </>
      )}

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
