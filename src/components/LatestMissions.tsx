import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { getCategory } from "@/lib/categories";

export default async function LatestMissions() {
  const missions = await prisma.mission.findMany({
    where: { status: { not: "BROUILLON" } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <section className="bg-brand-sand px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">[ TOUTES LES MISSIONS ]</p>
        <h2 className="mt-6 text-2xl font-bold text-[#2b2f38] md:text-3xl">
          DERNIÈRES MISSIONS PUBLIÉES
        </h2>

        {missions.length === 0 ? (
          <p className="mt-12 text-sm text-[#7c8797]">Aucune mission publiée pour le moment.</p>
        ) : (
          <div className="mt-12 grid gap-3 bg-white p-4 shadow-sm sm:grid-cols-2 sm:gap-x-8">
            {missions.map((mission) => {
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
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                    {formatMoney(mission.rewardCents)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

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
