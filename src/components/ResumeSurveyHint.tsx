"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "hr-survey";
const TOTAL_SURVEY_QUESTIONS = 8;

type SavedSurvey = {
  current?: unknown;
  answers?: Record<string, unknown>;
};

function getResumeQuestion(saved: SavedSurvey): number | null {
  const current = Number(saved.current);
  if (!Number.isInteger(current) || current < 0 || current >= TOTAL_SURVEY_QUESTIONS) {
    return null;
  }

  const answers = saved.answers ?? {};
  const hasProgress = Object.entries(answers).some(([key, value]) => {
    const index = Number(key);
    return Number.isInteger(index) && index >= 0 && index < TOTAL_SURVEY_QUESTIONS && ["A", "B", "C"].includes(String(value));
  });

  return hasProgress ? current + 1 : null;
}

export default function ResumeSurveyHint() {
  const [resumeQuestion, setResumeQuestion] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      setResumeQuestion(getResumeQuestion(JSON.parse(raw)));
    } catch {
      setResumeQuestion(null);
    }
  }, []);

  if (!resumeQuestion) return null;

  return (
    <p className="font-body text-xs text-gray-400">
      Saved progress found. {" "}
      <Link href="/survey" className="text-accent-blue underline underline-offset-4 hover:text-blue-700">
        Resume at question {resumeQuestion} of {TOTAL_SURVEY_QUESTIONS}
      </Link>
    </p>
  );
}
