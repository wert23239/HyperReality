"use client";

export default function HDiagram() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-md mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sketchy lines - slightly imperfect for hand-drawn feel */}
      {/* Left vertical of H */}
      <path
        d="M120 80 L120 220"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="none"
        style={{ filter: "url(#sketchy)" }}
      />
      {/* Right vertical of H */}
      <path
        d="M280 80 L280 220"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Crossbar */}
      <path
        d="M120 150 L280 150"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Branch lines */}
      {/* Top-left: Hydrogen */}
      <path d="M120 80 L50 30" stroke="#6B8DAE" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="30" r="4" fill="#6B8DAE" opacity="0.6" />
      {/* Top-right: Heaven */}
      <path d="M280 80 L350 30" stroke="#6B8DAE" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="350" cy="30" r="4" fill="#6B8DAE" opacity="0.6" />
      {/* Bottom-left: Hell */}
      <path d="M120 220 L50 270" stroke="#C4726C" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="270" r="4" fill="#C4726C" opacity="0.6" />
      {/* Bottom-right: Habit */}
      <path d="M280 220 L350 270" stroke="#A8A08E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="350" cy="270" r="4" fill="#A8A08E" opacity="0.6" />

      {/* Node dots at H corners */}
      <circle cx="120" cy="80" r="5" fill="#1a1a1a" />
      <circle cx="280" cy="80" r="5" fill="#1a1a1a" />
      <circle cx="120" cy="220" r="5" fill="#1a1a1a" />
      <circle cx="280" cy="220" r="5" fill="#1a1a1a" />

      {/* Labels */}
      <text x="20" y="22" className="font-hand" fill="#6B8DAE" fontSize="16" fontFamily="Caveat, cursive">
        Hydrogen
      </text>
      <text x="310" y="22" className="font-hand" fill="#6B8DAE" fontSize="16" fontFamily="Caveat, cursive">
        Heaven
      </text>
      <text x="30" y="292" className="font-hand" fill="#C4726C" fontSize="16" fontFamily="Caveat, cursive">
        Hell
      </text>
      <text x="318" y="292" className="font-hand" fill="#A8A08E" fontSize="16" fontFamily="Caveat, cursive">
        Habit
      </text>
    </svg>
  );
}
