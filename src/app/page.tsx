'use client';

import Link from 'next/link';
import { useState } from 'react';

function D3Die({ className }: { className?: string }) {
  const [rolled, setRolled] = useState(false);
  return (
    <div
      className={`dice-hover ${className}`}
      onClick={() => { setRolled(true); setTimeout(() => setRolled(false), 800); }}
    >
      <svg viewBox="0 0 200 220" width="180" height="200" className={rolled ? 'animate-spin' : ''}>
        {/* 3-sided die: a triangular prism face */}
        <defs>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b0000" />
            <stop offset="100%" stopColor="#4a0000" />
          </linearGradient>
        </defs>
        {/* Main triangle */}
        <polygon
          points="100,20 20,190 180,190"
          fill="url(#grad3)"
          stroke="#c9a84c"
          strokeWidth="2"
          filter="url(#glow3)"
        />
        {/* Inner scratchy lines for texture */}
        <line x1="100" y1="20" x2="100" y2="130" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
        <line x1="60" y1="105" x2="140" y2="105" stroke="#c9a84c" strokeWidth="0.5" opacity="0.3" />
        {/* Number */}
        <text x="100" y="145" textAnchor="middle" fill="#c9a84c" fontSize="48" fontFamily="Creepster" opacity="0.9">3</text>
        {/* Eye symbol */}
        <ellipse cx="100" cy="75" rx="15" ry="10" fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.6" />
        <circle cx="100" cy="75" r="4" fill="#c9a84c" opacity="0.6" />
        {/* Crack lines */}
        <path d="M 45 160 L 55 140 L 48 125" fill="none" stroke="#1a1a2e" strokeWidth="1" opacity="0.5" />
      </svg>
      <p className="text-center font-pixel text-[10px] text-[#c9a84c] mt-2 opacity-60">D3</p>
    </div>
  );
}

function D4Die({ className }: { className?: string }) {
  const [rolled, setRolled] = useState(false);
  return (
    <div
      className={`dice-hover ${className}`}
      onClick={() => { setRolled(true); setTimeout(() => setRolled(false), 800); }}
    >
      <svg viewBox="0 0 220 240" width="200" height="220" className={rolled ? 'animate-spin' : ''}>
        <defs>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="grad4a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a4e" />
            <stop offset="100%" stopColor="#0a0a2e" />
          </linearGradient>
          <linearGradient id="grad4b" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a1a3e" />
            <stop offset="100%" stopColor="#1a0a2e" />
          </linearGradient>
        </defs>
        {/* Tetrahedron - front face */}
        <polygon
          points="110,15 20,200 200,200"
          fill="url(#grad4a)"
          stroke="#c9a84c"
          strokeWidth="2"
          filter="url(#glow4)"
        />
        {/* Left dark face */}
        <polygon
          points="110,15 20,200 65,120"
          fill="url(#grad4b)"
          stroke="#c9a84c"
          strokeWidth="1"
          opacity="0.7"
        />
        {/* Arcane symbol */}
        <circle cx="110" cy="130" r="25" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />
        <polygon points="110,108 88,140 132,140" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.4" />
        {/* Number */}
        <text x="110" y="145" textAnchor="middle" fill="#c9a84c" fontSize="42" fontFamily="Creepster" opacity="0.9">4</text>
        {/* Rune marks */}
        <path d="M 50 175 L 60 160 L 55 150" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.3" />
        <path d="M 160 180 L 150 165 L 158 155" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.3" />
      </svg>
      <p className="text-center font-pixel text-[10px] text-[#c9a84c] mt-2 opacity-60">D4</p>
    </div>
  );
}

function D5Die({ className }: { className?: string }) {
  const [rolled, setRolled] = useState(false);
  return (
    <div
      className={`dice-hover ${className}`}
      onClick={() => { setRolled(true); setTimeout(() => setRolled(false), 800); }}
    >
      <svg viewBox="0 0 220 230" width="200" height="210" className={rolled ? 'animate-spin' : ''}>
        <defs>
          <filter id="glow5">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1a00" />
            <stop offset="100%" stopColor="#1a0e00" />
          </linearGradient>
        </defs>
        {/* Pentagon */}
        <polygon
          points="110,15 210,85 175,200 45,200 10,85"
          fill="url(#grad5)"
          stroke="#c9a84c"
          strokeWidth="2"
          filter="url(#glow5)"
        />
        {/* Inner pentagon */}
        <polygon
          points="110,55 170,100 150,170 70,170 50,100"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="0.7"
          opacity="0.25"
        />
        {/* Pentagram star */}
        <polygon
          points="110,55 70,170 170,100 50,100 150,170"
          fill="none"
          stroke="#8b0000"
          strokeWidth="0.8"
          opacity="0.4"
        />
        {/* Number */}
        <text x="110" y="140" textAnchor="middle" fill="#c9a84c" fontSize="46" fontFamily="Creepster" opacity="0.9">5</text>
        {/* Drip marks */}
        <path d="M 60 190 Q 58 200 60 210" fill="none" stroke="#8b0000" strokeWidth="1.5" opacity="0.4" />
        <path d="M 155 195 Q 157 208 154 215" fill="none" stroke="#8b0000" strokeWidth="1" opacity="0.3" />
      </svg>
      <p className="text-center font-pixel text-[10px] text-[#c9a84c] mt-2 opacity-60">D5</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#c9a84c] opacity-[0.03]"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite ${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <h1 className="font-creepster text-6xl md:text-8xl lg:text-9xl text-[#c9a84c] flicker mb-2 text-center relative z-10 tracking-wider">
        HYPER REALITY
      </h1>
      <p className="font-elite text-xl md:text-2xl text-[#d4a574] opacity-70 mb-16 text-center italic relative z-10">
        a cockroach vs. a king?
      </p>

      {/* Three Dice */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-16 relative z-10">
        <div className="float-1">
          <D3Die />
        </div>
        <div className="float-2">
          <D4Die />
        </div>
        <div className="float-3">
          <D5Die />
        </div>
      </div>

      {/* Tagline */}
      <p className="font-elite text-sm md:text-base text-[#d4a574] opacity-50 mb-8 text-center max-w-md relative z-10">
        A philosophy book where no two copies are the same.<br />
        Your answers roll the dice. Your fate writes the chapters.
      </p>

      {/* CTA */}
      <Link
        href="/survey"
        className="relative z-10 font-creepster text-2xl md:text-3xl px-10 py-4 bg-[#8b0000] text-[#c9a84c] rounded-sm border border-[#c9a84c] border-opacity-30 hover:bg-[#a00000] transition-all duration-300 pulse-glow tracking-widest uppercase"
      >
        Roll Your Fate
      </Link>

      {/* Bottom flavor */}
      <p className="font-pixel text-[8px] text-[#c9a84c] opacity-20 mt-16 relative z-10">
        11 chapters · 110 pages · 6,561 possible versions
      </p>
    </main>
  );
}
