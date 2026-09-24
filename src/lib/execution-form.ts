import {
  DEFAULT_MIN_WATCH_SECONDS,
  isExecution,
  parseQuestions,
  validateQuestions,
  videoSource,
  type Execution,
} from "@/lib/mission-content";

export type ExecutionData = {
  execution: Execution;
  videoUrl: string | null;
  minWatchSeconds: number | null;
  questionsJson: string | null;
  autoValidate: boolean;
};

// Lit les champs "exécution sur la plateforme" d'un formulaire de mission (entreprise ou
// administrateur) et les contrôle. uploadedVideoUrl = fichier vidéo téléversé, prioritaire
// sur le lien saisi.
export function parseExecutionForm(
  formData: FormData,
  uploadedVideoUrl: string | null
): { error: string } | { data: ExecutionData } {
  const rawExecution = (formData.get("execution") as string) || "PREUVE";
  if (!isExecution(rawExecution)) return { error: "Mode d'exécution invalide." };
  if (rawExecution === "PREUVE") {
    return {
      data: { execution: "PREUVE", videoUrl: null, minWatchSeconds: null, questionsJson: null, autoValidate: false },
    };
  }

  const questions = parseQuestions(formData.get("questionsJson") as string | null).map((q, i) => ({
    ...q,
    id: `q${i + 1}`,
  }));
  const problem = validateQuestions(rawExecution, questions);
  if (problem) return { error: problem };

  const typedUrl = ((formData.get("videoUrl") as string) || "").trim();
  const videoUrl = uploadedVideoUrl ?? (typedUrl || null);
  if (videoUrl && !videoSource(videoUrl)) return { error: "Lien de vidéo invalide (adresse complète attendue)." };
  if (rawExecution === "QUIZ" && videoUrl && videoSource(videoUrl)?.kind === "link") {
    return {
      error: "Ce lien ne peut pas être lu dans PubAfric. Utilisez YouTube, Vimeo, Facebook, ou téléversez le fichier vidéo.",
    };
  }

  let minWatchSeconds: number | null = null;
  if (rawExecution === "QUIZ" && videoUrl) {
    const n = parseInt(formData.get("minWatchSeconds") as string, 10);
    minWatchSeconds = Number.isFinite(n) && n > 0 ? Math.min(n, 3600) : DEFAULT_MIN_WATCH_SECONDS;
  }

  return {
    data: {
      execution: rawExecution,
      videoUrl,
      minWatchSeconds,
      questionsJson: JSON.stringify(questions),
      // Un quiz est toujours validé automatiquement ; un sondage seulement si l'entreprise le choisit.
      autoValidate: rawExecution === "QUIZ" ? true : formData.get("autoValidate") === "on",
    },
  };
}
