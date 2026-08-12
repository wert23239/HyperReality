"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { buildBookCode, getAnswersFromBookCode, getChaptersFromCode, isValidBookCode, normalizeBookCode, questionToSection } from "@/lib/chapters";
import Link from "next/link";
import CodeEntry from "@/components/CodeEntry";

const SURVEY_STORAGE_KEY = "hr-survey";
const MAX_READER_NAME_LENGTH = 60;

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the textarea fallback for browsers that expose the
      // Clipboard API but block it outside secure/user-activated contexts.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command was not accepted");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [revealed, setRevealed] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [readerName, setReaderName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

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
  const readerNameParam = searchParams.get("name") ?? "";

  function cleanReaderName(name: string) {
    return name.replace(/\s+/g, " ").trim().slice(0, MAX_READER_NAME_LENGTH);
  }

  useEffect(() => {
    if (!isValid) return;

    const canonicalParams = new URLSearchParams({ code });
    const normalizedReaderName = cleanReaderName(readerNameParam);
    if (normalizedReaderName) {
      canonicalParams.set("name", normalizedReaderName);
    }
    const canonicalQuery = canonicalParams.toString();
    if (searchParams.toString() !== canonicalQuery) {
      router.replace(`/results?${canonicalQuery}`, { scroll: false });
    }
  }, [code, isValid, readerNameParam, router, searchParams]);

  useEffect(() => {
    const normalizedReaderName = cleanReaderName(readerNameParam);
    setReaderName(normalizedReaderName);
    setNameInput(normalizedReaderName);
  }, [readerNameParam]);

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

  function getChapterListText() {
    return [
      `Hyper Reality book code: ${code}`,
      ...(readerName ? [`Reader name: ${readerName}`] : []),
      "",
      ...chapters.map((ch) => `${ch.key}. ${ch.title}`),
    ].join("\n");
  }

  function saveReaderName() {
    const normalizedReaderName = cleanReaderName(nameInput);
    setReaderName(normalizedReaderName);
    setNameInput(normalizedReaderName);
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 2000);

    const params = new URLSearchParams({ code });
    if (normalizedReaderName) {
      params.set("name", normalizedReaderName);
    }
    router.replace(`/results?${params.toString()}`, { scroll: false });
  }

  async function copyChapterList() {
    try {
      await copyTextToClipboard(getChapterListText());
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
    }
  }

  function downloadChapterList() {
    const blob = new Blob([getChapterListText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hyper-reality-${code.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function reviseAnswers() {
    const answers = getAnswersFromBookCode(code);
    if (!answers) return;

    sessionStorage.setItem(SURVEY_STORAGE_KEY, JSON.stringify({ current: 0, answers, readerName }));
    router.push("/survey");
  }

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
          {readerName && (
            <p className="font-hand text-2xl text-gray-500">
              Prepared for {readerName}
            </p>
          )}
          <p className="font-body text-sm text-gray-400 tracking-wider uppercase">
            110 pages, unique to you
          </p>
        </div>

        {/* Code */}
        <div className="text-center space-y-3">
          <p className="font-hand text-2xl text-accent-blue tracking-wide">{code}</p>
          <div className="no-print flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="font-body text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Print / save this chapter list
            </button>
            <button
              type="button"
              onClick={copyChapterList}
              className="font-body text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
              aria-live="polite"
            >
              {copyStatus === "copied" ? "Copied chapter list" : "Copy chapter list"}
            </button>
            <button
              type="button"
              onClick={downloadChapterList}
              className="font-body text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Download .txt
            </button>
            <button
              type="button"
              onClick={reviseAnswers}
              className="font-body text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Revise answers
            </button>
          </div>
          {copyStatus === "failed" && (
            <p className="no-print font-body text-xs text-red-400" role="alert">
              Copy failed — try Print / save instead.
            </p>
          )}
        </div>

        <form
          className="no-print mx-auto max-w-sm space-y-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            saveReaderName();
          }}
        >
          <label htmlFor="reader-name" className="block text-center font-hand text-2xl text-gray-900">
            Personalize the cover name
          </label>
          <div className="flex gap-2">
            <input
              id="reader-name"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              maxLength={MAX_READER_NAME_LENGTH}
              placeholder="Reader name"
              className="min-w-0 flex-1 rounded-lg border-2 border-gray-200 px-3 py-2 font-body text-sm text-gray-700 outline-none focus:border-accent-blue"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent-blue px-4 py-2 font-hand text-lg text-white transition-opacity hover:opacity-90"
            >
              Save
            </button>
          </div>
          <p className="text-center font-body text-xs text-gray-400" aria-live="polite">
            {nameSaved ? "Name saved to this results link and download." : "Optional, but useful for personalized print fulfillment."}
          </p>
        </form>

        {/* Chapters */}
        <div className="space-y-3" aria-live="polite">
          {chapters.map((ch, i) => (
            <div
              key={ch.key}
              className={`chapter-row flex items-baseline gap-4 transition-all duration-500 ${
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

        {!reducedMotion && revealed < chapters.length && (
          <div className="no-print text-center">
            <button
              type="button"
              onClick={() => setRevealed(chapters.length)}
              className="font-body text-sm text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Show all chapters now
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="no-print border-t border-gray-100 pt-8 space-y-6">
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
        <div className="no-print text-center pt-4">
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
