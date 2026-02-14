export interface Question {
  id: number;
  section: number;
  text: string;
  options: { label: string; variant: "A" | "B" | "C" }[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    section: 1,
    text: "You find a wallet on the ground with $500 cash. No one is around. What do you do?",
    options: [
      { label: "Turn it in to the nearest authority", variant: "A" },
      { label: "Take the cash, leave the wallet", variant: "B" },
      { label: "Keep it all — finder's keepers", variant: "C" },
    ],
  },
  {
    id: 2,
    section: 2,
    text: "How do you feel about rules?",
    options: [
      { label: "They exist for a reason", variant: "A" },
      { label: "Suggestions, mostly", variant: "B" },
      { label: "Made to be broken", variant: "C" },
    ],
  },
  {
    id: 3,
    section: 3,
    text: "It's 3 AM. You can't sleep. What are you doing?",
    options: [
      { label: "Reading or journaling", variant: "A" },
      { label: "Doom-scrolling", variant: "B" },
      { label: "Texting someone I shouldn't", variant: "C" },
    ],
  },
  {
    id: 4,
    section: 6,
    text: "Someone cuts you off in traffic. Your reaction?",
    options: [
      { label: "Deep breath, move on", variant: "A" },
      { label: "Mutter something under my breath", variant: "B" },
      { label: "Full horn, maybe a finger", variant: "C" },
    ],
  },
  {
    id: 5,
    section: 7,
    text: "Your friend asks for brutal honesty. How honest are you?",
    options: [
      { label: "Gentle truth", variant: "A" },
      { label: "Honest but tactful", variant: "B" },
      { label: "Scorched earth", variant: "C" },
    ],
  },
  {
    id: 6,
    section: 8,
    text: "You get cancelled online. What do you do?",
    options: [
      { label: "Apologize and reflect", variant: "A" },
      { label: "Go silent, wait it out", variant: "B" },
      { label: "Double down", variant: "C" },
    ],
  },
  {
    id: 7,
    section: 9,
    text: "How do you handle a breakup?",
    options: [
      { label: "Process it, grow from it", variant: "A" },
      { label: "Rebound immediately", variant: "B" },
      { label: "Burn it all down", variant: "C" },
    ],
  },
  {
    id: 8,
    section: 10,
    text: "A cockroach or a king?",
    options: [
      { label: "A king — obviously", variant: "A" },
      { label: "Depends on the day", variant: "B" },
      { label: "A cockroach survives everything", variant: "C" },
    ],
  },
];
