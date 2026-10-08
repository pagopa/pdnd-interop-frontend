#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME_ROOT="$FRONTEND_ROOT/.local-development"
LOG_FILE="$RUNTIME_ROOT/startup.log"
STATUS_FILE="$RUNTIME_ROOT/startup.status"
FOLLOW_ONLY=false

if [[ "${1:-}" == "--follow-only" ]]; then
  FOLLOW_ONLY=true
elif [[ -n "${1:-}" ]]; then
  echo "Usage: $0 [--follow-only]" >&2
  exit 1
fi

mkdir -p "$RUNTIME_ROOT"
touch "$LOG_FILE"

echo "PDND Interop local environment"
echo "This terminal follows infrastructure, backend, seed, smoke, and frontend startup."
echo

if [[ "$FOLLOW_ONLY" == "false" ]]; then
  "$FRONTEND_ROOT/scripts/local-development/start-background.sh"
fi

tail -n +1 -F "$LOG_FILE" &
TAIL_PID=$!
trap 'kill "$TAIL_PID" 2>/dev/null || true' EXIT

while true; do
  status="$(cat "$STATUS_FILE" 2>/dev/null || true)"
  case "$status" in
    ready|failed|disabled) break ;;
  esac
  sleep 1
done

sleep 1
kill "$TAIL_PID" 2>/dev/null || true
wait "$TAIL_PID" 2>/dev/null || true
trap - EXIT

echo
case "$status" in
  ready)
    "$FRONTEND_ROOT/scripts/local-development/fullstack.sh" status
    echo
    printf 'READY: \033]8;;http://localhost:3000/ui/it/\033\\Open frontend in the host browser\033]8;;\033\\\n'
    echo "If the link is not supported, open host port 3000 at path /ui/it/."
    ;;
  disabled)
    echo "Automatic startup is disabled. Run: pnpm local:start"
    ;;
  failed)
    echo "FAILED: fix the reported error, then rerun: pnpm local:dashboard"
    exit 1
    ;;
esac
