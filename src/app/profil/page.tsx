import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";
import ProfileForm from "./ProfileForm";
import ReferralPanel from "@/components/ReferralPanel";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });

  let referralLink = "";
  let filleulCount = 0;
  let totalEarnedLabel = formatMoney(0, user.currency);

  if (user.role === "INTERNAUTE" && user.referralCode) {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    referralLink = `${proto}://${host}/inscription?parrain=${user.referralCode}`;

    const [count, earned] = await Promise.all([
      prisma.user.count({ where: { referredById: user.id } }),
      prisma.creditTransaction.aggregate({
        where: { userId: user.id, type: "COMMISSION_PARRAINAGE", amountCents: { gt: 0 } },
        _sum: { amountCents: true },
      }),
    ]);
    filleulCount = count;
    totalEarnedLabel = formatMoney(earned._sum.amountCents ?? 0, user.currency);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-extrabold text-[#2b2f38]">Mon profil</h1>
      <p className="mt-1 text-sm text-[#7c8797]">
        Complétez votre profil pour une expérience PubAFric plus personnalisée.
      </p>

      {user.role === "INTERNAUTE" && user.referralCode && (
        <section className="mt-6">
          <h2 className="text-sm font-bold tracking-widest text-brand-red">
            PARRAINAGE — GAGNEZ 5% DES GAINS DE VOS FILLEULS
          </h2>
          <p className="mt-2 text-xs text-[#7c8797]">
            Partagez votre lien : à chaque mission validée pour un filleul inscrit avec ce code,
            vous recevez automatiquement 5% de son gain, en plus de son propre salaire.
          </p>
          <div className="mt-4">
            <ReferralPanel
              referralLink={referralLink}
              referralCode={user.referralCode}
              filleulCount={filleulCount}
              totalEarnedLabel={totalEarnedLabel}
            />
          </div>
        </section>
      )}

      <div className="mt-8">
        <ProfileForm
          isInternaute={user.role === "INTERNAUTE"}
          isEntreprise={user.role === "ENTREPRISE"}
          logoUrl={user.logoUrl}
          initial={{
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            age: user.age?.toString() ?? "",
            location: user.location ?? "",
            profession: user.profession ?? "",
            whatsapp: user.whatsapp ?? "",
            socialInstagram: user.socialInstagram ?? "",
            socialTiktok: user.socialTiktok ?? "",
            socialFacebook: user.socialFacebook ?? "",
            socialTwitter: user.socialTwitter ?? "",
          }}
        />
      </div>
    </main>
  );
}
