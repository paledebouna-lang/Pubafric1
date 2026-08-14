"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isCurrencyCode } from "@/lib/currency";
import { generateVerificationCode, VERIFICATION_CODE_TTL_MINUTES } from "@/lib/moderation";
import { generateUniqueReferralCode } from "@/lib/referral";
import { saveUploadedFile } from "@/lib/upload";

export type RegisterState = { error?: string };

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const role = formData.get("role") as string;
  const name = (formData.get("name") as string)?.trim();
  const emailRaw = (formData.get("email") as string)?.trim().toLowerCase();
  const phoneRaw = (formData.get("phone") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const currency = formData.get("currency") as string;
  const terms = formData.get("terms");
  const referralCodeInput = (formData.get("parrainCode") as string)?.trim().toUpperCase();
  const logo = formData.get("logo") as File | null;

  const email = emailRaw || null;
  const phone = phoneRaw || null;

  if (role !== "INTERNAUTE" && role !== "ENTREPRISE") {
    return { error: "Profil invalide." };
  }
  if (!name || !password) {
    return { error: "Merci de remplir tous les champs." };
  }
  if (!isCurrencyCode(currency)) {
    return { error: "Choisissez une monnaie valide." };
  }
  if (!email && !phone) {
    return { error: "Indiquez un email ou un numéro de téléphone." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }
  if (!terms) {
    return { error: "Vous devez accepter les conditions générales." };
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    },
  });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email ou ce numéro de téléphone." };
  }

  let referredById: string | null = null;
  if (role === "INTERNAUTE" && referralCodeInput) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: referralCodeInput },
    });
    if (!referrer || referrer.role !== "INTERNAUTE") {
      return { error: "Code de parrainage invalide." };
    }
    referredById = referrer.id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationCode = generateVerificationCode();
  const verificationCodeExpiresAt = new Date(
    Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000
  );
  const referralCode = role === "INTERNAUTE" ? await generateUniqueReferralCode() : null;
  const logoUrl = role === "ENTREPRISE" ? await saveUploadedFile(logo) : null;

  await prisma.user.create({
    data: {
      role,
      name,
      email,
      phone,
      passwordHash,
      currency,
      verificationCode,
      verificationCodeExpiresAt,
      referralCode,
      referredById,
      logoUrl,
      ...(email ? { emailVerified: false } : {}),
      ...(phone ? { phoneVerified: false } : {}),
    },
  });

  redirect(`/verifier?identifiant=${encodeURIComponent(email ?? phone ?? "")}`);
}
