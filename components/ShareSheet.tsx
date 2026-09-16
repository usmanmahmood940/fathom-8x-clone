"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Visibility = "public" | "unlisted";
type Permission = "viewer" | "comment";

export function ShareSheet({
  open,
  title,
  url,
  onClose,
  onCopied,
}: {
  open: boolean;
  title: string;
  url: string;
  onClose: () => void;
  onCopied: (label: string) => void;
}) {
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [permission, setPermission] = useState<Permission>("viewer");

  if (!open) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      onCopied(
        `${visibility === "public" ? "Public" : "Unlisted"} · ${permission === "viewer" ? "Viewer" : "Can comment"}`,
      );
    } catch {
      onCopied("Copy failed");
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close share sheet"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-surface p-5 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan">
              Share
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-muted hover:text-white"
          >
            Close
          </button>
        </div>

        <p className="mb-4 rounded-xl border border-yellow/20 bg-yellow/5 px-3 py-2 text-[11px] text-muted">
          Demo: the copied URL is always public. Visibility and permission
          below are labels only — they do not lock the meeting.
        </p>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Visibility
        </p>
        <div className="mb-4 flex gap-2">
          {(["public", "unlisted"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVisibility(v)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                visibility === v
                  ? "bg-yellow text-black"
                  : "border border-white/10 text-white/70",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Permission
        </p>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setPermission("viewer")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              permission === "viewer"
                ? "bg-cyan text-black"
                : "border border-white/10 text-white/70",
            )}
          >
            Viewer
          </button>
          <button
            type="button"
            onClick={() => setPermission("comment")}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold",
              permission === "comment"
                ? "bg-cyan text-black"
                : "border border-white/10 text-white/70",
            )}
          >
            Can comment
          </button>
        </div>

        <p className="mb-3 truncate rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-[11px] text-white/70">
          {url}
        </p>
        <button
          type="button"
          onClick={() => void copy()}
          className="w-full rounded-full bg-cyan py-2 text-sm font-bold text-black hover:brightness-110"
        >
          Copy link
        </button>
        <p className="mt-3 text-[11px] text-muted">
          Anyone with this URL can open the meeting. No auth in this demo.
        </p>
      </div>
    </div>
  );
}
