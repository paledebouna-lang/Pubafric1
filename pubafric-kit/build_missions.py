import csv, json, math

# Règles PubAfric (page "7 questions") : +15 % payés par l'entreprise, -10 % retenus sur l'internaute.
FEE_COMPANY = 0.15
FEE_WORKER = 0.10

def rnd5(x):
    return int(math.ceil(x / 5.0) * 5)

M = []
def add(slug, titre, categorie, lieu, type_, description, instructions, preuve,
        duree_min, delai_h, recompense, places, financeur="PubAfric"):
    M.append(dict(
        slug=slug, titre=titre, categorie=categorie, type=type_, lieu=lieu,
        description=description, instructions=instructions, preuve_demandee=preuve,
        duree_estimee_min=duree_min, delai_heures=delai_h,
        recompense_fcfa=recompense, places=places, financeur=financeur,
    ))

add("partager-pubafric-statut-whatsapp",
    "Partager PubAfric en statut WhatsApp",
    "Réseaux sociaux", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Faites connaître PubAfric à vos contacts en publiant notre visuel en statut WhatsApp pendant 24 h.",
    ["Téléchargez le visuel fourni par PubAfric.",
     "Publiez-le en statut WhatsApp avec la légende indiquée.",
     "Laissez-le en ligne 24 heures.",
     "Envoyez une capture d'écran du statut ET de la liste des vues."],
    "Capture d'écran du statut avec le nombre de vues visible.",
    10, 48, 200, 50)

add("rejoindre-chaine-whatsapp-pubafric",
    "Rejoindre la chaîne WhatsApp PubAfric",
    "Réseaux sociaux", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Suivez la chaîne officielle PubAfric pour recevoir en premier les nouvelles missions.",
    ["Ouvrez le lien de la chaîne PubAfric.",
     "Cliquez sur « Suivre ».",
     "Envoyez une capture d'écran montrant que vous suivez la chaîne."],
    "Capture d'écran de la chaîne avec le bouton « Suivi ».",
    3, 48, 100, 100)

add("aimer-page-facebook-pubafric",
    "S'abonner à la page Facebook PubAfric et aimer 3 publications",
    "Réseaux sociaux", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Aidez la page PubAfric à grandir : abonnement et 3 mentions « J'aime ».",
    ["Ouvrez la page Facebook PubAfric.",
     "Abonnez-vous à la page.",
     "Aimez trois publications de votre choix.",
     "Envoyez deux captures d'écran : l'abonnement et les publications aimées."],
    "2 captures d'écran (abonnement + publications aimées).",
    4, 48, 150, 100)

add("tester-site-pubafric-10-questions",
    "Tester le site PubAfric et répondre à 10 questions",
    "Avis et tests", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Parcourez PubAfric comme un vrai utilisateur et dites-nous ce qui est clair ou compliqué.",
    ["Ouvrez PubAfric sur votre téléphone.",
     "Faites 3 actions : voir une mission, ouvrir votre profil, lire « PubAfric en 7 questions ».",
     "Répondez aux 10 questions du formulaire de test.",
     "Soyez précis : chaque réponse doit faire au moins une phrase."],
    "Réponses complètes aux 10 questions dans le compte-rendu.",
    15, 72, 500, 30)

add("sondage-paiement-mobile-money",
    "Sondage : vos habitudes de paiement Mobile Money",
    "Sondage", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Répondez à un court sondage sur l'usage d'Orange Money, MTN MoMo, Wave et Moov Money.",
    ["Ouvrez le formulaire du sondage.",
     "Répondez honnêtement aux 12 questions (5 minutes).",
     "Copiez le code de confirmation affiché à la fin dans votre compte-rendu."],
    "Code de confirmation du sondage.",
    5, 72, 300, 100)

add("filmer-marche-quartier-abidjan",
    "Filmer 20 secondes de la vie d'un marché ou d'un quartier d'Abidjan",
    "Terrain", "Abidjan (Cocody, Yopougon, Marcory, Treichville, Abobo…)", "terrain",
    "PubAfric constitue sa bibliothèque d'images locales. Filmez une scène de rue authentique.",
    ["Choisissez un lieu public (marché, gare, carrefour, maquis, plage).",
     "Filmez en vidéo horizontale, 20 secondes minimum, image stable, bon éclairage.",
     "Évitez de filmer de face des personnes qui refusent : demandez l'accord ou filmez de dos.",
     "Envoyez la vidéo et indiquez le lieu exact dans le compte-rendu."],
    "Fichier vidéo (horizontal, 20 s min.) + nom du lieu.",
    30, 72, 1000, 20)

add("photographier-5-enseignes-quartier",
    "Photographier 5 enseignes ou affiches de commerces de votre quartier",
    "Terrain", "Abidjan, Bouaké, Yamoussoukro, San-Pédro, Daloa", "terrain",
    "Repérage local : prenez en photo 5 commerces différents avec leur enseigne bien lisible.",
    ["Choisissez 5 commerces différents (boutique, pharmacie, coiffeur, restaurant…).",
     "Photographiez chaque enseigne en entier, en plein jour, sans reflet.",
     "Indiquez pour chaque photo le nom du commerce et le quartier."],
    "5 photos nettes + liste (nom du commerce, quartier).",
    45, 72, 1500, 15)

add("distribuer-50-flyers",
    "Distribuer 50 flyers dans un lieu très fréquenté",
    "Terrain", "Abidjan (Plateau, Cocody, Marcory, Yopougon), Bouaké", "terrain",
    "Distribuez des flyers de l'entreprise partenaire à des passants intéressés.",
    ["Récupérez les 50 flyers auprès du point relais indiqué.",
     "Distribuez-les poliment, en main propre, dans un lieu fréquenté (pas dans la rue à contresens ni dans les véhicules).",
     "Prenez 3 photos : au départ, pendant la distribution, et avec les flyers restants (s'il y en a).",
     "Indiquez l'heure et le lieu dans le compte-rendu."],
    "3 photos + heure et lieu de distribution.",
    120, 72, 3000, 10)

add("porter-vetement-publicitaire",
    "Porter un vêtement publicitaire pendant 2 heures",
    "Terrain", "Abidjan, Bouaké, Yamoussoukro", "terrain",
    "Portez le t-shirt de la marque fourni et faites-vous voir dans un lieu passant.",
    ["Récupérez le vêtement auprès du point relais.",
     "Portez-le 2 heures consécutives dans un lieu passant (centre commercial, gare, marché).",
     "Prenez 3 photos en portant le vêtement, à des moments différents.",
     "Rendez le vêtement s'il n'est pas offert."],
    "3 photos horodatées, lieu et heure de début/fin.",
    120, 72, 3500, 10)

add("trouver-nom-slogan-marque",
    "Proposer 5 idées de noms ou de slogans pour une marque",
    "Création", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Une jeune entreprise ivoirienne cherche un nom accrocheur. Proposez vos meilleures idées.",
    ["Lisez la description de l'entreprise et de son produit.",
     "Proposez 5 noms ou slogans originaux, faciles à retenir et à prononcer.",
     "Pour chaque idée, expliquez en une phrase pourquoi elle marche.",
     "Pas de copie de marques existantes."],
    "Liste de 5 idées avec une phrase d'explication chacune.",
    25, 72, 500, 30)

add("releve-prix-5-produits-boutique",
    "Relever le prix de 5 produits dans une boutique ou au marché",
    "Terrain", "Abidjan, Bouaké, Yamoussoukro, San-Pédro, Daloa", "terrain",
    "Enquête de prix : notez le prix de 5 produits de grande consommation dans un point de vente.",
    ["Rendez-vous dans une boutique, un supermarché ou un marché.",
     "Relevez le prix exact de 5 produits (liste fournie) et prenez-les en photo avec l'étiquette ou le prix visible.",
     "Notez le nom du point de vente et le quartier."],
    "5 photos + tableau produit / prix / lieu.",
    40, 72, 1000, 25)

add("tester-application-mobile-avis",
    "Tester une application mobile 10 minutes et donner votre avis",
    "Avis et tests", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Une application ivoirienne veut savoir si elle est simple à utiliser. Testez-la et notez-la.",
    ["Installez l'application indiquée (Android).",
     "Créez un compte de test et utilisez-la 10 minutes.",
     "Répondez au questionnaire : ce qui est clair, ce qui bloque, votre note sur 5.",
     "Joignez 2 captures d'écran d'un problème rencontré, s'il y en a."],
    "Questionnaire rempli + 2 captures d'écran.",
    20, 72, 700, 20)

add("mystere-visite-point-de-vente",
    "Client mystère : noter l'accueil d'un point de vente",
    "Terrain", "Abidjan, Bouaké, Yamoussoukro", "terrain",
    "Visitez un commerce comme un client normal et évaluez l'accueil et la propreté.",
    ["Rendez-vous au point de vente indiqué.",
     "Demandez un renseignement sur un produit et notez le temps d'attente.",
     "Remplissez la grille : accueil, propreté, clarté des prix, sourire (note de 1 à 5).",
     "Ne dites pas que vous êtes en mission. Aucune photo à l'intérieur sans autorisation."],
    "Grille d'évaluation complétée + ticket ou preuve de visite si possible.",
    30, 72, 2500, 10)

add("relire-texte-300-mots",
    "Relire un texte de 300 mots et signaler les fautes",
    "Création", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Relecture en français : orthographe, grammaire et ponctuation d'un texte publicitaire court.",
    ["Lisez le texte fourni (300 mots environ).",
     "Listez chaque faute trouvée avec sa correction.",
     "Proposez une version corrigée complète."],
    "Liste des fautes + texte corrigé.",
    20, 48, 800, 20)

add("saisir-20-fiches-produits",
    "Saisir 20 fiches produits (copier-coller)",
    "Saisie", "En ligne (toute la Côte d'Ivoire)", "en_ligne",
    "Recopiez dans un tableau les informations de 20 produits à partir de photos d'étiquettes.",
    ["Ouvrez le tableau et le dossier de photos fournis.",
     "Pour chaque produit : nom, marque, contenance, prix.",
     "Vérifiez qu'il n'y a pas de faute de frappe, puis envoyez le tableau."],
    "Tableau complété (20 lignes).",
    45, 72, 1000, 20)

# Calculs
for i, m in enumerate(M, 1):
    r = m["recompense_fcfa"]
    m["id"] = i
    m["net_internaute_fcfa"] = int(round(r * (1 - FEE_WORKER)))
    m["cout_entreprise_fcfa"] = rnd5(r * (1 + FEE_COMPANY))
    m["budget_total_entreprise_fcfa"] = m["cout_entreprise_fcfa"] * m["places"]
    m["devise"] = "XOF"

with open("missions.json", "w", encoding="utf-8") as f:
    json.dump(dict(pays="CI", devise="XOF", frais_entreprise=FEE_COMPANY,
                   frais_internaute=FEE_WORKER, missions=M), f, ensure_ascii=False, indent=2)

cols = ["id", "slug", "titre", "categorie", "type", "lieu", "recompense_fcfa",
        "net_internaute_fcfa", "cout_entreprise_fcfa", "places",
        "budget_total_entreprise_fcfa", "duree_estimee_min", "delai_heures",
        "preuve_demandee", "description"]
with open("missions.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=cols, delimiter=";", extrasaction="ignore")
    w.writeheader()
    for m in M:
        w.writerow(m)

tot = sum(m["budget_total_entreprise_fcfa"] for m in M)
print(len(M), "missions | budget si toutes les places sont prises:", tot, "FCFA")
for m in M:
    print(m["id"], m["recompense_fcfa"], m["net_internaute_fcfa"], m["cout_entreprise_fcfa"], m["places"], m["budget_total_entreprise_fcfa"])
