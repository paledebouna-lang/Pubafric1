"use client";

import { useActionState } from "react";
import { requestWithdrawal, type ActionState } from "./actions";

export default function WithdrawalForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestWithdrawal,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <input
        name="amount"
        type="number"
        step="1"
        min="1"
        placeholder="Montant à retirer (FCFA)"
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <input
        name="destination"
        placeholder="IBAN / compte bancaire ou numéro mobile money de destination"
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}
      {state?.success && <p className="text-sm font-semibold text-brand-teal">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-brand-gold px-6 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-gold/90 disabled:opacity-60"
      >
        {pending ? "ENVOI..." : "DEMANDER LE RETRAIT"}
      </button>
    </form>
  );
}
