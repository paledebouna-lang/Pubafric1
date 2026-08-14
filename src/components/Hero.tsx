import { Camera, User, Landmark } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      {/* Placeholder for hero photography — swap for a licensed image of a "tasker" in action */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-[#3a2a1f]/95 to-[#1a120c]" />
      <div className="absolute right-0 top-0 hidden h-full w-1/2 items-center justify-center opacity-20 md:flex">
        <Camera size={280} strokeWidth={1} className="text-brand-gold" />
      </div>
      <div className="kente-bar absolute bottom-0 left-0 right-0" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:py-28">
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

        <div className="grid max-w-xl grid-cols-2 gap-4">
          <a
            href="/inscription"
            className="flex flex-col items-center gap-3 bg-white/90 px-6 py-8 text-center transition-colors hover:bg-white"
          >
            <User size={36} className="text-[#5b6472]" strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-wide text-[#2b2f38]">INTERNAUTES</span>
            <span className="text-xs text-[#6b7280]">Arrondissez vos fins de mois</span>
          </a>
          <a
            href="/inscription"
            className="flex flex-col items-center gap-3 bg-brand-red/90 px-6 py-8 text-center transition-colors hover:bg-brand-red"
          >
            <Landmark size={36} className="text-white" strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-wide text-white">ENTREPRISES</span>
            <span className="text-xs text-white/85">Proposez vos missions</span>
          </a>
        </div>
      </div>
    </section>
  );
}
