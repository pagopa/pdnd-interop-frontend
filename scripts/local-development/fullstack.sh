#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="${INTEROP_BE_ROOT:-$(dirname "$FRONTEND_ROOT")/interop-be-monorepo}"
CLIENT="$FRONTEND_ROOT/scripts/local-development/dashboard-client.mjs"

case "${1:-}" in
  start)
    bash "$FRONTEND_ROOT/scripts/local-development/dashboard.sh"
    node "$CLIENT" fullstack.start
    ;;
  stop) node "$CLIENT" fullstack.stop ;;
  status) node "$CLIENT" status ;;
  logs) node "$CLIENT" logs "${2:-}" ;;
  reset) node "$CLIENT" infra.reset ;;
  use-local|use-dev) node "$CLIENT" frontend.restart "${1#use-}" ;;
  identity)
    tenant="${2:-}"; user="${3:-}"
    case "$tenant" in comune|provider|impresa|certificatore) ;; *) echo "Invalid tenant: $tenant" >&2; exit 1 ;; esac
    case "$user" in admin|api|security|reviewer|viewer) ;; *) echo "Invalid user: $user" >&2; exit 1 ;; esac
    (cd "$BACKEND_ROOT" && pnpm local:token -- --tenant "$tenant" --user "$user" --output .local-development/frontend-token)
    node "$CLIENT" frontend.restart local
    ;;
  *) echo "Usage: $0 {start|stop|status|logs [SOURCE]|reset|use-local|use-dev|identity TENANT USER}" >&2; exit 1 ;;
esac
