"use client";

import { useActionState } from "react";
import { submitReport, type ActionState } from "./actions";

export default function SubmitReportForm({ claimId }: { claimId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitReport, {});

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="claimId" value={claimId} />
      <textarea
        name="report"
        required
        placeholder="Décrivez le travail effectué (compte-rendu)..."
        rows={2}
        className="border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <input
        name="link"
        type="url"
        placeholder="Lien à l'appui (optionnel)"
        className="border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <div className="flex gap-3">
        <label className="flex-1 text-xs text-[#7c8797]">
          Photo (optionnel)
          <input name="image" type="file" accept="image/*" className="mt-1 block w-full text-xs" />
        </label>
        <label className="flex-1 text-xs text-[#7c8797]">
          Vidéo (optionnel)
          <input name="video" type="file" accept="video/*" className="mt-1 block w-full text-xs" />
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-teal px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90 disabled:opacity-60"
        >
          {pending ? "ENVOI..." : "ENVOYER LE COMPTE-RENDU"}
        </button>
        {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
      </div>
    </form>
  );
}
