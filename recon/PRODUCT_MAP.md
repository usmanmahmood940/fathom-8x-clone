# Fathom 24h Clone — Product Map

_Recon date: 2026-09-15. Public marketing pages only; no account was created and no password/SSO was entered. Items labelled **inferred** are clone requirements, not directly observed in the authenticated app._

## Brand / visual system

- **Overall feel:** cinematic, space-themed, premium AI productivity. Homepage is almost entirely black with sparse star-field particles; some feature bands switch to charcoal (`#1b1b1b`).
- **Typography:** large geometric/neo-grotesk sans; very light/white display headlines, generous tracking and oversized type. Body copy is white/off-white. Use a clean rounded sans (e.g. Inter/Manrope/Satoshi) with 56–72px hero type and 14–18px body.
- **Accents:** electric cyan/blue for links, icons and primary CTAs; yellow is used for active tabs/arrows; orange, pink, purple and cyan gradients appear in feature art. Approximate primary cyan `#08BDF2`, yellow `#FFF06A`, surface `#1B1B1B`, background `#000000`.
- **Components:** thin 1px borders, large rounded cards, pill nav and pill buttons. Dark cards have soft outlines and bright accent strokes. Marketing imagery uses orbit/circle frames and colorful gradient blocks.

## Public shell / navigation

- Header: FATHOM logo at left; pill nav **Overview**, **Solutions**, **Integrations**, **Resources**, **Pricing**; right-side **Book a Demo**, **Log In**, **SIGN UP FREE**.
- Repeated CTA language: **GET STARTED - FREE FOREVER**, **GET STARTED. IT'S FREE.**, **SEE OUR PRICING**, **TRY FATHOM FOR YOUR TEAM**.
- Overview page positions product as “Meeting intelligence built around you” and “Never miss what matters.”
- Homepage tabs distinguish **Fathom for teams** and **Fathom for individuals**.

## 24-hour clone information architecture

### 1. Meetings list (inferred; authenticated list was behind login)

- Default landing after sign-in: chronological list of meetings with title, date/time, participants, source (Zoom/Meet/Teams), recording mode and a short AI-summary preview.
- Put global search at top, plus date/participant/team filters and a prominent “New/record meeting” action.
- Dark left rail or top nav; selected meeting uses cyan accent. Support empty state with “Your meetings will appear here.”

### 2. Meeting detail + transcript (directly supported by public UI imagery)

- Detail header: meeting title such as “Project check-in,” participant avatars, date/duration, and share/export affordances.
- Main content is a recording/video area with playback; adjacent or below is a dark content panel.
- Observed tabs in the public product mockup: **Summary**, **Action Items**, **Comments**, **Transcript**, **Related**.
- Transcript must attribute multiple speakers and support timestamped navigation. Marketing specifically emphasizes accurate speaker attribution, accents, cross-talk and bot-free recordings.
- Capture choices shown publicly: **Transcript-only (BOT-FREE)**, **Audio + transcript (BOT-FREE)**, and **Full audio + video**. The latter includes screen capture and a thumbnail/play control for rewatching.

### 3. AI summary

- The mockup shows a Summary view with sections/labels including **Meeting Purpose**, **Topics**, **Enhanced Summary**, **Current Challenges**, **Goals**, and **Upcoming Q4 Strategies**.
- Include “Change Template” beside Summary and render concise bullet sections rather than one large paragraph.
- Summary is available immediately after the call; marketing copy says summaries and action items can be delivered to the inbox.
- Add a compact “Ask Fathom” entry point for follow-up questions (the homepage visibly promotes an Ask Fathom prompt).

### 4. Action items

- Dedicated tab and a section beneath the summary (both visible in the product mockup).
- Each row: checkbox, task text, owner/mention, optional due date, and timestamp back to transcript. Public imagery shows follow-up assignment such as “@Jordan to follow up with security.”
- Support quick copy/export and “mark complete.”

### 5. Highlights / clips (partially observed; detail controls inferred)

- Full audio + video mockup includes a small playable video clip thumbnail over the detail panel; marketing copy positions the recording for coaching, reviewing presentations and rewatching.
- 24h MVP: allow selecting a transcript time range, label it as a highlight, add a note, and generate a shareable clip link. Show highlights in a right-side drawer or in **Related**.
- Use cyan waveform/timestamp accents and a simple start/end range interaction; avoid building video transcoding if time-constrained—store timestamp ranges against the recording.

### 6. Search

- Homepage/team copy explicitly promises “Search conversations, spot patterns” and “shared source of truth.”
- 24h MVP: global search across meeting title, transcript, summary, actions and comments; results show highlighted snippet, speaker, date and jump-to-timestamp.
- Add filters for person, date range and team; empty state should suggest Ask Fathom.

### 7. Share / collaboration

- Public product imagery shows **Comments** and team-oriented shared visibility; the marketing site emphasizes decisions and follow-through being visible across meetings.
- 24h MVP: meeting-level Share button opens public/private link choice; permission options Viewer/Can comment; copy-link confirmation. Reuse same share link for timestamped highlights/clips.
- Include export/copy actions for summary and action items; integrations/CRM sync are a later extension (public nav links to Asana, ChatGPT, Claude, HubSpot, Salesforce and Zapier).

## Capture / processing behavior to mirror

- Before/during/after-call capture language is prominent. A bot-free transcript-only mode is important for sensitive calls, plus bot-free audio capture and full video mode.
- Public text promises automatic notes, summaries and updated-recap follow-ups; provide a visible processing state, then replace it with summary/transcript/action items.
- Speaker attribution and custom dictionary/acronym handling are differentiators; a simple “custom terms” settings field is a good stretch goal.

## Screenshots copied into this folder

- `homepage-hero.png` — homepage hero, nav and primary CTA.
- `homepage-feature-capture.png` — capture notes / AI summaries feature band.
- `homepage-teams.png` — team/individual positioning and shared visibility.
- `homepage-clarity.png` — Clarity section with transcript/summary/action-item imagery.
- `overview-hero.png` — overview hero and meeting intelligence mockup.
- `overview-meeting-shell.png` — multi-participant recording and summary panel.
- `overview-capture-transcript.png` — transcript-only capture and Summary/Action Items/Comments/Transcript/Related tabs.
- `overview-full-video.png` — full audio + video mode with playable clip thumbnail.
- `signup-wall.png` — sign-up wall (Google or Microsoft only).
- `signin-wall.png` — sign-in wall (Google, Microsoft or SSO).

## Auth boundary observed

- Sign-up page required **Continue with Google** or **Continue with Microsoft**; no paid account was created.
- Sign-in page offered **Continue with Google**, **Continue with Microsoft**, and **Continue with SSO**. Recon stopped at this wall as required.
