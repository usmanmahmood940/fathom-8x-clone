"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Meeting, MeetingFilter } from "@/lib/types";
import { MeetingCard } from "./MeetingCard";
import { RecordSheet } from "./RecordSheet";
import { searchMeetings } from "@/lib/search";
import { allPeople } from "@/lib/data";
import {
  cn,
  formatMeetingDate,
  formatTimestamp,
  startOfDay,
  startOfWeekMonday,
} from "@/lib/utils";

const FILTERS: { id: MeetingFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "recorded", label: "Recorded" },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Snippet({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-yellow/30 text-yellow">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function MeetingsHome({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MeetingFilter>("all");
  const [tag, setTag] = useState<string>("all");
  const [person, setPerson] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);

  useEffect(() => {
    function syncHash() {
      if (window.location.hash === "#record") setRecordOpen(true);
    }
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const people = useMemo(() => allPeople(meetings), [meetings]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    meetings.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [meetings]);

  const weekDays = useMemo(() => {
    const monday = startOfWeekMonday(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.getTime();
      const onDay = meetings.filter(
        (m) => startOfDay(new Date(m.startedAt)).getTime() === key,
      );
      return { date: d, key, meetings: onDay };
    });
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
        if (person !== "all" && !m.participants.some((p) => p.id === person)) {
          return false;
        }
        const started = new Date(m.startedAt);
        if (
          selectedDay != null &&
          startOfDay(started).getTime() !== selectedDay
        ) {
          return false;
        }
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
          ...m.participants.map((p) => `${p.name} ${p.email}`),
          ...m.transcript.map((t) => t.text),
          ...m.actionItems.map((a) => a.text),
          ...m.comments.map((c) => c.text),
          ...m.summary.flatMap((s) => s.bullets),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
  }, [meetings, query, filter, tag, person, selectedDay]);

  const hits = useMemo(() => {
    if (!query.trim()) return [];
    const allowed = new Set(filtered.map((m) => m.id));
    return searchMeetings(meetings, query).filter((h) =>
      allowed.has(h.meetingId),
    );
  }, [meetings, filtered, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <section className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
              Meeting intelligence
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
              Never miss what matters.
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setRecordOpen(true)}
            className="rounded-full bg-cyan px-4 py-2 text-sm font-bold text-black hover:brightness-110"
          >
            Record
          </button>
        </div>
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

      <section className="mb-8">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">This week</h2>
          <p className="text-[11px] text-muted">
            Static calendar · click a day to filter
          </p>
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day, i) => {
            const isToday =
              startOfDay(new Date()).getTime() === day.key;
            const active = selectedDay === day.key;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() =>
                  setSelectedDay((prev) => (prev === day.key ? null : day.key))
                }
                className={cn(
                  "rounded-2xl border px-1.5 py-2 sm:px-2 sm:py-2.5 text-left transition",
                  active
                    ? "border-cyan/50 bg-cyan-dim"
                    : isToday
                      ? "border-yellow/40 bg-surface"
                      : "border-white/10 bg-surface hover:border-white/25",
                )}
              >
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  {WEEKDAYS[i]}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-semibold",
                    isToday ? "text-yellow" : "text-white",
                  )}
                >
                  {day.date.getDate()}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-0.5 min-h-2">
                  {day.meetings.slice(0, 3).map((m) => (
                    <span
                      key={m.id}
                      className="h-1.5 w-1.5 rounded-full bg-cyan"
                      title={m.title}
                    />
                  ))}
                </div>
              </button>
            );
          })}
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
              onClick={() => {
                setFilter(f.id);
                setSelectedDay(null);
              }}
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

      <div className="mb-3 flex flex-wrap gap-2">
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

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPerson("all")}
          className={
            person === "all"
              ? "rounded-full bg-yellow px-3 py-1 text-xs font-bold text-black"
              : "rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted hover:text-white"
          }
        >
          All people
        </button>
        {people.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPerson(p.id)}
            className={
              person === p.id
                ? "rounded-full bg-yellow px-3 py-1 text-xs font-bold text-black"
                : "rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted hover:text-white"
            }
          >
            {p.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {query.trim() && hits.length > 0 && (
        <div className="mb-6 grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan">
            {hits.length} search {hits.length === 1 ? "hit" : "hits"}
          </p>
          {hits.map((hit) => {
            const jump =
              hit.timestampMs != null
                ? `/meetings/${hit.meetingId}/?t=${Math.floor(hit.timestampMs / 1000)}`
                : `/meetings/${hit.meetingId}/`;
            return (
              <Link
                key={`${hit.meetingId}-${hit.snippet}`}
                href={jump}
                className="rounded-2xl border border-white/10 bg-surface p-4 hover:border-cyan/40 transition"
              >
                <p className="text-sm font-semibold text-white">{hit.title}</p>
                <p className="mt-1 text-sm text-muted">
                  <Snippet text={hit.snippet} query={query} />
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted">
                  {hit.speaker && <span className="text-cyan">{hit.speaker}</span>}
                  {hit.date && <span>{formatMeetingDate(hit.date)}</span>}
                  {hit.timestampMs != null && (
                    <span className="font-mono text-yellow">
                      Jump to {formatTimestamp(hit.timestampMs)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface/60 p-12 text-center text-sm text-muted">
          No meetings match. Open any meeting and try Ask Fathom, or{" "}
          <button
            type="button"
            className="text-cyan hover:underline"
            onClick={() => setRecordOpen(true)}
          >
            Record
          </button>
          .
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}

      <RecordSheet
        open={recordOpen}
        onClose={() => {
          setRecordOpen(false);
          if (window.location.hash === "#record") {
            history.replaceState(null, "", window.location.pathname);
          }
        }}
      />
    </div>
  );
}
