// Catalogue des modèles de missions PubAfric, classés par famille.
// Il sert à trois choses :
//  - montrer aux internautes le genre de tâches qu'ils peuvent trouver ;
//  - donner aux entreprises un cahier des charges prêt à reprendre en un clic (le formulaire
//    de création est pré-rempli, elles n'ont plus qu'à ajuster) ;
//  - alimenter la page « Types de missions ».
// Les récompenses sont des suggestions en FCFA : l'entreprise fixe le montant final.

export type MissionIdea = {
  slug: string;
  family: string; // id d'une famille de mission-families.ts
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
  // Mode d'exécution conseillé sur la plateforme (par défaut : compte-rendu avec preuves)
  execution?: "QUIZ" | "SONDAGE";
};

type Row = [
  slug: string,
  title: string,
  category: string,
  cover: string,
  kind: "EN_LIGNE" | "TERRAIN",
  summary: string,
  instructions: string[],
  proof: string,
  minutes: number,
  deadlineHours: number,
  suggestedReward: number,
];

function family(id: string, rows: Row[]): MissionIdea[] {
  return rows.map(
    ([slug, title, category, cover, kind, summary, instructions, proof, minutes, deadlineHours, suggestedReward]) => ({
      slug,
      family: id,
      title,
      category,
      cover,
      kind,
      summary,
      instructions,
      proof,
      minutes,
      deadlineHours,
      suggestedReward,
    })
  );
}

// Modèles qui se réalisent directement sur PubAfric.
const EXECUTION_BY_SLUG: Record<string, "QUIZ" | "SONDAGE"> = {
  "repondre-sondage-court": "SONDAGE",
  "repondre-a-une-etude": "SONDAGE",
  "regarder-une-pub-et-donner-son-avis": "QUIZ",
  "trouver-idee-de-marque-nom": "SONDAGE",
  "trouver-idee-de-slogan": "SONDAGE",
  "trouver-idee-de-nom-de-marque": "SONDAGE",
};

const ALL_IDEAS: MissionIdea[] = [
  // ---------------------------------------------------------------- Saisie de données
  ...family("saisie", [
    ["recopier-des-donnees", "Saisir des données depuis une photo", "AUTRE", "TROUVER_LISTE", "EN_LIGNE",
      "Recopiez proprement dans un tableau les informations d'une liste photographiée.",
      ["Ouvrez la photo fournie et agrandissez-la si besoin.", "Recopiez chaque ligne dans le tableau demandé, sans faute.", "Relisez avant d'envoyer : une erreur peut entraîner le refus."],
      "Le tableau rempli, en texte ou en fichier joint.", 30, 48, 700],
    ["repondre-a-une-question", "Répondre à une question précise", "TROUVER_LISTE", "TROUVER_LISTE", "EN_LIGNE",
      "Faites une petite recherche pour répondre à une question posée par l'entreprise, sources à l'appui.",
      ["Lisez la question et les précisions données.", "Cherchez la réponse sur des sites fiables (pas de copier-coller d'un seul site).", "Rédigez une réponse claire de 3 à 5 lignes et indiquez vos sources."],
      "La réponse rédigée et les adresses des pages consultées.", 15, 48, 300],
    ["trouver-une-promo-un-concours", "Trouver une promo ou un concours", "TROUVER_LISTE", "TROUVER_LISTE", "EN_LIGNE",
      "Repérez les promotions ou jeux concours en cours pour un produit ou une marque donnée.",
      ["Recherchez sur les sites, réseaux sociaux et publicités de la marque.", "Notez pour chaque offre : intitulé, dates, conditions.", "Envoyez au moins 3 offres réelles avec le lien ou une capture."],
      "Liste des offres avec dates, conditions et lien ou capture d'écran.", 25, 48, 500],
    ["reformater-un-document", "Reformater un document", "AUTRE", "TROUVER_LISTE", "EN_LIGNE",
      "Remettez en forme un texte brut : titres, listes, espaces et ponctuation.",
      ["Ouvrez le document fourni.", "Appliquez le format demandé (titres, puces, police, paragraphes).", "Relisez et envoyez le document mis en forme."],
      "Le document reformaté envoyé en pièce jointe ou collé dans le compte-rendu.", 30, 48, 800],
    ["reecrire-un-texte", "Réécrire un texte", "CONTENU_CREATIF", "CONTENU_CREATIF", "EN_LIGNE",
      "Reformulez un texte avec vos mots, sans changer le sens, dans un ton adapté.",
      ["Lisez le texte d'origine et le ton demandé (simple, commercial, chaleureux…).", "Réécrivez-le entièrement avec vos propres mots.", "Vérifiez l'orthographe et respectez le nombre de mots demandé."],
      "Le texte réécrit dans le compte-rendu.", 30, 48, 800],
    ["lister-commerces-quartier", "Trouver une liste de… (commerces d'un quartier)", "TROUVER_LISTE", "EVENEMENT_LOCAL", "TERRAIN",
      "Recensez les boutiques, restaurants ou services d'une rue ou d'un quartier.",
      ["Parcourez la zone indiquée à pied.", "Notez pour chaque commerce : nom, type d'activité et un repère pour le retrouver.", "Envoyez au moins 15 commerces différents."],
      "Liste d'au moins 15 commerces, avec la zone couverte.", 90, 96, 1500],
    ["corriger-moderer-une-page", "Corriger ou modérer une page web", "TROUVER_LISTE", "TROUVER_LISTE", "EN_LIGNE",
      "Relisez une page ou des commentaires et signalez les fautes ou contenus inappropriés.",
      ["Ouvrez la page ou le fichier indiqué.", "Notez chaque faute ou chaque commentaire problématique avec sa position.", "Proposez la correction ou la décision (garder, masquer, signaler)."],
      "La liste des corrections ou décisions, avec captures si nécessaire.", 30, 48, 600],
    ["ecrire-un-texte-court", "Écrire un texte court", "CONTENU_CREATIF", "CONTENU_CREATIF", "EN_LIGNE",
      "Rédigez une courte description de produit, une légende ou une annonce de 50 à 100 mots.",
      ["Lisez le brief : produit, public visé, ton.", "Rédigez le texte demandé, original et sans faute.", "Respectez le nombre de mots indiqué."],
      "Le texte rédigé dans le compte-rendu.", 25, 48, 700],
  ]),

  // ---------------------------------------------------------------- Études et sondages
  ...family("etudes", [
    ["repondre-sondage-court", "Répondre à un sondage", "REPONDRE_ETUDE", "REPONDRE_ETUDE", "EN_LIGNE",
      "Quelques questions rapides sur vos habitudes de consommation.",
      ["Ouvrez le questionnaire (sur PubAfric ou via le lien fourni).", "Répondez honnêtement à toutes les questions (5 minutes maximum).", "Faites une capture de l'écran de confirmation si le sondage est externe."],
      "Réponses enregistrées sur PubAfric ou capture de la page de confirmation.", 5, 48, 150],
    ["repondre-a-une-etude", "Répondre à une étude", "REPONDRE_ETUDE", "REPONDRE_ETUDE", "EN_LIGNE",
      "Une étude plus détaillée, avec des questions ouvertes, pour comprendre un besoin ou un usage.",
      ["Lisez la présentation de l'étude.", "Répondez précisément, en une ou deux phrases pour les questions ouvertes.", "Relisez vos réponses avant d'envoyer."],
      "Réponses complètes enregistrées sur PubAfric.", 15, 72, 500],
    ["remplir-un-formulaire", "Remplir un formulaire", "REPONDRE_ETUDE", "REPONDRE_ETUDE", "EN_LIGNE",
      "Complétez un formulaire en ligne avec des informations réelles et vérifiables.",
      ["Ouvrez le formulaire fourni.", "Remplissez tous les champs demandés avec des informations exactes.", "Ne saisissez jamais de code secret ni de mot de passe : ils ne sont jamais demandés."],
      "Capture de la page de confirmation d'envoi.", 10, 48, 250],
    ["avis-sur-un-site-web", "Donner son avis sur un site web", "DONNER_AVIS", "DONNER_AVIS", "EN_LIGNE",
      "Parcourez un site et dites ce qui est clair, beau, utile ou confus.",
      ["Ouvrez le site sur votre téléphone et visitez au moins 3 pages.", "Notez le site de 1 à 5 et rédigez un avis d'au moins 5 lignes.", "Signalez un point à améliorer en priorité."],
      "Note, avis rédigé et 2 captures d'écran des pages visitées.", 15, 48, 400],
    ["trouver-idee-de-marque-nom", "Donner son avis sur un nom, une marque", "DONNER_AVIS", "IDEE", "EN_LIGNE",
      "Dites ce que vous inspire un nom de marque ou un logo : facile à retenir ? à prononcer ? crédible ?",
      ["Regardez le nom ou le logo présenté.", "Notez-le de 1 à 5 sur la mémorisation, la prononciation et la confiance.", "Proposez une amélioration en une phrase."],
      "Grille de notes et suggestion d'amélioration.", 10, 48, 250],
    ["regarder-une-pub-et-donner-son-avis", "Regarder une publicité et donner son avis", "DONNER_AVIS", "VIDEO", "EN_LIGNE",
      "Regardez une publicité en entier, puis répondez à un quiz : chaque bonne réponse remplit la jauge, à 100 % la mission est payée.",
      ["Lancez la vidéo et regardez-la jusqu'au bout, sans avancer.", "Répondez aux questions du quiz.", "Si la jauge n'est pas à 100 %, revoyez la vidéo et reprenez vos réponses (3 essais)."],
      "Quiz réussi à 100 % sur PubAfric (aucune preuve à envoyer).", 5, 48, 200],
  ]),

  // ---------------------------------------------------------------- Réseaux sociaux
  ...family("reseaux", [
    ["relayer-lancement-reseaux", "Partager une publication sur Facebook ou WhatsApp", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Partagez le visuel d'un lancement en publication ou en statut avec la légende fournie.",
      ["Téléchargez le visuel et copiez la légende fournie.", "Publiez-les sur votre compte avec votre code de vérification.", "Laissez la publication en ligne pendant la durée indiquée."],
      "Capture d'écran de la publication avec le code de vérification visible.", 10, 48, 200],
    ["relayer-un-message-sur-x", "Relayer un message sur X (Twitter)", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Republiez ou citez un message officiel de la marque avec le hashtag indiqué.",
      ["Ouvrez le message indiqué.", "Republiez-le ou citez-le avec le hashtag demandé.", "Gardez la publication en ligne 48 heures."],
      "Lien de la publication et capture d'écran avec le code de vérification.", 5, 48, 150],
    ["partager-sur-linkedin", "Partager une publication sur LinkedIn", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Partagez une publication professionnelle avec un commentaire personnel.",
      ["Ouvrez la publication indiquée.", "Partagez-la avec un commentaire d'au moins une phrase.", "Envoyez une capture d'écran de votre partage."],
      "Capture d'écran du partage publié.", 10, 48, 300],
    ["recommander-un-service", "Recommander un site, un produit, un service", "RECOMMANDER", "RECOMMANDER", "EN_LIGNE",
      "Parlez d'un service à 3 personnes de votre entourage et partagez leurs retours.",
      ["Présentez le service avec le message fourni à 3 proches.", "Demandez-leur s'il les intéresse et pourquoi.", "Résumez leurs réponses en quelques lignes, sans donner de données personnelles."],
      "Résumé des 3 retours et, si possible, capture d'un échange.", 20, 72, 500],
    ["trouver-des-amis-a-partager", "Trouver des amis prêts à partager", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Motivez 3 amis à relayer à leur tour une publication de la marque.",
      ["Envoyez la publication à 3 amis avec le message fourni.", "Obtenez leur accord de la relayer.", "Envoyez la capture de leurs partages ou de leur accord."],
      "Captures des 3 partages ou des accords des amis.", 20, 72, 600],
    ["parrainer-un-ami", "Parrainer un ami", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Invitez un ami à s'inscrire sur le site ou l'application de la marque grâce à votre lien personnel.",
      ["Envoyez votre lien à un ami que l'offre peut intéresser.", "Aidez-le à créer son compte sur le site ou l'application de la marque.", "Envoyez la capture de son inscription confirmée (avec son accord)."],
      "Capture de l'inscription confirmée de l'ami parrainé.", 15, 96, 400],
    ["voter-pour-un-site", "Voter pour un site, un service, un produit", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Votez pour un candidat à un concours ou un classement en ligne.",
      ["Ouvrez la page de vote indiquée.", "Votez pour le candidat demandé, une seule fois.", "Envoyez une capture de la confirmation du vote."],
      "Capture d'écran de la confirmation du vote.", 5, 48, 100],
    ["suivre-sur-un-reseau-social", "Suivre une page ou une chaîne", "RESEAU_SOCIAL", "RESEAU_SOCIAL", "EN_LIGNE",
      "Abonnez-vous à la page, à la chaîne WhatsApp ou au compte d'une marque.",
      ["Ouvrez le lien fourni.", "Cliquez sur « Suivre » ou « S'abonner ».", "Envoyez une capture montrant que vous suivez la page."],
      "Capture d'écran montrant l'abonnement.", 3, 48, 100],
  ]),

  // ---------------------------------------------------------------- Visites et déplacements
  ...family("visites", [
    ["releve-de-prix", "Faire un relevé de prix en magasin", "TROUVER_LISTE", "TROUVER_LISTE", "TERRAIN",
      "Notez les prix d'une liste de produits dans un marché ou un supermarché.",
      ["Rendez-vous dans le point de vente indiqué.", "Relevez le prix affiché de chaque produit de la liste, avec la marque et le format.", "Prenez en photo l'étiquette de prix de 3 produits au hasard."],
      "Tableau des prix rempli et 3 photos d'étiquettes.", 40, 72, 1000],
    ["client-mystere", "Faire le client mystère", "EVENEMENT_LOCAL", "DONNER_AVIS", "TERRAIN",
      "Visitez un commerce comme un client normal et évaluez l'accueil, la propreté et la rapidité.",
      ["Rendez-vous dans le commerce indiqué sans annoncer la mission.", "Achetez ou demandez le produit prévu par le scénario.", "Remplissez la grille d'évaluation dans l'heure qui suit votre visite."],
      "Grille d'évaluation remplie et photo du ticket ou de la devanture.", 45, 72, 2000],
    ["verifier-agencement-plv", "Vérifier un agencement, une PLV", "CONTENU_CREATIF", "CONTENU_CREATIF", "TERRAIN",
      "Contrôlez qu'une affiche, un présentoir ou un produit est bien visible en point de vente.",
      ["Rendez-vous au point de vente indiqué.", "Photographiez l'affiche ou le présentoir de face, de jour, sans reflet.", "Ajoutez une photo de l'enseigne pour prouver le lieu."],
      "2 photos nettes : l'affichage et l'enseigne du point de vente.", 30, 72, 600],
    ["devenir-client-gratuitement", "Devenir client gratuitement", "EVENEMENT_LOCAL", "DONNER_AVIS", "TERRAIN",
      "Profitez d'une offre de découverte offerte par un commerce partenaire et racontez l'expérience.",
      ["Présentez-vous avec le code ou le bon fourni par l'entreprise.", "Profitez du produit ou du service offert.", "Racontez votre expérience en 5 lignes avec une photo."],
      "Compte-rendu de l'expérience et photo (bon, ticket ou lieu).", 60, 96, 1500],
  ]),

  // ---------------------------------------------------------------- Créativité
  ...family("creativite", [
    ["trouver-idee-de-slogan", "Trouver une idée de slogan", "CONTENU_CREATIF", "IDEE", "EN_LIGNE",
      "Proposez des slogans courts et accrocheurs pour une marque ou une campagne.",
      ["Lisez la présentation de la marque.", "Proposez 5 slogans de moins de 8 mots.", "Expliquez en une phrase votre préféré."],
      "Liste de 5 slogans et explication du préféré.", 15, 48, 500],
    ["trouver-idee-de-nom-de-marque", "Trouver une idée de marque, de nom", "CONTENU_CREATIF", "IDEE", "EN_LIGNE",
      "Proposez des noms originaux, faciles à retenir et à prononcer, pour un nouveau produit ou une boutique.",
      ["Lisez la description du produit ou du projet.", "Proposez 5 noms différents, sans copier de marques existantes.", "Pour chaque nom, expliquez en une phrase pourquoi il convient."],
      "Liste de 5 propositions avec une courte justification chacune.", 20, 48, 500],
    ["trouver-une-idee-de-buzz", "Trouver une idée de buzz", "CONTENU_CREATIF", "IDEE", "EN_LIGNE",
      "Imaginez une action ou un défi qui fera parler d'une marque sur les réseaux.",
      ["Lisez la présentation de la marque et de sa cible.", "Décrivez votre idée de buzz en 8 lignes : principe, déroulé, hashtag.", "Précisez pourquoi elle donnera envie de partager."],
      "Description de l'idée de buzz avec le hashtag proposé.", 25, 72, 800],
    ["trouver-une-idee-de-produit", "Trouver une idée de produit ou de service", "CONTENU_CREATIF", "IDEE", "EN_LIGNE",
      "Proposez un produit ou service qui répond à un besoin réel de votre quartier ou de votre ville.",
      ["Identifiez un problème concret que vous rencontrez au quotidien.", "Décrivez le produit ou service qui le résoudrait, et pour qui.", "Estimez combien vous seriez prêt à payer."],
      "Fiche d'idée : problème, solution, cible, prix imaginé.", 25, 72, 800],
    ["creer-une-affiche", "Créer une affiche ou un visuel", "CONTENU_CREATIF", "CONTENU_CREATIF", "EN_LIGNE",
      "Concevez un visuel simple pour une promotion : affiche, bannière de statut, carte de vœux…",
      ["Lisez le brief : message, couleurs, logo à utiliser.", "Créez le visuel avec l'application de votre choix (Canva, PicsArt…).", "Envoyez-le en haute qualité, format vertical 1080 × 1920 ou carré 1080 × 1080."],
      "Le fichier image du visuel envoyé avec le compte-rendu.", 60, 96, 2500],
  ]),

  // ---------------------------------------------------------------- Buzz
  ...family("buzz", [
    ["porter-vetement-publicitaire", "Porter un vêtement publicitaire", "EVENEMENT_LOCAL", "TSHIRT", "TERRAIN",
      "Portez le t-shirt ou la casquette de la marque pendant une sortie et faites-vous photographier.",
      ["Récupérez le vêtement auprès de l'entreprise ou du point relais.", "Portez-le lors d'une sortie de plusieurs heures dans un lieu fréquenté.", "Prenez 3 photos nettes où le logo est bien visible."],
      "3 photos où le logo est lisible, prises le jour de la mission.", 120, 72, 1500],
    ["faire-acte-de-presence", "Faire acte de présence quelque part", "EVENEMENT_LOCAL", "EVENEMENT_LOCAL", "TERRAIN",
      "Soyez présent à un lieu ou un évènement pour créer de l'affluence et prouvez votre passage.",
      ["Rendez-vous à l'adresse indiquée à l'heure demandée.", "Restez au moins 30 minutes.", "Prenez une photo de l'entrée avec l'heure visible."],
      "Photo de l'entrée du lieu avec l'heure visible.", 45, 72, 1200],
    ["telecharger-une-application", "Télécharger une application", "INSCRIPTION_SITE", "INSCRIPTION_SITE", "EN_LIGNE",
      "Installez une application mobile et ouvrez-la pour valider l'installation.",
      ["Ouvrez le lien de téléchargement fourni.", "Installez l'application et ouvrez-la une première fois.", "Envoyez une capture de l'écran d'accueil de l'application."],
      "Capture d'écran de l'application installée et ouverte.", 10, 48, 300],
    ["s-inscrire-sur-un-site", "S'inscrire sur un site", "INSCRIPTION_SITE", "INSCRIPTION_SITE", "EN_LIGNE",
      "Créez un compte de test et signalez ce qui est clair ou compliqué dans le parcours.",
      ["Ouvrez le lien fourni sur votre téléphone.", "Créez un compte en suivant chaque étape (sans jamais donner de mot de passe de service tiers).", "Notez ce qui vous a bloqué ou surpris, avec des captures d'écran."],
      "Captures de l'inscription réussie et liste des problèmes rencontrés.", 15, 48, 400],
    ["participer-a-un-concours", "Participer à un concours", "DEFI_CHALLENGE", "DEFI_CHALLENGE", "EN_LIGNE",
      "Participez à un jeu concours de la marque en suivant son règlement.",
      ["Lisez le règlement du concours.", "Participez avec vos propres informations, une seule fois.", "Envoyez une capture de la confirmation de participation."],
      "Capture d'écran de la confirmation de participation.", 10, 48, 250],
    ["relever-un-defi-video", "Relever un défi vidéo", "DEFI_CHALLENGE", "DEFI_CHALLENGE", "EN_LIGNE",
      "Réalisez le défi imaginé par la marque en 15 secondes et publiez-le avec son hashtag.",
      ["Regardez la vidéo d'exemple et lisez les règles du défi.", "Filmez votre version en 15 secondes maximum.", "Publiez-la avec le hashtag de la marque et votre code de vérification."],
      "Lien de la publication et capture d'écran avec le code visible.", 30, 72, 1000],
    ["distribuer-flyers", "Distribuer des flyers ou animer un stand", "EVENEMENT_LOCAL", "EVENEMENT_LOCAL", "TERRAIN",
      "Faites connaître une offre près de chez vous en distribuant des flyers ou en accueillant du public.",
      ["Récupérez les flyers auprès de l'entreprise.", "Distribuez-les poliment dans la zone indiquée, aux heures de passage.", "Prenez une photo au début et une à la fin, et indiquez le nombre distribué."],
      "2 photos (début, fin) et le nombre de flyers distribués.", 120, 96, 2000],
  ]),

  // ---------------------------------------------------------------- Photos et vidéos
  ...family("photos", [
    ["photo-d-un-endroit", "Prendre une photo d'un endroit", "CONTENU_CREATIF", "CONTENU_CREATIF", "TERRAIN",
      "Photographiez un lieu précis : devanture, rue, marché, agence…",
      ["Rendez-vous sur place à l'adresse indiquée.", "Prenez 2 photos nettes en plein jour : une vue d'ensemble, une vue de détail.", "Indiquez le nom du lieu et le quartier."],
      "2 photos du lieu, nom et quartier.", 30, 72, 500],
    ["photo-de-soi", "Prendre une photo de soi", "CONTENU_CREATIF", "CONTENU_CREATIF", "EN_LIGNE",
      "Un selfie avec un produit ou dans une situation précise, pour illustrer une campagne. (Votre accord est demandé avant toute diffusion.)",
      ["Lisez la consigne : produit, décor, expression.", "Prenez une photo nette, bien éclairée, sans filtre.", "Acceptez ou refusez la diffusion de votre image dans le compte-rendu."],
      "La photo respectant la consigne.", 15, 48, 500],
    ["photo-d-un-objet", "Prendre une photo d'un objet", "CONTENU_CREATIF", "CONTENU_CREATIF", "EN_LIGNE",
      "Photographiez un objet ou un produit sous plusieurs angles, sur fond neutre.",
      ["Placez l'objet sur un fond uni, en pleine lumière.", "Prenez 3 photos : de face, de côté, en détail.", "Vérifiez la netteté avant d'envoyer."],
      "3 photos nettes de l'objet.", 15, 48, 400],
    ["video-de-soi", "Faire une vidéo de soi", "VIDEO", "VIDEO", "EN_LIGNE",
      "Un court témoignage ou une présentation face caméra de 30 secondes. (Votre accord est demandé avant toute diffusion.)",
      ["Lisez le texte ou la question à traiter.", "Filmez 30 secondes en mode vertical, dans un endroit calme et lumineux.", "Acceptez ou refusez la diffusion de la vidéo dans le compte-rendu."],
      "La vidéo de 30 secondes.", 25, 72, 1200],
    ["faire-video-endroit", "Faire une vidéo d'un endroit", "VIDEO", "VIDEO", "TERRAIN",
      "Filmez en quelques secondes un lieu précis : boutique, quartier, marché, restaurant…",
      ["Rendez-vous sur place à l'adresse indiquée.", "Filmez en mode horizontal, 20 à 30 secondes, sans coupure, en montrant l'entrée et l'ambiance.", "Ne filmez pas de visages en gros plan sans l'accord des personnes."],
      "La vidéo de 20 à 30 secondes.", 30, 72, 800],
    ["video-d-une-situation", "Faire une vidéo d'une situation", "VIDEO", "VIDEO", "TERRAIN",
      "Filmez une situation du quotidien : file d'attente, trajet, utilisation d'un service.",
      ["Repérez la situation décrite dans la mission.", "Filmez 20 secondes maximum, sans mettre personne en difficulté.", "Décrivez en une phrase ce que montre la vidéo."],
      "La vidéo et sa description en une phrase.", 30, 72, 900],
    ["video-de-deballage", "Faire une vidéo de déballage d'un produit", "VIDEO", "VIDEO", "EN_LIGNE",
      "Filmez le déballage et la première prise en main d'un produit fourni par la marque.",
      ["Filmez l'ouverture du colis sans coupure.", "Montrez le produit sous tous les angles et dites vos premières impressions.", "Gardez la vidéo entre 1 et 2 minutes."],
      "La vidéo de déballage de 1 à 2 minutes.", 30, 96, 2000],
    ["screencast-d-un-site", "Faire un screencast d'un site web", "VIDEO", "INSCRIPTION_SITE", "EN_LIGNE",
      "Enregistrez l'écran de votre téléphone pendant que vous utilisez un site, en commentant ce que vous faites.",
      ["Activez l'enregistrement d'écran de votre téléphone.", "Réalisez le parcours demandé (recherche, inscription, achat fictif) en parlant à voix haute.", "Envoyez l'enregistrement de 2 à 3 minutes."],
      "L'enregistrement d'écran de 2 à 3 minutes.", 20, 72, 1000],
  ]),

  // ---------------------------------------------------------------- Comptes-rendus
  ...family("comptes-rendus", [
    ["compte-rendu-d-un-evenement", "Faire un compte rendu d'un évènement", "EVENEMENT_LOCAL", "EVENEMENT_LOCAL", "TERRAIN",
      "Assistez à un évènement local (concert, foire, conférence) et racontez-le.",
      ["Rendez-vous à l'évènement indiqué.", "Notez le programme, l'ambiance, le public et 3 moments marquants.", "Prenez 2 photos et rédigez un compte rendu de 10 lignes."],
      "Compte rendu de 10 lignes et 2 photos.", 120, 96, 2500],
    ["resume-d-emission-tv", "Faire un résumé d'émission télé", "DONNER_AVIS", "DONNER_AVIS", "EN_LIGNE",
      "Regardez une émission ou un reportage et résumez-le en 10 lignes.",
      ["Regardez l'émission indiquée en entier.", "Notez les idées principales et 3 informations précises.", "Rédigez un résumé objectif de 10 lignes."],
      "Résumé de 10 lignes avec 3 informations précises.", 60, 72, 1200],
    ["resume-de-film-serie", "Faire un résumé de film ou de série", "DONNER_AVIS", "DONNER_AVIS", "EN_LIGNE",
      "Résumez un épisode ou un film sans en gâcher la fin, avec votre avis.",
      ["Regardez le film ou l'épisode indiqué.", "Rédigez un résumé de 8 lignes sans dévoiler la fin.", "Ajoutez votre note sur 5 et votre avis en 3 lignes."],
      "Résumé, note sur 5 et avis.", 60, 96, 1200],
    ["compte-rendu-de-visite-de-lieu", "Faire un compte rendu de visite (musée, site touristique)", "EVENEMENT_LOCAL", "EVENEMENT_LOCAL", "TERRAIN",
      "Visitez un musée, un site historique ou touristique et racontez votre visite.",
      ["Rendez-vous sur le lieu indiqué.", "Notez l'accueil, le prix d'entrée, ce qui vous a plu et ce qui manque.", "Prenez 3 photos (avec autorisation) et rédigez 10 lignes."],
      "Compte rendu de 10 lignes et 3 photos ou le ticket d'entrée.", 120, 96, 2500],
    ["utilisation-d-un-produit", "Raconter l'utilisation d'un produit ou d'un service", "DONNER_AVIS", "DONNER_AVIS", "EN_LIGNE",
      "Utilisez un produit ou un service pendant plusieurs jours et racontez votre expérience.",
      ["Utilisez le produit ou le service dans des conditions réelles.", "Notez chaque jour ce qui fonctionne et ce qui déçoit.", "Rédigez un compte rendu de 10 lignes avec une photo."],
      "Compte rendu de 10 lignes et une photo.", 45, 168, 1500],
    ["apporter-un-temoignage", "Apporter un témoignage", "DONNER_AVIS", "DONNER_AVIS", "EN_LIGNE",
      "Racontez en quelques lignes votre expérience réelle avec un produit, un service ou une marque.",
      ["Lisez la question posée.", "Racontez une expérience vécue, avec des détails concrets.", "Indiquez si vous acceptez que votre témoignage soit publié."],
      "Témoignage de 5 lignes minimum.", 15, 48, 500],
  ]),

  // ---------------------------------------------------------------- Tests
  ...family("tests", [
    ["donner-avis-produit", "Tester un produit", "DONNER_AVIS", "DONNER_AVIS", "TERRAIN",
      "Essayez un produit puis racontez honnêtement votre expérience : ce qui plaît, ce qui manque.",
      ["Recevez ou achetez le produit selon les consignes de l'entreprise.", "Utilisez-le au moins une fois dans des conditions réelles.", "Notez-le de 1 à 5 et rédigez un avis d'au moins 5 lignes, sincère et précis."],
      "Note, avis rédigé et une photo du produit en situation.", 45, 96, 1500],
    ["tester-un-service", "Tester un service", "DONNER_AVIS", "DONNER_AVIS", "TERRAIN",
      "Utilisez un service (livraison, salon, restaurant, transport) et évaluez-le.",
      ["Réservez ou utilisez le service selon les consignes.", "Notez la qualité, la rapidité et le prix.", "Rédigez un avis d'au moins 5 lignes avec le ticket ou une photo."],
      "Avis rédigé, notes et ticket ou photo.", 60, 96, 2000],
    ["tester-un-logiciel", "Tester un logiciel ou un service en ligne", "DONNER_AVIS", "INSCRIPTION_SITE", "EN_LIGNE",
      "Essayez un logiciel ou un service web pendant 15 minutes et signalez les bugs.",
      ["Créez un compte de test avec le lien fourni.", "Réalisez les actions demandées et notez chaque anomalie.", "Envoyez un rapport avec des captures d'écran."],
      "Rapport de test et captures d'écran des anomalies.", 30, 72, 800],
    ["tester-un-site-web", "Tester un site web", "DONNER_AVIS", "INSCRIPTION_SITE", "EN_LIGNE",
      "Parcourez PubAfric ou un autre site comme un vrai utilisateur et dites ce qui est clair ou compliqué.",
      ["Ouvrez le site sur votre téléphone.", "Réalisez les 3 actions demandées.", "Répondez au questionnaire de test avec des phrases précises."],
      "Réponses complètes au questionnaire de test.", 15, 72, 500],
    ["telecharger-et-tester-une-appli", "Télécharger et tester une appli", "DONNER_AVIS", "INSCRIPTION_SITE", "EN_LIGNE",
      "Installez une application, utilisez-la 10 minutes et notez-la.",
      ["Installez l'application indiquée (Android).", "Créez un compte de test et utilisez-la 10 minutes.", "Répondez au questionnaire : ce qui est clair, ce qui bloque, votre note sur 5."],
      "Questionnaire rempli, avec captures d'écran des problèmes rencontrés.", 20, 72, 700],
    ["ecouter-et-noter-un-titre", "Écouter et noter un titre ou un contenu", "MUSIQUE_STREAM", "MUSIQUE_STREAM", "EN_LIGNE",
      "Écoutez un nouveau titre en entier ou explorez un contenu, puis donnez une note et un commentaire.",
      ["Ouvrez le lien fourni sur votre téléphone.", "Écoutez le titre en entier ou explorez le contenu pendant 5 minutes.", "Notez de 1 à 5 et laissez un commentaire d'une phrase."],
      "Capture d'écran de l'écoute ou de la note donnée.", 10, 48, 200],
  ]),
];

export const MISSION_IDEAS: MissionIdea[] = ALL_IDEAS.map((i) => ({
  ...i,
  ...(EXECUTION_BY_SLUG[i.slug] ? { execution: EXECUTION_BY_SLUG[i.slug] } : {}),
}));

export function getIdea(slug: string): MissionIdea | undefined {
  return MISSION_IDEAS.find((i) => i.slug === slug);
}

export function ideasOfFamily(familyId: string): MissionIdea[] {
  return MISSION_IDEAS.filter((i) => i.family === familyId);
}

// Texte d'instructions numérotées, tel que stocké sur une mission.
export function ideaInstructionsText(idea: MissionIdea): string {
  return idea.instructions.map((line, i) => `${i + 1}. ${line}`).join("\n");
}
