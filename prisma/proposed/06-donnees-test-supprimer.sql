-- PROPOSITION (non appliquée) — supprime les comptes et la mission de test :
--   « Test Prod » (internaute), « Prod Test Co » (entreprise), « Mission internaute prod ».
-- À lancer seulement après votre confirmation. Tout ou rien (transaction).
BEGIN;

CREATE TEMP TABLE _test_users AS
  SELECT id FROM "User" WHERE email IN ('test-prod-check@example.com', 'prod-test-co@example.com');
CREATE TEMP TABLE _test_claims AS
  SELECT c.id FROM "MissionClaim" c
   WHERE c."userId" IN (SELECT id FROM _test_users)
      OR c."missionId" IN (SELECT id FROM "Mission" WHERE "ownerId" IN (SELECT id FROM _test_users));

DELETE FROM "Dispute" WHERE "claimId" IN (SELECT id FROM _test_claims)
                         OR "raisedById" IN (SELECT id FROM _test_users);
DELETE FROM "MissionClaim" WHERE id IN (SELECT id FROM _test_claims);
DELETE FROM "CreditTransaction" WHERE "userId" IN (SELECT id FROM _test_users);
DELETE FROM "BanAppeal" WHERE "userId" IN (SELECT id FROM _test_users);
DELETE FROM "Mission" WHERE "ownerId" IN (SELECT id FROM _test_users);
DELETE FROM "User" WHERE id IN (SELECT id FROM _test_users);

COMMIT;
