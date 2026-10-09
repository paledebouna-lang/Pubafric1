"use client";

import { useActionState } from "react";
import { completeAllMissions, type ActionState } from "./actions";

export default function CompleteAllButton({ openCount }: { openCount: number }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(completeAllMissions, {});

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Marquer les ${openCount} mission(s) publiée(s) comme achevée(s) ? Elles ne pourront plus être prises (les participations déjà en cours restent valables).`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="border border-border-soft bg-white p-4"
    >
      <p className="text-sm text-[#4a5262]">
        {openCount} mission{openCount > 1 ? "s" : ""} publiée{openCount > 1 ? "s" : ""} actuellement. Les
        marquer comme achevées les retire des missions disponibles ; vous pourrez ensuite créer les vraies
        missions.
      </p>
      <button
        type="submit"
        disabled={pending || openCount === 0}
        className="mt-3 bg-brand-coral px-5 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-coral/90 disabled:opacity-50"
      >
        {pending ? "..." : "MARQUER TOUTES LES MISSIONS PUBLIÉES COMME ACHEVÉES"}
      </button>
      {state?.error && <p className="mt-2 text-sm font-semibold text-brand-coral">{state.error}</p>}
      {state?.success && <p className="mt-2 text-sm font-semibold text-brand-teal">{state.success}</p>}
    </form>
  );
}
