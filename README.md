# Fathom 8× Clone — AI Meeting Notetaker (Demo)

Polished **public demo** of a [Fathom](https://fathom.video/)-inspired meeting notetaker. Cinematic black UI, cyan/yellow accents, seeded meetings with transcripts, AI summaries, action items, comments, and shareable highlight clips.

**No login required** for reviewers.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npx --yes serve out
```

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Static seed data in `lib/data.ts` (Vercel-friendly; no database)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Meetings list — search, date filters, tags, avatars, durations |
| `/meetings/[id]` | Meeting detail — player stub, timeline, tabs |

### Meeting detail tabs

**Summary** · **Action Items** · **Comments** · **Transcript** · **Related**

Summary sections mirror Fathom-style labels (Meeting Purpose, Topics, Goals, Current Challenges, etc.) plus Enhanced Summary and inline action items with owners.

## Seed data

**6 meetings** with real-looking content:

1. Weekly Product Sync  
2. Customer Call — Acme Corp Onboarding  
3. Engineering Standup  
4. Design Critique — Meeting Detail  
5. Sales Pipeline Review  
6. Security Review — Data Retention  

Each includes participants, multi-speaker transcript with timestamps, structured AI summary, checkable action items, comments, and highlights.

## What was stubbed

- **Recording bot / capture** — not connected to Zoom/Meet/Teams. **Record** shows a processing state then opens a seeded meeting.
- **Video player** — visual placeholder with play/pause (Space), seek, and 10× stub playhead; no real media file.
- **Ask Fathom** — local keyword retrieval over the meeting seed; no LLM backend.
- **Share permissions** — Public/Unlisted and Viewer/Can comment are demo chrome; the URL is already public.
- **Auth / CRM / email recaps** — omitted so the demo stays open.

Clip “Share” copies a timestamped URL to the clipboard (no video transcoding).

## Deploy (GitHub Pages + Vercel)

Static export (`output: "export"`). No env vars required for the demo.

**GitHub Pages** (project site):

```bash
npm run build:pages
```

`public/.nojekyll` is copied into `out/` so GitHub’s Jekyll does not hide `_next/`. A GitHub Action (`.github/workflows/pages.yml`) deploys `out/` on every push to `main`. Manual:

```bash
git push origin main
# or: npm run deploy:pages
```

Live: [usmanmahmood940.github.io/fathom-8x-clone](https://usmanmahmood940.github.io/fathom-8x-clone/).

**Vercel** (empty `basePath`):

```bash
npm run build
```

Import the GitHub repo in Vercel, or `npx vercel --prod`. Framework: Next.js. Build: `npm run build`. Output: `out`.

## Project notes

- Keep `CAPTURE-TEST.md`, `.agent-logs/`, and `.cursor/hooks` intact (assignment capture harness).
- Visual system follows recon in `recon/PRODUCT_MAP.md`: `#000` / `#1B1B1B`, cyan `#08BDF2`, yellow `#FFF06A`.
