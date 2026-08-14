import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function UnverifiedBanner() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, phone: true, emailVerified: true, phoneVerified: true, isBanned: true },
  });
  if (!user || user.isBanned) return null;

  const pendingIdentifier =
    user.email && !user.emailVerified ? user.email : user.phone && !user.phoneVerified ? user.phone : null;
  if (!pendingIdentifier) return null;

  return (
    <div className="bg-brand-gold px-6 py-4 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-extrabold tracking-wide">COMPTE NON VÉRIFIÉ</p>
          <p className="mt-1 text-xs text-white/90">
            Confirmez votre {user.email && !user.emailVerified ? "email" : "numéro de téléphone"}{" "}
            pour pouvoir prendre des missions, publier ou gérer votre portefeuille.
          </p>
        </div>
        <a
          href={`/verifier?identifiant=${encodeURIComponent(pendingIdentifier)}`}
          className="shrink-0 bg-white px-4 py-2 text-xs font-bold tracking-wide text-brand-gold transition-colors hover:bg-white/90"
        >
          VÉRIFIER MAINTENANT
        </a>
      </div>
    </div>
  );
}
