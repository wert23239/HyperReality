import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hand: ["Caveat", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        accent: {
          blue: "#6B8DAE",
          red: "#C4726C",
          warm: "#A8A08E",
          light: "#F5F3EF",
        },
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        floatAlt: {
          "0%, 100%": { transform: "translateY(-4px) rotate(1deg)" },
          "50%": { transform: "translateY(-16px) rotate(-3deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealLine: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "floatSlow 5s ease-in-out infinite",
        "float-alt": "floatAlt 4.5s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
