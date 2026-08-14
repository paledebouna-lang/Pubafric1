"use client";

import { useActionState } from "react";
import { toggleBan, type ActionState } from "./actions";

export default function BanButton({ userId, isBanned }: { userId: string; isBanned: boolean }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(toggleBan, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className={`rounded-full px-3 py-1 text-xs font-bold text-white disabled:opacity-60 ${
          isBanned ? "bg-brand-teal hover:bg-brand-teal/90" : "bg-brand-coral hover:bg-brand-coral/90"
        }`}
      >
        {pending ? "..." : isBanned ? "Débannir" : "Bannir"}
      </button>
      {state?.error && <p className="mt-1 text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}
