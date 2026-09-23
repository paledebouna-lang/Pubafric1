"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { expireOverdueClaims } from "@/lib/missions";
import { MAX_CONCURRENT_CLAIMS } from "@/lib/rules";
import { saveUploadedFile, buildMediaList } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { getModerationBlock } from "@/lib/moderation";

export type ActionState = { error?: string };

const OCCUPYING_STATUSES = ["EN_COURS", "SOUMISE", "VALIDEE"];

function generateVerificationCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function claimMission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INTERNAUTE") {
    return { error: "Vous devez être connecté en tant qu'internaute." };
  }
  const missionId = formData.get("missionId") as string;
  const userId = session.user.id;

  const block = await getModerationBlock(userId);
  if (block) return { error: block };

  await expireOverdueClaims(userId);

  const activeCount = await prisma.missionClaim.count({
    where: { userId, status: { in: ["EN_COURS", "SOUMISE"] } },
  });
  if (activeCount >= MAX_CONCURRENT_CLAIMS) {
    return {
      error: `Vous avez déjà ${MAX_CONCURRENT_CLAIMS} missions en cours. Terminez-en une avant d'en prendre une nouvelle.`,
    };
  }

  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: { claims: true },
  });
  if (!mission || mission.status !== "OUVERTE") {
    return { error: "Cette mission n'est plus disponible." };
  }
  if (mission.claims.some((c) => c.userId === userId)) {
    return { error: "Vous avez déjà pris cette mission." };
  }
  const occupied = mission.claims.filter((c) => OCCUPYING_STATUSES.includes(c.status)).length;
  if (occupied >= mission.slotsTotal) {
    return { error: "Toutes les places pour cette mission sont déjà prises." };
  }

  const expiresAt = new Date(Date.now() + mission.deadlineHours * 60 * 60 * 1000);

  await prisma.missionClaim.create({
    data: { missionId, userId, expiresAt, verificationCode: generateVerificationCode() },
  });

  revalidatePath("/missions");
  return {};
}

// L'internaute abandonne une mission qu'il a prise mais ne veut plus exécuter : la place est
// libérée pour les autres. Seule une mission encore "en cours" (rien n'a été envoyé) peut
// être rétractée ; une fois le compte-rendu envoyé, c'est à l'entreprise de trancher.
export async function retractClaim(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "INTERNAUTE") {
    return { error: "Vous devez être connecté en tant qu'internaute." };
  }
  const claimId = formData.get("claimId") as string;

  const claim = await prisma.missionClaim.findUnique({ where: { id: claimId } });
  if (!claim || claim.userId !== session.user.id) {
    return { error: "Mission introuvable." };
  }
  if (claim.status !== "EN_COURS") {
    return { error: "Cette mission ne peut plus être rétractée." };
  }

  await prisma.missionClaim.delete({ where: { id: claimId } });

  revalidatePath("/missions");
  revalidatePath("/entreprise/missions");
  return {};
}

export async function raiseDispute(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };

  const claimId = formData.get("claimId") as string;
  const reason = (formData.get("reason") as string)?.trim();
  if (!reason) return { error: "Expliquez pourquoi vous contestez ce rejet." };

  const claim = await prisma.missionClaim.findUnique({
    where: { id: claimId },
    include: { dispute: true },
  });
  if (!claim || claim.userId !== session.user.id || claim.status !== "REJETEE") {
    return { error: "Cette mission ne peut pas être contestée." };
  }
  if (claim.dispute) {
    return { error: "Vous avez déjà contesté cette mission." };
  }

  await prisma.dispute.create({
    data: { claimId, raisedById: session.user.id, reason },
  });

  revalidatePath("/missions");
  return {};
}

export async function submitReport(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };
  const block = await getModerationBlock(session.user.id);
  if (block) return { error: block };

  const claimId = formData.get("claimId") as string;
  const report = (formData.get("report") as string)?.trim();
  const link = (formData.get("link") as string)?.trim();
  const image = formData.get("image") as File | null;
  const video = formData.get("video") as File | null;
  if (!report) return { error: "Merci de décrire le travail effectué." };

  const claim = await prisma.missionClaim.findUnique({ where: { id: claimId } });
  if (!claim || claim.userId !== session.user.id || claim.status !== "EN_COURS") {
    return { error: "Mission introuvable ou déjà traitée." };
  }
  if (claim.expiresAt < new Date()) {
    await prisma.missionClaim.update({ where: { id: claimId }, data: { status: "EXPIREE" } });
    return { error: "Le délai est dépassé, cette mission a expiré." };
  }

  const imageUrl = await saveUploadedFile(image);
  const videoUrl = await saveUploadedFile(video);
  const media = buildMediaList({ imageUrl, videoUrl, link });

  await prisma.missionClaim.update({
    where: { id: claimId },
    data: {
      status: "SOUMISE",
      report,
      reportMediaJson: media.length > 0 ? JSON.stringify(media) : null,
      submittedAt: new Date(),
    },
  });

  revalidatePath("/missions");
  return {};
}
