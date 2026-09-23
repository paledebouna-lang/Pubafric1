"use client";

import { useActionState } from "react";
import { createAdminMission, type ActionState } from "./actions";
import { MISSION_CATEGORIES } from "@/lib/categories";

export default function AdminMissionForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createAdminMission,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 border border-border-soft bg-white p-5">
      <input
        name="title"
        placeholder="Titre de la mission"
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <select
        name="category"
        required
        defaultValue=""
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      >
        <option value="" disabled>
          Type de mission...
        </option>
        {MISSION_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <textarea
        name="instructions"
        placeholder="Instructions"
        required
        rows={2}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <div className="flex gap-3">
        <input
          name="reward"
          type="number"
          step="1"
          min="1"
          placeholder="Rémunération (FCFA)"
          required
          className="w-1/3 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="slotsTotal"
          type="number"
          min="1"
          defaultValue={1}
          title="Nombre d'internautes"
          className="w-1/3 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="deadlineHours"
          type="number"
          min="1"
          defaultValue={24}
          title="Délai en heures"
          className="w-1/3 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}
      {state?.success && <p className="text-sm font-semibold text-brand-teal">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-[#2b2f38] px-6 py-2 text-xs font-bold tracking-wide text-white hover:bg-[#1c1f26] disabled:opacity-60"
      >
        {pending ? "PUBLICATION..." : "PUBLIER (MISSION PUBAFRIC)"}
      </button>
    </form>
  );
}
