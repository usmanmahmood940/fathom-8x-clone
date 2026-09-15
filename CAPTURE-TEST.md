# CAPTURE-TEST

## Tool and model (step 1)

- **Tool:** Cursor desktop (installed on Coding Partner's computer), coordinated by Grok Bot / Coding Partner
- **Model:** Auto (Cursor Auto) — planning and execution stay on Auto per Usman's preference; no Cursor cloud agents
- **Hooks mechanism:** Yes — Cursor project hooks via `.cursor/hooks.json`

## Mechanism and config (step 2)

- Config file: `.cursor/hooks.json`
- Scripts: `.cursor/hooks/capture-prompt.sh`, `.cursor/hooks/capture-response.sh`, `.cursor/hooks/capture.py`
- Events: `beforeSubmitPrompt`, `afterAgentResponse`, `stop`
- Behavior: appends verbatim prompt + final response (no tool traces) into `.agent-logs/`

## Log paths for canaries

- Session 1: `/workspace/fathom-8x-clone/.agent-logs/2026-09-15_15-02-21_e898ebb0-2009-488e-8ba4-d8804bd45097.md`
- Session 2: `/workspace/fathom-8x-clone/.agent-logs/2026-09-15_15-02-23_855987e7-a3d5-42d8-b605-ba5b5408ae38.md`

## Canary entries (raw)

### Session 1

```
---
session_id: e898ebb0-2009-488e-8ba4-d8804bd45097
date: 2026-09-15
author: usmanmahmood940
model: auto
tool: cursor
project: fathom-8x-clone
total_exchanges: 0
first_prompt_time: 2026-09-15T15:02:21.973Z
last_prompt_time: 2026-09-15T15:02:21.973Z
---

# Session Log


---

[LOG_ENTRY type=PROMPT num=1 session=e898ebb0]
timestamp: 2026-09-15T15:02:21.972Z
model: auto

CAPTURE TEST — 8x assignment, Usman Mahmood


---

[LOG_ENTRY type=RESPONSE num=1 session=e898ebb0]
timestamp: 2026-09-15T15:02:22.026Z
model: auto

Capture confirmed. Hooks at .cursor/hooks.json fire on beforeSubmitPrompt and afterAgentResponse via .cursor/hooks/capture-*.sh → capture.py.
```

### Session 2

```
---
session_id: 855987e7-a3d5-42d8-b605-ba5b5408ae38
date: 2026-09-15
author: usmanmahmood940
model: auto
tool: cursor
project: fathom-8x-clone
total_exchanges: 0
first_prompt_time: 2026-09-15T15:02:23.084Z
last_prompt_time: 2026-09-15T15:02:23.084Z
---

# Session Log


---

[LOG_ENTRY type=PROMPT num=1 session=855987e7]
timestamp: 2026-09-15T15:02:23.083Z
model: auto

CAPTURE TEST 2 — second session, Usman Mahmood


---

[LOG_ENTRY type=RESPONSE num=1 session=855987e7]
timestamp: 2026-09-15T15:02:23.139Z
model: auto

Second session capture confirmed. Hook works across sessions.
```

## What did not work first

- First attempt wrote two sessions in the same UTC second with identical filenames, so session 2 overwrote session 1. Fixed by using UUID session ids in the log filename.
- Nested heredoc stdin bugs in early hook wrappers; fixed by `INPUT=$(cat)` then piping into Python.
