"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { isValidBookCode, normalizeBookCode } from "@/lib/chapters";

const MAX_READER_NAME_LENGTH = 60;

function cleanReaderName(name: string) {
  return name.replace(/\s+/g, " ").trim().slice(0, MAX_READER_NAME_LENGTH);
}

function extractReaderNameInput(input: string): string {
  try {
    const url = new URL(input.trim(), "https://hyper-reality.local");
    return cleanReaderName(url.searchParams.get("name") ?? "");
  } catch {
    return "";
  }
}

/**
 * Inline "Have a code?" widget for the landing page.
 * Expands into a text input on click; accepts a book code or full results URL,
 * validates the code format, and navigates to /results.
 */
export default function CodeEntry({
  defaultOpen = false,
  initialCode = "",
  initialReaderName = "",
}: {
  defaultOpen?: boolean;
  initialCode?: string;
  initialReaderName?: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [open, setOpen] = useState(defaultOpen);
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");

  function submit() {
    const normalized = normalizeBookCode(code);
    if (!isValidBookCode(normalized)) {
      setError("That doesn't look right — paste a book code or results link like 1A-2B-3C-4-5-6A-7B-8C-9A-10B-11");
      return;
    }

    const params = new URLSearchParams({ code: normalized });
    const readerName = extractReaderNameInput(code) || cleanReaderName(initialReaderName);
    if (readerName) {
      params.set("name", readerName);
    }

    router.push(`/results?${params.toString()}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-body underline underline-offset-4"
      >
        Have a code already?
      </button>
    );
  }

  return (
    <form
      className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex gap-2 w-full">
        <label htmlFor={inputId} className="sr-only">
          Hyper Reality book code
        </label>
        <input
          id={inputId}
          autoFocus
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(""); }}
          placeholder="Code or results link"
          className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-blue outline-none font-mono text-sm text-gray-700"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-accent-blue text-white font-hand text-lg hover:opacity-90 transition-opacity"
        >
          Go
        </button>
      </div>
      {error && <p id={errorId} className="text-xs text-red-400 text-center" role="alert">{error}</p>}
    </form>
  );
}
