import type { Meeting } from "./types";

export type SearchHit = {
  meetingId: string;
  title: string;
  snippet: string;
  timestampMs?: number;
};

function clip(text: string, q: string, radius = 72): string {
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 140);
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + q.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export function searchMeetings(meetings: Meeting[], raw: string): SearchHit[] {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];

  for (const m of meetings) {
    const push = (text: string, timestampMs?: number) => {
      hits.push({
        meetingId: m.id,
        title: m.title,
        snippet: clip(text, q),
        timestampMs,
      });
    };

    if (m.title.toLowerCase().includes(q)) {
      push(m.title);
      continue;
    }
    if (m.enhancedSummary.toLowerCase().includes(q)) {
      push(m.enhancedSummary);
      continue;
    }
    const seg = m.transcript.find((t) => t.text.toLowerCase().includes(q));
    if (seg) {
      push(seg.text, seg.startMs);
      continue;
    }
    const action = m.actionItems.find((a) => a.text.toLowerCase().includes(q));
    if (action) {
      push(action.text, action.timestampMs);
      continue;
    }
    const comment = m.comments.find((c) => c.text.toLowerCase().includes(q));
    if (comment) {
      push(comment.text, comment.timestampMs);
      continue;
    }
    const bullet = m.summary
      .flatMap((s) => s.bullets)
      .find((b) => b.toLowerCase().includes(q));
    if (bullet) {
      push(bullet);
      continue;
    }
    const person = m.participants.find((p) =>
      `${p.name} ${p.email}`.toLowerCase().includes(q),
    );
    if (person) {
      push(`${person.name} · ${m.enhancedSummary}`);
    }
  }

  return hits;
}
