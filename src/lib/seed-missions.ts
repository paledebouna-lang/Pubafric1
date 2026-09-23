import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { entrepriseCost, internauteNet } from "./fees";

// Import idempotent des missions du kit PubAfric (pubafric-kit/missions.json).
// Utilisé par le script `scripts/seed-missions.ts` ET par le bouton d'import du tableau
// de bord administrateur : même logique, un seul endroit à maintenir.

export const PUBAFRIC_ACCOUNT_EMAIL = "entreprise@pubafric.com";
export const PUBAFRIC_ACCOUNT_NAME = "PubAfric";

export type KitMission = {
  slug: string;
  titre: string;
  categorie: string;
  type: string;
  lieu: string;
  description: string;
  instructions: string[];
  preuve_demandee: string;
  duree_estimee_min: number;
  delai_heures: number;
  recompense_fcfa: number;
  places: number;
  cout_entreprise_fcfa: number;
  net_internaute_fcfa: number;
};

export type KitFile = { missions: KitMission[] };

// Catégories du kit -> catégories déjà présentes sur le site.
const CATEGORY_MAP: Record<string, string> = {
  "Réseaux sociaux": "RESEAU_SOCIAL",
  "Avis et tests": "DONNER_AVIS",
  Sondage: "REPONDRE_ETUDE",
  Terrain: "EVENEMENT_LOCAL",
  Création: "CONTENU_CREATIF",
  Saisie: "AUTRE",
};

export type ImportRow = {
  slug: string;
  title: string;
  action: "créer" | "mettre à jour";
  rewardFcfa: number;
  places: number;
  costFcfa: number;
  budgetFcfa: number;
  warnings: string[];
};

export type ImportReport = {
  dryRun: boolean;
  rows: ImportRow[];
  created: number;
  updated: number;
  budgetTotalFcfa: number;
  accountExists: boolean;
  accountCreated: boolean;
  // Mot de passe généré, affiché UNE seule fois lors de la création du compte PubAfric.
  accountPassword?: string;
};

function toInstructions(steps: string[]): string {
  return steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
}

function toMissionData(m: KitMission) {
  return {
    title: m.titre,
    description: m.description,
    instructions: toInstructions(m.instructions),
    proofRequired: m.preuve_demandee,
    category: CATEGORY_MAP[m.categorie] ?? "AUTRE",
    kind: m.type === "terrain" ? "TERRAIN" : "EN_LIGNE",
    locationLabel: m.lieu,
    estimatedMinutes: m.duree_estimee_min,
    deadlineHours: m.delai_heures,
    rewardCents: m.recompense_fcfa,
    slotsTotal: m.places,
    currency: "XOF",
  };
}

export async function importKitMissions(
  prisma: PrismaClient,
  kit: KitFile,
  { dryRun }: { dryRun: boolean }
): Promise<ImportReport> {
  const existingBySlug = new Set(
    (
      await prisma.mission.findMany({
        where: { slug: { in: kit.missions.map((m) => m.slug) } },
        select: { slug: true },
      })
    ).map((m) => m.slug)
  );

  const rows: ImportRow[] = kit.missions.map((m) => {
    const cost = entrepriseCost(m.recompense_fcfa);
    const net = internauteNet(m.recompense_fcfa);
    const rowWarnings: string[] = [];
    if (cost !== m.cout_entreprise_fcfa) {
      rowWarnings.push(`coût entreprise calculé ${cost} ≠ fichier ${m.cout_entreprise_fcfa}`);
    }
    if (net !== m.net_internaute_fcfa) {
      rowWarnings.push(`net internaute calculé ${net} ≠ fichier ${m.net_internaute_fcfa}`);
    }
    if (!CATEGORY_MAP[m.categorie]) {
      rowWarnings.push(`catégorie « ${m.categorie} » inconnue, classée dans « Autre mission »`);
    }
    return {
      slug: m.slug,
      title: m.titre,
      action: existingBySlug.has(m.slug) ? "mettre à jour" : "créer",
      rewardFcfa: m.recompense_fcfa,
      places: m.places,
      costFcfa: cost,
      budgetFcfa: cost * m.places,
      warnings: rowWarnings,
    };
  });

  const budgetTotalFcfa = rows.reduce((sum, r) => sum + r.budgetFcfa, 0);
  const existingAccount = await prisma.user.findUnique({
    where: { email: PUBAFRIC_ACCOUNT_EMAIL },
    select: { id: true, role: true },
  });
  if (existingAccount && existingAccount.role !== "ENTREPRISE") {
    throw new Error(
      `L'adresse ${PUBAFRIC_ACCOUNT_EMAIL} est déjà utilisée par un compte qui n'est pas une entreprise.`
    );
  }

  const report: ImportReport = {
    dryRun,
    rows,
    created: rows.filter((r) => r.action === "créer").length,
    updated: rows.filter((r) => r.action === "mettre à jour").length,
    budgetTotalFcfa,
    accountExists: Boolean(existingAccount),
    accountCreated: false,
  };
  if (dryRun) return report;

  let ownerId = existingAccount?.id;
  if (!ownerId) {
    const password = randomBytes(9).toString("base64url");
    const owner = await prisma.user.create({
      data: {
        role: "ENTREPRISE",
        name: PUBAFRIC_ACCOUNT_NAME,
        email: PUBAFRIC_ACCOUNT_EMAIL,
        passwordHash: await bcrypt.hash(password, 10),
        currency: "XOF",
      },
    });
    ownerId = owner.id;
    report.accountCreated = true;
    report.accountPassword = password;
  }

  for (const m of kit.missions) {
    const data = toMissionData(m);
    // À la création : brouillon, jamais publié automatiquement. À la mise à jour, on ne
    // touche ni au statut ni au propriétaire (une mission déjà publiée reste publiée).
    await prisma.mission.upsert({
      where: { slug: m.slug },
      create: { ...data, slug: m.slug, status: "BROUILLON", ownerId },
      update: data,
    });
  }
  return report;
}
