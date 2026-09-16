import type { Meeting } from "./types";

export const meetings: Meeting[] = [
  {
    id: "m-product-sync",
    title: "Weekly Product Sync",
    description:
      "Roadmap check-in: Q4 launch readiness, pricing experiments, and design QA.",
    startedAt: "2026-09-15T15:00:00.000Z",
    durationMs: 42 * 60 * 1000,
    platform: "Zoom",
    captureMode: "Full audio + video",
    tags: ["product", "roadmap", "internal"],
    participants: [
      {
        id: "p-ava",
        name: "Ava Chen",
        email: "ava@northline.io",
        role: "PM",
        avatarColor: "#0d9488",
      },
      {
        id: "p-marcus",
        name: "Marcus Reid",
        email: "marcus@northline.io",
        role: "Eng Lead",
        avatarColor: "#2563eb",
      },
      {
        id: "p-sofia",
        name: "Sofia Alvarez",
        email: "sofia@northline.io",
        role: "Design",
        avatarColor: "#db2777",
      },
      {
        id: "p-jordan",
        name: "Jordan Lee",
        email: "jordan@northline.io",
        role: "Data",
        avatarColor: "#7c3aed",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-ava",
        startMs: 12000,
        endMs: 48000,
        text: "Alright everyone, thanks for jumping on. Today's focus is Q4 launch readiness. Marcus, can you kick us off with eng status on the clip-sharing flow?",
      },
      {
        id: "t2",
        speakerId: "p-marcus",
        startMs: 49000,
        endMs: 98000,
        text: "Sure. Backend for shareable clip links is done. We're still polishing the player scrubber and deep-linking into transcript timestamps. ETA is Thursday if QA is clean.",
      },
      {
        id: "t3",
        speakerId: "p-sofia",
        startMs: 99000,
        endMs: 142000,
        text: "On design — I pushed the updated empty states and the teal accent tokens. One open question: should highlights use cards or a dense list on mobile?",
      },
      {
        id: "t4",
        speakerId: "p-ava",
        startMs: 143000,
        endMs: 188000,
        text: "Let's ship cards on desktop and a compact list on mobile. Jordan, any signal from the pricing experiment yet?",
      },
      {
        id: "t5",
        speakerId: "p-jordan",
        startMs: 189000,
        endMs: 248000,
        text: "Early look: the annual plan uplift is about 8% week over week, but sample size is still small. I'd wait until Friday before we declare a winner.",
      },
      {
        id: "t6",
        speakerId: "p-marcus",
        startMs: 249000,
        endMs: 295000,
        text: "Also flagging: recording bot retries spiked overnight. Not user-facing yet, but we should bump the backoff before the customer call tomorrow.",
      },
      {
        id: "t7",
        speakerId: "p-ava",
        startMs: 296000,
        endMs: 340000,
        text: "Agreed. Action: Marcus owns bot backoff, Sofia locks mobile highlights, Jordan posts experiment read-out Friday. Anything else blocking launch?",
      },
      {
        id: "t8",
        speakerId: "p-sofia",
        startMs: 341000,
        endMs: 375000,
        text: "Nope — I'll share the Figma updates this afternoon and tag eng for final QA.",
      },
    ],
    enhancedSummary:
      "Team aligned on Q4 launch readiness: clip sharing ETA Thursday, pricing experiment readout Friday, and a recording-bot backoff fix before tomorrow's customer call.",
    summary: [
      {
        title: "Meeting Purpose",
        bullets: [
          "Team reviewed Q4 launch readiness across clip sharing, UI polish, and pricing experiments.",
          "Engineering is on track for Thursday if player scrubber QA stays clean.",
        ],
      },
      {
        title: "Topics",
        bullets: [
          "Highlights UI: cards on desktop, compact list on mobile.",
          "Wait until Friday to call the pricing experiment winner.",
        ],
      },
      {
        title: "Current Challenges",
        bullets: [
          "Recording bot retry spikes overnight — backoff needs a bump before tomorrow's customer call.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Bump recording bot retry backoff before customer call",
        assigneeId: "p-marcus",
        dueDate: "2026-09-13",
        timestampMs: 249000,
        done: false,
      },
      {
        id: "a2",
        text: "Finalize mobile highlights list layout in Figma",
        assigneeId: "p-sofia",
        dueDate: "2026-09-12",
        timestampMs: 99000,
        done: true,
      },
      {
        id: "a3",
        text: "Publish pricing experiment readout",
        assigneeId: "p-jordan",
        dueDate: "2026-09-15",
        timestampMs: 189000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-ava",
        text: "Please keep the bot backoff fix on the launch checklist.",
        createdAt: "2026-09-12T16:10:00.000Z",
        timestampMs: 249000,
      },
      {
        id: "c2",
        authorId: "p-jordan",
        text: "I'll drop the experiment notebook link in Slack Friday AM.",
        createdAt: "2026-09-12T16:22:00.000Z",
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Clip sharing ETA Thursday",
        description: "Marcus commits to Thursday ship if QA is clean.",
        startMs: 49000,
        endMs: 98000,
        kind: "decision",
      },
      {
        id: "h2",
        title: "Pricing uplift ~8%",
        description: "Early annual-plan signal; sample still small.",
        startMs: 189000,
        endMs: 248000,
        kind: "insight",
      },
      {
        id: "h3",
        title: "Bot retry spike",
        description: "Backoff fix needed before customer call.",
        startMs: 249000,
        endMs: 295000,
        kind: "moment",
      },
    ],
  },
  {
    id: "m-customer-acme",
    title: "Customer Call — Acme Corp Onboarding",
    description:
      "Kickoff with Acme's RevOps team: SSO, retention policies, and success metrics.",
    startedAt: "2026-09-15T18:30:00.000Z",
    durationMs: 38 * 60 * 1000,
    platform: "Google Meet",
    captureMode: "Full audio + video",
    tags: ["customer", "onboarding", "enterprise"],
    participants: [
      {
        id: "p-priya",
        name: "Priya Nair",
        email: "priya@northline.io",
        role: "CSM",
        avatarColor: "#059669",
      },
      {
        id: "p-derek",
        name: "Derek Holt",
        email: "derek@acme.com",
        role: "RevOps",
        avatarColor: "#ea580c",
      },
      {
        id: "p-lena",
        name: "Lena Park",
        email: "lena@acme.com",
        role: "IT Admin",
        avatarColor: "#4f46e5",
      },
      {
        id: "p-ava",
        name: "Ava Chen",
        email: "ava@northline.io",
        role: "PM",
        avatarColor: "#0d9488",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-priya",
        startMs: 8000,
        endMs: 42000,
        text: "Derek, Lena — excited to get Acme live this month. Today we'll cover SSO, retention defaults, and how your managers will review coaching clips.",
      },
      {
        id: "t2",
        speakerId: "p-derek",
        startMs: 43000,
        endMs: 91000,
        text: "Perfect. Our biggest ask is Okta SSO plus a 90-day retention policy for most teams, with longer retention for legal holds.",
      },
      {
        id: "t3",
        speakerId: "p-lena",
        startMs: 92000,
        endMs: 145000,
        text: "Also, we need SCIM provisioning for about 420 seats. Can we stage that in a sandbox before production?",
      },
      {
        id: "t4",
        speakerId: "p-ava",
        startMs: 146000,
        endMs: 198000,
        text: "Yes — we'll spin up a sandbox tenant today. SCIM is GA; I'll send the Okta app catalog steps after this call.",
      },
      {
        id: "t5",
        speakerId: "p-priya",
        startMs: 199000,
        endMs: 255000,
        text: "For success metrics, how about: time-to-first-coaching-clip under 7 days, and manager review rate above 60% by week four?",
      },
      {
        id: "t6",
        speakerId: "p-derek",
        startMs: 256000,
        endMs: 305000,
        text: "Those targets work. One more thing — can clips be restricted so only the manager chain can view by default?",
      },
      {
        id: "t7",
        speakerId: "p-ava",
        startMs: 306000,
        endMs: 352000,
        text: "Yes, that's our workspace ACL model. We'll enable manager-chain sharing as the default for Acme.",
      },
    ],
    enhancedSummary:
      "Acme kickoff confirmed Okta SSO, SCIM for ~420 seats, 90-day retention with legal holds, and manager-chain clip ACLs. Sandbox provisioning starts today.",
    summary: [
      {
        title: "Meeting Purpose",
        bullets: [
          "Acme onboarding kickoff covering SSO, retention, SCIM, and coaching success metrics.",
          "Sandbox tenant and Okta setup steps will be delivered the same day.",
        ],
      },
      {
        title: "Topics",
        bullets: [
          "Okta SSO + SCIM for ~420 seats.",
          "90-day default retention with legal-hold exceptions.",
          "Manager-chain-only clip visibility by default.",
        ],
      },
      {
        title: "Goals",
        bullets: [
          "Time-to-first-coaching-clip < 7 days.",
          "Manager review rate > 60% by week four.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Provision Acme sandbox tenant and send Okta SCIM steps",
        assigneeId: "p-ava",
        dueDate: "2026-09-11",
        timestampMs: 146000,
        done: true,
      },
      {
        id: "a2",
        text: "Configure 90-day retention + legal-hold policy",
        assigneeId: "p-priya",
        dueDate: "2026-09-14",
        timestampMs: 43000,
        done: false,
      },
      {
        id: "a3",
        text: "Enable manager-chain ACL defaults for Acme workspace",
        assigneeId: "p-ava",
        dueDate: "2026-09-14",
        timestampMs: 306000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-priya",
        text: "Sandbox invite sent to Lena — awaiting Okta app install.",
        createdAt: "2026-09-11T19:05:00.000Z",
        timestampMs: 146000,
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Okta + 90-day retention",
        description: "Core enterprise requirements confirmed by RevOps.",
        startMs: 43000,
        endMs: 91000,
        kind: "decision",
      },
      {
        id: "h2",
        title: "SCIM for 420 seats",
        description: "IT requests sandbox staging before production.",
        startMs: 92000,
        endMs: 145000,
        kind: "question",
      },
      {
        id: "h3",
        title: "Manager-chain ACL",
        description: "Default clip visibility limited to manager chain.",
        startMs: 306000,
        endMs: 352000,
        kind: "decision",
      },
    ],
  },
  {
    id: "m-eng-standup",
    title: "Engineering Standup",
    description: "Daily standup: player bugs, transcript latency, and deploy window.",
    startedAt: "2026-09-16T16:15:00.000Z",
    durationMs: 14 * 60 * 1000,
    platform: "Zoom",
    captureMode: "Transcript-only",
    tags: ["engineering", "standup"],
    participants: [
      {
        id: "p-marcus",
        name: "Marcus Reid",
        email: "marcus@northline.io",
        role: "Eng Lead",
        avatarColor: "#2563eb",
      },
      {
        id: "p-nina",
        name: "Nina Okonkwo",
        email: "nina@northline.io",
        role: "Frontend",
        avatarColor: "#c026d3",
      },
      {
        id: "p-owen",
        name: "Owen Brooks",
        email: "owen@northline.io",
        role: "Backend",
        avatarColor: "#0891b2",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-marcus",
        startMs: 5000,
        endMs: 28000,
        text: "Quick round — blockers first. Nina, how's the transcript click-to-seek?",
      },
      {
        id: "t2",
        speakerId: "p-nina",
        startMs: 29000,
        endMs: 72000,
        text: "Working locally. Still seeing a 200ms drift on long meetings; I'll normalize against the media timeline today.",
      },
      {
        id: "t3",
        speakerId: "p-owen",
        startMs: 73000,
        endMs: 118000,
        text: "I cut p95 transcript indexing from 4.2s to 1.8s. Planning a canary deploy at 3pm if metrics stay green.",
      },
      {
        id: "t4",
        speakerId: "p-marcus",
        startMs: 119000,
        endMs: 155000,
        text: "Ship it behind the flag. Also, please file a note in the launch checklist about rollback.",
      },
    ],
    enhancedSummary:
      "Standup cleared path for transcript seek fix and a 3pm canary of indexing latency improvements (p95 4.2s → 1.8s).",
    summary: [
      {
        title: "Meeting Purpose",
        bullets: [
          "Standup focused on transcript seek accuracy and indexing latency improvements.",
        ],
      },
      {
        title: "Topics",
        bullets: [
          "Transcript click-to-seek nearly done; 200ms drift remaining on long meetings.",
          "Indexing p95 improved 4.2s → 1.8s; canary planned for 3pm.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Normalize transcript seek against media timeline",
        assigneeId: "p-nina",
        dueDate: "2026-09-15",
        timestampMs: 29000,
        done: false,
      },
      {
        id: "a2",
        text: "Canary deploy indexing improvements + document rollback",
        assigneeId: "p-owen",
        dueDate: "2026-09-15",
        timestampMs: 73000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-marcus",
        text: "Flag the canary in #eng-deploys when it starts.",
        createdAt: "2026-09-15T14:30:00.000Z",
        timestampMs: 119000,
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Indexing p95 cut in half",
        description: "Owen reports 4.2s → 1.8s improvement.",
        startMs: 73000,
        endMs: 118000,
        kind: "insight",
      },
    ],
  },
  {
    id: "m-design-critique",
    title: "Design Critique — Meeting Detail",
    description:
      "Review of transcript density, summary sections, and share-clip affordances.",
    startedAt: "2026-09-14T16:00:00.000Z",
    durationMs: 51 * 60 * 1000,
    platform: "Zoom",
    captureMode: "Audio + transcript",
    tags: ["design", "critique", "ux"],
    participants: [
      {
        id: "p-sofia",
        name: "Sofia Alvarez",
        email: "sofia@northline.io",
        role: "Design",
        avatarColor: "#db2777",
      },
      {
        id: "p-ava",
        name: "Ava Chen",
        email: "ava@northline.io",
        role: "PM",
        avatarColor: "#0d9488",
      },
      {
        id: "p-kai",
        name: "Kai Nakamura",
        email: "kai@northline.io",
        role: "Design Systems",
        avatarColor: "#0f766e",
      },
      {
        id: "p-nina",
        name: "Nina Okonkwo",
        email: "nina@northline.io",
        role: "Frontend",
        avatarColor: "#c026d3",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-sofia",
        startMs: 15000,
        endMs: 62000,
        text: "We're looking at the meeting detail densification. Goal: feel like Fathom — calm, light, teal accents — without looking like a generic dashboard template.",
      },
      {
        id: "t2",
        speakerId: "p-kai",
        startMs: 63000,
        endMs: 118000,
        text: "Typography hierarchy is stronger now. I'd push the summary section headers one step quieter so the transcript remains the hero.",
      },
      {
        id: "t3",
        speakerId: "p-ava",
        startMs: 119000,
        endMs: 168000,
        text: "Agree. Also, share clip should be one click from any highlight — copy link plus a toast is enough for the demo.",
      },
      {
        id: "t4",
        speakerId: "p-nina",
        startMs: 169000,
        endMs: 220000,
        text: "I can wire sticky tab nav for Summary / Transcript / Actions / Highlights. Should timestamps seek the placeholder player?",
      },
      {
        id: "t5",
        speakerId: "p-sofia",
        startMs: 221000,
        endMs: 268000,
        text: "Yes — even with a stubbed player, seeking should update the playhead and highlight the active transcript line.",
      },
    ],
    enhancedSummary:
      "Design critique locked a Fathom-like densification: transcript as hero, quieter summary headers, sticky tabs, and seekable stub player.",
    summary: [
      {
        title: "Meeting Purpose",
        bullets: [
          "Calm light UI with soft teal accents; avoid generic template look.",
          "Transcript remains the visual hero; summary headers stay quieter.",
        ],
      },
      {
        title: "Topics",
        bullets: [
          "Share clip: copy link + toast from highlights.",
          "Clickable timestamps update stubbed player playhead and active line.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Quiet down summary headers; keep transcript hero",
        assigneeId: "p-sofia",
        dueDate: "2026-09-11",
        timestampMs: 120000,
        done: true,
      },
      {
        id: "a2",
        text: "Implement sticky tab nav + seekable stub player",
        assigneeId: "p-nina",
        dueDate: "2026-09-13",
        timestampMs: 120000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-kai",
        text: "Love the quieter summary headers — shipping that token set today.",
        createdAt: "2026-09-10T17:12:00.000Z",
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Transcript as hero",
        description: "Kai recommends quieter summary headers.",
        startMs: 63000,
        endMs: 118000,
        kind: "insight",
      },
      {
        id: "h2",
        title: "Seekable stub player",
        description: "Timestamps should still drive playhead in the demo.",
        startMs: 221000,
        endMs: 268000,
        kind: "decision",
      },
    ],
  },
  {
    id: "m-sales-pipeline",
    title: "Sales Pipeline Review",
    description:
      "Weekly pipeline review: late-stage deals, demo feedback, and competitive notes.",
    startedAt: "2026-09-12T20:00:00.000Z",
    durationMs: 33 * 60 * 1000,
    platform: "Teams",
    captureMode: "Full audio + video",
    tags: ["sales", "pipeline"],
    participants: [
      {
        id: "p-riley",
        name: "Riley Quinn",
        email: "riley@northline.io",
        role: "AE",
        avatarColor: "#dc2626",
      },
      {
        id: "p-sam",
        name: "Sam Ortiz",
        email: "sam@northline.io",
        role: "AE",
        avatarColor: "#ca8a04",
      },
      {
        id: "p-priya",
        name: "Priya Nair",
        email: "priya@northline.io",
        role: "CSM",
        avatarColor: "#059669",
      },
      {
        id: "p-ava",
        name: "Ava Chen",
        email: "ava@northline.io",
        role: "PM",
        avatarColor: "#0d9488",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-riley",
        startMs: 10000,
        endMs: 55000,
        text: "Brightside is at legal. They loved the AI summary sections but asked whether we can export action items to Asana.",
      },
      {
        id: "t2",
        speakerId: "p-sam",
        startMs: 56000,
        endMs: 108000,
        text: "Helix compared us to Gong again. Their objection is CRM writeback. I need a one-pager on what we sync today vs roadmap.",
      },
      {
        id: "t3",
        speakerId: "p-ava",
        startMs: 109000,
        endMs: 158000,
        text: "I can draft that today. For Brightside, Asana export is on the Q4 list — we can offer CSV export as a bridge.",
      },
      {
        id: "t4",
        speakerId: "p-priya",
        startMs: 159000,
        endMs: 205000,
        text: "If Brightside closes, I'll reserve onboarding slots for the week of the 28th.",
      },
    ],
    enhancedSummary:
      "Brightside is in legal and wants Asana action-item export; Helix compared us to Gong on CRM writeback. CSV bridge + one-pager are the near-term answers.",
    summary: [
      {
        title: "Meeting Purpose",
        bullets: [
          "Brightside in legal; interested in Asana action-item export.",
          "Helix competitive objection centers on CRM writeback depth.",
        ],
      },
      {
        title: "Upcoming Strategies",
        bullets: [
          "Offer CSV export bridge while Asana sits on Q4 roadmap.",
          "Draft CRM sync one-pager for Helix.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Draft CRM writeback vs roadmap one-pager for Helix",
        assigneeId: "p-ava",
        dueDate: "2026-09-10",
        timestampMs: 120000,
        done: true,
      },
      {
        id: "a2",
        text: "Hold onboarding capacity week of Sep 28 for Brightside",
        assigneeId: "p-priya",
        dueDate: "2026-09-12",
        timestampMs: 120000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-riley",
        text: "Brightside legal redlines attached in HubSpot.",
        createdAt: "2026-09-09T21:00:00.000Z",
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Asana export ask",
        description: "Brightside wants action items in Asana.",
        startMs: 10000,
        endMs: 55000,
        kind: "question",
      },
      {
        id: "h2",
        title: "Gong comparison",
        description: "Helix objection: CRM writeback.",
        startMs: 56000,
        endMs: 108000,
        kind: "moment",
      },
    ],
  },
  {
    id: "m-security-review",
    title: "Security Review — Data Retention",
    description:
      "Internal security review of retention defaults, export controls, and bot access scopes.",
    startedAt: "2026-09-10T17:00:00.000Z",
    durationMs: 47 * 60 * 1000,
    platform: "Google Meet",
    captureMode: "Transcript-only",
    tags: ["security", "compliance", "internal"],
    participants: [
      {
        id: "p-harper",
        name: "Harper Diaz",
        email: "harper@northline.io",
        role: "Security",
        avatarColor: "#1d4ed8",
      },
      {
        id: "p-marcus",
        name: "Marcus Reid",
        email: "marcus@northline.io",
        role: "Eng Lead",
        avatarColor: "#2563eb",
      },
      {
        id: "p-maya",
        name: "Maya Singh",
        email: "maya@northline.io",
        role: "Legal",
        avatarColor: "#be123c",
      },
      {
        id: "p-owen",
        name: "Owen Brooks",
        email: "owen@northline.io",
        role: "Backend",
        avatarColor: "#0891b2",
      },
    ],
    transcript: [
      {
        id: "t1",
        speakerId: "p-harper",
        startMs: 20000,
        endMs: 70000,
        text: "Two topics: retention defaults for new workspaces, and narrowing the recording bot's calendar scopes.",
      },
      {
        id: "t2",
        speakerId: "p-maya",
        startMs: 71000,
        endMs: 125000,
        text: "Legal wants 30-day default for free, 90-day for pro, with explicit admin override. Exports need audit logging.",
      },
      {
        id: "t3",
        speakerId: "p-owen",
        startMs: 126000,
        endMs: 180000,
        text: "Audit logging for exports is already in staging. Bot scopes — we can drop write access to calendars and keep read-only event details.",
      },
      {
        id: "t4",
        speakerId: "p-marcus",
        startMs: 181000,
        endMs: 230000,
        text: "Let's ship scope narrowing this sprint. Retention defaults can ride with the next billing change.",
      },
      {
        id: "t5",
        speakerId: "p-harper",
        startMs: 231000,
        endMs: 275000,
        text: "Approved. I'll update the trust center copy once both land.",
      },
    ],
    enhancedSummary:
      "Security approved 30/90-day retention tiers, read-only bot calendar scopes this sprint, and export audit logging before trust-center copy updates.",
    summary: [
      {
        title: "Topics",
        bullets: [
          "Retention: 30-day free / 90-day pro with admin override.",
          "Recording bot calendar scopes narrowed to read-only.",
          "Export actions require audit logging.",
        ],
      },
      {
        title: "Upcoming Strategies",
        bullets: [
          "Scope narrowing this sprint; retention defaults with next billing change.",
        ],
      },
    ],
    actionItems: [
      {
        id: "a1",
        text: "Ship read-only calendar scopes for recording bot",
        assigneeId: "p-owen",
        dueDate: "2026-09-18",
        timestampMs: 120000,
        done: false,
      },
      {
        id: "a2",
        text: "Enable export audit logging in production",
        assigneeId: "p-marcus",
        dueDate: "2026-09-16",
        timestampMs: 120000,
        done: false,
      },
      {
        id: "a3",
        text: "Update trust center retention language",
        assigneeId: "p-harper",
        dueDate: "2026-09-20",
        timestampMs: 120000,
        done: false,
      },
    ],
    comments: [
      {
        id: "c1",
        authorId: "p-harper",
        text: "Trust center draft ready once scopes land.",
        createdAt: "2026-09-08T18:10:00.000Z",
        timestampMs: 231000,
      },
    ],
    highlights: [
      {
        id: "h1",
        title: "Retention tiers set",
        description: "30-day free / 90-day pro with admin override.",
        startMs: 71000,
        endMs: 125000,
        kind: "decision",
      },
      {
        id: "h2",
        title: "Bot scopes narrowed",
        description: "Drop calendar write; keep read-only event details.",
        startMs: 126000,
        endMs: 180000,
        kind: "decision",
      },
    ],
  },
];

export function getMeeting(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function getParticipant(meeting: Meeting, participantId: string) {
  return meeting.participants.find((p) => p.id === participantId);
}

export function getRelatedMeetings(meeting: Meeting): Meeting[] {
  const ids = new Set(meeting.participants.map((p) => p.id));
  return meetings.filter(
    (m) =>
      m.id !== meeting.id && m.participants.some((p) => ids.has(p.id)),
  );
}

export function allPeople(list: Meeting[] = meetings) {
  const map = new Map<string, { id: string; name: string; color: string }>();
  for (const m of list) {
    for (const p of m.participants) {
      if (!map.has(p.id)) {
        map.set(p.id, { id: p.id, name: p.name, color: p.avatarColor });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
