import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

export const VERIFICATION_CODE_TTL_MINUTES = 15;

export function generateVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export const BANNED_ACTION_ERROR =
  "Votre compte est banni. Vous ne pouvez pas effectuer cette action tant que votre bannissement n'est pas levé — contestez-le depuis le bandeau en haut de l'écran.";

export const UNVERIFIED_ACTION_ERROR =
  "Votre compte n'est pas encore vérifié. Confirmez votre email ou numéro de téléphone depuis le bandeau en haut de l'écran pour pouvoir effectuer cette action.";

// Single check combining every reason a logged-in user might be blocked from
// mutating the app (banned, or signed up but never confirmed their email/phone).
export async function getModerationBlock(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isBanned: true, email: true, phone: true, emailVerified: true, phoneVerified: true },
  });
  if (!user) return "Utilisateur introuvable.";
  if (user.isBanned) return BANNED_ACTION_ERROR;

  const verified = (!user.email || user.emailVerified) && (!user.phone || user.phoneVerified);
  if (!verified) return UNVERIFIED_ACTION_ERROR;

  return null;
}
