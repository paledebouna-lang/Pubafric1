"use client";

import { useActionState } from "react";
import { deleteUser, type ActionState } from "./actions";

export default function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(deleteUser, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          `Supprimer définitivement « ${name} » ?\n\nSes missions, comptes-rendus, transactions et litiges seront aussi effacés. Cette action est irréversible.`
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-brand-coral px-3 py-1 text-xs font-bold text-brand-coral hover:bg-brand-coral hover:text-white disabled:opacity-60"
      >
        {pending ? "..." : "Supprimer"}
      </button>
      {state?.error && (
        <p className="mt-1 max-w-52 text-right text-xs font-semibold text-brand-coral">{state.error}</p>
      )}
    </form>
  );
}
