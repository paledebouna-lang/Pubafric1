"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { saveUploadedFile } from "@/lib/upload";

export type ActionState = { error?: string; success?: string };

export async function updateProfile(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };

  const firstName = (formData.get("firstName") as string)?.trim() || null;
  const lastName = (formData.get("lastName") as string)?.trim() || null;
  const ageRaw = (formData.get("age") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const profession = (formData.get("profession") as string)?.trim() || null;
  const whatsapp = (formData.get("whatsapp") as string)?.trim() || null;
  const socialInstagram = (formData.get("socialInstagram") as string)?.trim() || null;
  const socialTiktok = (formData.get("socialTiktok") as string)?.trim() || null;
  const socialFacebook = (formData.get("socialFacebook") as string)?.trim() || null;
  const socialTwitter = (formData.get("socialTwitter") as string)?.trim() || null;
  const logo = formData.get("logo") as File | null;

  let age: number | null = null;
  if (ageRaw) {
    age = parseInt(ageRaw, 10);
    if (Number.isNaN(age) || age < 13 || age > 120) {
      return { error: "Merci d'indiquer un âge valide." };
    }
  }

  const logoUrl = session.user.role === "ENTREPRISE" ? await saveUploadedFile(logo) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      age,
      location,
      profession,
      whatsapp,
      socialInstagram,
      socialTiktok,
      socialFacebook,
      socialTwitter,
      ...(logoUrl ? { logoUrl } : {}),
    },
  });

  revalidatePath("/profil");
  revalidatePath("/partenaires");
  return { success: "Profil mis à jour." };
}
