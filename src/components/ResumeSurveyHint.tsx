"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { questionToSection } from "@/lib/chapters";

const STORAGE_KEY = "hr-survey";
const TOTAL_SURVEY_QUESTIONS = questionToSection.length;
const MAX_READER_NAME_LENGTH = 60;

type SavedSurvey = {
  current?: unknown;
  answers?: Record<string, unknown>;
  readerName?: unknown;
};

function cleanReaderName(name: unknown) {
  return String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_READER_NAME_LENGTH);
}

function getResumeDetails(saved: SavedSurvey): { question: number; readerName: string } | null {
  const current = Number(saved.current);
  if (!Number.isInteger(current) || current < 0 || current >= TOTAL_SURVEY_QUESTIONS) {
    return null;
  }

  const answers = saved.answers ?? {};
  const hasProgress = Object.entries(answers).some(([key, value]) => {
    const index = Number(key);
    return Number.isInteger(index) && index >= 0 && index < TOTAL_SURVEY_QUESTIONS && ["A", "B", "C"].includes(String(value));
  });

  return hasProgress ? { question: current + 1, readerName: cleanReaderName(saved.readerName) } : null;
}

export default function ResumeSurveyHint() {
  const router = useRouter();
  const [resumeDetails, setResumeDetails] = useState<{ question: number; readerName: string } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      setResumeDetails(getResumeDetails(JSON.parse(raw)));
    } catch {
      setResumeDetails(null);
    }
  }, []);

  function startOver() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}

    setResumeDetails(null);
    router.push("/survey");
  }

  if (!resumeDetails) return null;

  return (
    <p className="font-body text-xs text-gray-400">
      Saved progress found. {" "}
      <Link href="/survey" className="text-accent-blue underline underline-offset-4 hover:text-blue-700">
        Resume {resumeDetails.readerName ? `${resumeDetails.readerName}'s book` : `at question ${resumeDetails.question} of ${TOTAL_SURVEY_QUESTIONS}`}
      </Link>
      {resumeDetails.readerName && (
        <span className="ml-2 text-gray-300">
          question {resumeDetails.question} of {TOTAL_SURVEY_QUESTIONS}
        </span>
      )}
      <span className="mx-2 text-gray-300">/</span>
      <button
        type="button"
        onClick={startOver}
        className="text-gray-400 underline underline-offset-4 hover:text-gray-600"
      >
        Start over
      </button>
    </p>
  );
}
