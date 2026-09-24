"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getModerationBlock } from "@/lib/moderation";
import {
  MAX_QUIZ_ATTEMPTS,
  formatAnswers,
  parseQuestions,
  scoreQuiz,
  validateSurveyAnswers,
} from "@/lib/mission-content";
import { submitClaimOnPlatform } from "@/lib/settlement";

export type ExecState = {
  error?: string;
  // Quiz : résultat de la tentative
  percent?: number;
  correct?: number;
  total?: number;
  attemptsLeft?: number;
  lost?: boolean; // toutes les tentatives sont épuisées
  // Envoi accepté
  done?: "VALIDEE" | "SOUMISE";
};

// Slack laissé au navigateur (chargement de la vidéo, horloges légèrement décalées).
const WATCH_TOLERANCE_MS = 3000;

async function loadOwnClaim(claimId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "INTERNAUTE") return { error: "Non autorisé." } as const;
  const block = await getModerationBlock(session.user.id);
  if (block) return { error: block } as const;

  const claim = await prisma.missionClaim.findUnique({
    where: { id: claimId },
    include: { mission: true },
  });
  if (!claim || claim.userId !== session.user.id) return { error: "Mission introuvable." } as const;
  if (claim.status !== "EN_COURS") return { error: "Cette mission n'est plus en cours." } as const;
  if (claim.expiresAt < new Date()) return { error: "Le délai de cette mission est dépassé." } as const;
  return { claim } as const;
}

// Démarre (ou redémarre après un échec) le visionnage : le chronomètre est côté serveur.
export async function startWatching(claimId: string): Promise<{ error?: string }> {
  const res = await loadOwnClaim(claimId);
  if ("error" in res) return { error: res.error };
  await prisma.missionClaim.update({ where: { id: claimId }, data: { watchStartedAt: new Date() } });
  return {};
}

export async function submitExecution(claimId: string, answersRaw: string): Promise<ExecState> {
  const res = await loadOwnClaim(claimId);
  if ("error" in res) return { error: res.error };
  const { claim } = res;
  const { mission } = claim;

  if (mission.execution !== "QUIZ" && mission.execution !== "SONDAGE") {
    return { error: "Cette mission ne s'exécute pas sur la plateforme." };
  }
  const questions = parseQuestions(mission.questionsJson);
  if (questions.length === 0) return { error: "Cette mission n'a pas encore de questions." };

  let answers: Record<string, unknown>;
  try {
    const parsed = JSON.parse(answersRaw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    answers = parsed as Record<string, unknown>;
  } catch {
    return { error: "Réponses invalides." };
  }

  if (mission.execution === "SONDAGE") {
    const problem = validateSurveyAnswers(questions, answers);
    if (problem) return { error: problem };
    const result = await submitClaimOnPlatform(
      claimId,
      { report: formatAnswers(questions, answers), answersJson: JSON.stringify(answers) },
      mission.autoValidate
    );
    if (result === "DEJA_TRAITEE") return { error: "Cette mission a déjà été envoyée." };
    revalidatePath("/missions");
    revalidatePath("/entreprise/missions");
    return { done: result };
  }

  // --- QUIZ ---
  if (mission.videoUrl || mission.minWatchSeconds) {
    const needed = (mission.minWatchSeconds ?? 0) * 1000 - WATCH_TOLERANCE_MS;
    const elapsed = claim.watchStartedAt ? Date.now() - claim.watchStartedAt.getTime() : -1;
    if (elapsed < 0 || elapsed < needed) {
      return { error: "Regardez le contenu en entier avant de répondre aux questions." };
    }
  }

  const score = scoreQuiz(questions, answers);
  const attempts = claim.attempts + 1;

  if (score.percent < 100) {
    const lost = attempts >= MAX_QUIZ_ATTEMPTS;
    await prisma.missionClaim.update({
      where: { id: claimId },
      data: {
        attempts,
        score: Math.max(claim.score ?? 0, score.percent),
        // Un nouvel essai impose de regarder à nouveau le contenu.
        watchStartedAt: null,
        ...(lost ? { status: "EXPIREE" } : {}),
      },
    });
    revalidatePath("/missions");
    return {
      percent: score.percent,
      correct: score.correct,
      total: score.total,
      attemptsLeft: MAX_QUIZ_ATTEMPTS - attempts,
      lost,
    };
  }

  await prisma.missionClaim.update({ where: { id: claimId }, data: { attempts } });
  const result = await submitClaimOnPlatform(
    claimId,
    {
      report: `Quiz réussi à 100 % (${score.correct}/${score.total}) au bout de ${attempts} essai${attempts > 1 ? "s" : ""}.`,
      answersJson: JSON.stringify(answers),
      score: 100,
    },
    true
  );
  if (result === "DEJA_TRAITEE") return { error: "Cette mission a déjà été envoyée." };
  revalidatePath("/missions");
  revalidatePath("/entreprise/missions");
  return { percent: 100, correct: score.correct, total: score.total, done: result };
}
