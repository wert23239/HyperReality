export interface Chapter {
  id: string;
  section: number;
  title: string;
  description: string;
  pages: number;
}

export const ALL_CHAPTERS: Chapter[] = [
  { id: "1A", section: 1, title: "F.r.a.m.e.w.o.r.k.s.", description: "Narcissistic stuff that spells out frameworks", pages: 10 },
  { id: "1B", section: 1, title: "Tutorial", description: "About writing", pages: 10 },
  { id: "1C", section: 1, title: "Box Theory", description: "People are put into boxes in your head", pages: 10 },
  { id: "2A", section: 2, title: "Taxes", description: "Things take upfront annoyance to be enjoyed", pages: 10 },
  { id: "2B", section: 2, title: "Pyramid Theory", description: "Maslow's pyramid and beyond", pages: 10 },
  { id: "2C", section: 2, title: "Box Theory P.2", description: "Things are put into boxes", pages: 10 },
  { id: "3A", section: 3, title: "Categories", description: "All things that can be graphed elegantly", pages: 10 },
  { id: "3B", section: 3, title: "Death Theory", description: "Continuation of past book, condensed", pages: 10 },
  { id: "3C", section: 3, title: "Therapy", description: "What I took out of therapy", pages: 10 },
  { id: "4", section: 4, title: "Hard Mode", description: "Two sides of controversial questions", pages: 10 },
  { id: "5", section: 5, title: "Uniqueness", description: "Large variation, catch-all of random pages", pages: 10 },
  { id: "6A", section: 6, title: "Void Theory", description: "Each day has limited time, how you fill it", pages: 10 },
  { id: "6B", section: 6, title: "Game Theory", description: "Everyday tricks in love and life", pages: 10 },
  { id: "6C", section: 6, title: "Plan(e) Theory", description: "Thoughts during travel", pages: 10 },
  { id: "7A", section: 7, title: "A Retrospective", description: "Ketamine thoughts about other chapters", pages: 10 },
  { id: "7B", section: 7, title: "The Simp", description: "Why simping is bad", pages: 10 },
  { id: "7C", section: 7, title: "A Spectrum", description: "Rewriting flawed black-and-white metrics", pages: 10 },
  { id: "8A", section: 8, title: "Mindset", description: "Framing things differently", pages: 10 },
  { id: "8B", section: 8, title: "The Social Death Penalty", description: "Cancelling people and why it's bad", pages: 10 },
  { id: "8C", section: 8, title: "Salt & Pepper", description: "Adding spice to make things better", pages: 10 },
  { id: "9A", section: 9, title: "The Draft", description: "World War 3 thoughts", pages: 10 },
  { id: "9B", section: 9, title: "The Social Death Penalty P.2", description: "Alternatives to canceling", pages: 10 },
  { id: "9C", section: 9, title: "Substance Abuse", description: "Abusing things that aren't drugs, and drugs", pages: 10 },
  { id: "10A", section: 10, title: "Type 2 Fun", description: "Fun even when it doesn't seem like it", pages: 10 },
  { id: "10B", section: 10, title: "Endless Pattern", description: "Same shit over and over, new year new girl", pages: 10 },
  { id: "10C", section: 10, title: "Default Mode", description: "Same shit over and over, same life same girl", pages: 10 },
  { id: "11", section: 11, title: "Hyper Reality", description: "Last chapter summing everything up", pages: 10 },
];

const FIXED_SECTIONS = [4, 5, 11];
const VARIANT_SECTIONS = [1, 2, 3, 6, 7, 8, 9, 10];
const ALL_SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export interface BookSelection {
  code: string;
  chapters: Chapter[];
  totalPages: number;
}

export function buildBook(variants: Record<number, string>): BookSelection {
  const chapters: Chapter[] = [];

  for (const section of ALL_SECTIONS) {
    if (FIXED_SECTIONS.includes(section)) {
      chapters.push(ALL_CHAPTERS.find((c) => c.section === section)!);
    } else {
      const variant = variants[section] || "A";
      const id = `${section}${variant}`;
      chapters.push(ALL_CHAPTERS.find((c) => c.id === id)!);
    }
  }

  const code = chapters.map((c) => c.id).join("-");
  return { code, chapters, totalPages: chapters.length * 10 };
}
