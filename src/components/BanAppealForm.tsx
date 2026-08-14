"use client";

import { useActionState } from "react";
import { raiseBanAppeal, type ActionState } from "./banAppealActions";

export default function BanAppealForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    raiseBanAppeal,
    {}
  );

  if (state?.success) {
    return <p className="mt-2 text-xs font-semibold text-white">{state.success}</p>;
  }

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start">
      <textarea
        name="reason"
        required
        placeholder="Expliquez pourquoi vous contestez ce bannissement..."
        rows={2}
        className="flex-1 border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/70 outline-none focus:border-white"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 bg-white px-4 py-2 text-xs font-bold tracking-wide text-brand-coral transition-colors hover:bg-white/90 disabled:opacity-60"
      >
        {pending ? "ENVOI..." : "CONTESTER MON BANNISSEMENT"}
      </button>
      {state?.error && (
        <p className="text-xs font-semibold text-white sm:basis-full">{state.error}</p>
      )}
    </form>
  );
}
