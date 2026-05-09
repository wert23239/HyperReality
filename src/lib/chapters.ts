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

const expectedCodeParts = [
  /^1[ABC]$/,
  /^2[ABC]$/,
  /^3[ABC]$/,
  /^4$/,
  /^5$/,
  /^6[ABC]$/,
  /^7[ABC]$/,
  /^8[ABC]$/,
  /^9[ABC]$/,
  /^10[ABC]$/,
  /^11$/,
];

export function normalizeBookCode(code: string): string {
  const cleaned = code
    .trim()
    .toUpperCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s*-\s*/g, "-");

  const compact = cleaned.replace(/[^A-Z0-9]/g, "");
  const parts: string[] = [];
  let cursor = 0;

  for (let section = 1; section <= 11; section++) {
    const sectionText = String(section);
    if (!compact.startsWith(sectionText, cursor)) {
      return cleaned.replace(/\s+/g, "");
    }

    cursor += sectionText.length;
    if (fixedSections.includes(section)) {
      parts.push(sectionText);
    } else {
      const variant = compact[cursor];
      if (!variant || !/[ABC]/.test(variant)) {
        return cleaned.replace(/\s+/g, "");
      }
      cursor += 1;
      parts.push(`${sectionText}${variant}`);
    }
  }

  return cursor === compact.length ? parts.join("-") : cleaned.replace(/\s+/g, "");
}

export function isValidBookCode(code: string): boolean {
  const normalized = normalizeBookCode(code);
  const parts = normalized.split("-");
  if (parts.length !== 11) return false;

  return parts.every((part, index) => (
    expectedCodeParts[index].test(part) && Boolean(chapterMap[part])
  ));
}

export function getChaptersFromCode(code: string): { key: string; title: string }[] {
  return normalizeBookCode(code).split("-").map((part) => ({
    key: part,
    title: chapterMap[part] || "Unknown",
  }));
}
