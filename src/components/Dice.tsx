"use client";

function TriangleDie() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 animate-float" fill="none">
      {/* 3-sided: triangle */}
      <path
        d="M50 12 L88 82 L12 82 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="white"
      />
      {/* Subtle shading */}
      <path d="M50 12 L88 82 L50 65 Z" fill="#00000008" />
      <text x="50" y="62" textAnchor="middle" fontSize="22" fontFamily="Caveat, cursive" fill="#1a1a1a">3</text>
    </svg>
  );
}

function TetrahedronDie() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 animate-float-slow" fill="none">
      {/* 4-sided: diamond/rhombus (2D representation of tetrahedron) */}
      <path
        d="M50 8 L90 50 L50 92 L10 50 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="white"
      />
      {/* Inner edge for 3D feel */}
      <path d="M50 8 L50 92" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" />
      <path d="M10 50 L90 50" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" />
      {/* Shading */}
      <path d="M50 8 L90 50 L50 50 Z" fill="#00000006" />
      <text x="50" y="56" textAnchor="middle" fontSize="22" fontFamily="Caveat, cursive" fill="#1a1a1a">4</text>
    </svg>
  );
}

function PentagonDie() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 animate-float-alt" fill="none">
      {/* 5-sided: pentagon */}
      <path
        d="M50 10 L93 38 L76 88 L24 88 L7 38 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="white"
      />
      {/* Subtle shading */}
      <path d="M50 10 L93 38 L76 88 L50 55 Z" fill="#00000006" />
      <text x="50" y="62" textAnchor="middle" fontSize="22" fontFamily="Caveat, cursive" fill="#1a1a1a">5</text>
    </svg>
  );
}

export default function Dice() {
  return (
    <div className="flex items-center justify-center gap-8 py-8">
      <TriangleDie />
      <TetrahedronDie />
      <PentagonDie />
    </div>
  );
}
