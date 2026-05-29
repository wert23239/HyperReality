"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { buildBookCode, getChaptersFromCode, isValidBookCode, normalizeBookCode, questionToSection } from "@/lib/chapters";
import Link from "next/link";
import CodeEntry from "@/components/CodeEntry";

const SURVEY_STORAGE_KEY = "hr-survey";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Support direct code param (from "Have a code?" flow) or answer params
  const directCode = searchParams.get("code");
  let code: string;
  if (directCode) {
    code = normalizeBookCode(directCode);
  } else {
    const answers: Record<number, string> = {};
    searchParams.forEach((v, k) => {
      const idx = parseInt(k);
      if (!isNaN(idx)) answers[idx] = v;
    });

    const hasAllSurveyAnswers = questionToSection.every((_, i) => (
      ["A", "B", "C"].includes(answers[i])
    ));

    code = hasAllSurveyAnswers ? buildBookCode(answers) : "";
  }
  const isValid = isValidBookCode(code);
  const chapters = isValid ? getChaptersFromCode(code) : [];

  useEffect(() => {
    if (isValid) {
      sessionStorage.removeItem(SURVEY_STORAGE_KEY);
    }
  }, [isValid]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(chapters.length);
      return;
    }

    if (revealed < chapters.length) {
      const timer = setTimeout(() => setRevealed((r) => r + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [revealed, chapters.length, reducedMotion]);

  if (!isValid) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="font-hand text-5xl text-gray-900">Code not found</h1>
          <p className="font-body text-gray-500 leading-relaxed">
            That link doesn't match a real Hyper Reality book code. Paste the code again below, or take the survey to generate a fresh one.
          </p>
          <CodeEntry defaultOpen initialCode={directCode ?? ""} />
          <Link
            href="/survey"
            className="inline-block border-2 border-accent-blue text-accent-blue px-8 py-3 rounded-full font-hand text-2xl hover:bg-accent-blue hover:text-white transition-all duration-300 hover:scale-105"
          >
            Take the survey
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="max-w-lg w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-hand text-5xl text-gray-900">Your Book</h1>
          <p className="font-body text-sm text-gray-400 tracking-wider uppercase">
            110 pages, unique to you
          </p>
        </div>

        {/* Code */}
        <div className="text-center">
          <p className="font-hand text-2xl text-accent-blue tracking-wide">{code}</p>
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          {chapters.map((ch, i) => (
            <div
              key={ch.key}
              className={`flex items-baseline gap-4 transition-all duration-500 ${
                i < revealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <span className="font-hand text-2xl text-gray-300 w-8 text-right shrink-0">
                {ch.key.replace(/[ABC]/, "")}
              </span>
              <span className="font-body text-gray-700">{ch.title}</span>
              {ch.key.match(/[ABC]/) && (
                <span className="font-hand text-sm text-accent-warm">
                  {ch.key.slice(-1)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-8 space-y-6">
          <h2 className="font-hand text-3xl text-center text-gray-900">Get Your Copy</h2>

          <div className="grid grid-cols-2 gap-4">
            <div
              role="status"
              aria-label="PDF ordering is coming soon"
              className="text-center p-6 rounded-xl border-2 border-gray-200 bg-gray-50/60"
            >
              <p className="font-hand text-2xl text-gray-900">PDF</p>
              <p className="font-body text-sm text-gray-500 mt-1">$20 via Venmo</p>
              <p className="font-body text-xs text-gray-400 mt-3">Ordering opens soon</p>
            </div>
            <div
              role="status"
              aria-label="Print ordering is coming soon"
              className="text-center p-6 rounded-xl border-2 border-gray-200 bg-gray-50/60"
            >
              <p className="font-hand text-2xl text-gray-900">Print</p>
              <p className="font-body text-sm text-gray-500 mt-1">$5 on Amazon</p>
              <p className="font-body text-xs text-gray-400 mt-3">Ordering opens soon</p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="text-center pt-4">
          <Link href="/" className="font-hand text-lg text-gray-400 hover:text-gray-600 transition-colors">
            ← Start over
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-hand text-2xl text-gray-300">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
