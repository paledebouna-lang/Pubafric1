"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getModerationBlock } from "@/lib/moderation";

export type ActionState = { error?: string; success?: string };

async function requireEntreprise() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ENTREPRISE") return null;
  return session.user;
}

// Deposits are requests, not instant top-ups: the entreprise pays PubAFric via a real
// bank transfer / mobile money outside the app, then an admin confirms receipt and
// credits the virtual wallet for that amount.
export async function requestDeposit(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireEntreprise();
  if (!user) return { error: "Vous devez être connecté en tant qu'entreprise." };
  const block = await getModerationBlock(user.id);
  if (block) return { error: block };

  const amountEuros = parseFloat(formData.get("amount") as string);
  const paymentMethod = (formData.get("paymentMethod") as string)?.trim();
  const reference = (formData.get("reference") as string)?.trim();

  if (!amountEuros || amountEuros <= 0) return { error: "Montant invalide." };
  if (!paymentMethod) return { error: "Indiquez un moyen de paiement." };

  const amountCents = Math.round(amountEuros * 100);

  await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      type: "DEPOT",
      status: "EN_ATTENTE",
      amountCents,
      note: `Dépôt annoncé via ${paymentMethod}${reference ? ` — réf. ${reference}` : ""}`,
    },
  });

  revalidatePath("/entreprise/credits");
  return {
    success:
      "Demande de dépôt envoyée. Un administrateur PubAFric confirmera la réception du paiement puis créditera votre portefeuille.",
  };
}

export async function requestWithdrawal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireEntreprise();
  if (!user) return { error: "Vous devez être connecté en tant qu'entreprise." };
  const block = await getModerationBlock(user.id);
  if (block) return { error: block };

  const amountEuros = parseFloat(formData.get("amount") as string);
  const destination = (formData.get("destination") as string)?.trim();

  if (!amountEuros || amountEuros <= 0) return { error: "Montant invalide." };
  if (!destination) return { error: "Indiquez un compte bancaire ou mobile money de destination." };

  const amountCents = Math.round(amountEuros * 100);
  const owner = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
  if (amountCents > owner.walletCents) {
    return { error: "Le montant demandé dépasse votre solde disponible." };
  }

  await prisma.creditTransaction.create({
    data: {
      userId: user.id,
      type: "RETRAIT",
      status: "EN_ATTENTE",
      amountCents: -amountCents,
      note: `Demande de retrait vers ${destination}`,
    },
  });

  revalidatePath("/entreprise/credits");
  return {
    success:
      "Demande de retrait envoyée. Un administrateur PubAFric effectuera le virement réel puis validera la demande.",
  };
}
