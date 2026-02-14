# Hyper Reality — Project Doc

## The Book
- **Title:** Hyper Reality
- **Tagline:** "a cockroach vs. a king?"
- **Concept:** A philosophy/self-help book where every reader gets a unique version based on a personality survey
- **Every chapter:** 10 pages
- **Every book:** 11 chapters = 110 pages

## Chapter Structure

Everyone's book has one chapter per section. Sections 4, 5, and 11 are universal. The rest have 3 variants (A/B/C) determined by the survey.

| Section | A | B | C |
|---------|---|---|---|
| 1 | F.r.a.m.e.w.o.r.k.s. — narcissistic stuff | Tutorial — about writing | Box Theory — people in boxes |
| 2 | Taxes — upfront annoyance to enjoy things | Pyramid Theory — Maslow's and beyond | Box Theory P.2 — things in boxes |
| 3 | Categories — things graphed elegantly | Death Theory — continuation, condensed | Therapy — what I got from therapy |
| **4** | **Hard Mode** — two sides of controversial questions | — | — |
| **5** | **Uniqueness** — large variation, catch-all | — | — |
| 6 | Void Theory — limited time, filling the void | Game Theory — everyday tricks in love/life | Plan(e) Theory — travel thoughts |
| 7 | A Retrospective — ketamine thoughts on chapters | The Simp — why simping is bad | A Spectrum — rewriting flawed metrics |
| 8 | Mindset — framing things differently | Social Death Penalty — cancelling is bad | Salt & Pepper — adding spice |
| 9 | The Draft — WW3 thoughts | Social Death Penalty P.2 — alternatives | Substance Abuse — drugs and not-drugs |
| 10 | Type 2 Fun — fun when it doesn't seem like it | Endless Pattern — new year new girl | Default Mode — same year same girl |
| **11** | **Hyper Reality** — final chapter, sums it up | — | — |

**Possible unique books:** 3^8 = 6,561 versions

## Book Code
Each reader's version is encoded: `1A-2C-3B-4-5-6A-7C-8B-9A-10C-11`

## Site Flow
1. **Landing page** — dark, dice imagery (Binding of Isaac vibes), "Roll Your Fate" CTA
2. **Survey** — fun personality questions, game-like UI, one at a time
3. **Paywall** — pay before seeing your chapters
4. **Results** — book code, chapter lineup, payment links

## Payment
- **Print only** — no PDF/digital version
- **Amazon KDP** self-published, ~$5
- Every copy has the reader's NAME on the cover

## Production Pipeline
1. Survey → book code + reader's name
2. Book code → InDesign script assembles interior from chapter files
3. Generate personalized cover with reader's name
4. Upload to Amazon KDP → reader buys their unique copy
- TODO: can KDP handle thousands of unique listings? Or do we generate on-demand somehow?

## Tech Stack
- Next.js 14 (app router)
- Tailwind CSS
- TypeScript
- Vercel hosting
- GitHub repo: wert23239/BookWebsite (or new repo?)

## Content Status
| Section | Pages Done | Pages Needed | Editing Needed |
|---------|-----------|-------------|----------------|
| 1A | ✅ | 0 | 10 |
| 1B | ✅ | 0 | 10 |
| 1C | ✅ | 0 | 10 |
| 2A | partial | 2 | 10 |
| 2B | partial | 3 | 10 |
| 2C | partial | 2 | 10 |
| 3A | partial | 2 | 10 |
| 3B | partial | 2 | 10 |
| 3C | ✅ | 0 | 10 |
| 4 | partial | 8 | 10 |
| 5 | partial | 19 | 10 |
| 6A | ✅ | 0 | 10 |
| 6B | ✅ | 0 | 10 |
| 6C | partial | 1 | 10 |
| 7A | partial | 1 | 10 |
| 7B | partial | 3 | 10 |
| 7C | partial | 1 | 10 |
| 8A | partial | 2 | 10 |
| 8B | ✅ | 0 | 10 |
| 8C | partial | 2 | 10 |
| 9A | partial | 6 | 10 |
| 9B | partial | 4 | 10 |
| 9C | partial | 3 | 10 |
| 10A | ✅ | 0 | 10 |
| 10B | partial | 3 | 10 |
| 10C | partial | 3 | 10 |
| 11 | partial | 10 | 10 |

**Total pages still needed:** 77

## TODOs

### Website
- [ ] Move scoring/chapter mapping server-side so people can't cheat by reading source code
- [ ] Review/tweak homepage design (H-diagram, dice, layout)
- [ ] Finalize survey questions (currently 10 placeholder questions)
- [ ] Add name input (for personalized cover)
- [ ] Payment flow — Venmo integration or at least verification
- [ ] Deploy to Vercel
- [ ] Domain — hyperreality.fun? something else?
- [ ] Mobile responsiveness pass
- [ ] Add a "what is this?" / about section

### Book Content
- [ ] Write remaining 77 pages
- [ ] Edit all 26 chapters (10 pages editing each)
- [ ] Finalize chapter order / flow within each chapter

### Branding
- [ ] The 3-4-5 dice = the official logo/brand mark
- [ ] Hire a professional designer to create a polished version of the dice logo
- [ ] Use on: website, book cover, end page, everywhere
- [ ] Get vector/SVG version for all uses

### Production
- [ ] InDesign script — auto-assemble PDF from chapter files based on book code
- [ ] Cover design — personalized with reader's name
- [ ] Amazon KDP self-publish strategy (how many versions?)
- [ ] Test print-on-demand pipeline end to end

### Infrastructure
- [x] GitHub repo (wert23239/HyperReality)
- [x] Next.js site built (v3 — white/clean/handwritten)
- [ ] Set up Vercel project
- [ ] Connect domain

## Book Notes (Raw Dumps)
- **"All Men Suck Percent"** — a page about the new way women generalize men. Heavy asterisk → a second page expanding on it. Then flip it — talk about the opposite: how men are still sexist. Both sides of the coin. **No chapter yet** — Mindset (8A) is the right fit but no space currently.

## Open Questions
- One cover or different covers per version?
- How to deliver PDF after Venmo payment? Manual or automated?
- Which Amazon versions to publish? All 6,561? Top ~10 archetypes?
- Domain: hyperreality.book? hyperrealitybook.com?
