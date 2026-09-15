"use client";

import { useMemo, useState } from "react";
import type { Meeting, MeetingFilter } from "@/lib/types";
import { MeetingCard } from "./MeetingCard";

const FILTERS: { id: MeetingFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "recorded", label: "Recorded" },
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function MeetingsHome({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MeetingFilter>("all");
  const [tag, setTag] = useState<string>("all");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    meetings.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [meetings]);

  const filtered = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const q = query.trim().toLowerCase();

    return meetings
      .filter((m) => {
        if (tag !== "all" && !m.tags.includes(tag)) return false;
        const started = new Date(m.startedAt);
        if (filter === "today" && startOfDay(started).getTime() !== today.getTime()) {
          return false;
        }
        if (filter === "week" && started < weekAgo) return false;
        if (filter === "recorded" && m.durationMs <= 0) return false;
        if (!q) return true;
        const hay = [
          m.title,
          m.description,
          m.enhancedSummary,
          m.platform,
          ...m.tags,
          ...m.participants.map((p) => p.name),
          ...m.transcript.map((t) => t.text),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
  }, [meetings, query, filter, tag]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <section className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
          Meeting intelligence
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
          Never miss what matters.
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-muted leading-relaxed">
          A cinematic Fathom-inspired demo with seeded recordings, AI summaries,
          speaker-attributed transcripts, action items, and shareable clips.
          Recording bot is stubbed.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-white/80">
            {meetings.length} seeded meetings
          </span>
          <span className="rounded-full border border-white/10 bg-surface px-3 py-1.5 text-white/80">
            No auth required
          </span>
          <span className="rounded-full border border-cyan/30 bg-cyan-dim px-3 py-1.5 text-cyan">
            Bot-free modes included
          </span>
        </div>
      </section>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-xl">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations, people, or tags…"
            className="w-full rounded-full border border-white/10 bg-surface py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-muted focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                filter === f.id
                  ? "rounded-full bg-yellow px-3.5 py-1.5 text-xs font-bold text-black"
                  : "rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-medium text-white/70 hover:border-white/25 hover:text-white"
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTag("all")}
          className={
            tag === "all"
              ? "rounded-full bg-cyan-dim px-3 py-1 text-xs font-semibold text-cyan border border-cyan/30"
              : "rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted hover:text-white"
          }
        >
          All tags
        </button>
        {allTags.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={
              tag === t
                ? "rounded-full bg-cyan-dim px-3 py-1 text-xs font-semibold text-cyan border border-cyan/30 capitalize"
                : "rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted hover:text-white capitalize"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface/60 p-12 text-center text-sm text-muted">
          No meetings match. Try another keyword — or Ask Fathom (stubbed).
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </div>
  );
}
