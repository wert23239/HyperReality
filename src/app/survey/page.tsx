"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";

const pastelBgs = [
  "hover:bg-blue-50 hover:border-accent-blue",
  "hover:bg-red-50 hover:border-accent-red",
  "hover:bg-stone-100 hover:border-accent-warm",
];

export default function Survey() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [animating, setAnimating] = useState(false);

  const q = questions[current];
  const total = questions.length;
  const progress = ((current) / total) * 100;

  function select(value: string) {
    if (animating) return;
    setAnimating(true);
    const next = { ...answers, [current]: value };
    setAnswers(next);

    setTimeout(() => {
      if (current < total - 1) {
        setCurrent(current + 1);
        setAnimating(false);
      } else {
        // Encode answers and go to results
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
          {q.options.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`w-full text-left p-5 rounded-xl border-2 border-gray-200 transition-all duration-200 ${pastelBgs[i]} group`}
            >
              <span className="font-hand text-lg text-gray-400 group-hover:text-gray-600 mr-3">
                {opt.label})
              </span>
              <span className="font-body text-gray-700 group-hover:text-gray-900">
                {opt.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
