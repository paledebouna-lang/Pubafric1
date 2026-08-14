"use client";

import { useActionState } from "react";
import { resolveBanAppeal, type ActionState } from "./actions";

export default function BanAppealDecisionButtons({ appealId }: { appealId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resolveBanAppeal,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="appealId" value={appealId} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="ACCEPTE"
          disabled={pending}
          className="bg-brand-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-teal/90 disabled:opacity-60"
        >
          Débannir
        </button>
        <button
          type="submit"
          name="decision"
          value="REJETE"
          disabled={pending}
          className="bg-brand-coral px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-coral/90 disabled:opacity-60"
        >
          Maintenir le bannissement
        </button>
      </div>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
