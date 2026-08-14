"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: string };

export async function raiseBanAppeal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };

  const reason = (formData.get("reason") as string)?.trim();
  if (!reason) return { error: "Expliquez pourquoi vous contestez ce bannissement." };

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!user.isBanned) return { error: "Votre compte n'est pas banni." };

  const existing = await prisma.banAppeal.findFirst({
    where: { userId: user.id, status: "OUVERT" },
  });
  if (existing) return { error: "Vous avez déjà une demande de révision en cours." };

  await prisma.banAppeal.create({ data: { userId: user.id, reason } });

  revalidatePath("/", "layout");
  return { success: "Votre demande de révision a été envoyée à un administrateur." };
}
