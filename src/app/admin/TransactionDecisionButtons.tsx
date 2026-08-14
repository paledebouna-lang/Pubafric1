"use client";

import { useActionState } from "react";
import { approveTransaction, rejectTransaction, type ActionState } from "./actions";

function ApproveForm({ transactionId }: { transactionId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    approveTransaction,
    {}
  );
  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="transactionId" value={transactionId} />
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-teal/90 disabled:opacity-60"
      >
        Approuver
      </button>
      {state?.error && <p className="max-w-[10rem] text-right text-xs font-semibold text-brand-coral">{state.error}</p>}
    </form>
  );
}

function RejectForm({ transactionId }: { transactionId: string }) {
  const [, formAction, pending] = useActionState<ActionState, FormData>(rejectTransaction, {});
  return (
    <form action={formAction}>
      <input type="hidden" name="transactionId" value={transactionId} />
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-coral px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-coral/90 disabled:opacity-60"
      >
        Rejeter
      </button>
    </form>
  );
}

export default function TransactionDecisionButtons({ transactionId }: { transactionId: string }) {
  return (
    <div className="flex gap-2">
      <ApproveForm transactionId={transactionId} />
      <RejectForm transactionId={transactionId} />
    </div>
  );
}
