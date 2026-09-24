import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { expireOverdueClaims } from "@/lib/missions";
import Link from "next/link";
import { formatMoney } from "@/lib/currency";
import { MAX_CONCURRENT_CLAIMS } from "@/lib/rules";
import { INTERNAUTE_FEE_RATE } from "@/lib/payments";
import { MISSION_CATEGORIES, getCategory } from "@/lib/categories";
import { parseMediaJson } from "@/lib/upload";
import MediaGallery from "@/components/MediaGallery";
import CountdownTimer from "@/components/CountdownTimer";
import MissionCover from "@/components/MissionCover";
import ClaimButton from "./ClaimButton";
import RetractButton from "./RetractButton";
import SubmitReportForm from "./SubmitReportForm";
import DisputeForm from "./DisputeForm";

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

const SOCIAL_PROOF_CATEGORIES = [
  "RESEAU_SOCIAL",
  "DEFI_CHALLENGE",
  "CONTENU_CREATIF",
  "MUSIQUE_STREAM",
  "VIDEO",
];

const CLAIM_STATUS_LABEL: Record<string, string> = {
  EN_COURS: "En cours",
  SOUMISE: "Compte-rendu envoyé, en attente de validation",
  VALIDEE: "Validée, créditée",
  REJETEE: "Rejetée",
  EXPIREE: "Expirée",
};

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role === "ENTREPRISE") redirect("/entreprise/missions");
  if (session.user.role === "ADMIN") redirect("/admin");

  const { category: categoryFilter } = await searchParams;
  const userId = session.user.id;
  await expireOverdueClaims(userId);

  const [candidateMissions, myClaims] = await Promise.all([
    prisma.mission.findMany({
      where: { status: "OUVERTE", ...(categoryFilter ? { category: categoryFilter } : {}) },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true } }, claims: true },
    }),
    prisma.missionClaim.findMany({
      where: { userId },
      orderBy: { claimedAt: "desc" },
      include: { mission: true, dispute: true },
    }),
  ]);

  const openMissions = candidateMissions.filter((m) => {
    const occupied = m.claims.filter((c) => OCCUPYING_STATUSES.includes(c.status)).length;
    const alreadyClaimed = m.claims.some((c) => c.userId === userId);
    return occupied < m.slotsTotal && !alreadyClaimed;
  });

  const activeCount = myClaims.filter((c) => ["EN_COURS", "SOUMISE"].includes(c.status)).length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-extrabold text-[#2b2f38]">Missions disponibles</h1>
      <p className="mt-1 text-sm text-[#7c8797]">
        {activeCount}/{MAX_CONCURRENT_CLAIMS} missions actives — bienvenue {session.user.name}. Le
        montant affiché est brut ; {(INTERNAUTE_FEE_RATE * 100).toFixed(0)}% de frais PubAFric
        sont retenus au crédit sur votre portefeuille.
      </p>

      <section className="mt-8">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">MES MISSIONS EN COURS</h2>
        {myClaims.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Vous n&apos;avez encore pris aucune mission.</p>
        )}
        <div className="mt-4 flex flex-col gap-4">
          {myClaims.map((claim) => {
            const category = getCategory(claim.mission.category);
            return (
              <div key={claim.id} className="border border-border-soft bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <category.icon size={20} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-semibold text-[#2b2f38]">{claim.mission.title}</p>
                      <p className="mt-1 text-xs text-[#9aa2b1]">
                        {claim.status === "EN_COURS" ? (
                          <>
                            En cours —{" "}
                            <CountdownTimer expiresAt={claim.expiresAt.toISOString()} />
                          </>
                        ) : (
                          CLAIM_STATUS_LABEL[claim.status]
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                    {formatMoney(claim.mission.rewardCents)}
                  </span>
                </div>
                {claim.status === "EN_COURS" &&
                  SOCIAL_PROOF_CATEGORIES.includes(claim.mission.category) &&
                  claim.verificationCode && (
                    <p className="mt-2 rounded bg-brand-gold/10 px-3 py-2 text-xs text-[#2b2f38]">
                      Ajoutez ce code dans votre publication ou story pour prouver que c&apos;est
                      bien vous :{" "}
                      <span className="font-mono font-bold text-brand-gold">
                        {claim.verificationCode}
                      </span>
                    </p>
                  )}
                {claim.status === "EN_COURS" &&
                  (claim.mission.execution === "PREUVE" ? (
                    <>
                      <Link
                        href={`/mission/${claim.mission.id}`}
                        className="mt-2 inline-block text-xs font-semibold text-brand-blue underline"
                      >
                        Ouvrir la fiche complète (ressources, détails)
                      </Link>
                      <SubmitReportForm claimId={claim.id} />
                    </>
                  ) : (
                    <Link
                      href={`/missions/executer/${claim.id}`}
                      className="mt-3 inline-block bg-brand-red px-5 py-3 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90"
                    >
                      {claim.mission.execution === "QUIZ"
                        ? claim.mission.videoUrl
                          ? "REGARDER ET RÉPONDRE AU QUIZ"
                          : "RÉPONDRE AU QUIZ"
                        : "RÉPONDRE AU QUESTIONNAIRE"}{" "}
                      →
                    </Link>
                  ))}
                {claim.status === "EN_COURS" && <RetractButton claimId={claim.id} />}
                {claim.status === "REJETEE" &&
                  (claim.dispute ? (
                    <p className="mt-2 text-xs font-semibold text-brand-gold">
                      Contestation envoyée, en attente d&apos;un administrateur.
                    </p>
                  ) : (
                    <DisputeForm claimId={claim.id} />
                  ))}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">NOUVELLES MISSIONS</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/missions"
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              !categoryFilter
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-border-soft text-[#7c8797] hover:border-brand-blue"
            }`}
          >
            Toutes
          </Link>
          {MISSION_CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/missions?category=${c.value}`}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                categoryFilter === c.value
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-border-soft text-[#7c8797] hover:border-brand-blue"
              }`}
            >
              <c.icon size={12} /> {c.label}
            </Link>
          ))}
        </div>

        {openMissions.length === 0 && (
          <p className="mt-4 text-sm text-[#7c8797]">Aucune mission disponible pour le moment.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {openMissions.map((mission) => {
            const category = getCategory(mission.category);
            const occupied = mission.claims.filter((c) =>
              OCCUPYING_STATUSES.includes(c.status)
            ).length;
            const media = parseMediaJson(mission.mediaJson);
            return (
              <div
                key={mission.id}
                className="flex items-center justify-between gap-4 border border-border-soft bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <MissionCover
                    variant={mission.category}
                    label={category.label}
                    className="hidden h-20 w-32 shrink-0 rounded sm:block"
                  />
                  <div>
                    <Link href={`/mission/${mission.id}`} className="text-sm font-semibold text-[#2b2f38] hover:text-brand-blue hover:underline">
                      {mission.title}
                    </Link>
                    {mission.execution !== "PREUVE" && (
                      <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold text-brand-red">
                        À FAIRE SUR PUBAFRIC
                      </span>
                    )}
                    {mission.description && (
                      <p className="mt-1 max-w-lg text-xs text-[#2b2f38]">{mission.description}</p>
                    )}
                    <p className="mt-1 max-w-lg whitespace-pre-line text-xs text-[#7c8797]">
                      {mission.instructions}
                    </p>
                    {mission.proofRequired && (
                      <p className="mt-1 max-w-lg text-xs text-[#7c8797]">
                        <span className="font-semibold">Preuve demandée :</span>{" "}
                        {mission.proofRequired}
                      </p>
                    )}
                    {(mission.estimatedMinutes || mission.locationLabel) && (
                      <p className="mt-1 max-w-lg text-xs text-[#7c8797]">
                        {mission.estimatedMinutes ? `≈ ${mission.estimatedMinutes} min` : ""}
                        {mission.estimatedMinutes && mission.locationLabel ? " · " : ""}
                        {mission.kind === "TERRAIN"
                          ? `Sur le terrain${mission.locationLabel ? ` — ${mission.locationLabel}` : ""}`
                          : (mission.locationLabel ?? "En ligne")}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[#9aa2b1]">
                      Proposée par {mission.owner.name} · {occupied}/{mission.slotsTotal} place
                      {mission.slotsTotal > 1 ? "s" : ""} · délai {mission.deadlineHours}h
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
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                    {formatMoney(mission.rewardCents)}
                  </span>
                  <ClaimButton missionId={mission.id} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
