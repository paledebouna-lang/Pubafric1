import { ClipboardList, Settings, ThumbsUp, Banknote } from "lucide-react";
import { formatMoney } from "@/lib/currency";
import { MIN_PAYOUT_FCFA } from "@/lib/rules";

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. L'entreprise propose une mission",
    text: "Exemple : tester un produit, faire une visite terrain, relayer un lancement, prendre une photo, copier-coller des textes...",
  },
  {
    icon: Settings,
    title: "2. L'internaute disponible l'effectue",
    text: "Chaque micro-mission est faisable de chez soi ou près de chez soi : il suffit d'avoir un téléphone et un peu de temps.",
  },
  {
    icon: ThumbsUp,
    title: "3. L'entreprise valide son compte-rendu",
    text: "Une fois les tâches effectuées, les internautes envoient un compte-rendu validé par l'entreprise demandeuse.",
  },
  {
    icon: Banknote,
    title: "4. L'internaute cumule et reçoit l'argent",
    text: `Une fois validé, PubAFric crédite les comptes des internautes. L'argent est reversé à partir de ${formatMoney(MIN_PAYOUT_FCFA)} cumulés.`,
  },
];

export default function HowItWorks() {
  return (
    <section id="missions" className="bg-muted-bg px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">
          [ COMMENT ÇA MARCHE ? ]
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl text-2xl font-bold text-[#7c8797] md:text-3xl">
          CONFIER DES MICRO-MISSIONS AUX INTERNAUTES
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-[#7c8797]">
          Vous êtes une entreprise ? Vous avez des micro-tâches ponctuelles effectuables à
          distance ou sur le terrain ? Vous êtes un internaute ? Vous avez du temps et vous
          souhaitez arrondir vos fins de mois ? PubAFric vous met en relation simplement,
          légalement et en toute sécurité...
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="border border-border-soft bg-white p-6 text-left shadow-sm"
            >
              <step.icon size={36} className="text-brand-blue" strokeWidth={1.5} />
              <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-[#2b2f38]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-[#7c8797]">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
