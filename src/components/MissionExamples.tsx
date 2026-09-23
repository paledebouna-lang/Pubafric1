import Link from "next/link";
import MissionCover from "./MissionCover";
import { MISSION_IDEAS, getIdea } from "@/lib/mission-ideas";
import { formatMoney } from "@/lib/currency";

// Trois exemples mis en avant sur l'accueil ; tous les autres sont sur /exemples-de-missions.
const FEATURED = ["porter-vetement-publicitaire", "trouver-idee-de-marque-nom", "faire-video-endroit"];

export default function MissionExamples() {
  const ideas = FEATURED.map(getIdea).filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <section className="bg-brand-blue px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold tracking-widest">[ EXEMPLES DE MISSIONS ]</p>
        <h2 className="mt-6 text-2xl font-bold md:text-3xl">
          ET VOUS, QUELLES MISSIONS ALLEZ-VOUS NOUS CONFIER ?
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {ideas.map((idea) => (
            <Link
              key={idea.slug}
              href={`/exemples-de-missions/${idea.slug}`}
              className="group flex flex-col overflow-hidden bg-white text-left text-[#2b2f38] shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[5/3] overflow-hidden">
                <MissionCover
                  variant={idea.cover}
                  label={idea.title}
                  className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-bold uppercase tracking-wide">{idea.title}</p>
                <p className="mt-2 text-xs text-[#7c8797]">{idea.summary}</p>
                <div className="mt-4 flex items-center justify-between pt-1">
                  <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                    dès {formatMoney(idea.suggestedReward)}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                    Voir le détail →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/exemples-de-missions"
          className="mt-14 inline-block bg-brand-gold px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-gold/90"
        >
          VOIR LES {MISSION_IDEAS.length} EXEMPLES
        </Link>
      </div>
    </section>
  );
}
