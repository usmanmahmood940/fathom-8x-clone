#!/usr/bin/env python3
"""Append prompt/response captures to .agent-logs/ for 8x assignment."""
import json
import sys
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / ".cursor" / "agent-log-state.json"
LOGS = ROOT / ".agent-logs"


def load_state():
    if STATE.exists():
        return json.loads(STATE.read_text())
    import uuid
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    sid = str(uuid.uuid4())
    path = LOGS / f"{now.strftime('%Y-%m-%d_%H-%M-%S')}_{sid}.md"
    LOGS.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "---\n"
        f"session_id: {sid}\n"
        f"date: {now.strftime('%Y-%m-%d')}\n"
        "author: usmanmahmood940\n"
        "model: auto\n"
        "tool: cursor\n"
        "project: fathom-8x-clone\n"
        "total_exchanges: 0\n"
        f"first_prompt_time: {now.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]}Z\n"
        f"last_prompt_time: {now.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]}Z\n"
        "---\n\n# Session Log\n\n"
    )
    st = {
        "session_id": sid,
        "session_file": str(path),
        "exchange": 0,
        "model": "auto",
    }
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(st, indent=2))
    return st


def save_state(st):
    STATE.write_text(json.dumps(st, indent=2))


def append(path, block):
    with open(path, "a") as f:
        f.write(block)


def main():
    raw = sys.stdin.read()
    try:
        data = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        data = {"_raw": raw}

    event = str(data.get("hook_event_name") or data.get("event") or "")
    prompt = (
        data.get("prompt")
        or data.get("user_prompt")
        or data.get("message")
        or ""
    )
    response = (
        data.get("response")
        or data.get("agent_response")
        or data.get("text")
        or data.get("output")
        or ""
    )
    # For beforeSubmitPrompt, prompt may be under different keys
    if not prompt and isinstance(data.get("prompt"), str):
        prompt = data["prompt"]
    model = data.get("model") or data.get("model_name") or "auto"
    ts = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    st = load_state()
    path = Path(st["session_file"])
    sid = st["session_id"][:8]

    el = event.lower()
    is_prompt = ("prompt" in el and "response" not in el) or "submit" in el
    is_response = "response" in el or el in ("stop", "afteragentresponse")

    if not event:
        if data.get("prompt") or data.get("user_prompt"):
            is_prompt = True
        elif data.get("response") or data.get("agent_response") or data.get("text"):
            is_response = True

    if is_prompt and prompt:
        st["exchange"] = int(st.get("exchange", 0)) + 1
        n = st["exchange"]
        append(
            path,
            f"\n---\n\n[LOG_ENTRY type=PROMPT num={n} session={sid}]\n"
            f"timestamp: {ts}\nmodel: {model}\n\n{prompt}\n\n",
        )
        st["model"] = model
        save_state(st)
    elif is_response and response:
        n = max(1, int(st.get("exchange", 1)))
        append(
            path,
            f"\n---\n\n[LOG_ENTRY type=RESPONSE num={n} session={sid}]\n"
            f"timestamp: {ts}\nmodel: {model}\n\n{response}\n\n",
        )
        save_state(st)

    print(json.dumps({}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
