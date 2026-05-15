"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";
import { questionToSection } from "@/lib/chapters";

const STORAGE_KEY = "hr-survey";

const pastelBgs = [
  "hover:bg-blue-50 hover:border-accent-blue",
  "hover:bg-red-50 hover:border-accent-red",
  "hover:bg-stone-100 hover:border-accent-warm",
];

// Only these prompts map to variable book sections. Extra prompts can stay in the
// question bank for future expansion, but the live survey should not ask
// questions that don't affect the generated book code.
const surveyQuestions = questions.slice(0, questionToSection.length);

function loadSaved(): { current: number; answers: Record<number, string> } {
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
      const savedCurrent = Number(parsed.current);
      const current = Number.isInteger(savedCurrent)
        ? Math.min(Math.max(savedCurrent, 0), surveyQuestions.length - 1)
        : 0;
      return { current, answers };
    }
  } catch {}
  return { current: 0, answers: {} };
}

function save(current: number, answers: Record<number, string>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ current, answers }));
  } catch {}
}

export default function Survey() {
  const router = useRouter();
  const [current, setCurrent] = useState(() => loadSaved().current);
  const [answers, setAnswers] = useState<Record<number, string>>(() => loadSaved().answers);
  const [animating, setAnimating] = useState(false);

  const q = surveyQuestions[current];
  const total = surveyQuestions.length;
  const progress = ((current) / total) * 100;

  // Sync to sessionStorage on change
  useEffect(() => { save(current, answers); }, [current, answers]);

  // Push browser history entries per question so back/forward buttons work
  useEffect(() => {
    const initial = window.history.state?.surveyQ;
    if (initial === undefined) {
      window.history.replaceState({ surveyQ: current }, "");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = useCallback((q: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(q);
      setAnimating(false);
    }, 300);
  }, []);

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
    window.history.back();
  }

  function select(value: string) {
    if (animating) return;
    setAnimating(true);
    const next = { ...answers, [current]: value };
    setAnswers(next);

    setTimeout(() => {
      if (current < total - 1) {
        const nextQ = current + 1;
        window.history.pushState({ surveyQ: nextQ }, "");
        setCurrent(nextQ);
        setAnimating(false);
      } else {
        // Clear saved state and go to results
        sessionStorage.removeItem(STORAGE_KEY);
        const params = new URLSearchParams();
        Object.entries(next).forEach(([k, v]) => params.set(k, v));
        router.push(`/results?${params.toString()}`);
      }
    }, 400);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* Progress */}
      <div className="w-full max-w-md mb-12">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-blue transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right font-body">
          {current + 1} / {total}
        </p>
      </div>

      {/* Question */}
      <div
        className={`max-w-md w-full transition-all duration-300 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <h2 className="font-hand text-3xl md:text-4xl text-gray-900 mb-8 text-center leading-relaxed">
          {q.text}
        </h2>

        <div className="space-y-4">
          {q.options.map((opt, i) => {
            const selected = answers[current] === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                aria-pressed={selected}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
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

        {current > 0 && (
          <button
            onClick={goBack}
            className="mt-6 flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 mx-auto font-body text-sm"
          >
            <span>←</span> Back
          </button>
        )}
      </div>
    </main>
  );
}
