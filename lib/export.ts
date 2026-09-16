import type { ActionItem, Meeting } from "./types";
import { getParticipant } from "./data";

export function formatSummaryMarkdown(
  meeting: Meeting,
  actions: ActionItem[],
): string {
  const lines: string[] = [
    `# ${meeting.title}`,
    "",
    meeting.enhancedSummary,
    "",
  ];
  for (const section of meeting.summary) {
    lines.push(`## ${section.title}`, "");
    for (const b of section.bullets) lines.push(`- ${b}`);
    lines.push("");
  }
  lines.push("## Action items", "");
  for (const a of actions) {
    const owner = a.assigneeId
      ? getParticipant(meeting, a.assigneeId)
      : undefined;
    const mark = a.done ? "x" : " ";
    const who = owner ? ` (@${owner.name})` : "";
    lines.push(`- [${mark}] ${a.text}${who}`);
  }
  return lines.join("\n");
}
