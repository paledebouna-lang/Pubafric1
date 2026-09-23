# Migrations proposées — NON appliquées

Rien de ce dossier n'a été exécuté sur la base de production.

| Fichier | Rôle | Risque |
|---|---|---|
| `01-schema.sql` | Nouvelles colonnes des missions (slug, description, preuve, type, lieu, durée) + devise par défaut FCFA | Aucun (ajout pur). **Appliqué automatiquement au prochain déploiement** (`prisma db push` dans le build). |
| `02-fcfa-verifier.sql` | Lecture seule : combien d'argent existe, par devise | Aucun |
| `03-fcfa-appliquer.sql` | Convertit soldes / récompenses / transactions en FCFA entiers (1 € = 655,957 FCFA), avec sauvegarde | Modifie les montants. À lancer **une seule fois**, après `02`. |
| `04-fcfa-annuler.sql` | Restaure les montants depuis la sauvegarde | — |
| `05-donnees-test-lister.sql` | Lecture seule : données de test visibles | Aucun |
| `06-donnees-test-supprimer.sql` | Supprime « Test Prod », « Prod Test Co », « Mission internaute prod » | Suppression définitive. |

Exécution : Vercel → Storage → votre base Prisma Postgres → **Query** (désactiver « Read-only » pour `03`, `04`, `06`).
