"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Comment, Highlight, Meeting, MeetingTab } from "@/lib/types";
import { Avatar, AvatarStack } from "./Avatar";
import { AskFathom } from "./AskFathom";
import { ShareSheet } from "./ShareSheet";
import {
  cn,
  formatDuration,
  formatMeetingDate,
  formatMeetingTime,
  formatTimestamp,
  parseClipQuery,
  withBasePath,
} from "@/lib/utils";
import { getParticipant, getRelatedMeetings } from "@/lib/data";
import { formatSummaryMarkdown } from "@/lib/export";

const TABS: { id: MeetingTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "action-items", label: "Action Items" },
  { id: "comments", label: "Comments" },
  { id: "transcript", label: "Transcript" },
  { id: "related", label: "Related" },
];

const TEMPLATES: { id: string; label: string; order: string[] }[] = [
  {
    id: "general",
    label: "General",
    order: [
      "Meeting Purpose",
      "Topics",
      "Current Challenges",
      "Goals",
      "Upcoming Strategies",
    ],
  },
  {
    id: "customer",
    label: "Customer",
    order: ["Meeting Purpose", "Goals", "Topics", "Current Challenges"],
  },
  {
    id: "sales",
    label: "Sales",
    order: ["Upcoming Strategies", "Topics", "Goals", "Meeting Purpose"],
  },
];

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [tab, setTab] = useState<MeetingTab>("summary");
  const [currentMs, setCurrentMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [actions, setActions] = useState(meeting.actionItems);
  const [highlights, setHighlights] = useState(meeting.highlights);
  const [comments, setComments] = useState(meeting.comments);
  const [copied, setCopied] = useState<string | null>(null);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState(meeting.title);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [hlTitle, setHlTitle] = useState("");
  const [hlNote, setHlNote] = useState("");
  const [draft, setDraft] = useState("");

  const related = useMemo(() => getRelatedMeetings(meeting), [meeting]);
  const progress = Math.min(100, (currentMs / meeting.durationMs) * 100);
  const template = TEMPLATES[templateIndex] ?? TEMPLATES[0];
  const summarySections = useMemo(() => {
    const byTitle = new Map(meeting.summary.map((s) => [s.title, s]));
    const ordered = template.order
      .map((title) => byTitle.get(title))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    const extras = meeting.summary.filter(
      (s) => !template.order.includes(s.title),
    );
    return [...ordered, ...extras];
  }, [meeting.summary, template.order]);

  const activeSegmentId = useMemo(() => {
    const hit = meeting.transcript.find(
      (s) => currentMs >= s.startMs && currentMs < s.endMs,
    );
    return hit?.id ?? null;
  }, [currentMs, meeting.transcript]);

  const rangeSegs = useMemo(() => {
    const start = meeting.transcript.find((s) => s.id === rangeStart);
    const end = meeting.transcript.find((s) => s.id === rangeEnd) ?? start;
    if (!start || !end) return null;
    const a = start.startMs <= end.startMs ? start : end;
    const b = start.startMs <= end.startMs ? end : start;
    return { start: a, end: b };
  }, [meeting.transcript, rangeStart, rangeEnd]);

  function seek(ms: number) {
    setCurrentMs(Math.max(0, Math.min(ms, meeting.durationMs)));
  }

  useEffect(() => {
    const clip = parseClipQuery(window.location.search);
    if (!clip) return;
    seek(clip.startMs);
    setTab(clip.endMs != null ? "related" : "transcript");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply once from the shared clip URL
  }, [meeting.id]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setCurrentMs((ms) => Math.min(ms + 2000, meeting.durationMs));
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, meeting.durationMs]);

  useEffect(() => {
    if (playing && currentMs >= meeting.durationMs) setPlaying(false);
  }, [playing, currentMs, meeting.durationMs]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleAction(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
    );
  }

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("Copy failed");
      setTimeout(() => setCopied(null), 1800);
    }
  }

  function meetingUrl(query = "") {
    const path = withBasePath(`/meetings/${meeting.id}/`);
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${path}${query}`;
  }

  function openShare(title: string, query = "") {
    setShareTitle(title);
    setShareUrl(meetingUrl(query));
    setShareOpen(true);
  }

  function shareClip(startMs: number, endMs: number, title: string) {
    const start = Math.floor(startMs / 1000);
    const end = Math.floor(endMs / 1000);
    openShare(`Clip · ${title}`, `?t=${start}-${end}`);
  }

  async function copyActions() {
    const text = actions
      .map((a) => {
        const owner = a.assigneeId
          ? getParticipant(meeting, a.assigneeId)
          : undefined;
        const mark = a.done ? "x" : " ";
        const who = owner ? ` (@${owner.name})` : "";
        const due = a.dueDate ? ` due ${a.dueDate}` : "";
        return `- [${mark}] ${a.text}${who}${due}`;
      })
      .join("\n");
    await copyText("Actions copied", text);
  }

  function onTranscriptClick(segId: string, startMs: number) {
    seek(startMs);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(segId);
      setRangeEnd(null);
      return;
    }
    setRangeEnd(segId);
  }

  function saveHighlight() {
    if (!rangeSegs) return;
    const title =
      hlTitle.trim() ||
      rangeSegs.start.text.split(" ").slice(0, 6).join(" ") + "…";
    const next: Highlight = {
      id: `h-local-${Date.now()}`,
      title,
      description: hlNote.trim() || "Marked from transcript.",
      startMs: rangeSegs.start.startMs,
      endMs: rangeSegs.end.endMs,
      kind: "moment",
    };
    setHighlights((prev) => [next, ...prev]);
    setHlTitle("");
    setHlNote("");
    setRangeStart(null);
    setRangeEnd(null);
    setTab("related");
  }

  function postComment() {
    const text = draft.trim();
    if (!text) return;
    const next: Comment = {
      id: `c-local-${Date.now()}`,
      authorId: "local-you",
      text,
      createdAt: new Date().toISOString(),
      timestampMs: currentMs || undefined,
    };
    setComments((prev) => [...prev, next]);
    setDraft("");
  }

  function inRange(segId: string) {
    if (!rangeStart) return false;
    if (!rangeSegs) return segId === rangeStart;
    const ids = meeting.transcript.map((s) => s.id);
    const a = ids.indexOf(rangeSegs.start.id);
    const b = ids.indexOf(rangeSegs.end.id);
    const i = ids.indexOf(segId);
    return i >= Math.min(a, b) && i <= Math.max(a, b);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-muted hover:text-cyan transition-colors"
        >
          ← All meetings
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openShare(meeting.title)}
            className="rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-semibold text-white hover:border-cyan/40"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() =>
              void copyText(
                "Summary copied",
                formatSummaryMarkdown(meeting, actions),
              )
            }
            className="rounded-full bg-cyan px-3.5 py-1.5 text-xs font-bold text-black hover:brightness-110"
          >
            Export
          </button>
        </div>
      </div>

      <header className="mb-6 rounded-3xl border border-white/10 bg-surface p-5 sm:p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-full border border-cyan/30 bg-cyan-dim px-2.5 py-0.5 text-[11px] font-semibold text-cyan">
                {meeting.platform}
              </span>
              <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">
                {meeting.captureMode}
              </span>
              <span className="text-xs text-muted">
                Recording bot stubbed
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              {meeting.title}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {formatMeetingDate(meeting.startedAt)} ·{" "}
              {formatMeetingTime(meeting.startedAt)} ·{" "}
              <span className="text-yellow">{formatDuration(meeting.durationMs)}</span>
            </p>
          </div>
          <AvatarStack
            people={meeting.participants.map((p) => ({
              name: p.name,
              color: p.avatarColor,
            }))}
            max={5}
          />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-white/10 bg-surface overflow-hidden shadow-soft">
          <div className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#06202a] flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 40%, rgba(8,189,242,0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,240,106,0.08), transparent 35%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan text-black shadow-lg shadow-cyan/30 hover:scale-105 transition"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                    <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-7 w-7 ml-0.5" fill="currentColor">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>
              <p className="text-xs text-white/60">
                Video/player placeholder · Space to play · seek via transcript
              </p>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex gap-2">
              {meeting.participants.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-2.5 py-1.5 backdrop-blur"
                >
                  <Avatar name={p.name} color={p.avatarColor} size="sm" />
                  <span className="text-[11px] text-white/80">{p.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted">
              <span className="font-mono text-cyan">{formatTimestamp(currentMs)}</span>
              <span className="font-mono">{formatTimestamp(meeting.durationMs)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={meeting.durationMs}
              step={1000}
              value={currentMs}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full accent-cyan"
            />
            <div className="mt-3 relative h-2 rounded-full bg-black/60 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan/80 to-cyan"
                style={{ width: `${progress}%` }}
              />
              {highlights.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  title={h.title}
                  onClick={() => {
                    seek(h.startMs);
                    setTab("related");
                  }}
                  className="absolute top-0 bottom-0 w-1.5 -translate-x-1/2 bg-yellow hover:w-2"
                  style={{
                    left: `${(h.startMs / meeting.durationMs) * 100}%`,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Yellow markers = highlights. Click two transcript lines to mark a
              new moment.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-surface shadow-soft flex flex-col min-h-[420px]">
          <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 pt-2 scrollbar-thin">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "shrink-0 rounded-t-xl px-3.5 py-2.5 text-sm font-medium transition-colors border-b-2",
                  tab === t.id
                    ? "text-yellow border-yellow"
                    : "text-white/55 border-transparent hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin max-h-[560px]">
            {tab === "summary" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-white">Enhanced Summary</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setTemplateIndex((i) => (i + 1) % TEMPLATES.length)
                    }
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted hover:text-cyan"
                  >
                    Template: {template.label}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-white/80">
                  {meeting.enhancedSummary}
                </p>
                {summarySections.map((section) => (
                  <div key={section.title}>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-2 text-sm text-white/75 leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan">
                    Action Items
                  </h3>
                  <ul className="space-y-2">
                    {actions.slice(0, 3).map((a) => {
                      const owner = a.assigneeId
                        ? getParticipant(meeting, a.assigneeId)
                        : undefined;
                      return (
                        <li
                          key={a.id}
                          className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={a.done}
                            onChange={() => toggleAction(a.id)}
                            className="mt-1 accent-cyan"
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm",
                                a.done ? "text-muted line-through" : "text-white/85",
                              )}
                            >
                              {a.text}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted">
                              {owner && (
                                <span className="text-cyan">@{owner.name.split(" ")[0]}</span>
                              )}
                              {a.timestampMs != null && (
                                <button
                                  type="button"
                                  className="font-mono text-yellow hover:underline"
                                  onClick={() => {
                                    seek(a.timestampMs!);
                                    setTab("transcript");
                                  }}
                                >
                                  {formatTimestamp(a.timestampMs)}
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <AskFathom
                  meeting={meeting}
                  onJump={(ms) => {
                    seek(ms);
                    setTab("transcript");
                  }}
                />
              </div>
            )}

            {tab === "action-items" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">
                    {actions.filter((a) => !a.done).length} open ·{" "}
                    {actions.filter((a) => a.done).length} done
                  </h2>
                  <button
                    type="button"
                    onClick={() => void copyActions()}
                    className="text-[11px] text-cyan hover:underline"
                  >
                    Copy all
                  </button>
                </div>
                {actions.map((a) => {
                  const owner = a.assigneeId
                    ? getParticipant(meeting, a.assigneeId)
                    : undefined;
                  return (
                    <label
                      key={a.id}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 hover:border-cyan/30"
                    >
                      <input
                        type="checkbox"
                        checked={a.done}
                        onChange={() => toggleAction(a.id)}
                        className="mt-1 accent-cyan"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-sm",
                            a.done ? "text-muted line-through" : "text-white",
                          )}
                        >
                          {a.text}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                          {owner && (
                            <span className="inline-flex items-center gap-1.5">
                              <Avatar
                                name={owner.name}
                                color={owner.avatarColor}
                                size="sm"
                              />
                              @{owner.name.split(" ")[0]}
                            </span>
                          )}
                          {a.dueDate && <span>Due {a.dueDate}</span>}
                          {a.timestampMs != null && (
                            <button
                              type="button"
                              className="font-mono text-yellow hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                seek(a.timestampMs!);
                                setTab("transcript");
                              }}
                            >
                              {formatTimestamp(a.timestampMs)}
                            </button>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {tab === "comments" && (
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted">No comments yet.</p>
                ) : (
                  comments.map((c) => {
                    const author = getParticipant(meeting, c.authorId);
                    const name = author?.name ?? "You";
                    const color = author?.avatarColor ?? "#08bdf2";
                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-white/10 bg-black/25 p-3"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <Avatar name={name} color={color} size="sm" />
                          <span className="text-sm font-medium text-white">{name}</span>
                          <span className="text-[11px] text-muted">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{c.text}</p>
                        {c.timestampMs != null && (
                          <button
                            type="button"
                            className="mt-2 font-mono text-[11px] text-yellow hover:underline"
                            onClick={() => {
                              seek(c.timestampMs!);
                              setTab("transcript");
                            }}
                          >
                            Jump to {formatTimestamp(c.timestampMs)}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
                <form
                  className="rounded-2xl border border-white/10 p-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    postComment();
                  }}
                >
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Add a comment at the current playhead…"
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-muted"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted">
                      @ {formatTimestamp(currentMs)}
                    </span>
                    <button
                      type="submit"
                      className="rounded-full bg-cyan px-3 py-1 text-xs font-bold text-black"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            )}

            {tab === "transcript" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <p className="text-[11px] text-cyan">
                    Click two lines (start, then end), add a title, Save
                    highlight. Cyan = range.
                    {rangeSegs
                      ? ` ${formatTimestamp(rangeSegs.start.startMs)}–${formatTimestamp(rangeSegs.end.endMs)}`
                      : rangeStart
                        ? " Pick the end line."
                        : ""}
                  </p>
                  {rangeStart && (
                    <div className="mt-2 space-y-2">
                      <input
                        value={hlTitle}
                        onChange={(e) => setHlTitle(e.target.value)}
                        placeholder="Highlight title"
                        className="w-full rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm text-white outline-none"
                      />
                      <input
                        value={hlNote}
                        onChange={(e) => setHlNote(e.target.value)}
                        placeholder="Optional note"
                        className="w-full rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm text-white outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRangeStart(null);
                            setRangeEnd(null);
                          }}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          disabled={!rangeSegs}
                          onClick={saveHighlight}
                          className="rounded-full bg-yellow px-3 py-1 text-[11px] font-bold text-black disabled:opacity-40"
                        >
                          Save highlight
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {meeting.transcript.map((seg) => {
                  const speaker = getParticipant(meeting, seg.speakerId);
                  const active = seg.id === activeSegmentId;
                  const marked = inRange(seg.id);
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => onTranscriptClick(seg.id, seg.startMs)}
                      className={cn(
                        "w-full text-left rounded-2xl px-3 py-2.5 transition border",
                        marked
                          ? "border-cyan/50 bg-cyan-dim"
                          : active
                            ? "border-cyan/40 bg-cyan-dim/50"
                            : "border-transparent hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {speaker && (
                          <Avatar
                            name={speaker.name}
                            color={speaker.avatarColor}
                            size="sm"
                          />
                        )}
                        <span className="text-xs font-semibold text-white">
                          {speaker?.name ?? "Speaker"}
                        </span>
                        <span className="font-mono text-[11px] text-yellow">
                          {formatTimestamp(seg.startMs)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-white/75 pl-9">
                        {seg.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {tab === "related" && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white">
                  Highlights & clips
                </h2>
                {highlights.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-yellow/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow">
                            {h.kind}
                          </span>
                          <button
                            type="button"
                            className="font-mono text-[11px] text-cyan hover:underline"
                            onClick={() => {
                              seek(h.startMs);
                              setTab("transcript");
                            }}
                          >
                            {formatTimestamp(h.startMs)}–{formatTimestamp(h.endMs)}
                          </button>
                        </div>
                        <h3 className="text-sm font-semibold text-white">
                          {h.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{h.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => shareClip(h.startMs, h.endMs, h.title)}
                        className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-cyan hover:border-cyan/40"
                      >
                        Share clip
                      </button>
                    </div>
                  </div>
                ))}

                <h2 className="pt-2 text-sm font-semibold text-white">
                  Related meetings
                </h2>
                {related.length === 0 ? (
                  <p className="text-xs text-muted">No overlapping participants.</p>
                ) : (
                  related.map((m) => (
                    <Link
                      key={m.id}
                      href={`/meetings/${m.id}/`}
                      className="block rounded-2xl border border-white/10 bg-black/25 p-3 hover:border-cyan/40"
                    >
                      <p className="text-sm font-semibold text-white">{m.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">
                        {m.enhancedSummary}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {copied && (
            <div className="border-t border-white/10 px-4 py-2 text-center text-xs text-cyan">
              {copied}
            </div>
          )}
        </section>
      </div>

      <ShareSheet
        open={shareOpen}
        title={shareTitle}
        url={shareUrl}
        onClose={() => setShareOpen(false)}
        onCopied={(label) => {
          setCopied(label);
          setShareOpen(false);
          setTimeout(() => setCopied(null), 1800);
        }}
      />
    </div>
  );
}
