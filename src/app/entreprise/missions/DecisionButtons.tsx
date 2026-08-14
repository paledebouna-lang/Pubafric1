"use client";

import { useActionState } from "react";
import { decideClaim, type ActionState } from "./actions";

export default function DecisionButtons({ claimId }: { claimId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(decideClaim, {});

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="claimId" value={claimId} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="VALIDEE"
          disabled={pending}
          className="bg-brand-teal px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90 disabled:opacity-60"
        >
          VALIDER
        </button>
        <button
          type="submit"
          name="decision"
          value="REJETEE"
          disabled={pending}
          className="bg-brand-coral px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-coral/90 disabled:opacity-60"
        >
          REJETER
        </button>
      </div>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
