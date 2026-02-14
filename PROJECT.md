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
- **Venmo:** $20 → get the PDF
- **Amazon:** $5 → self-published print version
- TODO: figure out payment verification (how to prevent cheating)

## Production Pipeline
1. Survey → book code
2. Book code → InDesign script assembles the PDF from chapter files
3. PDF delivered (email? download link after Venmo?)
4. Amazon: each version self-published (or on-demand?)
- TODO: how many versions to actually publish on Amazon?

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
- [ ] Finalize survey questions
- [ ] Payment verification flow
- [ ] InDesign script for PDF assembly
- [ ] Figure out Amazon self-publish strategy
- [ ] Domain name?
- [ ] Write remaining 77 pages
- [ ] Edit all chapters (10 pages editing each)
- [ ] Design book cover(s?)

## Open Questions
- One cover or different covers per version?
- How to deliver PDF after Venmo payment? Manual or automated?
- Which Amazon versions to publish? All 6,561? Top ~10 archetypes?
- Domain: hyperreality.book? hyperrealitybook.com?
