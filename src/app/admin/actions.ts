"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { MISSION_CATEGORIES } from "@/lib/categories";
import { buildMissionPaymentOps } from "@/lib/payments";

export type ActionState = { error?: string; success?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

export async function toggleBan(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const userId = formData.get("userId") as string;
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "ADMIN") return { error: "Impossible de bannir un administrateur." };

  const nowUnbanned = target.isBanned;
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { isBanned: !target.isBanned } }),
    ...(nowUnbanned
      ? [
          prisma.banAppeal.updateMany({
            where: { userId, status: "OUVERT" },
            data: { status: "ACCEPTE", resolvedAt: new Date() },
          }),
        ]
      : []),
  ]);
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return {};
}

export async function resolveBanAppeal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const appealId = formData.get("appealId") as string;
  const decision = formData.get("decision") as "ACCEPTE" | "REJETE";

  const appeal = await prisma.banAppeal.findUnique({ where: { id: appealId } });
  if (!appeal || appeal.status !== "OUVERT") {
    return { error: "Demande introuvable ou déjà traitée." };
  }

  if (decision === "ACCEPTE") {
    await prisma.$transaction([
      prisma.banAppeal.update({
        where: { id: appealId },
        data: { status: "ACCEPTE", resolvedAt: new Date() },
      }),
      prisma.user.update({ where: { id: appeal.userId }, data: { isBanned: false } }),
    ]);
  } else {
    await prisma.banAppeal.update({
      where: { id: appealId },
      data: { status: "REJETE", resolvedAt: new Date() },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return {};
}

export async function approveTransaction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const transactionId = formData.get("transactionId") as string;
  const transaction = await prisma.creditTransaction.findUnique({
    where: { id: transactionId },
    include: { user: true },
  });
  if (!transaction || transaction.status !== "EN_ATTENTE") {
    return { error: "Demande introuvable ou déjà traitée." };
  }

  if (transaction.amountCents < 0 && transaction.user.walletCents < -transaction.amountCents) {
    return {
      error:
        "Solde insuffisant pour approuver ce retrait — le solde a changé depuis la demande.",
    };
  }

  await prisma.$transaction([
    prisma.creditTransaction.update({
      where: { id: transactionId },
      data: { status: "APPROUVEE", decidedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: transaction.userId },
      data: { walletCents: { increment: transaction.amountCents } },
    }),
  ]);

  revalidatePath("/admin");
  return {};
}

export async function rejectTransaction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const transactionId = formData.get("transactionId") as string;
  const transaction = await prisma.creditTransaction.findUnique({
    where: { id: transactionId },
  });
  if (!transaction || transaction.status !== "EN_ATTENTE") {
    return { error: "Demande introuvable ou déjà traitée." };
  }

  await prisma.creditTransaction.update({
    where: { id: transactionId },
    data: { status: "REJETEE", decidedAt: new Date() },
  });

  revalidatePath("/admin");
  return {};
}

export async function resolveDispute(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const disputeId = formData.get("disputeId") as string;
  const decision = formData.get("decision") as "INTERNAUTE" | "ENTREPRISE";

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { claim: { include: { mission: true } } },
  });
  if (!dispute || dispute.status !== "OUVERT") {
    return { error: "Litige introuvable ou déjà traité." };
  }

  const { claim } = dispute;

  if (decision === "INTERNAUTE") {
    const paymentOps = await buildMissionPaymentOps({
      internauteId: claim.userId,
      entrepriseId: claim.mission.ownerId,
      rewardCents: claim.mission.rewardCents,
      missionTitle: `${claim.mission.title} (litige tranché par l'administrateur)`,
    });

    await prisma.$transaction([
      prisma.dispute.update({
        where: { id: disputeId },
        data: { status: "RESOLU_INTERNAUTE", resolvedAt: new Date() },
      }),
      prisma.missionClaim.update({
        where: { id: claim.id },
        data: { status: "VALIDEE", decidedAt: new Date() },
      }),
      ...paymentOps,
    ]);
  } else {
    await prisma.dispute.update({
      where: { id: disputeId },
      data: { status: "RESOLU_ENTREPRISE", resolvedAt: new Date() },
    });
  }

  revalidatePath("/admin");
  return {};
}

export async function decideAdminClaim(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const claimId = formData.get("claimId") as string;
  const decision = formData.get("decision") as "VALIDEE" | "REJETEE";

  const claim = await prisma.missionClaim.findUnique({
    where: { id: claimId },
    include: { mission: true },
  });
  if (!claim || claim.mission.ownerId !== admin.id || claim.status !== "SOUMISE") {
    return { error: "Compte-rendu introuvable ou déjà traité." };
  }

  if (decision === "VALIDEE") {
    const paymentOps = await buildMissionPaymentOps({
      internauteId: claim.userId,
      entrepriseId: null, // PubAFric-funded mission — no entreprise to bill
      rewardCents: claim.mission.rewardCents,
      missionTitle: `${claim.mission.title} (mission PubAFric)`,
    });

    await prisma.$transaction([
      prisma.missionClaim.update({
        where: { id: claimId },
        data: { status: "VALIDEE", decidedAt: new Date() },
      }),
      ...paymentOps,
    ]);
  } else {
    await prisma.missionClaim.update({
      where: { id: claimId },
      data: { status: "REJETEE", decidedAt: new Date() },
    });
  }

  revalidatePath("/admin");
  return {};
}

export async function createAdminMission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const title = (formData.get("title") as string)?.trim();
  const instructions = (formData.get("instructions") as string)?.trim();
  const rewardEuros = parseFloat(formData.get("reward") as string);
  const category = formData.get("category") as string;
  const slotsTotal = parseInt(formData.get("slotsTotal") as string, 10) || 1;
  const deadlineHours = parseInt(formData.get("deadlineHours") as string, 10) || 24;

  if (!title || !instructions) return { error: "Merci de remplir tous les champs." };
  if (!rewardEuros || rewardEuros <= 0) return { error: "Rémunération invalide." };
  if (!MISSION_CATEGORIES.some((c) => c.value === category)) {
    return { error: "Catégorie invalide." };
  }

  const owner = await prisma.user.findUniqueOrThrow({ where: { id: admin.id } });

  await prisma.mission.create({
    data: {
      title,
      instructions,
      category,
      currency: owner.currency,
      rewardCents: Math.round(rewardEuros * 100),
      slotsTotal,
      deadlineHours,
      ownerId: admin.id,
    },
  });

  revalidatePath("/admin");
  return { success: "Mission publiée par PubAFric." };
}

export async function archiveMission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const missionId = formData.get("missionId") as string;
  await prisma.mission.update({ where: { id: missionId }, data: { status: "ARCHIVEE" } });
  revalidatePath("/admin");
  return {};
}

export async function createAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const type = formData.get("type") as string;
  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  if (!title || !body) return { error: "Merci de remplir tous les champs." };
  if (type !== "ANNONCE" && type !== "PROMO") return { error: "Type invalide." };

  await prisma.announcement.create({ data: { type, title, body } });
  revalidatePath("/admin");
  revalidatePath("/");
  return {};
}

export async function toggleAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Non autorisé." };

  const id = formData.get("id") as string;
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) return { error: "Introuvable." };

  await prisma.announcement.update({ where: { id }, data: { active: !announcement.active } });
  revalidatePath("/admin");
  revalidatePath("/");
  return {};
}
