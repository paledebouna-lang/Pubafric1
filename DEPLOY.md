# Déployer PubAFric sur Vercel

Le code utilise désormais PostgreSQL (via Prisma) et Vercel Blob pour les fichiers
uploadés (logos, photos/vidéos de mission) — plus de SQLite ni de disque local,
ce qui rend l'app compatible avec l'hébergement serverless de Vercel.

## 1. Créer un dépôt GitHub

```bash
git add -A
git commit -m "Prepare for production deployment (Postgres + Vercel Blob)"
```

Créez un dépôt sur [github.com/new](https://github.com/new), puis :

```bash
git remote add origin https://github.com/<votre-compte>/pubafric.git
git push -u origin main
```

## 2. Créer le projet sur Vercel

1. Allez sur [vercel.com/new](https://vercel.com/new) et importez le dépôt GitHub.
2. Vercel détecte automatiquement Next.js — laissez les réglages par défaut.
3. Ne cliquez pas encore sur "Deploy" : ajoutez d'abord la base de données et le
   stockage ci-dessous, sinon le premier build échouera (pas de `DATABASE_URL`).

## 3. Ajouter une base PostgreSQL

Dans l'onglet **Storage** du projet Vercel : **Create Database → Postgres**
(propulsé par Neon — gratuit pour démarrer). Une fois créée, Vercel injecte
automatiquement les variables `DATABASE_URL` / `POSTGRES_URL` dans le projet.

> Si Vercel nomme la variable différemment (ex. `POSTGRES_PRISMA_URL`), allez
> dans **Settings → Environment Variables** et ajoutez une variable `DATABASE_URL`
> avec la même valeur — le code lit spécifiquement `DATABASE_URL`.

Alternative : créez une base gratuite sur [neon.tech](https://neon.tech) ou
[supabase.com](https://supabase.com) et collez la chaîne de connexion à la main
dans **Settings → Environment Variables → DATABASE_URL**.

## 4. Ajouter le stockage de fichiers (Vercel Blob)

Toujours dans **Storage** : **Create Database → Blob**. Vercel injecte
automatiquement `BLOB_READ_WRITE_TOKEN` dans le projet.

## 5. Ajouter le secret d'authentification

Dans **Settings → Environment Variables**, ajoutez :

```
AUTH_SECRET = <générez-en un avec la commande ci-dessous>
```

```bash
npx auth secret
```

## 6. Déployer

Cliquez sur **Deploy**. Le build exécute automatiquement :

```
prisma generate && prisma migrate deploy && next build
```

`prisma migrate deploy` crée les tables dans la base Postgres au premier
déploiement (le dossier `prisma/migrations` a été régénéré pour Postgres).

## 7. Créer le compte administrateur

Une fois déployé, depuis votre machine, connectez-vous à la base de production
(remplacez `DATABASE_URL` localement par celle de Vercel, temporairement) et
lancez :

```bash
npx prisma db seed
```

Identifiants créés : `admin@pubafric.com` / `AdminPubafric123`.
**Connectez-vous immédiatement et changez ce mot de passe** — ce sont des
identifiants par défaut qui figurent dans le code source.

## 8. Nom de domaine personnalisé (optionnel)

Dans **Settings → Domains**, ajoutez votre domaine (ex. `pubafric.com`) et
suivez les instructions DNS affichées par Vercel (enregistrement A ou CNAME
chez votre registrar).

## Mises à jour ultérieures

Chaque `git push` sur la branche principale redéploie automatiquement le site
et applique les nouvelles migrations Prisma s'il y en a.

## Développement local après ce changement

Le fichier `.env` local pointe maintenant vers `postgresql://...` au lieu de
SQLite — il faut une base Postgres locale ou distante pour `npm run dev`
(ex. une branche de développement gratuite sur [neon.tech](https://neon.tech)).
Copiez `.env.example`, remplissez les trois variables, puis :

```bash
npx prisma migrate dev
```
