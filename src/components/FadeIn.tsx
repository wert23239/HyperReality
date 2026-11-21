import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Keep content visible without hydration; CSS handles the optional entrance animation.
// Reduced-motion readers get the unanimated content immediately, with no delay.
export default function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  return (
    <div
      className={`motion-safe:animate-[fadeInUp_0.7s_ease-out_both] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
