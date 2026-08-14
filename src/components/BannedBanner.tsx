import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BanAppealForm from "./BanAppealForm";

export default async function BannedBanner() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isBanned: true },
  });
  if (!user?.isBanned) return null;

  const openAppeal = await prisma.banAppeal.findFirst({
    where: { userId: session.user.id, status: "OUVERT" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-brand-coral px-6 py-4 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-extrabold tracking-wide">VOUS ÊTES BANNI</p>
        <p className="mt-1 text-xs text-white/90">
          Vous pouvez consulter votre compte mais vous ne pouvez plus effectuer d&apos;actions
          (prendre une mission, publier, faire une demande de dépôt ou de retrait...).
        </p>
        {openAppeal ? (
          <p className="mt-2 text-xs font-semibold text-white">
            Votre demande de révision est en cours d&apos;examen par un administrateur.
          </p>
        ) : (
          <BanAppealForm />
        )}
      </div>
    </div>
  );
}
