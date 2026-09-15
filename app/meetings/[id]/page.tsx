import { notFound } from "next/navigation";
import { MeetingDetail } from "@/components/MeetingDetail";
import { getMeeting, meetings } from "@/lib/data";

export function generateStaticParams() {
  return meetings.map((m) => ({ id: m.id }));
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = getMeeting(id);
  if (!meeting) notFound();
  return <MeetingDetail meeting={meeting} />;
}
