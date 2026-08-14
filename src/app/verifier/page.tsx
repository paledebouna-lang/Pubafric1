import { prisma } from "@/lib/prisma";
import VerifyForm from "./VerifyForm";

export default async function VerifierPage({
  searchParams,
}: {
  searchParams: Promise<{ identifiant?: string }>;
}) {
  const { identifiant = "" } = await searchParams;

  const user = identifiant
    ? await prisma.user.findFirst({
        where: { OR: [{ email: identifiant }, { phone: identifiant }] },
      })
    : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-extrabold">
        <span className="text-brand-red">P</span>ubAFric
      </h1>
      <p className="mt-1 text-center text-xs font-bold tracking-widest text-[#7c8797]">
        VÉRIFICATION DU COMPTE
      </p>

      {!identifiant || !user ? (
        <p className="mt-8 text-center text-sm text-[#7c8797]">
          Lien de vérification invalide.{" "}
          <a href="/inscription" className="font-semibold text-brand-blue">
            Recommencer l&apos;inscription
          </a>
        </p>
      ) : (
        <>
          <p className="mt-6 text-center text-sm text-[#2b2f38]">
            Un code de confirmation a été envoyé à <strong>{identifiant}</strong>.
          </p>

          {user.verificationCode && (
            <div className="mt-4 bg-brand-gold/10 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-[#7c8797]">
                Mode démonstration — aucun SMS/email n&apos;est réellement envoyé. Votre code :
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-[0.4em] text-brand-gold">
                {user.verificationCode}
              </p>
            </div>
          )}

          <div className="mt-6">
            <VerifyForm identifiant={identifiant} />
          </div>
        </>
      )}
    </main>
  );
}
