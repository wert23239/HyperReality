export interface Question {
  id: number;
  text: string;
  options: { label: string; value: string; text: string }[];
}

export const questions: Question[] = [
  {
    id: 0,
    text: "You're at a party. Do you:",
    options: [
      { label: "A", value: "A", text: "Find the dog" },
      { label: "B", value: "B", text: "Start a debate about something no one cares about" },
      { label: "C", value: "C", text: "Leave early and feel guilty about it" },
    ],
  },
  {
    id: 1,
    text: "Pick your poison:",
    options: [
      { label: "A", value: "A", text: "Anxiety about the future" },
      { label: "B", value: "B", text: "Nostalgia for the past" },
      { label: "C", value: "C", text: "Overthinking the present" },
    ],
  },
  {
    id: 2,
    text: "Someone cancels plans:",
    options: [
      { label: "A", value: "A", text: "Sweet relief" },
      { label: "B", value: "B", text: "Genuine rage" },
      { label: "C", value: "C", text: "You already expected it" },
    ],
  },
  {
    id: 3,
    text: "Your therapist says be more vulnerable:",
    options: [
      { label: "A", value: "A", text: "You laugh nervously" },
      { label: "B", value: "B", text: "You actually try and cry" },
      { label: "C", value: "C", text: "You ghost your therapist" },
    ],
  },
  {
    id: 4,
    text: "3am can't sleep, thinking about:",
    options: [
      { label: "A", value: "A", text: "What you're doing with your life" },
      { label: "B", value: "B", text: "That embarrassing thing from 2014" },
      { label: "C", value: "C", text: "Whether a hotdog is a sandwich" },
    ],
  },
  {
    id: 5,
    text: "A friend needs help moving:",
    options: [
      { label: "A", value: "A", text: "You show up with snacks" },
      { label: "B", value: "B", text: "You suddenly have plans" },
      { label: "C", value: "C", text: "You help but silently keep score" },
    ],
  },
  {
    id: 6,
    text: "You get a compliment:",
    options: [
      { label: "A", value: "A", text: "Deflect immediately" },
      { label: "B", value: "B", text: "Suspicious — what do they want?" },
      { label: "C", value: "C", text: "Save it in your brain forever" },
    ],
  },
  {
    id: 7,
    text: "Your love language is:",
    options: [
      { label: "A", value: "A", text: "Acts of service (doing things)" },
      { label: "B", value: "B", text: "Quality time (being there)" },
      { label: "C", value: "C", text: "Words (saying the right thing)" },
    ],
  },
  {
    id: 8,
    text: "You open your phone. First app:",
    options: [
      { label: "A", value: "A", text: "Notes app — you had a thought" },
      { label: "B", value: "B", text: "Social media — you need to feel something" },
      { label: "C", value: "C", text: "Weather — you like to be prepared" },
    ],
  },
  {
    id: 9,
    text: "Your ideal Saturday:",
    options: [
      { label: "A", value: "A", text: "An adventure you'll barely remember" },
      { label: "B", value: "B", text: "Doing absolutely nothing" },
      { label: "C", value: "C", text: "Something productive disguised as fun" },
    ],
  },
];
