"use client";

import { useActionState } from "react";
import { createAnnouncement, type ActionState } from "./actions";

export default function AnnouncementForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createAnnouncement,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <select
        name="type"
        required
        defaultValue="ANNONCE"
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      >
        <option value="ANNONCE">Annonce</option>
        <option value="PROMO">Offre promotionnelle</option>
      </select>
      <input
        name="title"
        placeholder="Titre"
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <textarea
        name="body"
        placeholder="Message"
        required
        rows={2}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-brand-gold px-6 py-2 text-xs font-bold tracking-wide text-white hover:bg-brand-gold/90 disabled:opacity-60"
      >
        {pending ? "PUBLICATION..." : "PUBLIER"}
      </button>
    </form>
  );
}
