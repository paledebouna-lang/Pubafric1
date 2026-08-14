"use client";

import { useActionState, useState } from "react";
import { raiseDispute, type ActionState } from "./actions";

export default function DisputeForm({ claimId }: { claimId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(raiseDispute, {});
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-semibold text-brand-coral underline"
      >
        Contester ce rejet
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="claimId" value={claimId} />
      <textarea
        name="reason"
        required
        placeholder="Expliquez pourquoi vous contestez ce rejet, un administrateur PubAFric va trancher."
        rows={2}
        className="border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-coral px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-coral/90 disabled:opacity-60"
        >
          {pending ? "ENVOI..." : "ENVOYER LA CONTESTATION"}
        </button>
        {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
      </div>
    </form>
  );
}
