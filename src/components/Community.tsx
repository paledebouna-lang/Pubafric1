import Link from "next/link";
import { prisma } from "@/lib/prisma";

const FALLBACK_TASKERS = [
  { id: "ella", name: "Ella Thiphany" },
  { id: "makaya", name: "Makaya Guelor" },
  { id: "almada", name: "Almada Helena" },
  { id: "christophel", name: "Christophel Ulrich" },
];

const AVATAR_COLORS = ["bg-brand-coral", "bg-brand-blue", "bg-brand-gold", "bg-brand-teal"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function Community() {
  const taskers = await prisma.user.findMany({
    where: { role: "INTERNAUTE" },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  const display =
    taskers.length > 0 ? taskers : FALLBACK_TASKERS.map((t) => ({ ...t, createdAt: new Date() }));

  return (
    <section id="taskers" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">
          [ LA COMMUNAUTÉ PUBAFRIC ]
        </p>
        <h2 className="mt-6 text-2xl font-bold text-brand-blue md:text-3xl">
          DÉCOUVREZ TOUS NOS TASKERS
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {display.map((tasker, i) => (
            <Link
              key={tasker.id}
              href={taskers.length > 0 ? `/taskers/${tasker.id}` : "/taskers"}
              className="flex flex-col items-center gap-4"
            >
              <div
                className={`flex h-32 w-32 items-center justify-center rounded-full text-2xl font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              >
                {initials(tasker.name)}
              </div>
              <p className="text-sm font-bold tracking-wide text-[#2b2f38]">
                {tasker.name.toUpperCase()}
              </p>
            </Link>
          ))}
        </div>

        <a
          href="/taskers"
          className="mt-14 inline-block bg-brand-blue px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-blue-dark"
        >
          VOIR LES AUTRES TASKERS
        </a>
      </div>
    </section>
  );
}
