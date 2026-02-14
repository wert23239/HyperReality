export interface Chapter {
  section: number;
  variant?: string;
  title: string;
  everyone?: boolean;
}

export const chapterMap: Record<string, string> = {
  "1A": "F.r.a.m.e.w.o.r.k.s.",
  "1B": "Tutorial",
  "1C": "Box Theory",
  "2A": "Taxes",
  "2B": "Pyramid Theory",
  "2C": "Box Theory P.2",
  "3A": "Categories",
  "3B": "Death Theory",
  "3C": "Therapy",
  "4": "Hard Mode",
  "5": "Uniqueness",
  "6A": "Void Theory",
  "6B": "Game Theory",
  "6C": "Plan(e) Theory",
  "7A": "A Retrospective",
  "7B": "The Simp",
  "7C": "A Spectrum",
  "8A": "Mindset",
  "8B": "Social Death Penalty",
  "8C": "Salt & Pepper",
  "9A": "The Draft",
  "9B": "Social Death Penalty P.2",
  "9C": "Substance Abuse",
  "10A": "Type 2 Fun",
  "10B": "Endless Pattern",
  "10C": "Default Mode",
  "11": "Hyper Reality",
};

// Maps question index to section number
export const questionToSection = [1, 2, 3, 6, 7, 8, 9, 10];
export const fixedSections = [4, 5, 11];

export function buildBookCode(answers: Record<number, string>): string {
  const parts: string[] = [];
  for (let s = 1; s <= 11; s++) {
    if ([4, 5, 11].includes(s)) {
      parts.push(String(s));
    } else {
      const qIdx = questionToSection.indexOf(s);
      const variant = qIdx >= 0 ? answers[qIdx] || "A" : "A";
      parts.push(`${s}${variant}`);
    }
  }
  return parts.join("-");
}

export function getChaptersFromCode(code: string): { key: string; title: string }[] {
  return code.split("-").map((part) => ({
    key: part,
    title: chapterMap[part] || "Unknown",
  }));
}
