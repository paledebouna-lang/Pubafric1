import type { Metadata } from "next";
import Link from "next/link";
import MissionCover from "@/components/MissionCover";
import { MISSION_IDEAS } from "@/lib/mission-ideas";
import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Exemples de missions | PubAFric",
  description:
    "Des idées de micro-missions pour les entreprises et les internautes : avis, sondages, vidéos, terrain, réseaux sociaux…",
};

export default function ExemplesPage() {
  return (
    <main className="bg-muted-bg px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold tracking-widest text-brand-red">
          [ EXEMPLES DE MISSIONS ]
        </p>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
          {MISSION_IDEAS.length} IDÉES DE MISSIONS À CONFIER OU À RÉALISER
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#7c8797]">
          Entreprise : reprenez un modèle en un clic et adaptez-le. Internaute : découvrez le
          type de tâches que vous pouvez trouver et gagner de l&apos;argent avec.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MISSION_IDEAS.map((idea) => {
            const category = getCategory(idea.category);
            return (
              <Link
                key={idea.slug}
                href={`/exemples-de-missions/${idea.slug}`}
                className="group flex flex-col overflow-hidden border border-border-soft bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  <MissionCover
                    variant={idea.cover}
                    label={idea.title}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#2b2f38]">
                    <category.icon size={12} className="text-brand-blue" />
                    {idea.kind === "TERRAIN" ? "Terrain" : "En ligne"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-[#2b2f38]">
                    {idea.title}
                  </h2>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[#7c8797]">{idea.summary}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                      dès {formatMoney(idea.suggestedReward)}
                    </span>
                    <span className="text-xs text-[#9aa2b1]">≈ {idea.minutes} min</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
