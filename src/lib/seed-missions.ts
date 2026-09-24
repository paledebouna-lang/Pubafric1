import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { PrismaClient } from "@prisma/client";
import { entrepriseCost, internauteNet } from "./fees";
import type { Resource } from "./mission-content";

// Question telle qu'écrite dans le kit (l'identifiant est ajouté à l'import).
export type KitQuestion = {
  type: string;
  text: string;
  options?: string[];
  correct?: number;
  minLength?: number;
};

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
  // Exécution sur la plateforme (facultatif ; sinon compte-rendu avec preuves)
  execution?: "PREUVE" | "QUIZ" | "SONDAGE";
  validation_auto?: boolean;
  video_url?: string;
  attente_secondes?: number;
  questions?: KitQuestion[];
  ressources?: Resource[];
  // Informations réelles encore à fournir avant de publier (montré à l'administrateur)
  a_completer?: string[];
};

export type KitFile = { missions: KitMission[]; missions_retirees?: string[] };

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
  // Missions retirées du kit (doublons) supprimées : brouillons sans aucune participation.
  removed: number;
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
    execution: m.execution ?? "PREUVE",
    autoValidate: m.execution === "QUIZ" ? true : (m.validation_auto ?? false),
    videoUrl: m.video_url ?? null,
    minWatchSeconds: m.attente_secondes ?? null,
    questionsJson: m.questions?.length
      ? JSON.stringify(m.questions.map((q, i) => ({ ...q, id: `q${i + 1}` })))
      : null,
    resourcesJson: m.ressources?.length ? JSON.stringify(m.ressources) : null,
    todoJson: m.a_completer?.length ? JSON.stringify(m.a_completer) : null,
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
    removed: 0,
  };
  if (dryRun) {
    report.removed = await prisma.mission.count({
      where: { slug: { in: kit.missions_retirees ?? [] }, status: "BROUILLON", claims: { none: {} } },
    });
    return report;
  }

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

  // Nettoyage des doublons retirés du kit : uniquement des brouillons que personne n'a pris.
  if (kit.missions_retirees?.length) {
    const removed = await prisma.mission.deleteMany({
      where: { slug: { in: kit.missions_retirees }, status: "BROUILLON", claims: { none: {} } },
    });
    report.removed = removed.count;
  }
  return report;
}
