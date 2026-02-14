'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

function getFullChapterList(code: string): string[] {
  const parts = code.split('-');
  const chapters: string[] = [];
  const surveyedSections = [1, 2, 3, 6, 7, 8, 9, 10];
  let partIdx = 0;

  for (let section = 1; section <= 11; section++) {
    if (section === 4) { chapters.push('4'); continue; }
    if (section === 5) { chapters.push('5'); continue; }
    if (section === 11) { chapters.push('11'); continue; }
    if (surveyedSections.includes(section) && partIdx < parts.length) {
      chapters.push(parts[partIdx]);
      partIdx++;
    }
  }
  return chapters;
}

export default function Results() {
  const [code, setCode] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [revealedChapters, setRevealedChapters] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem('hr-code');
    if (stored) {
      setCode(stored);
      // Dramatic reveal
      setTimeout(() => setRevealed(true), 500);
    }
  }, []);

  useEffect(() => {
    if (revealed && code) {
      const chapters = getFullChapterList(code);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setRevealedChapters(i);
        if (i >= chapters.length) clearInterval(interval);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [revealed, code]);

  if (!code) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-creepster text-4xl text-[#c9a84c] mb-8">No Fate Found</h1>
        <p className="font-elite text-[#d4a574] mb-8">You haven&apos;t rolled the dice yet.</p>
        <Link href="/survey" className="font-creepster text-xl px-8 py-3 bg-[#8b0000] text-[#c9a84c] rounded-sm border border-[#c9a84c] border-opacity-30 pulse-glow">
          Take the Survey
        </Link>
      </main>
    );
  }

  const chapters = getFullChapterList(code);
  const fullCode = chapters.join('-');

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16 relative">
      {/* Reveal animation */}
      {!revealed && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="font-creepster text-4xl text-[#8b0000] animate-pulse">
            Reading your soul...
          </div>
        </div>
      )}

      {revealed && (
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12 reveal-slam">
            <h1 className="font-creepster text-5xl md:text-6xl text-[#c9a84c] flicker mb-4">
              YOUR FATE
            </h1>
            <p className="font-elite text-[#d4a574] opacity-60 italic">has been decided</p>
          </div>

          {/* Book Code */}
          <div className="bg-[#1a1a2e] border border-[#c9a84c] border-opacity-30 rounded-sm p-6 mb-12 text-center">
            <p className="font-pixel text-[10px] text-[#8b0000] mb-3 tracking-widest uppercase">Your unique book code</p>
            <p className="font-creepster text-2xl md:text-3xl text-[#c9a84c] tracking-wider break-all">
              {fullCode}
            </p>
            <p className="font-pixel text-[8px] text-[#d4a574] opacity-40 mt-3">
              one of 6,561 possible versions
            </p>
          </div>

          {/* Chapter Lineup */}
          <div className="mb-12">
            <h2 className="font-creepster text-2xl text-[#c9a84c] mb-6 text-center">Your Chapters</h2>
            <div className="space-y-3">
              {chapters.map((ch, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-4 bg-[#1a1a2e] border border-[#c9a84c] border-opacity-10 rounded-sm transition-all duration-300
                    ${i < revealedChapters ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'}
                  `}
                >
                  <span className="font-creepster text-xl text-[#8b0000] min-w-[40px]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-elite text-lg text-[#d4a574]">
                    {sectionNames[ch] || ch}
                  </span>
                  <span className="font-pixel text-[8px] text-[#c9a84c] opacity-30 ml-auto">
                    10 pages
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { label: 'Chapters', value: '11' },
              { label: 'Pages', value: '110' },
              { label: 'Unique To You', value: '∞' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1a1a2e] border border-[#c9a84c] border-opacity-10 rounded-sm p-4 text-center">
                <div className="font-creepster text-2xl text-[#c9a84c]">{stat.value}</div>
                <div className="font-pixel text-[8px] text-[#d4a574] opacity-40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="border-t border-[#c9a84c] border-opacity-20 pt-8">
            <h2 className="font-creepster text-2xl text-[#c9a84c] mb-6 text-center">Claim Your Copy</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF via Venmo */}
              <div className="card-glow bg-[#1a1a2e] rounded-sm p-6 text-center">
                <div className="font-creepster text-4xl text-[#c9a84c] mb-2">$20</div>
                <div className="font-elite text-[#d4a574] mb-4">PDF — Instant Download</div>
                <p className="font-pixel text-[8px] text-[#d4a574] opacity-40 mb-4">
                  Venmo your book code + payment
                </p>
                <a
                  href="https://venmo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-creepster text-lg px-6 py-3 bg-[#8b0000] text-[#c9a84c] rounded-sm border border-[#c9a84c] border-opacity-30 hover:bg-[#a00000] transition-all pulse-glow"
                >
                  Pay via Venmo
                </a>
              </div>

              {/* Print via Amazon */}
              <div className="card-glow bg-[#1a1a2e] rounded-sm p-6 text-center">
                <div className="font-creepster text-4xl text-[#c9a84c] mb-2">$5</div>
                <div className="font-elite text-[#d4a574] mb-4">Print — Amazon</div>
                <p className="font-pixel text-[8px] text-[#d4a574] opacity-40 mb-4">
                  Physical copy ships to your door
                </p>
                <a
                  href="https://amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-creepster text-lg px-6 py-3 bg-[#2e1a00] text-[#c9a84c] rounded-sm border border-[#c9a84c] border-opacity-30 hover:bg-[#3e2a10] transition-all"
                >
                  Buy on Amazon
                </a>
              </div>
            </div>
          </div>

          {/* Retake */}
          <div className="text-center mt-12">
            <Link
              href="/survey"
              className="font-pixel text-[10px] text-[#8b0000] opacity-50 hover:opacity-100 transition-opacity"
            >
              ↻ Re-roll your fate
            </Link>
          </div>

          {/* Footer flavor */}
          <div className="text-center mt-16">
            <p className="font-pixel text-[8px] text-[#c9a84c] opacity-10">
              HYPER REALITY — a cockroach vs. a king?
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
