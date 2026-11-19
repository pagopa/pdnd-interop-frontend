#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
case "${1:-}" in
  install)
    cd "$FRONTEND_ROOT"
    CI=true pnpm install --frozen-lockfile
    pnpm exec playwright install chromium
    ;;
  frontend) exec bash "$FRONTEND_ROOT/scripts/local-development/run-frontend.sh" "${2:-local}" ;;
  smoke) exec bash "$FRONTEND_ROOT/scripts/local-development/smoke.sh" ;;
  browser-checks) exec bash "$FRONTEND_ROOT/scripts/local-development/run-e2e.sh" ;;
  *) echo "Usage: $0 {install|frontend [local|dev]|smoke|browser-checks}" >&2; exit 1 ;;
esac
