"use client";

import { useActionState } from "react";
import { decideAdminClaim, type ActionState } from "./actions";

export default function AdminDecisionButtons({ claimId }: { claimId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    decideAdminClaim,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="claimId" value={claimId} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="VALIDEE"
          disabled={pending}
          className="bg-brand-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-teal/90 disabled:opacity-60"
        >
          Valider
        </button>
        <button
          type="submit"
          name="decision"
          value="REJETEE"
          disabled={pending}
          className="bg-brand-coral px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-coral/90 disabled:opacity-60"
        >
          Rejeter
        </button>
      </div>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
