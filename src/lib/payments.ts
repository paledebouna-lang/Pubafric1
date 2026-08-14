import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { REFERRAL_COMMISSION_RATE } from "@/lib/referral";

// PubAFric's cut: 15% on money entreprises pay out for missions, 10% on what
// internautes earn. Both are real ledger deductions (not just display copy).
export const ENTREPRISE_FEE_RATE = 0.15;
export const INTERNAUTE_FEE_RATE = 0.1;

// The admin account acts as PubAFric's own treasury — platform fees accumulate
// on its wallet, visible to the admin in the users list and transaction feed.
export async function getPlatformAccountId(): Promise<string | null> {
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  return admin?.id ?? null;
}

type MissionPaymentParams = {
  internauteId: string;
  // null when the mission itself was published by PubAFric (no entreprise to bill/fee).
  entrepriseId: string | null;
  rewardCents: number;
  missionTitle: string;
};

/**
 * Builds the full set of Prisma write operations to settle a validated mission:
 * entreprise debited reward+15% (if applicable), internaute credited reward-10%,
 * platform fees credited to the admin treasury, and — if the internaute was
 * referred — 5% of their net gain paid to the referrer (funded by the platform).
 * Pass the returned array into prisma.$transaction([...]) alongside any other
 * writes (e.g. updating the MissionClaim status) so everything commits atomically.
 */
export async function buildMissionPaymentOps({
  internauteId,
  entrepriseId,
  rewardCents,
  missionTitle,
}: MissionPaymentParams): Promise<Prisma.PrismaPromise<unknown>[]> {
  const ops: Prisma.PrismaPromise<unknown>[] = [];
  const platformId = await getPlatformAccountId();

  if (entrepriseId) {
    const entrepriseFee = Math.round(rewardCents * ENTREPRISE_FEE_RATE);
    const entrepriseDebit = rewardCents + entrepriseFee;
    ops.push(
      prisma.user.update({
        where: { id: entrepriseId },
        data: { walletCents: { decrement: entrepriseDebit } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: entrepriseId,
          type: "DEBIT_MISSION",
          amountCents: -entrepriseDebit,
          note: `Mission validée (dont 15% de frais PubAFric) : ${missionTitle}`,
        },
      })
    );
    if (platformId && entrepriseFee > 0) {
      ops.push(
        prisma.user.update({
          where: { id: platformId },
          data: { walletCents: { increment: entrepriseFee } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: platformId,
            type: "FRAIS_PLATEFORME",
            amountCents: entrepriseFee,
            note: `Frais entreprise (15%) : ${missionTitle}`,
          },
        })
      );
    }
  }

  const internauteFee = Math.round(rewardCents * INTERNAUTE_FEE_RATE);
  const internauteCredit = rewardCents - internauteFee;

  ops.push(
    prisma.user.update({
      where: { id: internauteId },
      data: { walletCents: { increment: internauteCredit } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId: internauteId,
        type: "CREDIT_MISSION",
        amountCents: internauteCredit,
        note: `Mission validée (dont 10% de frais PubAFric) : ${missionTitle}`,
      },
    })
  );
  if (platformId && internauteFee > 0) {
    ops.push(
      prisma.user.update({
        where: { id: platformId },
        data: { walletCents: { increment: internauteFee } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: platformId,
          type: "FRAIS_PLATEFORME",
          amountCents: internauteFee,
          note: `Frais internaute (10%) : ${missionTitle}`,
        },
      })
    );
  }

  const internaute = await prisma.user.findUnique({
    where: { id: internauteId },
    select: { referredById: true, name: true },
  });
  if (internaute?.referredById) {
    const referralBonus = Math.round(internauteCredit * REFERRAL_COMMISSION_RATE);
    if (referralBonus > 0) {
      ops.push(
        prisma.user.update({
          where: { id: internaute.referredById },
          data: { walletCents: { increment: referralBonus } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: internaute.referredById,
            type: "COMMISSION_PARRAINAGE",
            amountCents: referralBonus,
            note: `Commission de parrainage (5%) — ${internaute.name} : ${missionTitle}`,
          },
        })
      );
      if (platformId) {
        ops.push(
          prisma.user.update({
            where: { id: platformId },
            data: { walletCents: { decrement: referralBonus } },
          }),
          prisma.creditTransaction.create({
            data: {
              userId: platformId,
              type: "COMMISSION_PARRAINAGE",
              amountCents: -referralBonus,
              note: `Commission de parrainage versée pour ${internaute.name} : ${missionTitle}`,
            },
          })
        );
      }
    }
  }

  return ops;
}
