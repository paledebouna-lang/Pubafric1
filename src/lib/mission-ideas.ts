// Catalogue d'idées de missions. Il sert à deux choses :
//  - montrer aux internautes le genre de tâches qu'ils peuvent trouver ;
//  - donner aux entreprises des modèles à reprendre en un clic (le formulaire de création est
//    pré-rempli, elles n'ont plus qu'à ajuster).
// Les récompenses sont des suggestions en FCFA : l'entreprise fixe le montant final.

export type MissionIdea = {
  slug: string;
  title: string;
  category: string; // valeur de MISSION_CATEGORIES
  cover: string; // scène de MissionCover
  kind: "EN_LIGNE" | "TERRAIN";
  summary: string;
  instructions: string[];
  proof: string;
  minutes: number;
  deadlineHours: number;
  suggestedReward: number;
};

export const MISSION_IDEAS: MissionIdea[] = [
  {
    slug: "porter-vetement-publicitaire",
    title: "Porter un vêtement publicitaire",
    category: "EVENEMENT_LOCAL",
    cover: "TSHIRT",
    kind: "TERRAIN",
    summary: "Portez le t-shirt ou la casquette de la marque pendant une sortie et faites-vous photographier.",
    instructions: [
      "Récupérez le vêtement auprès de l'entreprise (ou recevez-le par livraison).",
      "Portez-le lors d'une sortie de plusieurs heures dans un lieu fréquenté.",
      "Prenez 3 photos nettes où le logo est bien visible (dont une avec le lieu en arrière-plan).",
    ],
    proof: "3 photos où le logo est lisible, prises le jour de la mission.",
    minutes: 120,
    deadlineHours: 72,
    suggestedReward: 1500,
  },
  {
    slug: "trouver-idee-de-marque-nom",
    title: "Trouver une idée de marque, de nom",
    category: "DONNER_AVIS",
    cover: "IDEE",
    kind: "EN_LIGNE",
    summary: "Proposez des noms ou des slogans originaux pour un nouveau produit ou une nouvelle boutique.",
    instructions: [
      "Lisez la description du produit ou du projet.",
      "Proposez 5 noms différents, faciles à retenir et à prononcer.",
      "Pour chaque nom, expliquez en une phrase pourquoi il convient.",
    ],
    proof: "Liste de 5 propositions avec une courte justification chacune.",
    minutes: 15,
    deadlineHours: 48,
    suggestedReward: 500,
  },
  {
    slug: "faire-video-endroit",
    title: "Faire une vidéo d'un endroit",
    category: "VIDEO",
    cover: "VIDEO",
    kind: "TERRAIN",
    summary: "Filmez en quelques secondes un lieu précis : boutique, quartier, marché, restaurant…",
    instructions: [
      "Rendez-vous sur place à l'adresse indiquée.",
      "Filmez en mode horizontal, 20 à 30 secondes, sans coupure, en montrant l'entrée et l'ambiance.",
      "Ne filmez pas de visages en gros plan sans accord des personnes.",
    ],
    proof: "La vidéo de 20 à 30 secondes envoyée avec le compte-rendu.",
    minutes: 30,
    deadlineHours: 72,
    suggestedReward: 800,
  },
  {
    slug: "relayer-lancement-reseaux",
    title: "Relayer un lancement sur les réseaux",
    category: "RESEAU_SOCIAL",
    cover: "RESEAU_SOCIAL",
    kind: "EN_LIGNE",
    summary: "Partagez le visuel d'un lancement en statut ou en publication avec la légende fournie.",
    instructions: [
      "Téléchargez le visuel et copiez la légende fournie.",
      "Publiez-les sur votre compte (statut, story ou publication) avec votre code de vérification.",
      "Laissez la publication en ligne pendant la durée indiquée.",
    ],
    proof: "Capture d'écran de la publication avec le code de vérification visible.",
    minutes: 10,
    deadlineHours: 48,
    suggestedReward: 200,
  },
  {
    slug: "donner-avis-produit",
    title: "Tester un produit et donner son avis",
    category: "DONNER_AVIS",
    cover: "DONNER_AVIS",
    kind: "TERRAIN",
    summary: "Essayez un produit puis racontez honnêtement votre expérience : ce qui plaît, ce qui manque.",
    instructions: [
      "Recevez ou achetez le produit selon les consignes de l'entreprise.",
      "Utilisez-le au moins une fois dans des conditions réelles.",
      "Notez-le de 1 à 5 et rédigez un avis d'au moins 5 lignes, sincère et précis.",
    ],
    proof: "Note, avis rédigé et une photo du produit en situation.",
    minutes: 45,
    deadlineHours: 96,
    suggestedReward: 1500,
  },
  {
    slug: "sinscrire-et-tester-un-site",
    title: "S'inscrire et tester un site ou une appli",
    category: "INSCRIPTION_SITE",
    cover: "INSCRIPTION_SITE",
    kind: "EN_LIGNE",
    summary: "Créez un compte de test et signalez ce qui est clair ou compliqué dans le parcours.",
    instructions: [
      "Ouvrez le lien fourni sur votre téléphone.",
      "Créez un compte de test en suivant chaque étape.",
      "Notez tout ce qui vous a bloqué ou surpris, avec des captures d'écran.",
    ],
    proof: "Captures d'écran de l'inscription réussie et liste des problèmes rencontrés.",
    minutes: 15,
    deadlineHours: 48,
    suggestedReward: 400,
  },
  {
    slug: "repondre-sondage-court",
    title: "Répondre à un sondage court",
    category: "REPONDRE_ETUDE",
    cover: "REPONDRE_ETUDE",
    kind: "EN_LIGNE",
    summary: "Quelques questions sur vos habitudes de consommation pour aider une entreprise à mieux vous servir.",
    instructions: [
      "Ouvrez le lien du questionnaire.",
      "Répondez honnêtement à toutes les questions (5 minutes maximum).",
      "Faites une capture de l'écran de confirmation.",
    ],
    proof: "Capture d'écran de la page « Merci » à la fin du questionnaire.",
    minutes: 5,
    deadlineHours: 48,
    suggestedReward: 150,
  },
  {
    slug: "photographier-vitrine-affichage",
    title: "Photographier une vitrine ou un affichage",
    category: "CONTENU_CREATIF",
    cover: "CONTENU_CREATIF",
    kind: "TERRAIN",
    summary: "Vérifiez qu'une affiche ou un produit est bien visible en point de vente, photo à l'appui.",
    instructions: [
      "Rendez-vous au point de vente indiqué.",
      "Photographiez l'affiche ou la vitrine de face, de jour, sans reflet.",
      "Ajoutez une seconde photo de l'enseigne pour prouver le lieu.",
    ],
    proof: "2 photos nettes : l'affichage et l'enseigne du point de vente.",
    minutes: 30,
    deadlineHours: 72,
    suggestedReward: 600,
  },
  {
    slug: "releve-de-prix",
    title: "Relever les prix de produits en magasin",
    category: "TROUVER_LISTE",
    cover: "TROUVER_LISTE",
    kind: "TERRAIN",
    summary: "Notez les prix d'une liste de produits dans un marché ou un supermarché.",
    instructions: [
      "Rendez-vous dans le point de vente indiqué.",
      "Relevez le prix affiché de chaque produit de la liste, avec la marque et le format.",
      "Prenez en photo l'étiquette de prix de 3 produits au hasard.",
    ],
    proof: "Tableau des prix rempli + 3 photos d'étiquettes.",
    minutes: 40,
    deadlineHours: 72,
    suggestedReward: 1000,
  },
  {
    slug: "lister-commerces-quartier",
    title: "Lister les commerces d'un quartier",
    category: "TROUVER_LISTE",
    cover: "EVENEMENT_LOCAL",
    kind: "TERRAIN",
    summary: "Recensez les boutiques, restaurants ou services d'une rue ou d'un quartier.",
    instructions: [
      "Parcourez la zone indiquée à pied.",
      "Notez pour chaque commerce : nom, type d'activité et un repère pour le retrouver.",
      "Envoyez au moins 15 commerces différents.",
    ],
    proof: "Liste d'au moins 15 commerces, avec la zone couverte.",
    minutes: 90,
    deadlineHours: 96,
    suggestedReward: 1500,
  },
  {
    slug: "recommander-un-service",
    title: "Recommander un service à ses proches",
    category: "RECOMMANDER",
    cover: "RECOMMANDER",
    kind: "EN_LIGNE",
    summary: "Parlez d'un service à 3 personnes de votre entourage et partagez leurs retours.",
    instructions: [
      "Présentez le service avec le message fourni à 3 personnes de votre entourage.",
      "Demandez-leur s'il les intéresse et pourquoi.",
      "Résumez leurs réponses en quelques lignes (sans donner de données personnelles).",
    ],
    proof: "Résumé des 3 retours + capture d'écran d'un échange si possible.",
    minutes: 20,
    deadlineHours: 72,
    suggestedReward: 500,
  },
  {
    slug: "relever-un-defi-video",
    title: "Relever un défi vidéo",
    category: "DEFI_CHALLENGE",
    cover: "DEFI_CHALLENGE",
    kind: "EN_LIGNE",
    summary: "Réalisez le défi imaginé par la marque en 15 secondes et publiez-le avec son hashtag.",
    instructions: [
      "Regardez la vidéo d'exemple et lisez les règles du défi.",
      "Filmez votre version en 15 secondes maximum.",
      "Publiez-la avec le hashtag de la marque et votre code de vérification.",
    ],
    proof: "Lien de la publication et capture d'écran avec le code visible.",
    minutes: 30,
    deadlineHours: 72,
    suggestedReward: 1000,
  },
  {
    slug: "distribuer-flyers",
    title: "Distribuer des flyers ou animer un stand",
    category: "EVENEMENT_LOCAL",
    cover: "EVENEMENT_LOCAL",
    kind: "TERRAIN",
    summary: "Faites connaître une offre près de chez vous en distribuant des flyers ou en accueillant du public.",
    instructions: [
      "Récupérez les flyers auprès de l'entreprise.",
      "Distribuez-les dans la zone indiquée, aux heures de passage.",
      "Prenez une photo au début et une à la fin, et indiquez le nombre distribué.",
    ],
    proof: "2 photos (début, fin) et le nombre de flyers distribués.",
    minutes: 120,
    deadlineHours: 96,
    suggestedReward: 2000,
  },
  {
    slug: "ecouter-et-noter-un-titre",
    title: "Écouter et noter un titre ou une appli",
    category: "MUSIQUE_STREAM",
    cover: "MUSIQUE_STREAM",
    kind: "EN_LIGNE",
    summary: "Écoutez un nouveau titre en entier ou explorez une application, puis donnez une note et un commentaire.",
    instructions: [
      "Ouvrez le lien fourni sur votre téléphone.",
      "Écoutez le titre en entier ou utilisez l'application pendant 5 minutes.",
      "Notez de 1 à 5 et laissez un commentaire d'une phrase.",
    ],
    proof: "Capture d'écran de l'écoute ou de la note donnée.",
    minutes: 10,
    deadlineHours: 48,
    suggestedReward: 200,
  },
  {
    slug: "creer-une-affiche",
    title: "Créer une affiche ou un visuel",
    category: "CONTENU_CREATIF",
    cover: "CONTENU_CREATIF",
    kind: "EN_LIGNE",
    summary: "Concevez un visuel simple pour une promotion : affiche, bannière de statut, carte de vœux…",
    instructions: [
      "Lisez le brief : message, couleurs, logo à utiliser.",
      "Créez le visuel avec l'application de votre choix (Canva, PicsArt…).",
      "Envoyez-le en haute qualité, format vertical 1080 × 1920 ou carré 1080 × 1080.",
    ],
    proof: "Le fichier image du visuel envoyé avec le compte-rendu.",
    minutes: 60,
    deadlineHours: 96,
    suggestedReward: 2500,
  },
  {
    slug: "recopier-des-donnees",
    title: "Recopier des données depuis une photo",
    category: "AUTRE",
    cover: "TROUVER_LISTE",
    kind: "EN_LIGNE",
    summary: "Recopiez proprement dans un tableau les informations d'une liste photographiée.",
    instructions: [
      "Ouvrez la photo fournie et agrandissez-la si besoin.",
      "Recopiez chaque ligne dans le tableau demandé, sans faute.",
      "Relisez avant d'envoyer : une erreur peut entraîner le refus.",
    ],
    proof: "Le tableau rempli en texte ou en fichier joint.",
    minutes: 30,
    deadlineHours: 48,
    suggestedReward: 700,
  },
  {
    slug: "client-mystere",
    title: "Faire le client mystère",
    category: "EVENEMENT_LOCAL",
    cover: "DONNER_AVIS",
    kind: "TERRAIN",
    summary: "Visitez un commerce comme un client normal et évaluez l'accueil, la propreté et la rapidité.",
    instructions: [
      "Rendez-vous dans le commerce indiqué sans annoncer la mission.",
      "Achetez ou demandez le produit prévu par le scénario.",
      "Remplissez la grille d'évaluation dans l'heure qui suit votre visite.",
    ],
    proof: "Grille d'évaluation remplie et photo du ticket ou de la devanture.",
    minutes: 45,
    deadlineHours: 72,
    suggestedReward: 2000,
  },
];

export function getIdea(slug: string): MissionIdea | undefined {
  return MISSION_IDEAS.find((i) => i.slug === slug);
}

// Texte d'instructions numérotées, tel que stocké sur une mission.
export function ideaInstructionsText(idea: MissionIdea): string {
  return idea.instructions.map((line, i) => `${i + 1}. ${line}`).join("\n");
}
