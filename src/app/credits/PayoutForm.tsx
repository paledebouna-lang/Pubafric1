"use client";

import { useActionState } from "react";
import { requestPayout, type ActionState } from "./actions";

export default function PayoutForm({ currencySymbol = "€" }: { currencySymbol?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(requestPayout, {});

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder={`Montant à retirer (${currencySymbol})`}
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <input
        name="mobileMoneyPhone"
        type="tel"
        placeholder="Numéro de téléphone mobile money (ex: +225 07 00 00 00 00)"
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
