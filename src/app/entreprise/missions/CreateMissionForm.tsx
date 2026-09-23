"use client";

import { useActionState, useState } from "react";
import { createMission, type ActionState } from "./actions";
import { MISSION_CATEGORIES } from "@/lib/categories";
import LocationPicker from "@/components/LocationPicker";
import type { MissionIdea } from "@/lib/mission-ideas";
import { ideaInstructionsText } from "@/lib/mission-ideas";

export default function CreateMissionForm({ template }: { template?: MissionIdea }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createMission, {});
  const [needsLocation, setNeedsLocation] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  return (
    <form
      key={template?.slug ?? "vide"}
      action={formAction}
      className="flex flex-col gap-3 border border-border-soft bg-white p-5"
    >
      {template && (
        <p className="bg-brand-gold/10 px-3 py-2 text-xs font-semibold text-[#2b2f38]">
          Modèle « {template.title} » chargé : adaptez les textes et le prix avant de publier.
        </p>
      )}
      <input type="hidden" name="kind" value={template?.kind ?? "EN_LIGNE"} />
      <input type="hidden" name="estimatedMinutes" value={template?.minutes ?? ""} />
      <input
        name="title"
        defaultValue={template?.title}
        placeholder="Titre de la mission"
        required
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <select
        name="category"
        required
        defaultValue={template?.category ?? ""}
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
        name="description"
        defaultValue={template?.summary}
        placeholder="Résumé de la mission (une ou deux phrases, affiché sur la carte)"
        rows={2}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />
      <textarea
        name="instructions"
        defaultValue={template ? ideaInstructionsText(template) : undefined}
        placeholder="Instructions précises pour l'internaute, une par ligne"
        required
        rows={template ? 5 : 3}
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <input
        name="proofRequired"
        defaultValue={template?.proof}
        placeholder="Preuve demandée (ex : capture d'écran, photo, lien)"
        className="border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <div className="flex gap-3">
        <input
          name="reward"
          type="number"
          step="1"
          min="1"
          defaultValue={template?.suggestedReward}
          placeholder="Rémunération par internaute (FCFA)"
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
          defaultValue={template?.deadlineHours ?? 24}
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
