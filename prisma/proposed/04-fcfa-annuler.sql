-- Annule 03-fcfa-appliquer.sql : restaure montants et devises depuis "_fcfa_backup".
BEGIN;
UPDATE "User" x SET "walletCents" = b.amount, currency = b.currency
  FROM "_fcfa_backup" b WHERE b.tbl = 'User' AND b.id = x.id;
UPDATE "Mission" x SET "rewardCents" = b.amount, currency = b.currency
  FROM "_fcfa_backup" b WHERE b.tbl = 'Mission' AND b.id = x.id;
UPDATE "CreditTransaction" x SET "amountCents" = b.amount
  FROM "_fcfa_backup" b WHERE b.tbl = 'CreditTransaction' AND b.id = x.id;
DROP TABLE "_fcfa_backup";
COMMIT;
