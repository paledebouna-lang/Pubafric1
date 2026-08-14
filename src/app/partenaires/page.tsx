import { prisma } from "@/lib/prisma";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = ["bg-brand-coral", "bg-brand-blue", "bg-brand-gold", "bg-brand-teal"];

export default async function PartenairesPage() {
  const entreprises = await prisma.user.findMany({
    where: { role: "ENTREPRISE", missionsCreated: { some: {} } },
    include: { _count: { select: { missionsCreated: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-center text-sm font-bold tracking-widest text-brand-red">
        [ ILS NOUS FONT CONFIANCE ]
      </p>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
        NOS ENTREPRISES PARTENAIRES
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[#7c8797]">
        Ces entreprises publient régulièrement des missions rémunérées pour la communauté
        PubAFric.
      </p>

      {entreprises.length === 0 && (
        <p className="mt-10 text-center text-sm text-[#7c8797]">
          Aucune entreprise partenaire pour le moment — soyez la première à publier une mission !
        </p>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {entreprises.map((e, i) => (
          <div key={e.id} className="flex flex-col items-center gap-3 text-center">
            {e.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.logoUrl}
                alt={e.name}
                className="h-28 w-28 rounded-full border border-border-soft object-cover"
              />
            ) : (
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full text-2xl font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              >
                {initials(e.name)}
              </div>
            )}
            <p className="text-sm font-bold tracking-wide text-[#2b2f38]">
              {e.name.toUpperCase()}
            </p>
            <p className="text-xs text-[#9aa2b1]">
              {e._count.missionsCreated} mission{e._count.missionsCreated > 1 ? "s" : ""} publiée
              {e._count.missionsCreated > 1 ? "s" : ""}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
