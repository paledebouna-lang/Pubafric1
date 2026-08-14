"use client";

import { useActionState } from "react";
import { resolveDispute, type ActionState } from "./actions";

export default function DisputeDecisionButtons({ disputeId }: { disputeId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(resolveDispute, {});

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="disputeId" value={disputeId} />
      <div className="flex gap-2">
        <button
          type="submit"
          name="decision"
          value="INTERNAUTE"
          disabled={pending}
          className="bg-brand-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-teal/90 disabled:opacity-60"
        >
          Faveur internaute
        </button>
        <button
          type="submit"
          name="decision"
          value="ENTREPRISE"
          disabled={pending}
          className="bg-[#7c8797] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#6b7280] disabled:opacity-60"
        >
          Maintenir rejet
        </button>
      </div>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
