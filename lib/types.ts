export type Participant = {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarColor: string;
};

export type TranscriptSegment = {
  id: string;
  speakerId: string;
  startMs: number;
  endMs: number;
  text: string;
};

export type SummarySection = {
  title: string;
  bullets: string[];
};

export type ActionItem = {
  id: string;
  text: string;
  assigneeId?: string;
  dueDate?: string;
  timestampMs?: number;
  done: boolean;
};

export type Highlight = {
  id: string;
  title: string;
  description: string;
  startMs: number;
  endMs: number;
  kind: "decision" | "question" | "insight" | "moment";
};

export type Comment = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
  timestampMs?: number;
};

export type Meeting = {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  durationMs: number;
  platform: "Zoom" | "Google Meet" | "Teams" | "Other";
  captureMode: "Transcript-only" | "Audio + transcript" | "Full audio + video";
  tags: string[];
  participants: Participant[];
  transcript: TranscriptSegment[];
  enhancedSummary: string;
  summary: SummarySection[];
  actionItems: ActionItem[];
  highlights: Highlight[];
  comments: Comment[];
};

export type MeetingFilter = "all" | "today" | "week" | "recorded";

export type MeetingTab =
  | "summary"
  | "action-items"
  | "comments"
  | "transcript"
  | "related";
