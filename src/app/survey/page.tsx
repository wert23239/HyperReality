'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  question: string;
  answers: [string, string, string]; // A, B, C
  section: number; // which section this maps to
}

const questions: Question[] = [
  {
    question: "You're at a party. Do you:",
    answers: ["Find the dog", "Start a debate about free will", "Leave early (you weren't really there)"],
    section: 1,
  },
  {
    question: "Pick your poison:",
    answers: ["Anxiety", "Apathy", "Overthinking everything until your brain melts"],
    section: 2,
  },
  {
    question: "Someone cancels plans last minute:",
    answers: ["Sweet, sweet relief", "Rage. Pure, unfiltered rage.", "Already expected it tbh"],
    section: 3,
  },
  {
    question: "It's 3am and you can't sleep. You're thinking about:",
    answers: ["The future and all its terrifying possibilities", "The past and all its cringe moments", "Whether hotdogs are sandwiches"],
    section: 6,
  },
  {
    question: "Your therapist says you need to be more vulnerable. You:",
    answers: ["Laugh nervously and change the subject", "Actually try it and immediately regret everything", "Ghost your therapist"],
    section: 7,
  },
  {
    question: "You find $100 on the ground. First thought:",
    answers: ["Someone's having a worse day than me", "The universe provides", "Look around. This is definitely a trap."],
    section: 8,
  },
  {
    question: "Your coping mechanism of choice:",
    answers: ["Making plans I'll never follow through on", "Scrolling until my eyes bleed", "Substances (caffeine counts, right?)"],
    section: 9,
  },
  {
    question: "How do you handle existential dread?",
    answers: ["Turn it into a hobby somehow", "Convince myself patterns mean something", "Autopilot until the feeling passes"],
    section: 10,
  },
];

const sectionNames: Record<string, string> = {
  '1A': 'F.r.a.m.e.w.o.r.k.s.',
  '1B': 'Tutorial',
  '1C': 'Box Theory',
  '2A': 'Taxes',
  '2B': 'Pyramid Theory',
  '2C': 'Box Theory P.2',
  '3A': 'Categories',
  '3B': 'Death Theory',
  '3C': 'Therapy',
  '4': 'Hard Mode',
  '5': 'Uniqueness',
  '6A': 'Void Theory',
  '6B': 'Game Theory',
  '6C': 'Plan(e) Theory',
  '7A': 'A Retrospective',
  '7B': 'The Simp',
  '7C': 'A Spectrum',
  '8A': 'Mindset',
  '8B': 'Social Death Penalty',
  '8C': 'Salt & Pepper',
  '9A': 'The Draft',
  '9B': 'Social Death Penalty P.2',
  '9C': 'Substance Abuse',
  '10A': 'Type 2 Fun',
  '10B': 'Endless Pattern',
  '10C': 'Default Mode',
  '11': 'Hyper Reality',
};

const variants = ['A', 'B', 'C'] as const;

export default function Survey() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const progress = (current / questions.length) * 100;

  function handleAnswer(choice: number) {
    if (animating) return;
    setSelected(choice);
    setAnimating(true);

    setTimeout(() => {
      const newAnswers = [...answers, choice];
      setAnswers(newAnswers);

      if (current + 1 >= questions.length) {
        // Build code
        const code = buildCode(newAnswers);
        localStorage.setItem('hr-code', code);
        router.push('/results');
      } else {
        setCurrent(current + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 600);
  }

  function buildCode(ans: number[]): string {
    const parts: string[] = [];
    for (let i = 0; i < questions.length; i++) {
      const section = questions[i].section;
      const variant = variants[ans[i]];
      parts.push(`${section}${variant}`);
    }
    return parts.join('-');
  }

  const q = questions[current];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#1a1a2e] z-50">
        <div
          className="h-full progress-fill transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="font-pixel text-[10px] text-[#c9a84c] opacity-40 mb-8">
        {current + 1} / {questions.length}
      </div>

      {/* Question */}
      <div
        key={current}
        className="max-w-2xl w-full"
        style={{ animation: 'revealSlam 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
      >
        <h2 className="font-creepster text-3xl md:text-4xl text-[#c9a84c] text-center mb-12 flicker">
          {q.question}
        </h2>

        <div className="space-y-4">
          {q.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={animating}
              className={`w-full text-left p-5 rounded-sm border transition-all duration-300 group
                ${selected === i
                  ? 'bg-[#8b0000] border-[#c9a84c] scale-[1.02]'
                  : 'bg-[#1a1a2e] border-[#c9a84c] border-opacity-20 hover:border-opacity-60 hover:bg-[#2a1a3e]'
                }
                ${animating && selected !== i ? 'opacity-30 scale-95' : ''}
              `}
            >
              <div className="flex items-start gap-4">
                <span className="font-creepster text-2xl text-[#8b0000] group-hover:text-[#c9a84c] transition-colors min-w-[30px]">
                  {String.fromCharCode(65 + i)})
                </span>
                <span className="font-elite text-lg text-[#d4a574]">
                  {answer}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-4 left-4 font-pixel text-[8px] text-[#c9a84c] opacity-10">
        YOUR FATE IS BEING DECIDED
      </div>
      <div className="fixed bottom-4 right-4 font-pixel text-[8px] text-[#8b0000] opacity-20">
        NO GOING BACK
      </div>
    </main>
  );
}
