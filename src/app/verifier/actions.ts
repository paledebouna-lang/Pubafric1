"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateVerificationCode, VERIFICATION_CODE_TTL_MINUTES } from "@/lib/moderation";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: string };

async function findByIdentifier(identifiant: string) {
  return prisma.user.findFirst({
    where: { OR: [{ email: identifiant }, { phone: identifiant }] },
  });
}

export async function confirmVerification(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const identifiant = (formData.get("identifiant") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();
  if (!identifiant || !code) return { error: "Merci de renseigner le code reçu." };

  const user = await findByIdentifier(identifiant);
  if (!user) return { error: "Compte introuvable." };

  if (!user.verificationCode || user.verificationCode !== code) {
    return { error: "Code incorrect." };
  }
  if (!user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
    return { error: "Ce code a expiré, demandez-en un nouveau." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(user.email === identifiant ? { emailVerified: true } : {}),
      ...(user.phone === identifiant ? { phoneVerified: true } : {}),
      verificationCode: null,
      verificationCodeExpiresAt: null,
    },
  });

  revalidatePath("/", "layout");
  redirect("/connexion?verifie=ok");
}

export async function resendVerificationCode(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const identifiant = (formData.get("identifiant") as string)?.trim();
  if (!identifiant) return { error: "Identifiant manquant." };

  const user = await findByIdentifier(identifiant);
  if (!user) return { error: "Compte introuvable." };

  const verificationCode = generateVerificationCode();
  const verificationCodeExpiresAt = new Date(
    Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000
  );
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationCode, verificationCodeExpiresAt },
  });

  revalidatePath("/verifier");
  return { success: "Nouveau code généré." };
}
