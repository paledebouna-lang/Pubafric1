import type { Metadata } from "next";
import Link from "next/link";
import { getLegal, LEGAL_LAST_UPDATE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales | PubAFric",
};

export default function MentionsLegalesPage() {
  const legal = getLegal();

  const identity: [string, string][] = [
    ["Dénomination", legal.name],
    ...(legal.form ? ([["Forme juridique", legal.form]] as [string, string][]) : []),
    ...(legal.capital ? ([["Capital", legal.capital]] as [string, string][]) : []),
    ...(legal.registration ? ([["RCCM", legal.registration]] as [string, string][]) : []),
    ...(legal.taxId ? ([["N° de compte contribuable", legal.taxId]] as [string, string][]) : []),
    ...(legal.address ? ([["Adresse", legal.address]] as [string, string][]) : []),
    ["Email", legal.email],
    ...(legal.phone ? ([["Téléphone", legal.phone]] as [string, string][]) : []),
  ];

  const sections = [
    {
      title: "Directeur de la publication",
      body: legal.director
        ? `${legal.director}.`
        : "La direction de la publication est assurée par le représentant légal de l'éditeur.",
    },
    {
      title: "Hébergement",
      body: "Le site et ses bases de données sont hébergés par des prestataires techniques tiers (notamment Vercel Inc., États-Unis). Ils garantissent la disponibilité et la sécurité de la plateforme ; leurs serveurs peuvent être situés hors de Côte d'Ivoire.",
    },
    {
      title: "Propriété intellectuelle",
      body: "L'ensemble des éléments du site PubAFric (marque, logo, textes, illustrations, charte graphique, structure, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable est interdite.",
    },
    {
      title: "Données personnelles",
      body: `PubAFric ne collecte que les données nécessaires au fonctionnement du service et ne les vend pas. Conformément à la législation ivoirienne sur la protection des données à caractère personnel (loi n° 2013-450 du 19 juin 2013), chaque utilisateur dispose d'un droit d'accès, de rectification, d'opposition et de suppression, exerçable en écrivant à ${legal.email}. Le détail figure à l'article 9 des conditions générales.`,
    },
    {
      title: "Cookies",
      body: "PubAFric utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (maintien de la session de connexion). Aucun cookie publicitaire ou de traçage tiers n'est déposé.",
    },
    {
      title: "Portefeuille virtuel et mouvements financiers",
      body: "Les soldes affichés sur PubAFric sont un solde virtuel interne à l'application, en FCFA. Tout mouvement d'argent réel (dépôt d'une entreprise, retrait d'un internaute par Mobile Money) est examiné et validé manuellement par un administrateur avant tout crédit ou versement, conformément aux conditions générales.",
    },
    {
      title: "Droit applicable",
      body: "Les présentes mentions légales sont soumises au droit ivoirien. Tout litige relève des juridictions compétentes d'Abidjan (Côte d'Ivoire), sous réserve des règles impératives applicables.",
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-bold tracking-widest text-brand-red">[ INFORMATIONS LÉGALES ]</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">Mentions légales</h1>
      <p className="mt-2 text-xs text-[#9aa2b1]">Dernière mise à jour : {LEGAL_LAST_UPDATE}</p>

      <section className="mt-10">
        <h2 className="text-sm font-bold text-[#2b2f38]">Éditeur du site</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">
          PubAFric est une plateforme de mise en relation entre internautes et entreprises pour la
          réalisation de micro-missions rémunérées.
        </p>
        <dl className="mt-3 divide-y divide-border-soft border border-border-soft bg-white text-sm">
          {identity.map(([k, v]) => (
            <div key={k} className="flex gap-4 px-4 py-2">
              <dt className="w-48 shrink-0 font-semibold text-[#2b2f38]">{k}</dt>
              <dd className="text-[#4a5262]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-8 flex flex-col gap-7">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-sm font-bold text-[#2b2f38]">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-[#7c8797]">
        Voir aussi les{" "}
        <Link href="/cgu" className="font-semibold text-brand-blue underline">
          conditions générales d&apos;utilisation et de vente
        </Link>
        .
      </p>
    </main>
  );
}
