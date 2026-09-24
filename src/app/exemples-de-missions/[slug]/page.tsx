import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import MissionCover from "@/components/MissionCover";
import { MISSION_IDEAS, getIdea } from "@/lib/mission-ideas";
import { getCategory } from "@/lib/categories";
import { getFamily } from "@/lib/mission-families";
import { formatMoney } from "@/lib/currency";
import { entrepriseCost, internauteNet } from "@/lib/fees";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MISSION_IDEAS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const idea = getIdea((await params).slug);
  return { title: idea ? `${idea.title} | PubAFric` : "Exemple de mission | PubAFric" };
}

export default async function IdeaPage({ params }: Params) {
  const idea = getIdea((await params).slug);
  if (!idea) notFound();

  const session = await auth();
  const role = session?.user?.role;
  const category = getCategory(idea.category);
  const others = [
    ...MISSION_IDEAS.filter((i) => i.slug !== idea.slug && i.family === idea.family),
    ...MISSION_IDEAS.filter((i) => i.slug !== idea.slug && i.family !== idea.family),
  ].slice(0, 3);

  return (
    <main className="bg-muted-bg pb-16">
      <div className="relative h-56 overflow-hidden md:h-72">
        <MissionCover variant={idea.cover} label={idea.title} className="h-full w-full" />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <div className="-mt-8 border border-border-soft bg-white p-6 shadow-md md:p-8">
          <Link href="/exemples-de-missions" className="text-xs font-bold text-brand-blue hover:underline">
            ← Tous les exemples
          </Link>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
            <category.icon size={14} /> {getFamily(idea.family)?.label} ·{" "}
            {idea.kind === "TERRAIN" ? "Mission terrain" : "Mission en ligne"}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">{idea.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#7c8797]">{idea.summary}</p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Récompense conseillée</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-teal">{formatMoney(idea.suggestedReward)}</dd>
              <dd className="text-xs text-[#7c8797]">
                l&apos;internaute reçoit {formatMoney(internauteNet(idea.suggestedReward))}
              </dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Durée estimée</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-blue">≈ {idea.minutes} min</dd>
              <dd className="text-xs text-[#7c8797]">délai : {idea.deadlineHours} h</dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Coût pour l&apos;entreprise</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-blue">
                {formatMoney(entrepriseCost(idea.suggestedReward))}
              </dd>
              <dd className="text-xs text-[#7c8797]">par internaute, frais inclus</dd>
            </div>
          </dl>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-brand-red">
            Comment ça se passe
          </h2>
          <ol className="mt-3 flex flex-col gap-3">
            {idea.instructions.map((line, i) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-[#4a5262]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-brand-red">
            Preuve demandée
          </h2>
          <p className="mt-2 text-sm text-[#4a5262]">{idea.proof}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {role === "ENTREPRISE" ? (
              <Link
                href={`/entreprise/missions?modele=${idea.slug}#creer-mission`}
                className="bg-brand-red px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90"
              >
                PROPOSER CETTE MISSION
              </Link>
            ) : role === "INTERNAUTE" ? (
              <Link
                href={`/missions?category=${idea.category}`}
                className="bg-brand-blue px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark"
              >
                VOIR LES MISSIONS DE CE TYPE
              </Link>
            ) : (
              <>
                <Link
                  href="/inscription"
                  className="bg-brand-red px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90"
                >
                  JE SUIS UNE ENTREPRISE : PROPOSER
                </Link>
                <Link
                  href="/inscription"
                  className="bg-brand-blue px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark"
                >
                  JE SUIS INTERNAUTE : GAGNER
                </Link>
              </>
            )}
          </div>
        </div>

        <h2 className="mt-12 text-lg font-extrabold uppercase tracking-wide text-[#2b2f38]">
          D&apos;autres idées
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/exemples-de-missions/${o.slug}`}
              className="group overflow-hidden border border-border-soft bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[5/3] overflow-hidden">
                <MissionCover variant={o.cover} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
              </div>
              <p className="p-4 text-xs font-bold uppercase tracking-wide text-[#2b2f38]">{o.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
