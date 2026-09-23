import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CURRENCY_CODE } from "@/lib/currency";
import { generateUniqueReferralCode } from "@/lib/referral";
import { GOOGLE_ENABLED, SIGNUP_COOKIE, parseSignupCookie } from "@/lib/google-signup";

// Mot de passe aléatoire inutilisable : les comptes Google n'ont pas de mot de passe
// (le champ est obligatoire en base), et personne ne peut s'y connecter par mot de passe.
const unusablePasswordHash = () => bcrypt.hash(randomBytes(32).toString("hex"), 10);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/connexion" },
  providers: [
    ...(GOOGLE_ENABLED ? [Google] : []),
    Credentials({
      credentials: {
        identifier: { label: "Email ou téléphone" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const identifier = (credentials?.identifier as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;
        if (!identifier || !password) return null;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { phone: identifier }] },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider !== "google") return true;

      const email = profile?.email?.toLowerCase();
      if (!email || !profile?.email_verified) return "/connexion?erreur=google-email";

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        // Google a vérifié l'adresse : le compte existant est rattaché. Si l'adresse n'avait
        // jamais été confirmée, quelqu'un d'autre a pu créer ce compte avec un mot de passe
        // qu'il connaît : on le remplace pour que seul le vrai propriétaire garde la main.
        if (!existing.emailVerified) {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              emailVerified: true,
              verificationCode: null,
              verificationCodeExpiresAt: null,
              passwordHash: await unusablePasswordHash(),
            },
          });
        }
        return true;
      }

      const signup = parseSignupCookie((await cookies()).get(SIGNUP_COOKIE)?.value);
      if (!signup) return "/inscription?google=profil";

      let referredById: string | null = null;
      if (signup.role === "INTERNAUTE" && signup.parrain) {
        const referrer = await prisma.user.findUnique({ where: { referralCode: signup.parrain } });
        if (referrer && referrer.role === "INTERNAUTE") referredById = referrer.id;
      }

      try {
        await prisma.user.create({
          data: {
            role: signup.role,
            name: profile?.name?.trim() || email.split("@")[0],
            email,
            passwordHash: await unusablePasswordHash(),
            currency: CURRENCY_CODE,
            emailVerified: true,
            referralCode: signup.role === "INTERNAUTE" ? await generateUniqueReferralCode() : null,
            referredById,
          },
        });
      } catch {
        // Course : le compte vient d'être créé par une autre requête — on le réutilise.
        const created = await prisma.user.findUnique({ where: { email } });
        if (!created) return "/connexion?erreur=google";
      }
      return true;
    },
    jwt: async ({ token, user, account }) => {
      if (account?.provider === "google") {
        const dbUser = token.email
          ? await prisma.user.findUnique({ where: { email: token.email.toLowerCase() } })
          : null;
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
