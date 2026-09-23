# Prompt à coller dans Claude Code (projet PubAfric)

Avant de coller : copiez le dossier `pubafric-kit` à la racine de votre projet (il contient `missions.json`, `missions.csv` et le dossier `assets/`).

---

Tu travailles sur PubAfric, une plateforme de micro-missions pour la Côte d'Ivoire. Le dossier `pubafric-kit/` à la racine du projet contient :
- `missions.json` : 15 missions prêtes à importer (montants en FCFA, code devise XOF) ;
- `assets/` : `logo.svg`, `logo-blanc.svg`, `logo-icon.svg` (+ versions PNG) et `hero-visual.svg` / `hero-visual.png` (visuel d'accueil, format 1000x800).

Procède dans cet ordre, sans casser l'existant. Explore d'abord le code (framework, base de données, schéma des missions, page d'accueil, composants d'en-tête et de pied de page) et adapte-toi à ce que tu trouves : ne devine pas les noms de champs, lis le schéma. Si un point est ambigu, pose-moi la question au lieu d'inventer.

## 1. Logo et visuel d'accueil
- Copie `assets/*` dans le dossier public du projet (par ex. `public/brand/`).
- Remplace le logo texte actuel de l'en-tête par `logo.svg` (hauteur ~40 px, `alt="PubAfric"`), utilise `logo-blanc.svg` sur fonds sombres et `logo-icon.svg` comme favicon / icône d'application.
- Dans le bandeau d'accueil (hero), remplace l'icône d'appareil photo vide par `hero-visual.svg`, placé dans la colonne de droite. Sur mobile, l'image passe sous le texte, largeur 100 %, avec `loading="eager"`, une largeur/hauteur explicites et un `alt` descriptif.
- Ne modifie pas les couleurs existantes du site (vert, orange, jaune, rouge, bleu marine).

## 2. Devise : passer en FCFA
- Tous les montants affichés au public doivent être en FCFA (ex. « 1 000 FCFA », séparateur de milliers = espace insécable, pas de décimales). Remplace les « € » et « euros » partout (accueil, liste des missions, portefeuille, retraits, page « PubAfric en 7 questions », conditions d'utilisation).
- Stocke les montants en FCFA (entiers). Si la base contient déjà des montants en euros, propose-moi une migration réversible (taux fixe 1 € = 655,957 FCFA) et attends ma validation avant de l'appliquer.
- Retrait minimum : remplace « 5 euros cumulés » par « 2 000 FCFA cumulés » dans les textes ET dans la règle de code correspondante (une seule constante configurable).
- Les frais restent : +15 % côté entreprise, −10 % côté internaute, 5 % de parrainage. Pour chaque mission, arrondis le coût entreprise aux 5 FCFA supérieurs (le fichier `missions.json` contient déjà `cout_entreprise_fcfa` et `net_internaute_fcfa`, à utiliser pour contrôle).

## 3. Textes de l'accueil
- « Il suffit d'avoir un ordinateur » devient « Il suffit d'avoir un téléphone et un peu de temps ».
- Ajoute « Paiement par Mobile Money » (texte uniquement, sans logos d'opérateurs) près du bouton d'inscription.
- Dans le menu, « Micros missions » devient « Missions ». Choisis un seul terme, « internautes », partout dans l'interface publique.
- Retire du pied de page les liens vers des pages vides (Espace presse, Partenaires, Nous rejoindre) tant qu'elles n'ont pas de contenu, et ne montre les icônes de réseaux sociaux que si un lien réel est configuré.

## 4. Import des 15 missions (script idempotent)
- Crée un script `scripts/seed-missions.(ts|js|py selon le projet)` qui lit `pubafric-kit/missions.json` et crée les missions en base. Il doit être idempotent : la clé d'unicité est le `slug`, une deuxième exécution met à jour au lieu de dupliquer.
- Mappe les champs du JSON vers le schéma existant : `titre`, `description`, `instructions` (liste d'étapes numérotées), `preuve_demandee`, `categorie`, `type` (`en_ligne` / `terrain`), `lieu`, `duree_estimee_min`, `delai_heures`, `recompense_fcfa`, `places`. Si une colonne n'existe pas, propose une migration minimale plutôt que de supprimer l'information.
- Le financeur de toutes ces missions est PubAfric (missions « pour ses propres besoins », comme prévu dans la page « 7 questions »). Rattache-les au compte entreprise « PubAfric » (crée-le s'il n'existe pas) et ajoute un mode `--dry-run` qui affiche seulement le budget total à bloquer dans le portefeuille (somme de `cout_entreprise_fcfa × places`).
- Statut initial : `brouillon`. Ne les publie pas automatiquement : j'ai besoin de vérifier chaque mission (liens, visuels, formulaires) avant. Ajoute un bouton ou une commande simple « publier » pour que je puisse les publier une par une.
- Tant que je n'ai pas validé, ne supprime rien de l'existant.

## 5. Données de test
- Liste-moi (sans les supprimer) les enregistrements de test visibles publiquement, par exemple le tasker « TEST PROD » et la mission « Mission internaute prod » à 1 €. Après ma confirmation, masque-les de l'affichage public ou supprime-les.

## 6. Vérifications avant de conclure
- Lance le build et les tests existants.
- Ouvre la page d'accueil et la liste des missions en largeur mobile (390 px) et bureau (1280 px) et vérifie : logo net, visuel d'accueil visible sans débordement, aucun « € » restant, montants en FCFA.
- Donne-moi un résumé : fichiers modifiés, migrations proposées (non appliquées), budget total à créditer, et ce qui reste à faire de mon côté.
