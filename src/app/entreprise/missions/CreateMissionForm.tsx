"use client";

import { useActionState, useState } from "react";
import { createMission, type ActionState } from "./actions";
import { MISSION_CATEGORIES } from "@/lib/categories";
import LocationPicker from "@/components/LocationPicker";

export default function CreateMissionForm({ currencySymbol = "€" }: { currencySymbol?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createMission, {});
  const [needsLocation, setNeedsLocation] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

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
        placeholder="Instructions précises pour l'internaute"
        required
        rows={3}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <div className="flex gap-3">
        <input
          name="reward"
          type="number"
          step="0.01"
          min="0.01"
          placeholder={`Rémunération par internaute (${currencySymbol})`}
          required
          className="w-1/2 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="slotsTotal"
          type="number"
          min="1"
          max="500"
          defaultValue={1}
          title="Nombre d'internautes recherchés"
          className="w-1/4 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <input
          name="deadlineHours"
          type="number"
          min="1"
          max="720"
          defaultValue={24}
          title="Délai en heures"
          className="w-1/4 border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>
      <p className="-mt-2 text-xs text-[#9aa2b1]">
        Rémunération par internaute · Nombre d&apos;internautes recherchés · Délai (heures)
      </p>

      <input
        name="link"
        type="url"
        placeholder="Lien utile pour la mission (optionnel)"
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <div className="flex gap-3">
        <label className="flex-1 text-xs text-[#7c8797]">
          Image (optionnel)
          <input
            name="image"
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-xs"
          />
        </label>
        <label className="flex-1 text-xs text-[#7c8797]">
          Vidéo (optionnel)
          <input
            name="video"
            type="file"
            accept="video/*"
            className="mt-1 block w-full text-xs"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-[#2b2f38]">
        <input
          type="checkbox"
          checked={needsLocation}
          onChange={(e) => setNeedsLocation(e.target.checked)}
        />
        Cette mission nécessite un lieu précis (cliquez sur la carte pour le placer)
      </label>

      {needsLocation && (
        <>
          <LocationPicker position={position} onPick={(lat, lng) => setPosition([lat, lng])} />
          <input type="hidden" name="lat" value={position?.[0] ?? ""} />
          <input type="hidden" name="lng" value={position?.[1] ?? ""} />
          {position && (
            <p className="text-xs text-[#9aa2b1]">
              Position choisie : {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </p>
          )}
        </>
      )}

      {state?.error && <p className="text-sm font-semibold text-brand-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-brand-red px-6 py-2 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90 disabled:opacity-60"
      >
        {pending ? "PUBLICATION..." : "PUBLIER LA MISSION"}
      </button>
    </form>
  );
}
