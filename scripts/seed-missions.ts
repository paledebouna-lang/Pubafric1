// Import idempotent des missions du kit PubAfric.
//
//   npx tsx scripts/seed-missions.ts --dry-run   -> aperçu + budget, RIEN n'est écrit
//   npx tsx scripts/seed-missions.ts             -> crée/met à jour les missions (brouillons)
//
// Clé d'unicité : le "slug". Une 2e exécution met à jour au lieu de dupliquer.
// Les missions sont créées en statut BROUILLON : elles ne sont jamais publiées ici.
import { readFileSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { importKitMissions, PUBAFRIC_ACCOUNT_EMAIL, type KitFile } from "../src/lib/seed-missions";

const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const kit = JSON.parse(
    readFileSync(path.join(process.cwd(), "pubafric-kit", "missions.json"), "utf-8")
  ) as KitFile;

  const prisma = new PrismaClient();
  try {
    const report = await importKitMissions(prisma, kit, { dryRun });

    console.log(dryRun ? "\n=== APERÇU (rien n'est écrit) ===\n" : "\n=== IMPORT TERMINÉ ===\n");
    for (const r of report.rows) {
      console.log(
        `${r.action.padEnd(14)} ${r.slug.padEnd(42)} ${fcfa(r.rewardFcfa).padStart(11)} ` +
          `x${String(r.places).padStart(3)}  coût ${fcfa(r.costFcfa).padStart(11)}  budget ${fcfa(r.budgetFcfa).padStart(12)}`
      );
      for (const w of r.warnings) console.log(`   ⚠ ${w}`);
    }
    console.log(`\n${report.created} à créer, ${report.updated} à mettre à jour (statut initial : brouillon).`);
    console.log(`BUDGET TOTAL À CRÉDITER sur le portefeuille « PubAfric » : ${fcfa(report.budgetTotalFcfa)}`);
    console.log(
      report.accountExists
        ? `Compte ${PUBAFRIC_ACCOUNT_EMAIL} : déjà présent.`
        : dryRun
          ? `Compte ${PUBAFRIC_ACCOUNT_EMAIL} : sera créé à l'import.`
          : `Compte ${PUBAFRIC_ACCOUNT_EMAIL} : créé.`
    );
    if (report.accountPassword) {
      console.log(`Mot de passe généré (affiché une seule fois) : ${report.accountPassword}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
