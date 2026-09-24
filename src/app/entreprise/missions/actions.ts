"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { MISSION_CATEGORIES } from "@/lib/categories";
import { saveUploadedFile, buildMediaList } from "@/lib/upload";
import { getModerationBlock } from "@/lib/moderation";
import { buildMissionPaymentOps, entrepriseCost } from "@/lib/payments";
import { parseFcfa } from "@/lib/currency";
import { parseExecutionForm } from "@/lib/execution-form";

export type ActionState = { error?: string };

async function requireEntreprise() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ENTREPRISE") {
    return null;
  }
  return session.user;
}

export async function createMission(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireEntreprise();
  if (!user) return { error: "Vous devez être connecté en tant qu'entreprise." };
  const block = await getModerationBlock(user.id);
  if (block) return { error: block };

  const title = (formData.get("title") as string)?.trim();
  const instructions = (formData.get("instructions") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const proofRequired = (formData.get("proofRequired") as string)?.trim() || null;
  const estimatedMinutes = parseInt(formData.get("estimatedMinutes") as string, 10) || null;
  const kind = formData.get("kind") === "TERRAIN" ? "TERRAIN" : "EN_LIGNE";
  const rewardFcfa = parseFcfa(formData.get("reward"));
  const category = formData.get("category") as string;
  const slotsTotal = parseInt(formData.get("slotsTotal") as string, 10) || 1;
  const deadlineHours = parseInt(formData.get("deadlineHours") as string, 10) || 24;
  const link = (formData.get("link") as string)?.trim();
  const image = formData.get("image") as File | null;
  const video = formData.get("video") as File | null;
  const latRaw = formData.get("lat") as string | null;
  const lngRaw = formData.get("lng") as string | null;

  if (!title || !instructions) return { error: "Merci de remplir tous les champs." };
  if (!rewardFcfa) return { error: "Rémunération invalide (montant entier en FCFA)." };
  if (!MISSION_CATEGORIES.some((c) => c.value === category)) {
    return { error: "Catégorie invalide." };
  }
  if (slotsTotal < 1 || slotsTotal > 500) {
    return { error: "Le nombre d'internautes recherchés doit être entre 1 et 500." };
  }
  if (deadlineHours < 1 || deadlineHours > 24 * 30) {
    return { error: "Le délai doit être entre 1 heure et 30 jours." };
  }

  const contentVideoUrl = await saveUploadedFile(formData.get("contentVideo") as File | null);
  const exec = parseExecutionForm(formData, contentVideoUrl);
  if ("error" in exec) return { error: exec.error };

  const imageUrl = await saveUploadedFile(image);
  const videoUrl = await saveUploadedFile(video);
  const media = buildMediaList({ imageUrl, videoUrl, link });
  await prisma.mission.create({
    data: {
      title,
      instructions,
      ...exec.data,
      description,
      proofRequired,
      estimatedMinutes,
      kind,
      category,
      rewardCents: rewardFcfa,
      slotsTotal,
      deadlineHours,
      mediaJson: media.length > 0 ? JSON.stringify(media) : null,
      lat: latRaw ? parseFloat(latRaw) : null,
      lng: lngRaw ? parseFloat(lngRaw) : null,
      ownerId: user.id,
    },
  });

  revalidatePath("/entreprise/missions");
  return {};
}

export async function decideClaim(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireEntreprise();
  if (!user) return { error: "Non autorisé." };
  const block = await getModerationBlock(user.id);
  if (block) return { error: block };

  const claimId = formData.get("claimId") as string;
  const decision = formData.get("decision") as "VALIDEE" | "REJETEE";

  const claim = await prisma.missionClaim.findUnique({
    where: { id: claimId },
    include: { mission: true },
  });
  if (!claim || claim.mission.ownerId !== user.id || claim.status !== "SOUMISE") {
    return { error: "Compte-rendu introuvable ou déjà traité." };
  }

  if (decision === "VALIDEE") {
    const owner = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    const entrepriseDebit = entrepriseCost(claim.mission.rewardCents);
    if (owner.walletCents < entrepriseDebit) {
      return {
        error:
          "Solde de crédits insuffisant pour valider cette mission (récompense + 15% de frais PubAFric). Rechargez votre portefeuille.",
      };
    }

    const paymentOps = await buildMissionPaymentOps({
      internauteId: claim.userId,
      entrepriseId: user.id,
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
  } else {
    await prisma.missionClaim.update({
      where: { id: claimId },
      data: { status: "REJETEE", decidedAt: new Date() },
    });
  }

  revalidatePath("/entreprise/missions");
  return {};
}
