import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import { getCategory } from "@/lib/categories";
import BanButton from "./BanButton";
import DeleteUserButton from "./DeleteUserButton";
import DisputeDecisionButtons from "./DisputeDecisionButtons";
import ArchiveButton from "./ArchiveButton";
import PublishButton from "./PublishButton";
import ImportMissionsPanel from "./ImportMissionsPanel";
import { PUBAFRIC_ACCOUNT_EMAIL } from "@/lib/seed-missions";
import { missionTodos } from "@/lib/mission-todos";
import AdminMissionForm from "./AdminMissionForm";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementToggle from "./AnnouncementToggle";
import AdminDecisionButtons from "./AdminDecisionButtons";
import TransactionDecisionButtons from "./TransactionDecisionButtons";
import BanAppealDecisionButtons from "./BanAppealDecisionButtons";
import ClaimProof from "@/components/ClaimProof";
import {
  TRANSACTION_TYPE_LABEL,
  TRANSACTION_STATUS_LABEL,
  TRANSACTION_STATUS_COLOR,
} from "@/lib/transactions";

const MISSION_STATUS_LABEL: Record<string, string> = {
  BROUILLON: "Brouillon (non publiée)",
  OUVERTE: "Ouverte",
  ARCHIVEE: "Archivée",
};

const ROLE_LABEL: Record<string, string> = {
  INTERNAUTE: "Internaute",
  ENTREPRISE: "Entreprise",
  ADMIN: "Admin",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  if (session.user.role !== "ADMIN") redirect("/missions");

  const [
    users,
    disputes,
    missions,
    announcements,
    adminClaimsToReview,
    transactions,
    pendingTransactions,
    banAppeals,
  ] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.dispute.findMany({
        where: { status: "OUVERT" },
        orderBy: { createdAt: "asc" },
        include: {
          claim: {
            include: {
              mission: { include: { owner: { select: { name: true } } } },
              user: { select: { name: true } },
            },
          },
        },
      }),
      prisma.mission.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { owner: { select: { name: true, role: true } } },
      }),
      prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.missionClaim.findMany({
        where: { status: "SOUMISE", mission: { ownerId: session.user.id } },
        include: {
          mission: true,
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
      }),
      prisma.creditTransaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { user: { select: { name: true, role: true, currency: true } } },
      }),
      prisma.creditTransaction.findMany({
        where: { status: "EN_ATTENTE" },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, role: true, currency: true } } },
      }),
      prisma.banAppeal.findMany({
        where: { status: "OUVERT" },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, role: true } } },
      }),
    ]);

  const internautes = users.filter((u) => u.role === "INTERNAUTE");
  const entreprises = users.filter((u) => u.role === "ENTREPRISE");
  const filleulCounts = new Map<string, number>();
  for (const u of users) {
    if (u.referredById) {
      filleulCounts.set(u.referredById, (filleulCounts.get(u.referredById) ?? 0) + 1);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-extrabold text-[#2b2f38]">Administration PubAFric</h1>
      <p className="mt-1 text-sm text-[#7c8797]">Bienvenue {session.user.name}.</p>

      <section className="mt-8 grid grid-cols-3 gap-3">
        <div className="border border-border-soft bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[#2b2f38]">{users.length}</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-[#7c8797]">
            UTILISATEURS AU TOTAL
          </p>
        </div>
        <div className="border border-border-soft bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-brand-blue">{internautes.length}</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-[#7c8797]">INTERNAUTES</p>
        </div>
        <div className="border border-border-soft bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-brand-red">{entreprises.length}</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-[#7c8797]">ENTREPRISES</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          DEMANDES DE DÉPÔT ET RETRAIT ({pendingTransactions.length})
        </h2>
        {pendingTransactions.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune demande en attente.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {pendingTransactions.map((t) => (
            <div key={t.id} className="border border-border-soft bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#2b2f38]">
                    {TRANSACTION_TYPE_LABEL[t.type] ?? t.type}
                    <span className="ml-2 rounded-full bg-muted-bg px-2 py-0.5 text-xs font-normal text-[#7c8797]">
                      {t.user.name} · {ROLE_LABEL[t.user.role] ?? t.user.role}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[#9aa2b1]">{t.note}</p>
                  <p
                    className={`mt-1 text-sm font-bold ${
                      t.amountCents >= 0 ? "text-brand-teal" : "text-brand-coral"
                    }`}
                  >
                    {t.amountCents >= 0 ? "+" : ""}
                    {formatMoney(t.amountCents)}
                  </p>
                </div>
                <TransactionDecisionButtons transactionId={t.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          ACTIVITÉ FINANCIÈRE ({transactions.length})
        </h2>
        {transactions.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune transaction pour le moment.</p>
        )}
        <div className="mt-4 max-h-96 overflow-y-auto border border-border-soft bg-white">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 border-b border-border-soft px-4 py-2 text-sm last:border-0"
            >
              <div>
                <p className="font-semibold text-[#2b2f38]">
                  {TRANSACTION_TYPE_LABEL[t.type] ?? t.type}
                  <span className="ml-2 rounded-full bg-muted-bg px-2 py-0.5 text-xs font-normal text-[#7c8797]">
                    {t.user.name} · {ROLE_LABEL[t.user.role] ?? t.user.role}
                  </span>
                  {t.status !== "APPROUVEE" && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${TRANSACTION_STATUS_COLOR[t.status]}`}
                    >
                      {TRANSACTION_STATUS_LABEL[t.status]}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#9aa2b1]">
                  {t.note} · {t.createdAt.toLocaleString("fr-FR")}
                </p>
              </div>
              <span
                className={`shrink-0 font-bold ${
                  t.amountCents >= 0 ? "text-brand-teal" : "text-brand-coral"
                }`}
              >
                {t.amountCents >= 0 ? "+" : ""}
                {formatMoney(t.amountCents)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          LITIGES À TRANCHER ({disputes.length})
        </h2>
        {disputes.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucun litige en attente.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {disputes.map((d) => (
            <div key={d.id} className="border border-border-soft bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#2b2f38]">{d.claim.mission.title}</p>
                  <p className="mt-1 text-xs text-[#9aa2b1]">
                    {d.claim.user.name} vs {d.claim.mission.owner.name} ·{" "}
                    {formatMoney(d.claim.mission.rewardCents)}
                  </p>
                  <p className="mt-2 text-sm text-[#2b2f38]">
                    <span className="font-semibold">Motif : </span>
                    {d.reason}
                  </p>
                  {d.claim.report && (
                    <p className="mt-1 text-xs text-[#7c8797]">
                      Compte-rendu : {d.claim.report}
                    </p>
                  )}
                </div>
                <DisputeDecisionButtons disputeId={d.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          DEMANDES DE RÉVISION DE BANNISSEMENT ({banAppeals.length})
        </h2>
        {banAppeals.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Aucune demande en attente.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {banAppeals.map((a) => (
            <div key={a.id} className="border border-border-soft bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#2b2f38]">
                    {a.user.name}{" "}
                    <span className="ml-2 rounded-full bg-muted-bg px-2 py-0.5 text-xs font-normal text-[#7c8797]">
                      {ROLE_LABEL[a.user.role] ?? a.user.role}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-[#2b2f38]">
                    <span className="font-semibold">Motif : </span>
                    {a.reason}
                  </p>
                </div>
                <BanAppealDecisionButtons appealId={a.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          INTERNAUTES ({internautes.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {internautes.map((u) => {
            const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ");
            return (
              <div key={u.id} className="border border-border-soft bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">
                      {u.name}
                      {u.isBanned && (
                        <span className="ml-2 rounded-full bg-brand-coral/10 px-2 py-0.5 text-xs font-semibold text-brand-coral">
                          Banni
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">{u.email ?? u.phone}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#7c8797] sm:grid-cols-3">
                      {fullName && <p>Nom complet : {fullName}</p>}
                      {u.age && <p>Âge : {u.age} ans</p>}
                      {u.location && <p>Lieu : {u.location}</p>}
                      {u.profession && <p>Profession : {u.profession}</p>}
                      {u.whatsapp && <p>WhatsApp : {u.whatsapp}</p>}
                      <p className="font-semibold text-brand-teal">
                        Solde : {formatMoney(u.walletCents)}
                      </p>
                      {u.referralCode && (
                        <p>
                          Code parrainage :{" "}
                          <span className="font-mono text-brand-gold">{u.referralCode}</span>
                        </p>
                      )}
                      <p>Filleuls : {filleulCounts.get(u.id) ?? 0}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-col items-end gap-2">
                  <BanButton userId={u.id} isBanned={u.isBanned} />
                  <DeleteUserButton userId={u.id} name={u.name} />
                </div>
                    <DeleteUserButton userId={u.id} name={u.name} />
                  </div>
                </div>
              </div>
            );
          })}
          {internautes.length === 0 && (
            <p className="text-sm text-[#7c8797]">Aucun internaute inscrit.</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          ENTREPRISES ({entreprises.length})
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {entreprises.map((u) => (
            <div key={u.id} className="border border-border-soft bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {u.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.logoUrl}
                      alt={u.name}
                      className="h-10 w-10 shrink-0 rounded-full border border-border-soft object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-border-soft text-[9px] text-[#9aa2b1]">
                      Logo
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">
                      {u.name}
                      {u.isBanned && (
                        <span className="ml-2 rounded-full bg-brand-coral/10 px-2 py-0.5 text-xs font-semibold text-brand-coral">
                          Banni
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#9aa2b1]">{u.email ?? u.phone}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#7c8797] sm:grid-cols-3">
                      {u.location && <p>Lieu : {u.location}</p>}
                      {u.whatsapp && <p>WhatsApp : {u.whatsapp}</p>}
                      <p className="font-semibold text-brand-teal">
                        Solde : {formatMoney(u.walletCents)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <BanButton userId={u.id} isBanned={u.isBanned} />
                  <DeleteUserButton userId={u.id} name={u.name} />
                </div>
              </div>
            </div>
          ))}
          {entreprises.length === 0 && (
            <p className="text-sm text-[#7c8797]">Aucune entreprise inscrite.</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          IMPORTER LES MISSIONS DU KIT PUBAFRIC
        </h2>
        <div className="mt-4">
          <ImportMissionsPanel accountEmail={PUBAFRIC_ACCOUNT_EMAIL} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          PUBLIER UNE MISSION PUBAFRIC
        </h2>
        <div className="mt-4">
          <AdminMissionForm />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          COMPTES-RENDUS À VALIDER (MISSIONS PUBAFRIC)
        </h2>
        {adminClaimsToReview.length === 0 && (
          <p className="mt-3 text-sm text-[#7c8797]">Rien à valider pour le moment.</p>
        )}
        <div className="mt-4 flex flex-col gap-3">
          {adminClaimsToReview.map((claim) => (
            <div key={claim.id} className="border border-border-soft bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#2b2f38]">{claim.mission.title}</p>
                  <p className="mt-1 text-xs text-[#9aa2b1]">
                    Par {claim.user.name} ·{" "}
                    {formatMoney(claim.mission.rewardCents)}
                  </p>
                  <p className="mt-2 max-w-md whitespace-pre-line text-sm text-[#2b2f38]">{claim.report}</p>
                  <ClaimProof
                    category={claim.mission.category}
                    verificationCode={claim.verificationCode}
                    user={claim.user}
                  />
                </div>
                <AdminDecisionButtons claimId={claim.id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">TOUTES LES MISSIONS</h2>
        <div className="mt-4 flex flex-col gap-2">
          {missions.map((m) => {
            const category = getCategory(m.category);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 border-b border-border-soft py-2"
              >
                <div className="flex items-center gap-3">
                  <category.icon size={18} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                  <div>
                    <a href={`/mission/${m.id}`} className="text-sm font-semibold text-[#2b2f38] hover:text-brand-blue hover:underline">
                      {m.title}
                    </a>
                    <p className="text-xs text-[#9aa2b1]">
                      {m.owner.name} · {formatMoney(m.rewardCents)} ·{" "}
                      {MISSION_STATUS_LABEL[m.status] ?? m.status}
                      {m.execution !== "PREUVE" && ` · ${m.execution === "QUIZ" ? "Vidéo + quiz" : "Questionnaire"} sur la plateforme`}
                    </p>
                    {m.status === "BROUILLON" &&
                      missionTodos(m).map((t) => (
                        <p key={t} className="text-xs font-semibold text-brand-coral">
                          ⚠ À compléter avant publication : {t}
                        </p>
                      ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.status === "BROUILLON" && <PublishButton missionId={m.id} />}
                  {m.status !== "ARCHIVEE" && <ArchiveButton missionId={m.id} />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-bold tracking-widest text-brand-red">
          ANNONCES & OFFRES PROMOTIONNELLES
        </h2>
        <div className="mt-4">
          <AnnouncementForm />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 border-b border-border-soft py-2"
            >
              <div>
                <p className="text-sm font-semibold text-[#2b2f38]">
                  {a.type === "PROMO" ? "🎁 " : "📣 "}
                  {a.title}
                  {!a.active && (
                    <span className="ml-2 rounded-full bg-muted-bg px-2 py-0.5 text-xs font-normal text-[#7c8797]">
                      Inactive
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#9aa2b1]">{a.body}</p>
              </div>
              <AnnouncementToggle id={a.id} active={a.active} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
