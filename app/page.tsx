import { MeetingsHome } from "@/components/MeetingsHome";
import { meetings } from "@/lib/data";

export default function HomePage() {
  return <MeetingsHome meetings={meetings} />;
}
