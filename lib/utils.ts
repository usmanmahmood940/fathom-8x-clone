export function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatTimestamp(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatMeetingDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMeetingTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function parseClipQuery(
  search: string,
): { startMs: number; endMs?: number } | null {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const t = new URLSearchParams(raw).get("t");
  if (!t) return null;
  const [startRaw, endRaw] = t.split("-");
  const startSec = Number(startRaw);
  if (!Number.isFinite(startSec) || startSec < 0) return null;
  const endSec =
    endRaw != null && endRaw !== "" ? Number(endRaw) : undefined;
  return {
    startMs: Math.floor(startSec * 1000),
    endMs:
      endSec != null && Number.isFinite(endSec)
        ? Math.floor(endSec * 1000)
        : undefined,
  };
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfWeekMonday(d: Date) {
  const day = startOfDay(d);
  const weekday = day.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  day.setDate(day.getDate() + offset);
  return day;
}
