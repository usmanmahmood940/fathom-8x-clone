"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Meeting, MeetingTab } from "@/lib/types";
import { Avatar, AvatarStack } from "./Avatar";
import {
  cn,
  formatDuration,
  formatMeetingDate,
  formatMeetingTime,
  formatTimestamp,
} from "@/lib/utils";
import { getParticipant } from "@/lib/data";

const TABS: { id: MeetingTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "action-items", label: "Action Items" },
  { id: "comments", label: "Comments" },
  { id: "transcript", label: "Transcript" },
  { id: "related", label: "Related" },
];

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [tab, setTab] = useState<MeetingTab>("summary");
  const [currentMs, setCurrentMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [actions, setActions] = useState(meeting.actionItems);
  const [copied, setCopied] = useState<string | null>(null);

  const progress = Math.min(100, (currentMs / meeting.durationMs) * 100);

  const activeSegmentId = useMemo(() => {
    const hit = meeting.transcript.find(
      (s) => currentMs >= s.startMs && currentMs < s.endMs,
    );
    return hit?.id ?? null;
  }, [currentMs, meeting.transcript]);

  function seek(ms: number) {
    setCurrentMs(Math.max(0, Math.min(ms, meeting.durationMs)));
  }

  function toggleAction(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a)),
    );
  }

  async function copyLink(label: string, hash = "") {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const path = `${base}/meetings/${meeting.id}/${hash}`;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("Copy failed");
      setTimeout(() => setCopied(null), 1800);
    }
  }

  function shareClip(startMs: number, endMs: number, title: string) {
    void copyLink(`Clip · ${title}`, `?t=${Math.floor(startMs / 1000)}-${Math.floor(endMs / 1000)}`);
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
            onClick={() => copyLink("Meeting link")}
            className="rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs font-semibold text-white hover:border-cyan/40"
          >
            {copied === "Meeting link" ? "Copied!" : "Share link"}
          </button>
          <button
            type="button"
            onClick={() => copyLink("Export stub")}
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
        {/* Player + timeline */}
        <section className="rounded-3xl border border-white/10 bg-surface overflow-hidden shadow-soft">
          <div className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#06202a] flex items-center justify-center">
            <div className="absolute inset-0 opacity-40"
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
                Video/player placeholder · seek via transcript or timeline
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
              {meeting.highlights.map((h) => (
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
              Yellow markers = highlights / moments. Click to jump.
            </p>
          </div>
        </section>

        {/* Tabs panel */}
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
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-muted hover:text-cyan"
                  >
                    Change Template
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-white/80">
                  {meeting.enhancedSummary}
                </p>
                {meeting.summary.map((section) => (
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
                <AskStub />
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
                    onClick={() =>
                      copyLink(
                        "Actions copied",
                        "",
                      )
                    }
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
                {meeting.comments.length === 0 ? (
                  <p className="text-sm text-muted">No comments yet.</p>
                ) : (
                  meeting.comments.map((c) => {
                    const author = getParticipant(meeting, c.authorId);
                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-white/10 bg-black/25 p-3"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          {author && (
                            <Avatar
                              name={author.name}
                              color={author.avatarColor}
                              size="sm"
                            />
                          )}
                          <span className="text-sm font-medium text-white">
                            {author?.name ?? "Someone"}
                          </span>
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
                <div className="rounded-2xl border border-dashed border-white/15 p-3 text-xs text-muted">
                  Comment composer stubbed for this demo.
                </div>
              </div>
            )}

            {tab === "transcript" && (
              <div className="space-y-1">
                {meeting.transcript.map((seg) => {
                  const speaker = getParticipant(meeting, seg.speakerId);
                  const active = seg.id === activeSegmentId;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => seek(seg.startMs)}
                      className={cn(
                        "w-full text-left rounded-2xl px-3 py-2.5 transition border",
                        active
                          ? "border-cyan/40 bg-cyan-dim"
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
                {meeting.highlights.map((h) => (
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
                        {copied?.startsWith("Clip") && copied.includes(h.title)
                          ? "Copied!"
                          : "Share clip"}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-white/15 p-4 text-xs text-muted">
                  Clip sharing copies a timestamped link. No video transcoding in
                  this demo.
                </div>
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
    </div>
  );
}

function AskStub() {
  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan">
        <span aria-hidden>✦</span> ASK FATHOM
      </div>
      <input
        disabled
        placeholder="What follow-ups did we commit to? (stubbed)"
        className="w-full rounded-full border border-white/10 bg-surface px-3 py-2 text-sm text-muted outline-none"
      />
    </div>
  );
}
