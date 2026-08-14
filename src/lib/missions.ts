import { prisma } from "@/lib/prisma";

// Lazily expire any claim whose 24h deadline has passed — called before
// reading claim counts so the "max 2 concurrent missions" rule stays accurate
// without needing a background job.
export async function expireOverdueClaims(userId?: string) {
  await prisma.missionClaim.updateMany({
    where: {
      status: "EN_COURS",
      expiresAt: { lt: new Date() },
      ...(userId ? { userId } : {}),
    },
    data: { status: "EXPIREE" },
  });
}
