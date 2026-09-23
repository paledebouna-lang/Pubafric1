"use client";

import { useActionState } from "react";
import { publishMission, type ActionState } from "./actions";

export default function PublishButton({ missionId }: { missionId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(publishMission, {});

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="missionId" value={missionId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-teal px-3 py-1 text-xs font-bold text-white hover:bg-brand-teal/90 disabled:opacity-60"
      >
        {pending ? "..." : "Publier"}
      </button>
      {state?.error && <p className="text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
