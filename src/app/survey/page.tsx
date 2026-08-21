"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { questionToSection } from "@/lib/chapters";

const STORAGE_KEY = "hr-survey";
const MAX_READER_NAME_LENGTH = 60;

const pastelBgs = [
  "hover:bg-blue-50 hover:border-accent-blue",
  "hover:bg-red-50 hover:border-accent-red",
  "hover:bg-stone-100 hover:border-accent-warm",
];

// Only these prompts map to variable book sections. Extra prompts can stay in the
// question bank for future expansion, but the live survey should not ask
// questions that don't affect the generated book code.
const surveyQuestions = questions.slice(0, questionToSection.length);

function cleanReaderName(name: unknown) {
  return String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_READER_NAME_LENGTH);
}

function loadSaved(): { current: number; answers: Record<number, string>; readerName: string } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const answers = Object.fromEntries(
        Object.entries(parsed.answers ?? {}).filter(([key, value]) => {
          const index = Number(key);
          return Number.isInteger(index) && index >= 0 && index < surveyQuestions.length && ["A", "B", "C"].includes(String(value));
        })
      ) as Record<number, string>;
      const readerName = cleanReaderName(parsed.readerName);
      const savedCurrent = Number(parsed.current);
      const current = Number.isInteger(savedCurrent)
        ? Math.min(Math.max(savedCurrent, 0), surveyQuestions.length - 1)
        : 0;
      return { current, answers, readerName };
    }
  } catch {}
  return { current: 0, answers: {}, readerName: "" };
}

function save(current: number, answers: Record<number, string>, readerName = "") {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ current, answers, readerName }));
  } catch {}
}

export default function Survey() {
  const router = useRouter();
  const [savedSurvey] = useState(() => loadSaved());
  const [current, setCurrent] = useState(savedSurvey.current);
  const [answers, setAnswers] = useState<Record<number, string>>(savedSurvey.answers);
  const [readerName, setReaderName] = useState(savedSurvey.readerName);
  const [animating, setAnimating] = useState(false);
  const [hasSurveyHistory, setHasSurveyHistory] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasMountedRef = useRef(false);

  const q = surveyQuestions[current];
  const total = surveyQuestions.length;
  const allAnswersComplete = surveyQuestions.every((_, index) => ["A", "B", "C"].includes(answers[index]));
  const progress = ((current) / total) * 100;

  // Sync to sessionStorage on change
  useEffect(() => { save(current, answers, readerName); }, [current, answers, readerName]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Move keyboard/screen-reader focus to the new prompt after answer/back navigation.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    questionHeadingRef.current?.focus({ preventScroll: true });
  }, [current]);

  // Push browser history entries per question so back/forward buttons work
  useEffect(() => {
    const initial = window.history.state?.surveyQ;
    if (initial === undefined) {
      window.history.replaceState({ surveyQ: current }, "");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = useCallback((q: number) => {
    if (reducedMotion) {
      setCurrent(q);
      setAnimating(false);
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      setCurrent(q);
      setAnimating(false);
    }, 300);
  }, [reducedMotion]);

  // Listen for browser back/forward
  useEffect(() => {
    function onPop(e: PopStateEvent) {
      const q = e.state?.surveyQ;
      if (typeof q === "number" && q >= 0 && q < total) {
        navigateTo(q);
      }
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [total, navigateTo]);

  function goBack() {
    if (current === 0 || animating) return;

    if (hasSurveyHistory) {
      window.history.back();
      return;
    }

    // A resumed survey can land on question 2+ without per-question history
    // entries, so the visible Back control should still move to the previous
    // question instead of sending the reader away from the survey.
    const previousQ = current - 1;
    window.history.replaceState({ surveyQ: previousQ }, "");
    navigateTo(previousQ);
  }

  function restartSurvey() {
    if (animating) return;

    const hasAnyAnswer = Object.keys(answers).length > 0;
    if (hasAnyAnswer && !window.confirm("Clear your current answers and restart the survey?")) {
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
    window.history.replaceState({ surveyQ: 0 }, "");
    setHasSurveyHistory(false);
    setAnswers({});
    setReaderName("");
    setCurrent(0);
  }

  function goToResults(nextAnswers = answers) {
    // Clear saved state and go to results
    sessionStorage.removeItem(STORAGE_KEY);
    const params = new URLSearchParams();
    surveyQuestions.forEach((_, index) => params.set(String(index), nextAnswers[index]));
    if (readerName) {
      params.set("name", readerName);
    }
    router.push(`/results?${params.toString()}`);
  }

  function select(value: string) {
    if (animating) return;
    setAnimating(true);
    const next = { ...answers, [current]: value };
    setAnswers(next);

    const advance = () => {
      if (current < total - 1) {
        const nextQ = current + 1;
        window.history.pushState({ surveyQ: nextQ }, "");
        setHasSurveyHistory(true);
        setCurrent(nextQ);
        setAnimating(false);
        return;
      }

      const firstUnanswered = surveyQuestions.findIndex((_, index) => !["A", "B", "C"].includes(next[index]));
      if (firstUnanswered !== -1) {
        window.history.pushState({ surveyQ: firstUnanswered }, "");
        setHasSurveyHistory(true);
        setCurrent(firstUnanswered);
        setAnimating(false);
        return;
      }

      goToResults(next);
    };

    if (reducedMotion) {
      advance();
    } else {
      setTimeout(advance, 400);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Progress */}
      <div className="w-full max-w-md mb-12">
        <div
          className="h-1 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Survey progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={current + 1}
          aria-valuetext={`Question ${current + 1} of ${total}`}
        >
          <div
            className="h-full bg-accent-blue transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right font-body" aria-live="polite">
          Question {current + 1} of {total}
        </p>
      </div>

      {/* Question */}
      <div
        className={`max-w-md w-full transition-all ${reducedMotion ? "duration-0" : "duration-300"} ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
        aria-busy={animating}
      >
        <h2
          ref={questionHeadingRef}
          tabIndex={-1}
          className="font-hand text-3xl md:text-4xl text-gray-900 mb-8 text-center leading-relaxed outline-none"
        >
          {q.text}
        </h2>

        <div className="space-y-4">
          {q.options.map((opt, i) => {
            const selected = answers[current] === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => select(opt.value)}
                disabled={animating}
                aria-pressed={selected}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all disabled:cursor-wait disabled:pointer-events-none ${reducedMotion ? "duration-0" : "duration-200"} ${
                  selected
                    ? "border-accent-blue bg-blue-50 shadow-sm"
                    : `border-gray-200 ${pastelBgs[i]}`
                } group`}
              >
                <span className={`font-hand text-lg mr-3 ${selected ? "text-accent-blue" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {opt.label})
                </span>
                <span className={`font-body ${selected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"}`}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 font-body text-sm">
          {current > 0 && (
            <button
              type="button"
              onClick={goBack}
              className={`flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors ${reducedMotion ? "duration-0" : "duration-200"}`}
            >
              <span>←</span> Back
            </button>
          )}
          {allAnswersComplete && (
            <button
              type="button"
              onClick={() => goToResults()}
              disabled={animating}
              className={`text-accent-blue underline underline-offset-4 hover:text-blue-700 transition-colors disabled:cursor-wait disabled:opacity-60 ${reducedMotion ? "duration-0" : "duration-200"}`}
            >
              See results
            </button>
          )}
          {Object.keys(answers).length > 0 && (
            <button
              type="button"
              onClick={restartSurvey}
              className={`text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors ${reducedMotion ? "duration-0" : "duration-200"}`}
            >
              Start over
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
