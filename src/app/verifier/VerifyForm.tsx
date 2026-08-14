"use client";

import { useActionState } from "react";
import { confirmVerification, resendVerificationCode, type ActionState } from "./actions";

export default function VerifyForm({ identifiant }: { identifiant: string }) {
  const [confirmState, confirmAction, confirmPending] = useActionState<ActionState, FormData>(
    confirmVerification,
    {}
  );
  const [resendState, resendAction, resendPending] = useActionState<ActionState, FormData>(
    resendVerificationCode,
    {}
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={confirmAction} className="flex flex-col gap-3">
        <input type="hidden" name="identifiant" value={identifiant} />
        <input
          name="code"
          placeholder="Code à 6 chiffres"
          required
          maxLength={6}
          className="border border-border-soft bg-muted-bg px-4 py-3 text-center text-lg font-bold tracking-[0.5em] outline-none focus:border-brand-blue"
        />
        {confirmState?.error && (
          <p className="text-sm font-semibold text-brand-coral">{confirmState.error}</p>
        )}
        <button
          type="submit"
          disabled={confirmPending}
          className="bg-brand-teal py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90 disabled:opacity-60"
        >
          {confirmPending ? "VÉRIFICATION..." : "CONFIRMER MON COMPTE"}
        </button>
      </form>

      <form action={resendAction}>
        <input type="hidden" name="identifiant" value={identifiant} />
        <button
          type="submit"
          disabled={resendPending}
          className="w-full border border-border-soft py-2 text-xs font-semibold text-[#7c8797] transition-colors hover:border-brand-blue hover:text-brand-blue disabled:opacity-60"
        >
          {resendPending ? "ENVOI..." : "RENVOYER LE CODE"}
        </button>
        {resendState?.success && (
          <p className="mt-2 text-center text-xs font-semibold text-brand-teal">
            {resendState.success}
          </p>
        )}
      </form>
    </div>
  );
}
