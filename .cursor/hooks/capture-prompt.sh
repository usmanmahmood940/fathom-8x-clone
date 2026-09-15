#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)
echo "$INPUT" | python3 -c '
import json,sys,subprocess
raw=sys.stdin.read()
try: d=json.loads(raw) if raw.strip() else {}
except Exception: d={}
d["hook_event_name"]="beforeSubmitPrompt"
if "prompt" not in d:
  for k in ("user_prompt","message","text","content"):
    if k in d and isinstance(d[k], str):
      d["prompt"]=d[k]; break
subprocess.run([sys.executable, "'"$DIR"'/capture.py"], input=json.dumps(d), text=True)
print("{}")
'
