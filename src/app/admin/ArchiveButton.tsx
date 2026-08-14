"use client";

import { useActionState } from "react";
import { archiveMission, type ActionState } from "./actions";

export default function ArchiveButton({ missionId }: { missionId: string }) {
  const [, formAction, pending] = useActionState<ActionState, FormData>(archiveMission, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="missionId" value={missionId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-border-soft px-3 py-1 text-xs font-semibold text-[#7c8797] hover:border-brand-coral hover:text-brand-coral disabled:opacity-60"
      >
        {pending ? "..." : "Archiver"}
      </button>
    </form>
  );
}
