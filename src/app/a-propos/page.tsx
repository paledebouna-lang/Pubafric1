const QUESTIONS = [
  {
    q: "1. Qu'est-ce que PubAFric ?",
    a: "PubAFric est une plateforme qui met en relation des internautes qui souhaitent gagner de l'argent avec des entreprises qui souhaitent faire connaître leurs produits ou services. Les entreprises publient des micro-missions (avis, tests, partages sur les réseaux sociaux, vidéos, etc.) et les internautes les réalisent en échange d'une rémunération réelle.",
  },
  {
    q: "2. Comment gagner de l'argent en tant qu'internaute ?",
    a: "Créez un compte, parcourez les missions disponibles dans la catégorie de votre choix, prenez une mission, réalisez-la dans le délai indiqué puis envoyez votre compte-rendu. Une fois la mission validée par l'entreprise (ou par PubAFric pour ses propres missions), le montant promis est crédité sur votre portefeuille virtuel, moins 10% de frais PubAFric.",
  },
  {
    q: "3. Comment publier une mission en tant qu'entreprise ?",
    a: "Créez un compte entreprise, approvisionnez votre portefeuille de crédits (par dépôt réel confirmé par un administrateur), puis publiez votre mission en précisant la récompense par internaute, le nombre de places recherchées et le délai. Dès qu'un compte-rendu est validé, le montant promis plus 15% de frais PubAFric est débité automatiquement de votre portefeuille.",
  },
  {
    q: "4. Comment fonctionne le portefeuille virtuel ?",
    a: "L'argent qui circule sur PubAFric est une monnaie virtuelle interne à l'application. Les entreprises paient réellement PubAFric (virement, mobile money, chèque) puis un administrateur crédite le montant correspondant sur leur portefeuille virtuel. Côté internaute, un retrait déclenche un versement réel par PubAFric vers le numéro mobile money indiqué, après validation d'un administrateur. Aucune carte bancaire n'est jamais demandée sur l'application.",
  },
  {
    q: "5. Quels sont les frais prélevés par PubAFric ?",
    a: "PubAFric se rémunère de deux façons : 15% sont ajoutés au montant que l'entreprise met en jeu pour chaque mission, et 10% sont retenus sur le gain de l'internaute au moment de la validation. Ces frais financent le fonctionnement, la modération et la sécurité de la plateforme.",
  },
  {
    q: "6. Comment fonctionne le parrainage ?",
    a: "Chaque internaute dispose d'un code et d'un lien de parrainage personnels, disponibles sur sa page de profil. Lorsqu'un filleul inscrit avec ce lien réalise une mission validée, le parrain reçoit automatiquement 5% du gain net de son filleul, en plus du salaire du filleul lui-même — sans aucune limite de durée ni de montant.",
  },
  {
    q: "7. Que se passe-t-il en cas de litige ou de compte suspendu ?",
    a: "Si une entreprise rejette un compte-rendu, l'internaute peut contester la décision : un administrateur PubAFric tranche alors le litige et peut forcer le paiement sur le solde de l'entreprise si le travail a bien été réalisé. Un compte suspendu pour non-respect des règles reste consultable par son propriétaire, qui peut à tout moment demander une révision de son bannissement auprès d'un administrateur.",
  },
];

export default function AProposPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-center text-sm font-bold tracking-widest text-brand-red">
        [ TOUT COMPRENDRE EN UNE MINUTE ]
      </p>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
        PUBAFRIC EN 7 QUESTIONS
      </h1>

      <div className="mt-12 flex flex-col gap-8">
        {QUESTIONS.map((item) => (
          <div key={item.q} className="border-l-4 border-brand-gold pl-5">
            <h2 className="text-sm font-bold text-[#2b2f38]">{item.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
