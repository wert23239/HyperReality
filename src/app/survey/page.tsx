"use client";

import { useEffect, useState } from "react";
import Survey from "@/components/Survey";

export default function SurveyPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // sessionStorage is unavailable on the server. Mount the survey only after
  // hydration so saved answers and names cannot disagree with the server HTML.
  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <p role="status" className="font-body text-sm text-gray-400">Loading your survey…</p>
      </main>
    );
  }

  return <Survey />;
}
