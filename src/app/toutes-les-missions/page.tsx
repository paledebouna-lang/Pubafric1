import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { getCategory } from "@/lib/categories";

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

export default async function ToutesLesMissionsPage() {
  const missions = await prisma.mission.findMany({
    where: { status: { not: "BROUILLON" } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { owner: { select: { name: true } }, claims: true },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-center text-sm font-bold tracking-widest text-brand-red">
        [ TOUTES LES MISSIONS ]
      </p>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
        MISSIONS PUBLIÉES SUR PUBAFRIC
      </h1>

      {missions.length === 0 && (
        <p className="mt-10 text-center text-sm text-[#7c8797]">
          Aucune mission publiée pour le moment.
        </p>
      )}

      <div className="mt-12 flex flex-col gap-3">
        {missions.map((mission) => {
          const category = getCategory(mission.category);
          const occupied = mission.claims.filter((c) =>
            OCCUPYING_STATUSES.includes(c.status)
          ).length;
          const full = occupied >= mission.slotsTotal;
          return (
            <div
              key={mission.id}
              className="flex items-center justify-between gap-4 border border-border-soft bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <category.icon size={20} className="mt-0.5 shrink-0 text-brand-blue" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-[#2b2f38]">{mission.title}</p>
                  <p className="mt-1 text-xs text-[#9aa2b1]">
                    {mission.createdAt.toLocaleDateString("fr-FR")} · Proposée par{" "}
                    {mission.owner.name} · {occupied}/{mission.slotsTotal} place
                    {mission.slotsTotal > 1 ? "s" : ""}
                    {mission.lat && mission.lng && (
                      <>
                        {" · "}
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${mission.lat}&mlon=${mission.lng}#map=15/${mission.lat}/${mission.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-blue underline"
                        >
                          Voir le lieu
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                  {formatMoney(mission.rewardCents)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    mission.status === "ARCHIVEE"
                      ? "bg-[#e7e9ee] text-[#7c8797]"
                      : full
                        ? "bg-[#e7e9ee] text-[#7c8797]"
                        : "bg-brand-teal/10 text-brand-teal"
                  }`}
                >
                  {mission.status === "ARCHIVEE"
                    ? "Archivée"
                    : full
                      ? "Complet"
                      : "Disponible"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
