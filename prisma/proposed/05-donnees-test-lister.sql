-- Lecture seule : les enregistrements de test visibles publiquement sur le site.
SELECT id, role, name, email, "createdAt" FROM "User"
 WHERE email IN ('test-prod-check@example.com', 'prod-test-co@example.com');
SELECT id, title, "rewardCents", status, "createdAt" FROM "Mission" WHERE title = 'Mission internaute prod';
