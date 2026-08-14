"use client";

import { useActionState } from "react";
import { claimMission, type ActionState } from "./actions";

export default function ClaimButton({ missionId }: { missionId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(claimMission, {});

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="missionId" value={missionId} />
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-blue px-4 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
      >
        {pending ? "..." : "PRENDRE CETTE MISSION"}
      </button>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
