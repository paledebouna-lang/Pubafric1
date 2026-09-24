// Contenu des missions exécutées directement sur la plateforme (quiz après vidéo, sondage)
// et ressources affichées avec une mission. Fonctions pures, sans base de données.

export type Execution = "PREUVE" | "QUIZ" | "SONDAGE";

export const EXECUTION_LABEL: Record<Execution, string> = {
  PREUVE: "Compte-rendu avec preuves",
  QUIZ: "Vidéo / contenu + quiz (validation automatique)",
  SONDAGE: "Questionnaire sur la plateforme",
};

// Nombre d'essais du quiz : au-delà, la mission est perdue et la place est libérée.
export const MAX_QUIZ_ATTEMPTS = 3;
// Durée minimale de visionnage par défaut quand une vidéo est fournie sans durée précisée.
export const DEFAULT_MIN_WATCH_SECONDS = 30;

export type Question = {
  id: string;
  type: "choice" | "text";
  text: string;
  options?: string[]; // type "choice"
  correct?: number; // quiz uniquement : index de la bonne option
  minLength?: number; // type "text" : longueur minimale de la réponse
};

export type Resource = {
  label: string;
  text?: string; // texte à copier / lire
  url?: string; // lien ; "env:NOM" = lien lu dans une variable d'environnement
  image?: string; // visuel à télécharger
};

export function isExecution(v: unknown): v is Execution {
  return v === "PREUVE" || v === "QUIZ" || v === "SONDAGE";
}

function safeJson(raw: string | null | undefined): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseQuestions(raw: string | null | undefined): Question[] {
  const data = safeJson(raw);
  if (!Array.isArray(data)) return [];
  const out: Question[] = [];
  data.forEach((q, i) => {
    if (!q || typeof q !== "object") return;
    const item = q as Record<string, unknown>;
    if (typeof item.text !== "string" || !item.text.trim()) return;
    const options = Array.isArray(item.options)
      ? item.options.filter((o): o is string => typeof o === "string" && o.trim() !== "")
      : undefined;
    const type = item.type === "text" || !options || options.length === 0 ? "text" : "choice";
    out.push({
      id: typeof item.id === "string" && item.id ? item.id : `q${i + 1}`,
      type,
      text: item.text.trim(),
      ...(type === "choice" ? { options } : {}),
      ...(typeof item.correct === "number" ? { correct: item.correct } : {}),
      ...(typeof item.minLength === "number" ? { minLength: item.minLength } : {}),
    });
  });
  return out;
}

// Questions envoyées au navigateur de l'internaute : jamais les bonnes réponses.
export function publicQuestions(questions: Question[]): Omit<Question, "correct">[] {
  return questions.map(({ correct: _correct, ...rest }) => {
    void _correct;
    return rest;
  });
}

export function parseResources(raw: string | null | undefined): Resource[] {
  const data = safeJson(raw);
  if (!Array.isArray(data)) return [];
  return data.filter(
    (r): r is Resource => !!r && typeof r === "object" && typeof (r as Resource).label === "string"
  );
}

export function parseTodo(raw: string | null | undefined): string[] {
  const data = safeJson(raw);
  return Array.isArray(data) ? data.filter((t): t is string => typeof t === "string") : [];
}

// Résout un lien "env:NOM" ; renvoie null tant que la variable n'est pas renseignée.
export function resolveResourceUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("env:")) return process.env[url.slice(4)]?.trim() || null;
  return url;
}

// Contrôle d'un questionnaire avant enregistrement. Renvoie un message d'erreur ou null.
export function validateQuestions(execution: Execution, questions: Question[]): string | null {
  if (execution === "PREUVE") return null;
  if (questions.length === 0) return "Ajoutez au moins une question.";
  if (questions.length > 40) return "40 questions maximum.";
  for (const [i, q] of questions.entries()) {
    const n = i + 1;
    if (q.type === "choice") {
      if (!q.options || q.options.length < 2) return `Question ${n} : au moins 2 choix de réponse.`;
      if (q.options.length > 8) return `Question ${n} : 8 choix maximum.`;
    }
    if (execution === "QUIZ") {
      if (q.type !== "choice") return `Question ${n} : un quiz n'accepte que des questions à choix.`;
      if (typeof q.correct !== "number" || q.correct < 0 || q.correct >= (q.options?.length ?? 0)) {
        return `Question ${n} : indiquez la bonne réponse.`;
      }
    }
  }
  return null;
}

export type QuizScore = { correct: number; total: number; percent: number };

// answers : id de question -> index de l'option choisie.
export function scoreQuiz(questions: Question[], answers: Record<string, unknown>): QuizScore {
  const total = questions.length;
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

// Contrôle des réponses d'un sondage. Renvoie un message d'erreur ou null.
export function validateSurveyAnswers(
  questions: Question[],
  answers: Record<string, unknown>
): string | null {
  for (const [i, q] of questions.entries()) {
    const a = answers[q.id];
    if (q.type === "choice") {
      if (typeof a !== "number" || a < 0 || a >= (q.options?.length ?? 0)) {
        return `Question ${i + 1} : choisissez une réponse.`;
      }
    } else {
      const min = q.minLength ?? 3;
      if (typeof a !== "string" || a.trim().length < min) {
        return `Question ${i + 1} : réponse trop courte (au moins ${min} caractères).`;
      }
    }
  }
  return null;
}

// Texte lisible des réponses, stocké comme compte-rendu pour que l'entreprise le relise.
export function formatAnswers(questions: Question[], answers: Record<string, unknown>): string {
  return questions
    .map((q, i) => {
      const a = answers[q.id];
      const shown = q.type === "choice" && typeof a === "number" ? (q.options?.[a] ?? "—") : String(a ?? "—").trim();
      return `${i + 1}. ${q.text}\n→ ${shown}`;
    })
    .join("\n\n");
}

// --- Vidéo -------------------------------------------------------------------------

export type VideoSource =
  | { kind: "iframe"; src: string }
  | { kind: "file"; src: string }
  | { kind: "link"; src: string };

export function videoSource(url: string | null | undefined): VideoSource | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    return id ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` } : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)/)?.[1];
    return id ? { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` } : null;
  }
  if (host === "vimeo.com") {
    const id = u.pathname.match(/\/(\d+)/)?.[1];
    return id ? { kind: "iframe", src: `https://player.vimeo.com/video/${id}` } : null;
  }
  if (host === "facebook.com" || host === "fb.watch") {
    return {
      kind: "iframe",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
    };
  }
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u.pathname) || host.endsWith("blob.vercel-storage.com")) {
    return { kind: "file", src: url };
  }
  return { kind: "link", src: url };
}
