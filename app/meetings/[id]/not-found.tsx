import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-white">Meeting not found</h1>
      <p className="mt-3 text-muted">
        That recording isn&apos;t in the seeded demo set.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-cyan px-4 py-2 text-sm font-bold text-black"
      >
        Back to meetings
      </Link>
    </div>
  );
}
