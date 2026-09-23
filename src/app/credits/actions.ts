"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getModerationBlock } from "@/lib/moderation";
import { parseFcfa, formatMoney } from "@/lib/currency";
import { MIN_PAYOUT_FCFA } from "@/lib/rules";

export type ActionState = { error?: string; success?: string };

// Espaces, points et tirets sont ignorés : « +225 07 00 00 00 00 » (l'exemple du formulaire) est valide.
const PHONE_PATTERN = /^\+?[0-9]{8,15}$/;

export async function requestPayout(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Non authentifié." };
  const block = await getModerationBlock(session.user.id);
  if (block) return { error: block };

  const mobileMoneyPhone = (formData.get("mobileMoneyPhone") as string)?.trim();
  if (!mobileMoneyPhone || !PHONE_PATTERN.test(mobileMoneyPhone.replace(/[\s.-]/g, ""))) {
    return { error: "Indiquez un numéro de téléphone mobile money valide." };
  }

  const amountCents = parseFcfa(formData.get("amount"));
  if (!amountCents) {
    return { error: "Indiquez un montant à retirer (en FCFA)." };
  }
  if (amountCents < MIN_PAYOUT_FCFA) {
    return { error: `Le retrait minimum est de ${formatMoney(MIN_PAYOUT_FCFA)}.` };
  }

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
