import type { Metadata } from "next";
import Link from "next/link";
import { Layers, MapPin, Users, Eye, ShieldCheck, Wallet, Smartphone } from "lucide-react";
import { auth } from "@/auth";
import FamilyGrid from "@/components/FamilyGrid";
import MissionExamples from "@/components/MissionExamples";
import LatestMissions from "@/components/LatestMissions";
import { formatMoney } from "@/lib/currency";
import { ENTREPRISE_FEE_PERCENT, entrepriseCost } from "@/lib/fees";

export const metadata: Metadata = {
  title: "Entreprises : confiez vos micro-missions | PubAFric",
  description:
    "Publiez en quelques minutes une micro-mission et laissez la communauté d'internautes PubAFric s'en charger : sondages, avis, photos, visites, réseaux sociaux…",
};

const STEPS = ["Proposez une micro-mission", "La communauté PubAFric s'en charge", "Validez le travail effectué"];

const NEEDS = [
  {
    icon: Layers,
    title: "Vous avez des micro-tâches à effectuer",
    text: "Trop ponctuelles, trop petites pour embaucher ou sous-traiter : une saisie, une recherche, un sondage à faire remplir.",
  },
  {
    icon: MapPin,
    title: "Vous ne pouvez pas être sur le terrain",
    text: "Pas le temps ni le budget de vous déplacer : faites relever des prix, photographier un point de vente ou vérifier un affichage près de chez vos clients.",
  },
  {
    icon: Users,
    title: "Vous avez besoin de vous démultiplier",
    text: "Profitez de la communauté pour gagner en visibilité : partages sur WhatsApp, Facebook, TikTok, distribution de flyers, présence lors d'un évènement.",
  },
  {
    icon: Eye,
    title: "Vous avez besoin d'un regard extérieur",
    text: "Faites tester vos produits, mesurez la satisfaction, recueillez des idées de nom ou de slogan et des témoignages authentiques.",
  },
];

const GUARANTEES = [
  {
    icon: Wallet,
    title: "Vous ne payez que le travail validé",
    text: `Votre portefeuille n'est débité qu'au moment où vous validez un compte-rendu : la récompense promise + ${ENTREPRISE_FEE_PERCENT} % de frais PubAFric.`,
  },
  {
    icon: Smartphone,
    title: "Missions sur mobile, paiement Mobile Money",
    text: "Vos internautes travaillent depuis leur téléphone, partout en Afrique francophone, et sont payés par Mobile Money.",
  },
  {
    icon: ShieldCheck,
    title: "Preuves et arbitrage",
    text: "Chaque mission précise la preuve attendue. PubAFric arbitre les litiges et peut suspendre les comptes frauduleux.",
  },
];

export default async function EntreprisesPage() {
  const session = await auth();
  const role = session?.user?.role;
  const example = 1000;

  return (
    <main className="flex-1">
      {/* En-tête */}
      <section className="relative overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-[#3a2a1f]/95 to-[#1a120c]" />
        <div className="kente-bar absolute bottom-0 left-0 right-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <p className="text-sm font-bold tracking-widest text-brand-gold">[ POUR LES ENTREPRISES ]</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            DÉMULTIPLIEZ VOTRE FORCE DE TRAVAIL
          </h1>
          <ol className="mx-auto mt-10 flex max-w-md flex-col gap-4 text-left">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-4 text-base font-semibold text-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-brand-red">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <Link
            href={role === "ENTREPRISE" ? "/entreprise/missions#creer-mission" : "/inscription"}
            className="mt-12 inline-block bg-brand-gold px-10 py-4 text-sm font-bold tracking-wide text-white shadow transition-colors hover:bg-brand-gold/90"
          >
            + PROPOSER UNE MISSION
          </Link>
        </div>
      </section>

      {/* Familles */}
      <section className="bg-muted-bg px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-bold tracking-widest text-brand-red">[ CE QUE VOUS POUVEZ CONFIER ]</p>
          <h2 className="mt-4 text-center text-2xl font-bold text-brand-blue md:text-3xl">
            9 FAMILLES DE MICRO-MISSIONS
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

      {/* Besoins */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-sm font-bold tracking-widest text-brand-red">[ BESOIN D&apos;UNE SOLUTION CLÉ EN MAIN ? ]</p>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
            CONFIEZ-NOUS VOS MICRO-MISSIONS !
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-[#7c8797]">
            Vous êtes une entreprise, un commerçant, une association ? Vous n&apos;avez pas le temps,
            l&apos;équipe ou les compétences pour accomplir de petites tâches rapidement ?
            Inscrivez-vous, publiez votre micro-mission en quelques minutes et laissez la
            communauté d&apos;internautes PubAFric s&apos;en occuper. Vous validez les comptes-rendus,
            et vous n&apos;êtes débité que du travail accepté.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {NEEDS.map((n) => (
              <div key={n.title} className="flex gap-4">
                <n.icon size={40} className="mt-1 shrink-0 text-brand-coral" strokeWidth={1.5} />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#2b2f38]">{n.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">{n.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combien ça coûte */}
      <section className="bg-muted-bg px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-brand-blue md:text-3xl">COMBIEN ÇA COÛTE ?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#7c8797]">
            Vous fixez vous-même la récompense de chaque internaute. Exemple : une mission à{" "}
            <strong>{formatMoney(example)}</strong> vous coûte <strong>{formatMoney(entrepriseCost(example))}</strong>{" "}
            (récompense + {ENTREPRISE_FEE_PERCENT} % de frais), uniquement si vous validez le travail.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="border border-border-soft bg-white p-6 text-center shadow-sm">
                <g.icon size={32} className="mx-auto text-brand-teal" strokeWidth={1.5} />
                <h3 className="mt-4 text-sm font-bold text-[#2b2f38]">{g.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#7c8797]">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communauté */}
      <section className="bg-brand-blue px-6 py-16 text-center text-white">
        <p className="text-sm font-bold tracking-widest">[ LA COMMUNAUTÉ PUBAFRIC ]</p>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">DÉCOUVREZ TOUS NOS INTERNAUTES</h2>
        <Link
          href="/taskers"
          className="mt-8 inline-block border border-white px-8 py-3 text-sm font-bold tracking-wide transition-colors hover:bg-white hover:text-brand-blue"
        >
          VOIR LES INTERNAUTES
        </Link>
      </section>

      <LatestMissions />
      <MissionExamples />

      {/* Inscription */}
      <section className="bg-muted-bg px-6 py-20 text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red">[ INSCRIVEZ-VOUS ! ]</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-bold text-brand-blue md:text-3xl">
          CONFIEZ VOS MICRO-MISSIONS À NOS INTERNAUTES
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#7c8797]">
          Créez votre compte entreprise gratuitement, rechargez votre portefeuille et publiez votre
          première mission. Des modèles de cahiers des charges sont disponibles pour chaque type de mission.
        </p>
        <Link
          href={role === "ENTREPRISE" ? "/entreprise/missions#creer-mission" : "/inscription"}
          className="mt-8 inline-block bg-brand-red px-10 py-4 text-sm font-bold tracking-wide text-white transition-colors hover:bg-brand-red/90"
        >
          {role === "ENTREPRISE" ? "PUBLIER UNE MISSION" : "CRÉER MON COMPTE ENTREPRISE"}
        </Link>
      </section>
    </main>
  );
}
