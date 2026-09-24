import type { Metadata } from "next";
import Link from "next/link";
import { MISSION_FAMILIES } from "@/lib/mission-families";
import { MISSION_IDEAS, ideasOfFamily } from "@/lib/mission-ideas";
import { formatMoney } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Types de missions | PubAFric",
  description:
    "Les 9 familles de micro-missions proposées sur PubAFric : saisie, sondages, réseaux sociaux, visites, créativité, buzz, photos et vidéos, comptes-rendus et tests.",
};

export default function TypesDeMissionsPage() {
  return (
    <main className="bg-muted-bg px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold tracking-widest text-brand-red">
          [ TYPES DE MISSIONS PROPOSÉES ]
        </p>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
          9 FAMILLES, {MISSION_IDEAS.length} MODÈLES DE MISSIONS
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#7c8797]">
          Que vous soyez une entreprise à la recherche d&apos;un coup de main ou un internaute qui
          veut arrondir ses fins de mois, voici tout ce qui peut se faire sur PubAFric. Cliquez sur
          un modèle pour voir le cahier des charges détaillé.
        </p>

        <nav aria-label="Familles" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MISSION_FAMILIES.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className="flex flex-col items-center gap-2 border border-border-soft bg-white px-4 py-6 text-center shadow-sm transition-colors hover:border-brand-blue"
            >
              <f.icon size={34} className="text-brand-blue" strokeWidth={1.5} />
              <span className="text-sm font-bold text-[#2b2f38]">{f.short}</span>
              <span className="text-xs text-[#9aa2b1]">{ideasOfFamily(f.id).length} modèles</span>
            </a>
          ))}
        </nav>

        <div className="mt-14 flex flex-col gap-12">
          {MISSION_FAMILIES.map((f) => (
            <section key={f.id} id={f.id} className="scroll-mt-24">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                  <f.icon size={28} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold uppercase tracking-wide text-brand-red">{f.label}</h2>
                  <p className="mt-1 text-sm text-[#7c8797]">{f.description}</p>
                </div>
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {ideasOfFamily(f.id).map((idea) => (
                  <li key={idea.slug}>
                    <Link
                      href={`/exemples-de-missions/${idea.slug}`}
                      className="flex items-center justify-between gap-3 border border-border-soft bg-white px-4 py-3 text-sm text-[#2b2f38] transition-colors hover:border-brand-blue"
                    >
                      <span className="font-semibold">{idea.title}</span>
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs font-bold text-brand-teal">
                        dès {formatMoney(idea.suggestedReward)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link
            href="/entreprises"
            className="bg-brand-red px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90"
          >
            JE SUIS UNE ENTREPRISE
          </Link>
          <Link
            href="/internautes"
            className="bg-brand-blue px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark"
          >
            JE SUIS INTERNAUTE
          </Link>
        </div>
      </div>
    </main>
  );
}
