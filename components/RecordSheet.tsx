"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Meeting } from "@/lib/types";
import { cn } from "@/lib/utils";

type CaptureMode = Meeting["captureMode"];

const MODES: {
  id: CaptureMode;
  label: string;
  hint: string;
  botFree: boolean;
}[] = [
  {
    id: "Transcript-only",
    label: "Transcript-only",
    hint: "Notes without a bot joining the call.",
    botFree: true,
  },
  {
    id: "Audio + transcript",
    label: "Audio + transcript",
    hint: "Bot-free audio capture plus notes.",
    botFree: true,
  },
  {
    id: "Full audio + video",
    label: "Full audio + video",
    hint: "Rewatch with screen + faces. Bot stubbed.",
    botFree: false,
  },
];

export function RecordSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<CaptureMode>("Transcript-only");
  const [phase, setPhase] = useState<"pick" | "processing">("pick");

  if (!open) return null;

  function start() {
    setPhase("processing");
    window.setTimeout(() => {
      onClose();
      setPhase("pick");
      router.push("/meetings/m-eng-standup/");
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close record sheet"
        onClick={() => {
          if (phase === "pick") onClose();
        }}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-surface p-5 shadow-soft">
        {phase === "processing" ? (
          <div className="py-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">
              Processing
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Building notes…
            </h2>
            <p className="mt-2 text-sm text-muted">
              Demo only — the recording bot is stubbed. Opening a seeded standup
              next.
            </p>
            <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan" />
            </div>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">
              Record
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Capture a meeting
            </h2>
            <p className="mt-2 text-sm text-muted">
              Zoom/Meet/Teams bot is stubbed. Pick a mode, then we’ll show the
              processing state reviewers expect.
            </p>
            <div className="mt-4 space-y-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "w-full rounded-2xl border px-3.5 py-3 text-left",
                    mode === m.id
                      ? "border-cyan/50 bg-cyan-dim"
                      : "border-white/10 hover:border-white/25",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">
                      {m.label}
                    </span>
                    {m.botFree && (
                      <span className="rounded-full border border-cyan/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan">
                        Bot-free
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">{m.hint}</p>
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/10 py-2 text-sm font-semibold text-white/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={start}
                className="flex-1 rounded-full bg-cyan py-2 text-sm font-bold text-black"
              >
                Start capture
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
