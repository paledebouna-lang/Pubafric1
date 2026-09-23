"use client";

import { useActionState } from "react";
import { retractClaim, type ActionState } from "./actions";

export default function RetractButton({ claimId }: { claimId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(retractClaim, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Rétracter cette mission ? Vous l'abandonnez et la place sera libérée pour un autre internaute.")) {
          e.preventDefault();
        }
      }}
      className="mt-3 flex items-center gap-3 border-t border-border-soft pt-3"
    >
      <input type="hidden" name="claimId" value={claimId} />
      <button
        type="submit"
        disabled={pending}
        className="border border-brand-coral px-3 py-1.5 text-xs font-bold tracking-wide text-brand-coral transition-colors hover:bg-brand-coral hover:text-white disabled:opacity-60"
      >
        {pending ? "..." : "RÉTRACTER CETTE MISSION"}
      </button>
      <span className="text-xs text-[#9aa2b1]">Vous ne souhaitez plus l&apos;exécuter ? Libérez la place.</span>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
