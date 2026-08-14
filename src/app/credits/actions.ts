"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getModerationBlock } from "@/lib/moderation";

export type ActionState = { error?: string; success?: string };

const PHONE_PATTERN = /^\+?[0-9 ]{8,15}$/;

export async function requestPayout(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };
  const block = await getModerationBlock(session.user.id);
  if (block) return { error: block };

  const mobileMoneyPhone = (formData.get("mobileMoneyPhone") as string)?.trim();
  if (!mobileMoneyPhone || !PHONE_PATTERN.test(mobileMoneyPhone)) {
    return { error: "Indiquez un numéro de téléphone mobile money valide." };
  }

  const amountEuros = parseFloat(formData.get("amount") as string);
  if (!amountEuros || amountEuros <= 0) {
    return { error: "Indiquez un montant à retirer." };
  }
  const amountCents = Math.round(amountEuros * 100);

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  if (amountCents > user.walletCents) {
    return { error: "Le montant demandé dépasse votre solde disponible." };
  }

  await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      type: "RETRAIT",
      status: "EN_ATTENTE",
      amountCents: -amountCents,
      note: `Demande de versement mobile money vers ${mobileMoneyPhone}`,
    },
  });

  revalidatePath("/credits");
  return {
    success:
      "Demande de retrait envoyée. Un administrateur PubAFric effectuera le virement réel vers ce numéro mobile money puis validera la demande.",
  };
}
