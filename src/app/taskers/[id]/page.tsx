import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCategory } from "@/lib/categories";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function TaskerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tasker = await prisma.user.findUnique({
    where: { id, role: "INTERNAUTE" },
    include: {
      claims: {
        where: { status: "VALIDEE" },
        orderBy: { decidedAt: "desc" },
        include: { mission: true },
      },
    },
  });

  if (!tasker) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/taskers" className="text-xs font-semibold text-brand-blue">
        ← Tous les taskers
      </Link>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-blue text-2xl font-bold text-white">
          {initials(tasker.name)}
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-[#2b2f38]">{tasker.name}</h1>
        <p className="mt-1 text-xs text-[#9aa2b1]">
          Internaute depuis{" "}
          {tasker.createdAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </p>
        <p className="mt-3 rounded-full bg-brand-teal/10 px-4 py-1 text-sm font-bold text-brand-teal">
          {tasker.claims.length} mission{tasker.claims.length > 1 ? "s" : ""} validée
          {tasker.claims.length > 1 ? "s" : ""}
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          MISSIONS ACCOMPLIES
        </h2>
        {tasker.claims.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune mission validée pour le moment.</p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {tasker.claims.map((claim) => {
            const category = getCategory(claim.mission.category);
            return (
              <div
                key={claim.id}
                className="flex items-center gap-3 border-b border-border-soft py-2"
              >
                <category.icon size={18} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                <p className="text-sm text-[#2b2f38]">{claim.mission.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
