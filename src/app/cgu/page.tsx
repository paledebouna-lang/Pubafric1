const SECTIONS = [
  {
    title: "1. Objet",
    body: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme PubAFric, qui met en relation des internautes souhaitant réaliser des micro-missions rémunérées avec des entreprises souhaitant les publier. Toute inscription sur PubAFric implique l'acceptation pleine et entière des présentes CGU.",
  },
  {
    title: "2. Définitions",
    body: "« Internaute » désigne tout utilisateur inscrit pour réaliser des missions. « Entreprise » désigne tout utilisateur inscrit pour publier des missions. « Mission » désigne une tâche publiée par une entreprise et rémunérée à l'internaute qui la réalise. « Portefeuille » désigne le solde virtuel de crédits associé à chaque compte. « Administrateur » désigne un membre habilité de l'équipe PubAFric.",
  },
  {
    title: "3. Inscription et compte",
    body: "L'inscription nécessite un nom, une adresse email ou un numéro de téléphone, ainsi qu'un mot de passe. Chaque numéro de téléphone et chaque adresse email ne peut être associé qu'à un seul compte. Un code de confirmation est envoyé lors de l'inscription ; le compte n'est considéré comme pleinement validé qu'après vérification de ce code. L'utilisateur s'engage à fournir des informations exactes et à les maintenir à jour.",
  },
  {
    title: "4. Fonctionnement des missions",
    body: "Une entreprise publie une mission en précisant son objet, la récompense par internaute, le nombre de places disponibles et le délai de réalisation. Un internaute ne peut prendre une même mission qu'une seule fois. Une fois la mission prise, l'internaute dispose du délai indiqué pour envoyer son compte-rendu ; passé ce délai, la mission expire automatiquement et la place est libérée. L'entreprise (ou PubAFric pour ses missions propres) examine le compte-rendu et le valide ou le rejette.",
  },
  {
    title: "5. Rémunération et frais PubAFric",
    body: "Lors de la validation d'une mission, PubAFric prélève 15% du montant mis en jeu par l'entreprise (débité de son portefeuille en plus de la récompense promise) et 10% du gain crédité à l'internaute. Ces frais sont automatiquement calculés et appliqués à chaque transaction ; ils ne sont ni négociables ni remboursables une fois la mission validée.",
  },
  {
    title: "6. Portefeuille virtuel et mouvements réels d'argent",
    body: "Les soldes affichés sur PubAFric sont une monnaie virtuelle interne à l'application, sans valeur en dehors de celle-ci. Les entreprises alimentent leur portefeuille en effectuant un paiement réel (virement, mobile money, chèque) dont la réception est confirmée par un administrateur avant crédit du compte. Les internautes demandent le retrait de leur solde vers un numéro mobile money ; le versement réel est effectué par PubAFric après validation d'un administrateur. PubAFric ne demande jamais de coordonnées bancaires complètes ni de mot de passe de service tiers sur la plateforme.",
  },
  {
    title: "7. Programme de parrainage",
    body: "Chaque internaute dispose d'un code de parrainage unique. Lorsqu'un compte créé via ce code (le « filleul ») obtient la validation d'une mission, le parrain reçoit automatiquement une commission égale à 5% du gain net du filleul, prélevée sur le solde de PubAFric et non sur celui du filleul.",
  },
  {
    title: "8. Litiges",
    body: "En cas de rejet d'un compte-rendu qu'il estime injustifié, l'internaute peut contester la décision. Un administrateur PubAFric examine alors le litige et rend une décision définitive, pouvant inclure le paiement forcé de la mission sur le solde de l'entreprise si celle-ci refuse de s'exécuter après jugement.",
  },
  {
    title: "9. Suspension et bannissement",
    body: "PubAFric se réserve le droit de suspendre un compte en cas de non-respect des présentes CGU, de fraude ou de comportement abusif. Un compte suspendu reste accessible en lecture mais ne peut plus effectuer d'action (prise de mission, publication, retrait, etc.). Le titulaire d'un compte suspendu peut à tout moment déposer une demande de révision auprès d'un administrateur.",
  },
  {
    title: "10. Responsabilité",
    body: "PubAFric agit en tant qu'intermédiaire technique entre internautes et entreprises. PubAFric ne garantit pas la validation d'une mission et ne saurait être tenu responsable du contenu des missions publiées par les entreprises, sous réserve du mécanisme de litige décrit à l'article 8.",
  },
  {
    title: "11. Modification des CGU",
    body: "PubAFric peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle ; la poursuite de l'utilisation de la plateforme après modification vaut acceptation des nouvelles CGU.",
  },
  {
    title: "12. Droit applicable",
    body: "Les présentes CGU sont soumises au droit applicable dans le pays d'exploitation de PubAFric. Tout litige relatif à leur interprétation ou leur exécution relève des juridictions compétentes.",
  },
];

export default function CguPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-bold tracking-widest text-brand-red">[ MENTIONS CONTRACTUELLES ]</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="mt-2 text-xs text-[#9aa2b1]">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

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
