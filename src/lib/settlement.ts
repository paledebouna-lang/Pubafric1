import { prisma } from "@/lib/prisma";
import { buildMissionPaymentOps, entrepriseCost } from "@/lib/payments";

export type SettleResult = "VALIDEE" | "SOUMISE" | "DEJA_TRAITEE";

// Enregistre l'envoi d'une mission exécutée sur la plateforme (quiz réussi ou sondage rempli).
// Le passage "en cours" -> "soumise" est atomique : un double clic ne peut pas payer deux fois.
// Si la validation automatique est activée ET que le portefeuille de l'entreprise couvre
// récompense + frais, l'internaute est payé tout de suite ; sinon la mission reste "soumise"
// et l'entreprise la validera comme d'habitude — l'internaute n'est jamais pénalisé.
export async function submitClaimOnPlatform(
  claimId: string,
  data: { report: string; answersJson: string; score?: number },
  autoValidate: boolean
): Promise<SettleResult> {
  const moved = await prisma.missionClaim.updateMany({
    where: { id: claimId, status: "EN_COURS" },
    data: {
      status: "SOUMISE",
      submittedAt: new Date(),
      report: data.report,
      answersJson: data.answersJson,
      ...(data.score !== undefined ? { score: data.score } : {}),
    },
  });
  if (moved.count !== 1) return "DEJA_TRAITEE";
  if (!autoValidate) return "SOUMISE";

  const claim = await prisma.missionClaim.findUniqueOrThrow({
    where: { id: claimId },
    include: { mission: true },
  });
  const owner = await prisma.user.findUniqueOrThrow({ where: { id: claim.mission.ownerId } });
  if (owner.walletCents < entrepriseCost(claim.mission.rewardCents)) return "SOUMISE";

  const paymentOps = await buildMissionPaymentOps({
    internauteId: claim.userId,
    entrepriseId: owner.id,
    rewardCents: claim.mission.rewardCents,
    missionTitle: claim.mission.title,
  });
  await prisma.$transaction([
    prisma.missionClaim.update({
      where: { id: claimId },
      data: { status: "VALIDEE", decidedAt: new Date() },
    }),
    ...paymentOps,
  ]);
  return "VALIDEE";
}
