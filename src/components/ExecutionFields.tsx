"use client";

import { useState } from "react";
import { EXECUTION_LABEL, type Execution } from "@/lib/mission-content";

type BuilderQuestion = {
  text: string;
  type: "choice" | "text";
  options: string[];
  correct: number;
};

const blankQuestion = (): BuilderQuestion => ({ text: "", type: "choice", options: ["", ""], correct: 0 });

const inputClass =
  "border border-border-soft bg-muted-bg px-3 py-2 text-sm outline-none focus:border-brand-blue";

// Champs "mode d'exécution" d'un formulaire de mission : preuve classique, vidéo + quiz
// (chaque bonne réponse remplit la jauge, validation automatique à 100 %) ou questionnaire.
export default function ExecutionFields() {
  const [execution, setExecution] = useState<Execution>("PREUVE");
  const [questions, setQuestions] = useState<BuilderQuestion[]>([blankQuestion()]);

  const update = (i: number, patch: Partial<BuilderQuestion>) =>
    setQuestions((qs) => qs.map((q, qi) => (qi === i ? { ...q, ...patch } : q)));

  const json = JSON.stringify(
    questions.map((q) => {
      const isChoice = execution === "QUIZ" || q.type === "choice";
      if (!isChoice) return { text: q.text, type: "text", minLength: 10 };
      const options = q.options.filter((o) => o.trim());
      // La bonne réponse est repérée par sa position parmi les réponses non vides.
      const correct = q.options.slice(0, q.correct).filter((o) => o.trim()).length;
      const correctIsBlank = !q.options[q.correct]?.trim();
      return {
        text: q.text,
        type: "choice",
        options,
        ...(execution === "QUIZ" ? { correct: correctIsBlank ? -1 : correct } : {}),
      };
    })
  );

  return (
    <div className="flex flex-col gap-3 border border-dashed border-brand-blue/40 p-4">
      <label className="text-xs font-bold uppercase tracking-wide text-brand-blue">
        Comment l&apos;internaute réalise-t-il la mission ?
        <select
          name="execution"
          value={execution}
          onChange={(e) => setExecution(e.target.value as Execution)}
          className={`mt-1 block w-full ${inputClass} normal-case`}
        >
          {(Object.keys(EXECUTION_LABEL) as Execution[]).map((k) => (
            <option key={k} value={k}>
              {EXECUTION_LABEL[k]}
            </option>
          ))}
        </select>
      </label>

      {execution !== "PREUVE" && (
        <>
          <input type="hidden" name="questionsJson" value={json} />

          {execution === "QUIZ" && (
            <div className="flex flex-col gap-3">
              <input
                name="videoUrl"
                type="url"
                placeholder="Lien de la vidéo (YouTube, Vimeo, Facebook…) — ou téléversez un fichier ci-dessous"
                className={inputClass}
              />
              <label className="text-xs text-[#7c8797]">
                Ou fichier vidéo (mp4)
                <input name="contentVideo" type="file" accept="video/*" className="mt-1 block w-full text-xs" />
              </label>
              <label className="text-xs text-[#7c8797]">
                Durée de la vidéo en secondes (l&apos;internaute ne peut pas répondre avant)
                <input
                  name="minWatchSeconds"
                  type="number"
                  min="5"
                  max="3600"
                  defaultValue={30}
                  className={`mt-1 block w-40 ${inputClass}`}
                />
              </label>
              <p className="text-xs text-[#7c8797]">
                Chaque bonne réponse remplit la jauge. À 100 %, la mission est validée et payée
                automatiquement ; sinon l&apos;internaute revoit la vidéo et reprend ses réponses (3 essais).
              </p>
            </div>
          )}

          {execution === "SONDAGE" && (
            <label className="flex items-center gap-2 text-sm text-[#2b2f38]">
              <input type="checkbox" name="autoValidate" />
              Payer automatiquement dès que le questionnaire est envoyé (sans validation de ma part)
            </label>
          )}

          <div className="flex flex-col gap-4">
            {questions.map((q, i) => (
              <div key={i} className="border border-border-soft bg-white p-3">
                <div className="flex gap-2">
                  <input
                    value={q.text}
                    onChange={(e) => update(i, { text: e.target.value })}
                    placeholder={`Question ${i + 1}`}
                    className={`flex-1 ${inputClass}`}
                  />
                  {execution === "SONDAGE" && (
                    <select
                      value={q.type}
                      onChange={(e) => update(i, { type: e.target.value as "choice" | "text" })}
                      className={inputClass}
                    >
                      <option value="choice">Choix</option>
                      <option value="text">Réponse libre</option>
                    </select>
                  )}
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setQuestions((qs) => qs.filter((_, qi) => qi !== i))}
                      className="px-2 text-xs font-bold text-brand-coral"
                      aria-label="Supprimer la question"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {(execution === "QUIZ" || q.type === "choice") && (
                  <div className="mt-2 flex flex-col gap-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        {execution === "QUIZ" && (
                          <input
                            type="radio"
                            name={`correct-${i}`}
                            checked={q.correct === oi}
                            onChange={() => update(i, { correct: oi })}
                            title="Bonne réponse"
                          />
                        )}
                        <input
                          value={opt}
                          onChange={(e) =>
                            update(i, { options: q.options.map((o, k) => (k === oi ? e.target.value : o)) })
                          }
                          placeholder={`Réponse ${oi + 1}`}
                          className={`flex-1 ${inputClass}`}
                        />
                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              update(i, {
                                options: q.options.filter((_, k) => k !== oi),
                                correct: q.correct >= oi && q.correct > 0 ? q.correct - 1 : q.correct,
                              })
                            }
                            className="px-2 text-xs font-bold text-brand-coral"
                            aria-label="Supprimer la réponse"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {q.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => update(i, { options: [...q.options, ""] })}
                        className="self-start text-xs font-bold text-brand-blue"
                      >
                        + Ajouter une réponse
                      </button>
                    )}
                    {execution === "QUIZ" && (
                      <p className="text-xs text-[#9aa2b1]">Cochez le rond de la bonne réponse.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setQuestions((qs) => [...qs, blankQuestion()])}
            className="self-start border border-brand-blue px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            + AJOUTER UNE QUESTION
          </button>
        </>
      )}
    </div>
  );
}
