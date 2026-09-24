import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import MissionCover from "@/components/MissionCover";
import MediaGallery from "@/components/MediaGallery";
import ClaimButton from "@/app/missions/ClaimButton";
import { getCategory } from "@/lib/categories";
import { formatMoney } from "@/lib/currency";
import { internauteNet } from "@/lib/fees";
import { parseMediaJson } from "@/lib/upload";
import MissionResources from "@/components/MissionResources";
import { parseQuestions, parseResources, MAX_QUIZ_ATTEMPTS } from "@/lib/mission-content";

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const mission = await prisma.mission.findUnique({ where: { id: (await params).id } });
  return { title: mission && mission.status !== "BROUILLON" ? `${mission.title} | PubAFric` : "Mission | PubAFric" };
}

export default async function MissionDetailPage({ params }: Params) {
  const { id } = await params;
  const session = await auth();
  const role = session?.user?.role;

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: { owner: { select: { name: true } }, claims: true },
  });
  // Un brouillon n'est visible que de l'administrateur.
  if (!mission || (mission.status === "BROUILLON" && role !== "ADMIN")) notFound();

  const category = getCategory(mission.category);
  const occupied = mission.claims.filter((c) => OCCUPYING_STATUSES.includes(c.status)).length;
  const full = occupied >= mission.slotsTotal;
  const alreadyClaimed = session?.user ? mission.claims.some((c) => c.userId === session.user.id) : false;
  const available = mission.status === "OUVERTE" && !full;
  const media = parseMediaJson(mission.mediaJson);
  const steps = mission.instructions
    .split("\n")
    .map((l) => l.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  return (
    <main className="bg-muted-bg pb-16">
      <div className="relative h-56 overflow-hidden md:h-72">
        <MissionCover variant={mission.category} label={category.label} className="h-full w-full" />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <div className="-mt-8 border border-border-soft bg-white p-6 shadow-md md:p-8">
          <Link href="/toutes-les-missions" className="text-xs font-bold text-brand-blue hover:underline">
            ← Toutes les missions
          </Link>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-red">
            <category.icon size={14} /> {category.label}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">{mission.title}</h1>
          <p className="mt-2 text-xs text-[#9aa2b1]">Proposée par {mission.owner.name}</p>
          {mission.description && (
            <p className="mt-4 text-sm leading-relaxed text-[#4a5262]">{mission.description}</p>
          )}

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Vous gagnez</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-teal">
                {formatMoney(internauteNet(mission.rewardCents))}
              </dd>
              <dd className="text-xs text-[#7c8797]">
                {formatMoney(mission.rewardCents)} brut, frais PubAFric déduits
              </dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Durée et délai</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-blue">
                {mission.estimatedMinutes ? `≈ ${mission.estimatedMinutes} min` : "—"}
              </dd>
              <dd className="text-xs text-[#7c8797]">à rendre sous {mission.deadlineHours} h</dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Places</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-blue">
                {occupied}/{mission.slotsTotal}
              </dd>
              <dd className="text-xs text-[#7c8797]">
                {mission.status === "ARCHIVEE" ? "mission archivée" : full ? "complet" : "disponible"}
              </dd>
            </div>
          </dl>

          <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-brand-red">
            Ce qu&apos;il faut faire
          </h2>
          <ol className="mt-3 flex flex-col gap-3">
            {steps.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-[#4a5262]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>

          {mission.execution !== "PREUVE" && (
            <div className="mt-8 border-l-4 border-brand-red bg-brand-red/5 p-4 text-sm text-[#4a5262]">
              <p className="font-bold text-brand-red">Cette mission se fait directement sur PubAfric</p>
              <p className="mt-1">
                {mission.execution === "QUIZ"
                  ? `Vous regardez le contenu, puis vous répondez à ${parseQuestions(mission.questionsJson).length} questions. Chaque bonne réponse remplit la jauge ; à 100 %, la mission est validée et payée automatiquement. Vous avez ${MAX_QUIZ_ATTEMPTS} essais.`
                  : `Vous répondez à ${parseQuestions(mission.questionsJson).length} questions en ligne, sans rien à envoyer d'autre.${mission.autoValidate ? " Le paiement est automatique dès l'envoi." : " Le paiement suit la validation de l'entreprise."}`}
              </p>
            </div>
          )}

          <MissionResources resources={parseResources(mission.resourcesJson)} />

          {mission.proofRequired && (
            <>
              <h2 className="mt-8 text-sm font-bold uppercase tracking-widest text-brand-red">
                Preuve demandée
              </h2>
              <p className="mt-2 text-sm text-[#4a5262]">{mission.proofRequired}</p>
            </>
          )}

          <p className="mt-6 text-xs text-[#7c8797]">
            {mission.kind === "TERRAIN"
              ? `Mission sur le terrain${mission.locationLabel ? ` — ${mission.locationLabel}` : ""}`
              : (mission.locationLabel ?? "Mission à faire en ligne")}
            {mission.lat && mission.lng && (
              <>
                {" · "}
                <a
                  href={`https://www.openstreetmap.org/?mlat=${mission.lat}&mlon=${mission.lng}#map=15/${mission.lat}/${mission.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue underline"
                >
                  Voir le lieu sur la carte
                </a>
              </>
            )}
          </p>
          <MediaGallery items={media} />

          <div className="mt-8">
            {role === "INTERNAUTE" ? (
              alreadyClaimed ? (
                <Link href="/missions" className="inline-block bg-brand-blue px-6 py-3 text-sm font-bold tracking-wide text-white">
                  VOIR MA MISSION
                </Link>
              ) : available ? (
                <ClaimButton missionId={mission.id} />
              ) : (
                <p className="text-sm font-semibold text-[#7c8797]">Cette mission n&apos;est plus disponible.</p>
              )
            ) : !session?.user ? (
              <div className="flex flex-wrap gap-3">
                <Link href="/connexion" className="bg-brand-blue px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark">
                  SE CONNECTER POUR LA PRENDRE
                </Link>
                <Link href="/inscription" className="bg-brand-teal px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90">
                  CRÉER UN COMPTE
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[#7c8797]">Seuls les comptes internautes peuvent prendre une mission.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
