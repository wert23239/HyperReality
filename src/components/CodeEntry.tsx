"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidBookCode, normalizeBookCode } from "@/lib/chapters";

/**
 * Inline "Have a code?" widget for the landing page.
 * Expands into a text input on click; validates the code format and navigates to /results.
 */
export default function CodeEntry() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const normalized = normalizeBookCode(code);
    if (!isValidBookCode(normalized)) {
      setError("That doesn't look right — codes look like 1A-2B-3C-4-5-6A-7B-8C-9A-10B-11");
      return;
    }
    router.push(`/results?code=${encodeURIComponent(normalized)}`);
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
    <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
      <div className="flex gap-2 w-full">
        <input
          autoFocus
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. 1A-2B-3C-4-5-6A-7B-8C-9A-10B-11"
          className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-accent-blue outline-none font-mono text-sm text-gray-700"
        />
        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-accent-blue text-white font-hand text-lg hover:opacity-90 transition-opacity"
        >
          Go
        </button>
      </div>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
}
