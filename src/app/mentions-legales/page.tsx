const SECTIONS = [
  {
    title: "Éditeur du site",
    body: "PubAFric — plateforme de mise en relation entre internautes et entreprises pour la réalisation de micro-missions rémunérées. Pour toute question relative à l'édition du site, contactez-nous à contact@pubafric.com.",
  },
  {
    title: "Directeur de la publication",
    body: "La direction de la publication est assurée par l'équipe fondatrice de PubAFric.",
  },
  {
    title: "Hébergement",
    body: "Le site est hébergé par un prestataire d'hébergement web tiers, garantissant la disponibilité et la sécurité technique de la plateforme.",
  },
  {
    title: "Propriété intellectuelle",
    body: "L'ensemble des éléments composant le site PubAFric (textes, logo, charte graphique, structure) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable est interdite.",
  },
  {
    title: "Données personnelles",
    body: "PubAFric collecte uniquement les données nécessaires au fonctionnement du service : identité, coordonnées de contact, informations de portefeuille et historique des missions. Ces données ne sont ni vendues ni cédées à des tiers à des fins commerciales. Conformément à la réglementation applicable, chaque utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données, exerçable en contactant contact@pubafric.com.",
  },
  {
    title: "Cookies",
    body: "PubAFric utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (maintien de la session de connexion). Aucun cookie publicitaire ou de traçage tiers n'est déposé.",
  },
  {
    title: "Portefeuille virtuel et mouvements financiers",
    body: "Les soldes affichés sur PubAFric constituent une monnaie virtuelle interne à l'application, sans valeur en dehors de celle-ci. Tout mouvement d'argent réel (dépôt d'une entreprise, retrait d'un internaute) est examiné et validé manuellement par un administrateur avant tout crédit ou versement, conformément aux conditions générales d'utilisation.",
  },
  {
    title: "Droit applicable",
    body: "Les présentes mentions légales sont soumises au droit applicable dans le pays d'exploitation de PubAFric.",
  },
];

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-bold tracking-widest text-brand-red">[ INFORMATIONS LÉGALES ]</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">Mentions légales</h1>

      <div className="mt-10 flex flex-col gap-7">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-sm font-bold text-[#2b2f38]">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
