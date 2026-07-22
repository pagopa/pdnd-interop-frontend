#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNTIME_ROOT="$FRONTEND_ROOT/.local-development"
STATUS_FILE="$RUNTIME_ROOT/startup.status"

mkdir -p "$RUNTIME_ROOT"

startup_failed() {
  local exit_code=$?
  printf 'failed\n' > "$STATUS_FILE"
  echo
  echo "FULL-STACK STARTUP FAILED (exit code $exit_code)"
  echo "Inspect the error above or run: pnpm local:logs"
  echo "After fixing it, retry with: pnpm local:dashboard"
  exit "$exit_code"
}
trap startup_failed ERR

printf 'starting\n' > "$STATUS_FILE"
echo "PDND Interop local full-stack startup"
echo "Started at $(date --iso-8601=seconds)"
echo

"$FRONTEND_ROOT/scripts/local-development/fullstack.sh" start

echo
echo "Running the full-stack smoke checks"
"$FRONTEND_ROOT/scripts/local-development/smoke.sh"

echo
echo "Running the frontend browser checks"
(cd "$FRONTEND_ROOT" && pnpm local:test:e2e)

printf 'ready\n' > "$STATUS_FILE"
echo
echo "FULL STACK READY"
echo "Frontend ready on host port 3000 at path /ui/it/."
echo "Logs: pnpm local:logs"
echo "Status: pnpm local:status"
