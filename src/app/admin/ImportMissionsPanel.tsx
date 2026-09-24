"use client";

import { useActionState } from "react";
import { importPubafricMissions, type ImportState } from "./actions";
import { formatMoney } from "@/lib/currency";

export default function ImportMissionsPanel({ accountEmail }: { accountEmail: string }) {
  const [state, formAction, pending] = useActionState<ImportState, FormData>(
    importPubafricMissions,
    {}
  );
  const report = state.report;

  return (
    <div className="border border-border-soft bg-white p-5">
      <p className="text-sm text-[#2b2f38]">
        Les 15 missions du kit PubAfric sont importées en <strong>brouillon</strong> (invisibles
        du public), rattachées au compte entreprise « PubAfric ». Vous les publiez ensuite une par
        une dans la liste « Toutes les missions ». Relancer l&apos;import ne crée pas de doublon.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          name="mode"
          value="preview"
          disabled={pending}
          className="border border-border-soft px-4 py-2 text-xs font-bold tracking-wide text-[#2b2f38] hover:border-brand-blue disabled:opacity-60"
        >
          {pending ? "..." : "APERÇU ET BUDGET (RIEN N'EST ÉCRIT)"}
        </button>
        <button
          type="submit"
          name="mode"
          value="import"
          disabled={pending}
          className="bg-[#2b2f38] px-4 py-2 text-xs font-bold tracking-wide text-white hover:bg-[#1c1f26] disabled:opacity-60"
        >
          IMPORTER EN BROUILLON
        </button>
      </form>

      {state.error && <p className="mt-3 text-sm font-semibold text-brand-coral">{state.error}</p>}

      {report && (
        <div className="mt-5">
          <p className="text-sm font-bold text-[#2b2f38]">
            {report.dryRun ? "Aperçu (rien n'a été écrit)" : "Import terminé"} — {report.created}{" "}
            à créer, {report.updated} à mettre à jour
            {report.removed > 0 &&
              `, ${report.removed} doublon${report.removed > 1 ? "s" : ""} ${report.dryRun ? "à supprimer" : "supprimé" + (report.removed > 1 ? "s" : "")} (brouillons sans participation)`}
          </p>
          <p className="mt-1 text-sm font-bold text-brand-red">
            Budget total à créditer sur le portefeuille « PubAfric » :{" "}
            {formatMoney(report.budgetTotalFcfa)}
          </p>
          <p className="mt-1 text-xs text-[#7c8797]">
            Compte {accountEmail} :{" "}
            {report.accountCreated
              ? "créé à l'instant."
              : report.accountExists
                ? "déjà existant."
                : "sera créé à l'import."}
          </p>
          {report.accountPassword && (
            <p className="mt-2 bg-brand-gold/10 px-3 py-2 text-xs text-[#2b2f38]">
              Mot de passe généré (affiché une seule fois, notez-le maintenant) :{" "}
              <span className="font-mono font-bold">{report.accountPassword}</span>
            </p>
          )}
          <div className="mt-3 max-h-72 overflow-auto border border-border-soft">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="bg-muted-bg text-[#7c8797]">
                <tr>
                  <th className="px-3 py-2">Mission</th>
                  <th className="px-3 py-2">Action</th>
                  <th className="px-3 py-2 text-right">Récompense</th>
                  <th className="px-3 py-2 text-right">Places</th>
                  <th className="px-3 py-2 text-right">Budget</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((r) => (
                  <tr key={r.slug} className="border-t border-border-soft">
                    <td className="px-3 py-2">
                      {r.title}
                      {r.warnings.map((w) => (
                        <span key={w} className="block text-brand-coral">
                          ⚠ {w}
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-2">{r.action}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {formatMoney(r.rewardFcfa)}
                    </td>
                    <td className="px-3 py-2 text-right">{r.places}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {formatMoney(r.budgetFcfa)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
