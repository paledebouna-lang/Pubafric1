"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Gauge from "@/components/Gauge";
import { startWatching, submitExecution, type ExecState } from "./actions";
import type { Question, VideoSource } from "@/lib/mission-content";

type PublicQuestion = Omit<Question, "correct">;
type Phase = "intro" | "watching" | "questions" | "result";

export default function ExecuteMission({
  claimId,
  execution,
  video,
  minWatchSeconds,
  questions,
  attemptsUsed,
  maxAttempts,
  watchStartedAtMs,
  serverNowMs,
}: {
  claimId: string;
  execution: "QUIZ" | "SONDAGE";
  video: VideoSource | null;
  minWatchSeconds: number;
  questions: PublicQuestion[];
  attemptsUsed: number;
  maxAttempts: number;
  watchStartedAtMs: number | null;
  serverNowMs: number;
}) {
  const needsWatch = execution === "QUIZ" && (video !== null || minWatchSeconds > 0);
  const [phase, setPhase] = useState<Phase>(needsWatch ? (watchStartedAtMs ? "watching" : "intro") : "questions");
  // Décalage entre l'horloge du serveur et celle du téléphone : le compte à rebours reste juste.
  const [offset] = useState(() => serverNowMs - Date.now());
  const [startedAt, setStartedAt] = useState<number | null>(watchStartedAtMs);
  const [remaining, setRemaining] = useState(minWatchSeconds);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [result, setResult] = useState<ExecState | null>(null);
  const [gauge, setGauge] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "watching" || startedAt === null) return;
    const tick = () => {
      const elapsed = (Date.now() + offset - startedAt) / 1000;
      setRemaining(Math.max(0, Math.ceil(minWatchSeconds - elapsed)));
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [phase, startedAt, minWatchSeconds, offset]);

  function begin() {
    setError(null);
    startTransition(async () => {
      const res = await startWatching(claimId);
      if (res.error) {
        setError(res.error);
        return;
      }
      setStartedAt(Date.now() + offset);
      setPhase("watching");
    });
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await submitExecution(claimId, JSON.stringify(answers));
      if (res.error) {
        setError(res.error);
        return;
      }
      setResult(res);
      setPhase("result");
      // La jauge se remplit après l'affichage du résultat, pour l'animation.
      setTimeout(() => setGauge(res.percent ?? 0), 50);
    });
  }

  const answeredAll = questions.every((q) => {
    const a = answers[q.id];
    return q.type === "choice" ? typeof a === "number" : typeof a === "string" && a.trim().length > 0;
  });

  // ---- Résultat ----
  if (phase === "result" && result) {
    if (result.done) {
      return (
        <div className="border border-brand-teal bg-brand-teal/10 p-6 text-center">
          {execution === "QUIZ" && <Gauge percent={gauge} />}
          <p className="mt-4 text-lg font-extrabold text-brand-teal">
            {result.done === "VALIDEE" ? "Bravo, mission validée !" : "Réponses envoyées !"}
          </p>
          <p className="mt-2 text-sm text-[#4a5262]">
            {result.done === "VALIDEE"
              ? "Votre gain a été crédité sur votre portefeuille."
              : "Elles sont en attente de validation par l'entreprise : vous serez crédité dès qu'elle les aura validées."}
          </p>
          <Link href="/missions" className="mt-5 inline-block bg-brand-blue px-6 py-3 text-sm font-bold text-white">
            VOIR MES MISSIONS
          </Link>
        </div>
      );
    }
    return (
      <div className="border border-brand-coral bg-brand-coral/10 p-6">
        <Gauge percent={gauge} />
        <p className="mt-4 text-sm font-bold text-[#2b2f38]">
          {result.correct}/{result.total} bonnes réponses : la jauge n&apos;est pas à 100 %.
        </p>
        {result.lost ? (
          <>
            <p className="mt-2 text-sm text-[#4a5262]">
              Vous avez utilisé vos {maxAttempts} essais : cette mission est terminée pour vous et la place est libérée.
            </p>
            <Link href="/missions" className="mt-4 inline-block bg-brand-blue px-6 py-3 text-sm font-bold text-white">
              CHOISIR UNE AUTRE MISSION
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-[#4a5262]">
              {needsWatch
                ? "Regardez le contenu une nouvelle fois avec attention, puis reprenez vos réponses."
                : "Relisez attentivement chaque question, puis reprenez vos réponses."}{" "}
              Il vous reste{" "}
              <strong>
                {result.attemptsLeft} essai{(result.attemptsLeft ?? 0) > 1 ? "s" : ""}
              </strong>
              .
            </p>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setAnswers({});
                setGauge(0);
                setResult(null);
                if (needsWatch) {
                  begin();
                } else {
                  setPhase("questions");
                }
              }}
              className="mt-4 bg-brand-blue px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {needsWatch ? "REVOIR LA VIDÉO ET REPRENDRE" : "REPRENDRE MES RÉPONSES"}
            </button>
          </>
        )}
      </div>
    );
  }

  // ---- Visionnage ----
  if (needsWatch && (phase === "intro" || phase === "watching")) {
    return (
      <div>
        <p className="text-sm text-[#4a5262]">
          Étape 1 : regardez attentivement le contenu jusqu&apos;au bout. Étape 2 : répondez aux{" "}
          {questions.length} questions. Chaque bonne réponse remplit la jauge ; à 100 %, la mission est validée.
          {attemptsUsed > 0 && ` (Essais déjà utilisés : ${attemptsUsed}/${maxAttempts}.)`}
        </p>
        <div className="mt-4">
          <Gauge percent={0} />
        </div>

        {phase === "intro" ? (
          <button
            type="button"
            disabled={pending}
            onClick={begin}
            className="mt-6 bg-brand-red px-8 py-4 text-sm font-bold tracking-wide text-white disabled:opacity-60"
          >
            {pending ? "..." : "COMMENCER LE VISIONNAGE"}
          </button>
        ) : (
          <div className="mt-6">
            {video?.kind === "iframe" && (
              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  src={video.src}
                  title="Vidéo de la mission"
                  className="h-full w-full"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
            {video?.kind === "file" && (
              <video src={video.src} controls playsInline className="aspect-video w-full bg-black" />
            )}
            {video?.kind === "link" && (
              <a href={video.src} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue underline">
                Ouvrir le contenu dans un nouvel onglet
              </a>
            )}

            <button
              type="button"
              disabled={remaining > 0}
              onClick={() => setPhase("questions")}
              className="mt-4 bg-brand-blue px-8 py-4 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {remaining > 0 ? `RÉPONDRE AUX QUESTIONS (dans ${remaining} s)` : "J'AI TERMINÉ : RÉPONDRE AUX QUESTIONS"}
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-sm font-semibold text-brand-coral">{error}</p>}
      </div>
    );
  }

  // ---- Questions ----
  return (
    <div>
      {execution === "QUIZ" && (
        <div className="mb-6">
          <Gauge percent={0} />
        </div>
      )}
      <ol className="flex flex-col gap-6">
        {questions.map((q, i) => (
          <li key={q.id} className="border border-border-soft bg-white p-4">
            <p className="text-sm font-bold text-[#2b2f38]">
              {i + 1}. {q.text}
            </p>
            {q.type === "choice" ? (
              <div className="mt-3 flex flex-col gap-2">
                {q.options?.map((opt, oi) => (
                  <label key={oi} className="flex cursor-pointer items-center gap-3 text-sm text-[#4a5262]">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === oi}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                rows={3}
                value={(answers[q.id] as string) ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Votre réponse..."
                className="mt-3 w-full border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue"
              />
            )}
          </li>
        ))}
      </ol>

      {error && <p className="mt-4 text-sm font-semibold text-brand-coral">{error}</p>}
      <button
        type="button"
        disabled={pending || !answeredAll}
        onClick={submit}
        className="mt-6 bg-brand-teal px-8 py-4 text-sm font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "VÉRIFICATION..." : execution === "QUIZ" ? "VALIDER MES RÉPONSES" : "ENVOYER MES RÉPONSES"}
      </button>
      {!answeredAll && <p className="mt-2 text-xs text-[#9aa2b1]">Répondez à toutes les questions pour valider.</p>}
    </div>
  );
}
