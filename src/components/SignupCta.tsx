import { User, Landmark } from "lucide-react";
import { auth } from "@/auth";
import { spaceHref, spaceLabel } from "@/lib/space";

export default async function SignupCta() {
  const session = await auth();
  const user = session?.user;

  return (
    <section id="internautes" className="bg-muted-bg px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">
          {user ? "[ VOTRE ESPACE ]" : "[ INSCRIVEZ-VOUS ! ]"}
        </p>
        <h2 className="mt-6 text-2xl font-bold text-brand-blue md:text-3xl">
          PUBAFRIC VOUS MET EN RELATION FACILEMENT
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#7c8797]">
          Vous êtes une entreprise ? Il est temps de vous faciliter la vie pour confier vos
          micro-tâches aux internautes disponibles... Vous êtes un internaute qui a du temps et
          un téléphone ? Rejoignez la communauté des internautes PubAFric et gagnez de l&apos;argent dès
          maintenant en accomplissant vos premières missions.
        </p>

        {user ? (
          <div className="mt-14">
            <p className="text-sm font-semibold text-[#2b2f38]">
              Vous êtes connecté en tant que {user.name}.
            </p>
            <a
              href={spaceHref(user.role)}
              className="mt-4 inline-block bg-brand-blue px-8 py-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-blue-dark"
            >
              {spaceLabel(user.role)}
            </a>
          </div>
        ) : (
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
        )}
        <p className="mt-6 text-sm font-semibold text-[#2b2f38]">Paiement par Mobile Money</p>
      </div>
    </section>
  );
}
