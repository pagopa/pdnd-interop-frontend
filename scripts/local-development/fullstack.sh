#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="${INTEROP_BE_ROOT:-$(dirname "$FRONTEND_ROOT")/interop-be-monorepo}"
CLIENT="$FRONTEND_ROOT/scripts/local-development/dashboard-client.mjs"

compose() {
  docker compose -f "$BACKEND_ROOT/docker/docker-compose.yml" \
    -f "$BACKEND_ROOT/.local-development/dashboard/compose.yml" \
    -f "$FRONTEND_ROOT/.local-development/frontend/compose.yml" --profile dashboard "$@"
}

if [[ "${INTEROP_FRONTEND_RUNTIME:-}" != "true" ]]; then
  if [[ "${1:-}" == start ]]; then
    bash "$FRONTEND_ROOT/.devcontainer/initialize.sh"
    previous="$(compose ps -q frontend)"
    previous_running=false
    if [[ -n "$previous" ]]; then
      previous_running="$(docker inspect --format '{{.State.Running}}' "$previous")"
    fi
    dashboard="$(compose ps -q dashboard)"
    if [[ -z "$dashboard" ]] || [[ "$(docker inspect --format '{{.State.Running}}' "$dashboard")" != true ]]; then
      compose up -d --build dashboard
    fi
    compose up -d --build --no-deps frontend
    container="$(compose ps -q frontend)"
    if [[ "$container" == "$previous" && "$previous_running" == true ]]; then
      startup="$(compose exec -T frontend node "$CLIENT" startup-state)"
      if [[ "$startup" != running ]]; then
        compose exec -T frontend node "$CLIENT" start
        exit $?
      fi
    fi
    for ((attempt=0; attempt<1800; attempt++)); do
      startup="$(compose exec -T frontend node "$CLIENT" startup-state 2>/dev/null || true)"
      if [[ "$startup" == failed ]]; then
        compose logs frontend >&2
        exit 1
      fi
      state="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container")"
      case "$state" in
        healthy) echo 'Frontend: http://localhost:3000/ui/it/'; exit 0 ;;
        unhealthy|exited|dead) compose logs frontend >&2; exit 1 ;;
      esac
      sleep 1
    done
    echo 'Frontend startup timed out; inspect frontend container logs' >&2
    exit 1
  fi
  exec docker compose -f "$BACKEND_ROOT/docker/docker-compose.yml" \
    -f "$BACKEND_ROOT/.local-development/dashboard/compose.yml" \
    -f "$FRONTEND_ROOT/.local-development/frontend/compose.yml" --profile dashboard \
    exec -T frontend bash "$FRONTEND_ROOT/scripts/local-development/fullstack.sh" "$@"
fi

case "${1:-}" in
  start|stop|reset|use-local|use-dev) node "$CLIENT" "$1" ;;
  status) node "$CLIENT" status ;;
  logs) node "$CLIENT" logs "${2:-}" ;;
  identity)
    tenant="${2:-}"; user="${3:-}"
    case "$tenant" in comune|provider|impresa|certificatore) ;; *) echo "Invalid tenant: $tenant" >&2; exit 1 ;; esac
    case "$user" in admin|api|security|reviewer|viewer) ;; *) echo "Invalid user: $user" >&2; exit 1 ;; esac
    node "$CLIENT" identity "$tenant" "$user"
    ;;
  *) echo "Usage: $0 {start|stop|status|logs [SOURCE]|reset|use-local|use-dev|identity TENANT USER}" >&2; exit 1 ;;
esac
