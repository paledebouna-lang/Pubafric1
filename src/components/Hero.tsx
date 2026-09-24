import { User, Landmark } from "lucide-react";
import { auth } from "@/auth";
import { spaceHref, spaceLabel } from "@/lib/space";

export default async function Hero() {
  const session = await auth();
  const user = session?.user;

  return (
    <section className="relative overflow-hidden bg-brand-black">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-[#3a2a1f]/95 to-[#1a120c]" />
      <div className="kente-bar absolute bottom-0 left-0 right-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              <span className="block text-brand-teal">PETITES TÂCHES</span>
              <span className="block text-brand-coral">MISSIONS PONCTUELLES</span>
              <span className="block text-brand-gold">OU LOCALES...</span>
            </h1>
            <p className="mt-6 text-lg font-semibold text-white">
              Faites appel aux internautes !
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-widest text-brand-gold">
              Des missions simples, de l&apos;argent réel — 100% Afrique
            </p>
          </div>

          {user ? (
            <div className="mt-10 max-w-xl">
              <p className="text-sm font-semibold text-white/90">
                Bonjour {user.name}, vous êtes connecté.
              </p>
              <a
                href={spaceHref(user.role)}
                className="mt-4 inline-block bg-brand-gold px-8 py-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-gold/90"
              >
                {spaceLabel(user.role)}
              </a>
            </div>
          ) : (
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              <a
                href="/internautes"
                className="flex flex-col items-center gap-3 bg-white/90 px-6 py-8 text-center transition-colors hover:bg-white"
              >
                <User size={36} className="text-[#5b6472]" strokeWidth={1.5} />
                <span className="text-sm font-bold tracking-wide text-[#2b2f38]">INTERNAUTES</span>
                <span className="text-xs text-[#6b7280]">Arrondissez vos fins de mois</span>
              </a>
              <a
                href="/entreprises"
                className="flex flex-col items-center gap-3 bg-brand-red/90 px-6 py-8 text-center transition-colors hover:bg-brand-red"
              >
                <Landmark size={36} className="text-white" strokeWidth={1.5} />
                <span className="text-sm font-bold tracking-wide text-white">ENTREPRISES</span>
                <span className="text-xs text-white/85">Proposez vos missions</span>
              </a>
            </div>
          )}
          <p className="mt-4 text-sm font-semibold text-white/90">Paiement par Mobile Money</p>
        </div>

        {/* Image d'accueil : à droite sur ordinateur, sous le texte sur mobile. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/hero-visual.svg"
          alt="Un téléphone affichant des missions PubAfric payées en FCFA"
          width={1000}
          height={800}
          loading="eager"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
