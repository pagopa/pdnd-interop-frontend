#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME_ROOT="$FRONTEND_ROOT/.local-development"
LOG_FILE="$RUNTIME_ROOT/startup.log"
STATUS_FILE="$RUNTIME_ROOT/startup.status"

mkdir -p "$RUNTIME_ROOT"

if [[ "${INTEROP_AUTO_START:-true}" == "false" ]]; then
  printf 'disabled\n' > "$STATUS_FILE"
  echo "Automatic full-stack startup disabled (INTEROP_AUTO_START=false)"
  exit 0
fi

if tmux has-session -t interop-startup 2>/dev/null; then
  echo "Full-stack startup is already running"
  exit 0
fi

if [[ "$(cat "$STATUS_FILE" 2>/dev/null || true)" == "ready" ]] \
  && curl --fail --silent --output /dev/null http://localhost:5173/ui/it; then
  echo "Full stack is already ready"
  exit 0
fi

: > "$LOG_FILE"
printf 'starting\n' > "$STATUS_FILE"
tmux new-session -d -s interop-startup \
  "bash -lc 'exec \"$FRONTEND_ROOT/scripts/local-development/run-startup.sh\" >>\"$LOG_FILE\" 2>&1'"

echo "Full-stack startup launched; progress is written to $LOG_FILE"
