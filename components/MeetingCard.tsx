import Link from "next/link";
import type { Meeting } from "@/lib/types";
import { AvatarStack } from "./Avatar";
import { formatDuration, formatMeetingDate, formatMeetingTime } from "@/lib/utils";

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="group block rounded-2xl border border-white/10 bg-surface p-4 sm:p-5 shadow-soft transition-all hover:border-cyan/40 hover:bg-[#1f1f1f]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-cyan">
              {meeting.platform}
            </span>
            <span className="inline-flex items-center rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
              {meeting.captureMode}
            </span>
            {meeting.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-muted capitalize"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h2 className="truncate text-lg sm:text-xl font-semibold tracking-tight text-white group-hover:text-cyan transition-colors">
            {meeting.title}
          </h2>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted">
            {meeting.enhancedSummary || meeting.description}
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/50 text-cyan">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <AvatarStack
          people={meeting.participants.map((p) => ({
            name: p.name,
            color: p.avatarColor,
          }))}
        />
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>{formatMeetingDate(meeting.startedAt)}</span>
          <span className="text-white/20">·</span>
          <span>{formatMeetingTime(meeting.startedAt)}</span>
          <span className="text-white/20">·</span>
          <span className="font-medium text-yellow">
            {formatDuration(meeting.durationMs)}
          </span>
        </div>
      </div>
    </Link>
  );
}
