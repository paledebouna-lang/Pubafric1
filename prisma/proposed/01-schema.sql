-- PROPOSITION (non appliquée) — nouvelles colonnes des missions + devise par défaut FCFA.
-- 100 % additif : aucune donnée existante n'est modifiée ni supprimée.
-- Ce SQL est ce que `prisma db push` exécutera automatiquement au prochain déploiement.

ALTER TABLE "User" ALTER COLUMN "currency" SET DEFAULT 'XOF';

ALTER TABLE "Mission" ADD COLUMN     "description" TEXT,
ADD COLUMN     "estimatedMinutes" INTEGER,
ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'EN_LIGNE',
ADD COLUMN     "locationLabel" TEXT,
ADD COLUMN     "proofRequired" TEXT,
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'XOF';

CREATE UNIQUE INDEX "Mission_slug_key" ON "Mission"("slug");
