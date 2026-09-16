import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-sm sm:text-base font-bold tracking-[0.18em] text-white">
            FATHOM
          </span>
          <span className="flex flex-col gap-[3px]" aria-hidden>
            <span className="h-[3px] w-4 rounded-full bg-cyan rotate-[-18deg]" />
            <span className="h-[3px] w-4 rounded-full bg-cyan rotate-[-18deg]" />
            <span className="h-[3px] w-4 rounded-full bg-cyan rotate-[-18deg]" />
          </span>
        </Link>

        <nav className="hidden sm:flex items-center rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-1 text-sm">
          <Link
            href="/"
            className="rounded-full px-3.5 py-1.5 font-medium text-cyan"
          >
            Meetings
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline text-xs text-white/50">
            Public demo · no login
          </span>
          <Link
            href="/"
            className="rounded-full bg-cyan px-3.5 py-1.5 text-xs sm:text-sm font-bold text-black hover:brightness-110 transition"
          >
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}
