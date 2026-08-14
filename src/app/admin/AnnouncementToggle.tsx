"use client";

import { useActionState } from "react";
import { toggleAnnouncement, type ActionState } from "./actions";

export default function AnnouncementToggle({ id, active }: { id: string; active: boolean }) {
  const [, formAction, pending] = useActionState<ActionState, FormData>(toggleAnnouncement, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-border-soft px-3 py-1 text-xs font-semibold text-[#7c8797] hover:border-brand-blue disabled:opacity-60"
      >
        {pending ? "..." : active ? "Désactiver" : "Réactiver"}
      </button>
    </form>
  );
}
