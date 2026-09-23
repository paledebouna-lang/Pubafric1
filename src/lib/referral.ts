import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export const REFERRAL_COMMISSION_PERCENT = 5;
export const REFERRAL_COMMISSION_RATE = REFERRAL_COMMISSION_PERCENT / 100; // 5% of a filleul's net mission earnings

function randomCode(): string {
  return randomBytes(4).toString("hex").toUpperCase(); // 8 hex chars, e.g. "A1B2C3D4"
}

export async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const existing = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }
  // Astronomically unlikely to ever hit this, but stay correct under collision.
  return `${randomCode()}${randomCode()}`;
}
