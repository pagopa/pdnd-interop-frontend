#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="${INTEROP_FE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)}"
STATE_ROOT="${INTEROP_FRONTEND_STATE_ROOT:-$FRONTEND_ROOT/.local-development/frontend}"
mkdir -p "$STATE_ROOT"

json_string() {
  local value="$1"
  if [[ "$value" == *$'\n'* || "$value" == *$'\r'* || "$value" == *$'\t'* ]]; then
    echo 'Workspace paths cannot contain control characters' >&2
    exit 1
  fi
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  printf '"%s"' "$value"
}

# Dev Containers validates Compose before selecting services or enabling profiles.
{
  printf '{"services":{"frontend":{"profiles":["dashboard"],"init":true,"build":{"context":'
  json_string "$FRONTEND_ROOT/.devcontainer"
  printf '},"working_dir":'
  json_string "$FRONTEND_ROOT"
  printf ',"environment":{"INTEROP_FE_ROOT":'
  json_string "$FRONTEND_ROOT"
  printf ',"INTEROP_DEVCONTAINER":"true","INTEROP_FRONTEND_RUNTIME":"true","INTEROP_DASHBOARD_URL":"http://dashboard:8076","INTEROP_LOCAL_BACKEND_TARGET":"http://dashboard:3600","INTEROP_SELFCARE_URL":"http://host.docker.internal:8006","INTEROP_FRONTEND_PORT":"5173","LOCAL_UID":"%s","LOCAL_GID":"%s"},' "$(id -u)" "$(id -g)"
  printf '"extra_hosts":["host.docker.internal:host-gateway"],"ports":["3000:5173"],"depends_on":{"dashboard":{"condition":"service_healthy"}},"volumes":[{"type":"bind","source":'
  json_string "$FRONTEND_ROOT"
  printf ',"target":'
  json_string "$FRONTEND_ROOT"
  printf '},{"type":"volume","source":"frontend-modules","target":'
  json_string "$FRONTEND_ROOT/node_modules"
  printf ',"volume":{"nocopy":true}},{"type":"volume","source":"frontend-pnpm-store","target":"/home/node/.local/share/pnpm","volume":{"nocopy":true}},{"type":"volume","source":"frontend-browser-cache","target":"/home/node/.cache","volume":{"nocopy":true}}],"healthcheck":{"test":["CMD","node","scripts/local-development/dashboard-client.mjs","startup-status"],"interval":"5s","timeout":"5s","retries":3,"start_period":"30m"}}},"volumes":{"frontend-modules":{},"frontend-pnpm-store":{},"frontend-browser-cache":{}}}\n'
} > "$STATE_ROOT/compose.yml.tmp"
mv "$STATE_ROOT/compose.yml.tmp" "$STATE_ROOT/compose.yml"
echo "Prepared frontend runtime: $STATE_ROOT/compose.yml"
