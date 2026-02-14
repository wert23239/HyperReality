"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { buildBook } from "@/lib/chapters";

function Results() {
  const params = useSearchParams();
  const v = params.get("v") || "1A.2A.3A.6A.7A.8A.9A.10A";

  // Parse "1A.2C.3B.6A.7C.8B.9A.10C" into { 1: "A", 2: "C", ... }
  const variants: Record<number, string> = {};
  v.split(".").forEach((chunk) => {
    const match = chunk.match(/^(\d+)([ABC])$/);
    if (match) variants[Number(match[1])] = match[2];
  });

  const { code, chapters, totalPages } = buildBook(variants);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-20 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Book code */}
        <div className="text-center mb-16 fade-up">
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em] mb-4 font-mono">
            Your Version
          </p>
          <p className="text-lg sm:text-xl font-mono text-purple-300 tracking-wider break-all">
            {code}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            1 of 6,561 possible books
          </p>
        </div>

        {/* Chapter list */}
        <div className="fade-up fade-up-delay-1 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-300">Your 11 Chapters</h2>
            <p className="text-xs text-gray-600 font-mono">
              {totalPages} pages
            </p>
          </div>

          <div className="space-y-[1px]">
            {chapters.map((chapter, i) => (
              <div
                key={chapter.id}
                className="flex items-start gap-4 px-5 py-4 bg-[#111] hover:bg-[#161616] transition-colors border-l-2 border-purple-500/20 hover:border-purple-400/40"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-xs text-purple-400/60 font-mono w-10 shrink-0 pt-0.5">
                  {chapter.id}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 font-medium">
                    {chapter.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {chapter.description}
                  </p>
                </div>
                <span className="text-[10px] text-gray-700 font-mono ml-auto shrink-0 pt-0.5">
                  {chapter.pages}p
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase */}
        <div className="fade-up fade-up-delay-2 border border-gray-800 rounded-sm p-8 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-[0.2em] mb-6">
            Get Your Copy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://venmo.com/YOUR_VENMO_HERE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm transition-colors tracking-wide"
            >
              PDF — $20
              <span className="block text-[10px] text-purple-200/60 mt-1">
                via Venmo
              </span>
            </a>

            <a
              href="https://amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 text-sm transition-colors tracking-wide"
            >
              Print — $5
              <span className="block text-[10px] text-gray-500 mt-1">
                via Amazon
              </span>
            </a>
          </div>

          <p className="mt-6 text-[10px] text-gray-700">
            Include your book code in the Venmo note:
          </p>
          <p className="mt-1 text-xs text-gray-500 font-mono select-all">
            {code}
          </p>
        </div>

        {/* Retake */}
        <div className="text-center mt-12 fade-up fade-up-delay-3">
          <Link
            href="/survey"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-mono"
          >
            ← Retake survey
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <Results />
    </Suspense>
  );
}
