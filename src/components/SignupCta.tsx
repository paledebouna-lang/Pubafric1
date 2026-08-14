import { User, Landmark } from "lucide-react";

export default function SignupCta() {
  return (
    <section id="internautes" className="bg-muted-bg px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">[ INSCRIVEZ-VOUS ! ]</p>
        <h2 className="mt-6 text-2xl font-bold text-brand-blue md:text-3xl">
          PUBAFRIC VOUS MET EN RELATION FACILEMENT
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#7c8797]">
          Vous êtes une entreprise ? Il est temps de vous faciliter la vie pour confier vos
          micro-tâches aux internautes disponibles... Vous êtes un internaute qui a du temps et
          un ordinateur ? Rejoignez la communauté des Taskers PubAFric et gagnez de l'argent dès
          maintenant en accomplissant vos premières missions.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <a
            href="/inscription"
            className="flex flex-col items-center gap-3 border border-border-soft bg-white px-6 py-10 transition-colors hover:border-brand-blue"
          >
            <User size={36} className="text-[#5b6472]" strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-wide text-[#2b2f38]">INTERNAUTES</span>
            <span className="text-xs text-[#6b7280]">Arrondissez vos fins de mois</span>
          </a>
          <a
            id="entreprises"
            href="/inscription"
            className="flex flex-col items-center gap-3 border border-border-soft bg-white px-6 py-10 transition-colors hover:border-brand-red"
          >
            <Landmark size={36} className="text-brand-red" strokeWidth={1.5} />
            <span className="text-sm font-bold tracking-wide text-[#2b2f38]">ENTREPRISES</span>
            <span className="text-xs text-[#6b7280]">Proposez vos missions</span>
          </a>
        </div>
      </div>
    </section>
  );
}
