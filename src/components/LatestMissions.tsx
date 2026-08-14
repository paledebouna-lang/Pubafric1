import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { getCategory } from "@/lib/categories";

const FALLBACK_MISSIONS = [
  { id: "1", title: "CACS FORMATIONS", createdAt: new Date(), rewardCents: 100, category: "AUTRE", currency: "EUR" },
  { id: "2", title: "Trouver 20 jumeaux célèbres", createdAt: new Date(), rewardCents: 100, category: "TROUVER_LISTE", currency: "EUR" },
  { id: "3", title: "Chercher 10 jeux 3DS sur le site de la Fnac", createdAt: new Date(), rewardCents: 100, category: "RECOMMANDER", currency: "EUR" },
  { id: "4", title: "Chercher 10 coffrets de série tv sur le site de la Fnac", createdAt: new Date(), rewardCents: 100, category: "RECOMMANDER", currency: "EUR" },
];

export default async function LatestMissions() {
  const missions = await prisma.mission.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const display = missions.length > 0 ? missions : FALLBACK_MISSIONS;

  return (
    <section className="bg-brand-sand px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">[ TOUTES LES MISSIONS ]</p>
        <h2 className="mt-6 text-2xl font-bold text-[#2b2f38] md:text-3xl">
          DERNIÈRES MISSIONS PUBLIÉES
        </h2>

        <div className="mt-12 grid gap-3 bg-white p-4 shadow-sm sm:grid-cols-2 sm:gap-x-8">
          {display.map((mission) => {
            const category = getCategory(mission.category);
            return (
              <div
                key={mission.id}
                className="flex items-center justify-between gap-4 border-b border-border-soft px-2 py-3 text-left last:border-0"
              >
                <div className="flex items-start gap-2">
                  <category.icon size={16} className="mt-0.5 shrink-0 text-brand-blue" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">{mission.title}</p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">
                      {mission.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                  {formatMoney(mission.rewardCents, mission.currency)}
                </span>
              </div>
            );
          })}
        </div>

        <a
          href="/toutes-les-missions"
          className="mt-10 inline-block bg-brand-blue px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-blue-dark"
        >
          VOIR TOUTES LES MISSIONS
        </a>
      </div>
    </section>
  );
}
