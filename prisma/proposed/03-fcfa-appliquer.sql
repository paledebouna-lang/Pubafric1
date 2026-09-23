-- PROPOSITION (non appliquée) — conversion des montants existants vers des FCFA entiers.
-- Anciennement : entier en CENTIMES de la devise du compte (EUR/USD/XOF, sans conversion).
-- Désormais     : entier en FCFA.
--   EUR : centimes / 100 * 655,957 (taux fixe), arrondi au FCFA
--   XOF : centimes / 100 (les anciens « FCFA » étaient déjà stockés en centimes)
--   USD : NON converti automatiquement (aucun taux fixé) — traitez-les à la main.
-- Sauvegarde automatique dans "_fcfa_backup" pour pouvoir revenir en arrière (04-fcfa-annuler.sql).
-- À ne lancer qu'UNE seule fois. Exécuté dans une transaction : tout ou rien.

BEGIN;

CREATE TABLE "_fcfa_backup" AS
  SELECT 'User'::text AS tbl, u.id, u."walletCents" AS amount, u.currency AS currency FROM "User" u
  UNION ALL
  SELECT 'Mission', m.id, m."rewardCents", m.currency FROM "Mission" m
  UNION ALL
  SELECT 'CreditTransaction', t.id, t."amountCents", u.currency
    FROM "CreditTransaction" t JOIN "User" u ON u.id = t."userId";

UPDATE "CreditTransaction" t
SET "amountCents" = CASE u.currency
    WHEN 'EUR' THEN ROUND(t."amountCents" / 100.0 * 655.957)
    WHEN 'XOF' THEN ROUND(t."amountCents" / 100.0)
    ELSE t."amountCents" END
FROM "User" u WHERE u.id = t."userId";

UPDATE "User"
SET "walletCents" = CASE currency
    WHEN 'EUR' THEN ROUND("walletCents" / 100.0 * 655.957)
    WHEN 'XOF' THEN ROUND("walletCents" / 100.0)
    ELSE "walletCents" END,
  currency = CASE WHEN currency IN ('EUR','XOF') THEN 'XOF' ELSE currency END;

UPDATE "Mission"
SET "rewardCents" = CASE currency
    WHEN 'EUR' THEN ROUND("rewardCents" / 100.0 * 655.957)
    WHEN 'XOF' THEN ROUND("rewardCents" / 100.0)
    ELSE "rewardCents" END,
  currency = CASE WHEN currency IN ('EUR','XOF') THEN 'XOF' ELSE currency END;

COMMIT;
