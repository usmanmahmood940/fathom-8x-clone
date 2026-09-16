import type { Meeting } from "./types";

export type AskHit = {
  text: string;
  timestampMs?: number;
};

const STOP = new Set([
  "the",
  "and",
  "for",
  "what",
  "were",
  "was",
  "did",
  "does",
  "with",
  "that",
  "this",
  "from",
  "have",
  "our",
  "are",
  "you",
  "we",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export const ASK_PROMPTS = [
  "What follow-ups did we commit to?",
  "What decisions were made?",
  "What are the risks or blockers?",
];

export function askFathom(meeting: Meeting, question: string): AskHit[] {
  const qTokens = tokens(question);
  if (qTokens.length === 0) return [];

  const docs: AskHit[] = [
    { text: meeting.enhancedSummary },
    ...meeting.transcript.map((t) => ({
      text: t.text,
      timestampMs: t.startMs,
    })),
    ...meeting.summary.flatMap((s) =>
      s.bullets.map((b) => ({ text: `${s.title}: ${b}` })),
    ),
    ...meeting.actionItems.map((a) => ({
      text: a.text,
      timestampMs: a.timestampMs,
    })),
  ];

  const scored = docs
    .map((doc) => {
      const bag = tokens(doc.text);
      const score = qTokens.reduce(
        (sum, t) => sum + (bag.includes(t) ? 1 : 0),
        0,
      );
      return { ...doc, score };
    })
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const out: AskHit[] = [];
  for (const d of scored) {
    if (seen.has(d.text)) continue;
    seen.add(d.text);
    out.push({ text: d.text, timestampMs: d.timestampMs });
    if (out.length >= 4) break;
  }
  return out;
}
