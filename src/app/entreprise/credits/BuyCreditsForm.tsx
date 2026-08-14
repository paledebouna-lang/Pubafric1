"use client";

import { useActionState } from "react";
import { requestDeposit, type ActionState } from "./actions";

const PRESETS = [10, 25, 50, 100];

export default function BuyCreditsForm({ currencySymbol }: { currencySymbol: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestDeposit,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((amount) => (
          <button
            key={amount}
            type="submit"
            name="amount"
            value={amount}
            className="rounded-full border border-border-soft px-4 py-1 text-xs font-bold text-[#2b2f38] hover:border-brand-blue"
          >
            +{amount} {currencySymbol}
          </button>
        ))}
      </div>

      <input
        name="amount"
        type="number"
        step="0.01"
        min="1"
        placeholder={`Ou montant personnalisé (${currencySymbol})`}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <select
        name="paymentMethod"
        required
        defaultValue=""
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      >
        <option value="" disabled>
          Moyen de paiement utilisé...
        </option>
        <option value="Mobile Money">Mobile Money</option>
        <option value="Virement bancaire">Virement bancaire</option>
        <option value="Chèque">Chèque</option>
      </select>

      <input
        name="reference"
        placeholder="Référence du paiement (optionnel)"
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}
      {state?.success && <p className="text-sm font-semibold text-brand-teal">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-brand-teal px-6 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90 disabled:opacity-60"
      >
        {pending ? "ENVOI..." : "DEMANDER LE DÉPÔT"}
      </button>
      <p className="text-xs text-[#9aa2b1]">
        Payez ce montant réellement via le compte bancaire de PubAFric, puis indiquez-le
        ici — un administrateur créditera votre portefeuille dès réception confirmée.
      </p>
    </form>
  );
}
