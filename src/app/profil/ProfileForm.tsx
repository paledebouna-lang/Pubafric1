"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "./actions";

type Props = {
  isInternaute: boolean;
  isEntreprise: boolean;
  logoUrl?: string | null;
  initial: {
    firstName: string;
    lastName: string;
    age: string;
    location: string;
    profession: string;
    whatsapp: string;
    socialInstagram: string;
    socialTiktok: string;
    socialFacebook: string;
    socialTwitter: string;
  };
};

export default function ProfileForm({ isInternaute, isEntreprise, logoUrl, initial }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateProfile,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="firstName"
          placeholder="Prénom"
          defaultValue={initial.firstName}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="lastName"
          placeholder="Nom"
          defaultValue={initial.lastName}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="age"
          type="number"
          min="13"
          max="120"
          placeholder="Âge"
          defaultValue={initial.age}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="location"
          placeholder="Lieu d'habitation"
          defaultValue={initial.location}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="profession"
          placeholder="Profession"
          defaultValue={initial.profession}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="whatsapp"
          type="tel"
          placeholder="Contact WhatsApp"
          defaultValue={initial.whatsapp}
          className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      {isEntreprise && (
        <div className="flex items-center gap-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo actuel"
              className="h-14 w-14 shrink-0 rounded-full border border-border-soft object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-border-soft text-[10px] text-[#9aa2b1]">
              Aucun logo
            </div>
          )}
          <label className="flex-1 text-xs text-[#7c8797]">
            Logo de l&apos;entreprise (affiché sur la page Partenaires)
            <input
              name="logo"
              type="file"
              accept="image/*"
              className="mt-1 block w-full border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </label>
        </div>
      )}

      {isInternaute && (
        <>
          <p className="mt-2 text-sm font-semibold text-[#2b2f38]">
            Réseaux sociaux (facilite la vérification des missions)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="socialInstagram"
              placeholder="Instagram (@pseudo)"
              defaultValue={initial.socialInstagram}
              className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
            <input
              name="socialTiktok"
              placeholder="TikTok (@pseudo)"
              defaultValue={initial.socialTiktok}
              className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
            <input
              name="socialFacebook"
              placeholder="Facebook"
              defaultValue={initial.socialFacebook}
              className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
            <input
              name="socialTwitter"
              placeholder="Twitter / X"
              defaultValue={initial.socialTwitter}
              className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          </div>
        </>
      )}

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}
      {state?.success && <p className="text-sm font-semibold text-brand-teal">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-brand-blue px-6 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
      >
        {pending ? "ENREGISTREMENT..." : "ENREGISTRER MON PROFIL"}
      </button>
    </form>
  );
}
