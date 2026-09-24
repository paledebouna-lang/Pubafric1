import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Wallet, Users, Smartphone } from "lucide-react";
import { auth } from "@/auth";
import FamilyGrid from "@/components/FamilyGrid";
import MissionExamples from "@/components/MissionExamples";
import LatestMissions from "@/components/LatestMissions";
import { formatMoney } from "@/lib/currency";
import { INTERNAUTE_FEE_PERCENT, internauteNet } from "@/lib/fees";
import { REFERRAL_COMMISSION_PERCENT } from "@/lib/referral";
import { MAX_CONCURRENT_CLAIMS, MIN_PAYOUT_FCFA } from "@/lib/rules";
import { spaceHref } from "@/lib/space";

export const metadata: Metadata = {
  title: "Internautes : arrondissez vos fins de mois | PubAFric",
  description:
    "Choisissez une micro-mission, accomplissez-la depuis votre téléphone et recevez votre argent par Mobile Money. Inscription gratuite.",
};

const STEPS = ["Choisissez l'une des missions proposées", "Accomplissez la tâche", "Recevez de l'argent !"];

const POINTS = [
  {
    icon: Smartphone,
    title: "Un téléphone suffit",
    text: "Pas besoin d'ordinateur ni de diplôme : les missions se font depuis votre téléphone, en ligne ou près de chez vous.",
  },
  {
    icon: Clock,
    title: "Vous choisissez votre rythme",
    text: `Aucune obligation de connexion. Vous pouvez avoir ${MAX_CONCURRENT_CLAIMS} missions en cours à la fois et faites-les quand vous avez un moment.`,
  },
  {
    icon: Wallet,
    title: "Payé par Mobile Money",
    text: `Dès que votre solde atteint ${formatMoney(MIN_PAYOUT_FCFA)}, demandez votre retrait sur Orange Money, MTN MoMo, Wave ou Moov Money.`,
  },
  {
    icon: Users,
    title: "Parrainez, gagnez plus",
    text: `Invitez vos amis avec votre lien personnel : vous gagnez ${REFERRAL_COMMISSION_PERCENT} % de leurs gains, sans limite de durée.`,
  },
];

export default async function InternautesPage() {
  const session = await auth();
  const user = session?.user;
  const example = 1000;

  return (
    <main className="flex-1">
      {/* En-tête */}
      <section className="relative overflow-hidden bg-brand-blue-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-dark via-brand-blue to-[#223a63]" />
        <div className="kente-bar absolute bottom-0 left-0 right-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <p className="text-sm font-bold tracking-widest text-brand-gold">[ POUR LES INTERNAUTES ]</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            ARRONDISSEZ VOS FINS DE MOIS !
          </h1>
          <ol className="mx-auto mt-10 flex max-w-md flex-col gap-4 text-left">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-4 text-base font-semibold text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-brand-blue">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Link
            href={user ? spaceHref(user.role) : "/inscription"}
            className="mt-12 inline-block bg-brand-gold px-10 py-4 text-sm font-bold tracking-wide text-white shadow transition-colors hover:bg-brand-gold/90"
          >
            {user ? "MES MISSIONS" : "+ DEVENIR INTERNAUTE"}
          </Link>
        </div>
      </section>

      {/* Familles */}
      <section className="bg-muted-bg px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-bold tracking-widest text-brand-red">[ CE QUE VOUS POUVEZ FAIRE ]</p>
          <h2 className="mt-4 text-center text-2xl font-bold text-brand-blue md:text-3xl">
            DES MISSIONS POUR TOUS LES GOÛTS
          </h2>
          <div className="mt-10">
            <FamilyGrid />
          </div>
          <p className="mt-6 text-center">
            <Link href="/types-de-missions" className="text-sm font-bold text-brand-blue hover:underline">
              Voir tous les types de missions →
            </Link>
          </p>
        </div>
      </section>

      {/* Missions disponibles */}
      <LatestMissions />

      {/* Atouts */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-bold tracking-widest text-brand-red">[ INSCRIVEZ-VOUS ! ]</p>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
            GAGNEZ DE L&apos;ARGENT FACILEMENT ET EN TOUTE CONFIANCE
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-[#7c8797]">
            Vous avez besoin d&apos;arrondir vos fins de mois ? Vous avez du temps et un téléphone ?
            Rejoignez la communauté des internautes PubAFric et effectuez vos premières missions.
            Dès qu&apos;une mission est terminée, vous envoyez votre compte-rendu (ou vos réponses
            au quiz). Une fois validé, vous êtes crédité, puis payé par Mobile Money.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-4">
                <p.icon size={40} className="mt-1 shrink-0 text-brand-teal" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#2b2f38]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">{p.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl bg-muted-bg p-5 text-center text-sm text-[#4a5262]">
            Exemple : une mission affichée <strong>{formatMoney(example)}</strong> vous rapporte{" "}
            <strong>{formatMoney(internauteNet(example))}</strong> ({INTERNAUTE_FEE_PERCENT} % de frais PubAFric
            retenus). Le détail est expliqué sur la page{" "}
            <Link href="/comment-ca-marche" className="font-semibold text-brand-blue underline">
              Comment ça marche
            </Link>
            .
          </p>
        </div>
      </section>

      <MissionExamples />

      <section className="bg-muted-bg px-6 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-2xl font-bold text-brand-blue md:text-3xl">
          PRÊT À COMMENCER ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-[#7c8797]">
          L&apos;inscription est gratuite. Vous pouvez aussi vous inscrire avec votre compte Google.
        </p>
        <Link
          href={user ? spaceHref(user.role) : "/inscription"}
          className="mt-8 inline-block bg-brand-teal px-10 py-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-teal/90"
        >
          {user ? "MES MISSIONS" : "CRÉER MON COMPTE INTERNAUTE"}
        </Link>
      </section>
    </main>
  );
}
