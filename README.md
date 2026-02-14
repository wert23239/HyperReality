# Hyper Reality

**The Mysterious Death of Alex Lambert 2** — A book unique to YOU.

A Next.js 14 website for an interactive choose-your-own-adventure book. Readers take a personality survey that determines which chapter variants they receive, creating a unique 110-page book from 11 sections.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Fonts (Caveat + Inter)

## Pages

- `/` — Homepage with H-diagram, floating dice, and CTA
- `/survey` — 10 personality questions, one at a time
- `/results` — Unique book code, chapter listing, payment links

## Development

```bash
npm install
npm run dev
```

## Chapter Structure

8 survey questions map to 8 variable sections (1-3, 6-10) with A/B/C variants each. Sections 4, 5, and 11 are fixed for all readers. This creates 6,561 possible unique books (3^8).
