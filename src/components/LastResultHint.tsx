"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getVersionNumberFromCode, isValidBookCode, normalizeBookCode, questionToSection } from "@/lib/chapters";

const LAST_RESULT_STORAGE_KEY = "hr-last-result";
const MAX_READER_NAME_LENGTH = 60;
const UNIQUE_VERSIONS = Math.pow(3, questionToSection.length);

type LastResult = {
  code?: unknown;
  readerName?: unknown;
};

function cleanReaderName(name: unknown) {
  return String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_READER_NAME_LENGTH);
}

function getLastResultLink(saved: LastResult): { href: string; code: string; readerName: string; versionNumber: number | null } | null {
  const code = normalizeBookCode(String(saved.code ?? ""));
  if (!isValidBookCode(code)) return null;

  const params = new URLSearchParams({ code });
  const readerName = cleanReaderName(saved.readerName);
  if (readerName) {
    params.set("name", readerName);
  }

  return { href: `/results?${params.toString()}`, code, readerName, versionNumber: getVersionNumberFromCode(code) };
}

export default function LastResultHint() {
  const [lastResult, setLastResult] = useState<{ href: string; code: string; readerName: string; versionNumber: number | null } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_RESULT_STORAGE_KEY);
      if (!raw) return;

      setLastResult(getLastResultLink(JSON.parse(raw)));
    } catch {
      setLastResult(null);
    }
  }, []);

  function clearLastResult() {
    try {
      localStorage.removeItem(LAST_RESULT_STORAGE_KEY);
    } catch {}

    setLastResult(null);
  }

  if (!lastResult) return null;

  return (
    <p className="font-body text-xs text-gray-400">
      Last book found.{" "}
      <Link href={lastResult.href} className="text-accent-blue underline underline-offset-4 hover:text-blue-700">
        Reopen {lastResult.readerName ? `${lastResult.readerName}'s book` : lastResult.code}
      </Link>
      {lastResult.versionNumber && (
        <span className="ml-2 text-gray-300">
          version {lastResult.versionNumber.toLocaleString()} of {UNIQUE_VERSIONS.toLocaleString()}
        </span>
      )}
      <span className="mx-2 text-gray-300">/</span>
      <button
        type="button"
        onClick={clearLastResult}
        className="text-gray-400 underline underline-offset-4 hover:text-gray-600"
      >
        Hide
      </button>
    </p>
  );
}
