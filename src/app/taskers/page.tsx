import Link from "next/link";
import { prisma } from "@/lib/prisma";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = ["bg-brand-coral", "bg-brand-blue", "bg-brand-gold", "bg-brand-teal"];

export default async function TaskersPage() {
  const taskers = await prisma.user.findMany({
    where: { role: "INTERNAUTE" },
    include: { claims: { where: { status: "VALIDEE" } } },
    orderBy: { createdAt: "asc" },
  });

  const ranked = taskers
    .map((t) => ({ ...t, completed: t.claims.length }))
    .sort((a, b) => b.completed - a.completed);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-center text-sm font-bold tracking-widest text-brand-red">
        [ LA COMMUNAUTÉ PUBAFRIC ]
      </p>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
        DÉCOUVREZ TOUS NOS INTERNAUTES
      </h1>

      {ranked.length === 0 && (
        <p className="mt-10 text-center text-sm text-[#7c8797]">
          Aucun internaute inscrit pour le moment — soyez le premier !
        </p>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {ranked.map((tasker, i) => (
          <Link
            key={tasker.id}
            href={`/taskers/${tasker.id}`}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div
              className={`flex h-32 w-32 items-center justify-center rounded-full text-2xl font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
            >
              {initials(tasker.name)}
            </div>
            <p className="text-sm font-bold tracking-wide text-[#2b2f38]">
              {tasker.name.toUpperCase()}
            </p>
            <p className="text-xs text-[#9aa2b1]">
              {tasker.completed} mission{tasker.completed > 1 ? "s" : ""} validée
              {tasker.completed > 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
