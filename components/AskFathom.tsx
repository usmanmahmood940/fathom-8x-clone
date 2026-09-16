"use client";

import { useState } from "react";
import type { Meeting } from "@/lib/types";
import { ASK_PROMPTS, askFathom, type AskHit } from "@/lib/ask";
import { formatTimestamp } from "@/lib/utils";

export function AskFathom({
  meeting,
  onJump,
}: {
  meeting: Meeting;
  onJump: (ms: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<AskHit[] | null>(null);

  function run(q: string) {
    const next = q.trim();
    setQuery(next);
    setHits(askFathom(meeting, next));
  }

  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan">
        <span aria-hidden>✦</span> ASK FATHOM
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What follow-ups did we commit to?"
          className="w-full rounded-full border border-white/10 bg-surface px-3 py-2 text-sm text-white outline-none placeholder:text-muted focus:border-cyan/40"
        />
      </form>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ASK_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => run(p)}
            className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted hover:text-cyan"
          >
            {p}
          </button>
        ))}
      </div>
      {hits && hits.length === 0 && (
        <p className="mt-3 text-xs text-muted">
          No overlap in this transcript. Try a prompt above — retrieval is
          local, no LLM.
        </p>
      )}
      {hits && hits.length > 0 && (
        <ul className="mt-3 space-y-2">
          {hits.map((h) => (
            <li
              key={h.text}
              className="rounded-xl border border-white/10 bg-surface px-3 py-2"
            >
              <p className="text-sm text-white/80">{h.text}</p>
              {h.timestampMs != null && (
                <button
                  type="button"
                  className="mt-1 font-mono text-[11px] text-yellow hover:underline"
                  onClick={() => onJump(h.timestampMs!)}
                >
                  Jump to {formatTimestamp(h.timestampMs)}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
