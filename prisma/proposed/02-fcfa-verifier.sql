-- À lancer AVANT toute conversion (lecture seule) : combien d'argent est concerné ?
SELECT currency, COUNT(*) AS comptes, SUM("walletCents") AS total_soldes_stockes
FROM "User" WHERE role <> 'ADMIN' GROUP BY currency;

SELECT currency, COUNT(*) AS missions, SUM("rewardCents") AS total_recompenses_stockees
FROM "Mission" GROUP BY currency;

SELECT COUNT(*) AS transactions FROM "CreditTransaction";
