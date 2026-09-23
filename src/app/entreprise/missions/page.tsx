import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { ENTREPRISE_FEE_RATE } from "@/lib/payments";
import { getCategory } from "@/lib/categories";
import { parseMediaJson } from "@/lib/upload";
import MediaGallery from "@/components/MediaGallery";
import ClaimProof from "@/components/ClaimProof";
import SlotsGauge from "@/components/SlotsGauge";
import CountdownTimer from "@/components/CountdownTimer";
import CreateMissionForm from "./CreateMissionForm";
import { getIdea } from "@/lib/mission-ideas";
import DecisionButtons from "./DecisionButtons";

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

export default async function EntrepriseMissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ modele?: string }>;
}) {
  const { modele } = await searchParams;
  const template = modele ? getIdea(modele) : undefined;
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ENTREPRISE") redirect("/missions");

  const [owner, missions] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
    prisma.mission.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        claims: {
          orderBy: { claimedAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                socialInstagram: true,
                socialTiktok: true,
                socialFacebook: true,
                socialTwitter: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const toReview = missions.flatMap((m) =>
    m.claims.filter((c) => c.status === "SOUMISE").map((c) => ({ ...c, mission: m }))
  );
  const inProgress = missions.flatMap((m) =>
    m.claims.filter((c) => c.status === "EN_COURS").map((c) => ({ ...c, mission: m }))
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2b2f38]">Espace entreprise</h1>
          <p className="mt-1 text-sm text-[#7c8797]">
            Bienvenue {session.user.name} — {(ENTREPRISE_FEE_RATE * 100).toFixed(0)}% de frais
            PubAFric s&apos;ajoutent à la récompense promise, débités de votre portefeuille dès
            validation de la mission.
          </p>
        </div>
        <Link
          href="/entreprise/credits"
          className="shrink-0 rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white"
        >
          {formatMoney(owner.walletCents)} de crédits
        </Link>
      </div>

      <section id="creer-mission" className="mt-8 scroll-mt-24">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          PUBLIER UNE NOUVELLE MISSION
        </h2>
        <div className="mt-4">
          <CreateMissionForm template={template} />
          <p className="mt-2 text-xs text-[#7c8797]">
            Besoin d&apos;idées ?{" "}
            <Link href="/exemples-de-missions" className="font-semibold text-brand-blue">
              Parcourir les modèles de missions
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          COMPTES-RENDUS À VALIDER
        </h2>
        {toReview.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Rien à valider pour le moment.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {toReview.map((claim) => {
            const category = getCategory(claim.mission.category);
            const reportMedia = parseMediaJson(claim.reportMediaJson);
            return (
              <div key={claim.id} className="border border-border-soft bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <category.icon size={20} className="mt-0.5 shrink-0 text-brand-blue" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-semibold text-[#2b2f38]">{claim.mission.title}</p>
                      <p className="mt-1 text-xs text-[#9aa2b1]">
                        Par {claim.user.name} ·{" "}
                        {formatMoney(claim.mission.rewardCents)}
                      </p>
                      <p className="mt-2 max-w-md text-sm text-[#2b2f38]">{claim.report}</p>
                      <MediaGallery items={reportMedia} />
                      <ClaimProof
                        category={claim.mission.category}
                        verificationCode={claim.verificationCode}
                        user={claim.user}
                      />
                    </div>
                  </div>
                  <DecisionButtons claimId={claim.id} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          MISSIONS EN COURS D&apos;EXÉCUTION ({inProgress.length})
        </h2>
        {inProgress.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune mission en cours de réalisation.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {inProgress.map((claim) => {
            const category = getCategory(claim.mission.category);
            return (
              <div
                key={claim.id}
                className="flex items-center justify-between gap-4 border border-border-soft bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <category.icon size={20} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">{claim.mission.title}</p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">Par {claim.user.name}</p>
                  </div>
                </div>
                <CountdownTimer expiresAt={claim.expiresAt.toISOString()} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">MES MISSIONS</h2>
        <div className="mt-4 flex flex-col gap-3">
          {missions.map((mission) => {
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
                <div className="flex items-center gap-3">
                  <category.icon size={20} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">{mission.title}</p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">
                      {mission.status === "ARCHIVEE" ? "Archivée" : mission.status === "BROUILLON" ? "Brouillon (non publiée)" : "Ouverte"} · délai{" "}
                      {mission.deadlineHours}h
                    </p>
                    <div className="mt-2">
                      <SlotsGauge occupied={occupied} total={mission.slotsTotal} />
                    </div>
                    <MediaGallery items={media} />
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-bold text-brand-teal">
                  {formatMoney(mission.rewardCents)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
