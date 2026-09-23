import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { MISSION_CATEGORIES, getCategory } from "@/lib/categories";
import MissionCover from "@/components/MissionCover";

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

export default async function ToutesLesMissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const activeCategory = MISSION_CATEGORIES.some((c) => c.value === categorie) ? categorie : undefined;

  const missions = await prisma.mission.findMany({
    where: { status: { not: "BROUILLON" }, ...(activeCategory ? { category: activeCategory } : {}) },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { owner: { select: { name: true } }, claims: true },
  });

  return (
    <main className="bg-muted-bg px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-bold tracking-widest text-brand-red">
          [ TOUTES LES MISSIONS ]
        </p>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
          MISSIONS PUBLIÉES SUR PUBAFRIC
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/toutes-les-missions"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              !activeCategory
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-border-soft bg-white text-[#7c8797] hover:border-brand-blue"
            }`}
          >
            Toutes
          </Link>
          {MISSION_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/toutes-les-missions?categorie=${c.value}`}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                activeCategory === c.value
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border-soft bg-white text-[#7c8797] hover:border-brand-blue"
              }`}
            >
              <c.icon size={12} /> {c.label}
            </Link>
          ))}
        </div>

        {missions.length === 0 && (
          <p className="mt-10 text-center text-sm text-[#7c8797]">
            Aucune mission publiée pour le moment.
          </p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => {
            const category = getCategory(mission.category);
            const occupied = mission.claims.filter((c) => OCCUPYING_STATUSES.includes(c.status)).length;
            const full = occupied >= mission.slotsTotal;
            const closed = mission.status === "ARCHIVEE" || full;
            return (
              <Link
                key={mission.id}
                href={`/mission/${mission.id}`}
                className="group flex flex-col overflow-hidden border border-border-soft bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  <MissionCover
                    variant={mission.category}
                    label={category.label}
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-extrabold text-brand-teal shadow">
                    {formatMoney(mission.rewardCents)}
                  </span>
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${
                      closed ? "bg-[#e7e9ee] text-[#7c8797]" : "bg-brand-teal text-white"
                    }`}
                  >
                    {mission.status === "ARCHIVEE" ? "Archivée" : full ? "Complet" : "Disponible"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-brand-red">
                    <category.icon size={12} /> {category.label}
                  </p>
                  <h2 className="mt-2 text-sm font-bold text-[#2b2f38]">{mission.title}</h2>
                  {mission.description && (
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-[#7c8797]">
                      {mission.description}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-[#9aa2b1]">
                    {mission.owner.name} · {occupied}/{mission.slotsTotal} place
                    {mission.slotsTotal > 1 ? "s" : ""}
                    {mission.estimatedMinutes ? ` · ≈ ${mission.estimatedMinutes} min` : ""}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
