import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CountdownTimer from "@/components/CountdownTimer";
import Gauge from "@/components/Gauge";
import MissionResources from "@/components/MissionResources";
import { formatMoney } from "@/lib/currency";
import { internauteNet } from "@/lib/fees";
import {
  DEFAULT_MIN_WATCH_SECONDS,
  MAX_QUIZ_ATTEMPTS,
  parseQuestions,
  parseResources,
  publicQuestions,
  videoSource,
} from "@/lib/mission-content";
import ExecuteMission from "../ExecuteMission";

export default async function ExecuterPage({ params }: { params: Promise<{ claimId: string }> }) {
  const { claimId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "INTERNAUTE") redirect("/missions");

  const claim = await prisma.missionClaim.findUnique({
    where: { id: claimId },
    include: { mission: { include: { owner: { select: { name: true } } } } },
  });
  if (!claim || claim.userId !== session.user.id) notFound();
  const { mission } = claim;
  if (mission.execution !== "QUIZ" && mission.execution !== "SONDAGE") notFound();

  const questions = parseQuestions(mission.questionsJson);
  const video = videoSource(mission.videoUrl);
  const minWatch = video || mission.minWatchSeconds ? (mission.minWatchSeconds ?? DEFAULT_MIN_WATCH_SECONDS) : 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/missions" className="text-xs font-bold text-brand-blue hover:underline">
        ← Mes missions
      </Link>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-red">
        {mission.execution === "QUIZ" ? (video ? "Vidéo + quiz" : "Quiz") : "Questionnaire"} · à réaliser sur PubAfric
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-[#2b2f38]">{mission.title}</h1>
      <p className="mt-2 text-xs text-[#7c8797]">
        Proposée par {mission.owner.name} · vous gagnez {formatMoney(internauteNet(mission.rewardCents))}
        {claim.status === "EN_COURS" && (
          <>
            {" · "}temps restant : <CountdownTimer expiresAt={claim.expiresAt.toISOString()} />
          </>
        )}
      </p>
      {mission.description && <p className="mt-4 text-sm leading-relaxed text-[#4a5262]">{mission.description}</p>}

      <MissionResources resources={parseResources(mission.resourcesJson)} />

      <div className="mt-8">
        {claim.status === "EN_COURS" ? (
          claim.expiresAt < new Date() ? (
            <p className="text-sm font-semibold text-brand-coral">Le délai de cette mission est dépassé.</p>
          ) : (
            <ExecuteMission
              claimId={claim.id}
              execution={mission.execution}
              video={video}
              minWatchSeconds={minWatch}
              questions={publicQuestions(questions)}
              attemptsUsed={claim.attempts}
              maxAttempts={MAX_QUIZ_ATTEMPTS}
              watchStartedAtMs={claim.watchStartedAt?.getTime() ?? null}
              serverNowMs={new Date().getTime()}
            />
          )
        ) : (
          <div className="border border-border-soft bg-white p-6 text-center">
            {mission.execution === "QUIZ" && claim.score !== null && (
              <div className="mb-4 text-left">
                <Gauge percent={claim.status === "VALIDEE" || claim.status === "SOUMISE" ? 100 : claim.score} />
              </div>
            )}
            <p className="text-sm font-bold text-[#2b2f38]">
              {claim.status === "VALIDEE"
                ? "Mission validée : votre gain est crédité."
                : claim.status === "SOUMISE"
                  ? "Réponses envoyées, en attente de validation par l'entreprise."
                  : claim.status === "REJETEE"
                    ? "Réponses refusées par l'entreprise."
                    : "Cette mission est terminée."}
            </p>
            <Link href="/missions" className="mt-4 inline-block bg-brand-blue px-6 py-3 text-sm font-bold text-white">
              VOIR MES MISSIONS
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
