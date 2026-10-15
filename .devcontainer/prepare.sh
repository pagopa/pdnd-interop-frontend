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

# Fixed service settings live in .devcontainer/compose.yml.
{
  printf '{"services":{"frontend":{"build":{"context":'
  json_string "$FRONTEND_ROOT/.devcontainer"
  printf '},"working_dir":'
  json_string "$FRONTEND_ROOT"
  printf ',"environment":{"INTEROP_FE_ROOT":'
  json_string "$FRONTEND_ROOT"
  printf ',"LOCAL_UID":"%s","LOCAL_GID":"%s"},' "$(id -u)" "$(id -g)"
  printf '"volumes":[{"type":"bind","source":'
  json_string "$FRONTEND_ROOT"
  printf ',"target":'
  json_string "$FRONTEND_ROOT"
  printf '},{"type":"volume","source":"frontend-modules","target":'
  json_string "$FRONTEND_ROOT/node_modules"
  printf ',"volume":{"nocopy":true}}]}}}\n'
} > "$STATE_ROOT/compose.yml.tmp"
mv "$STATE_ROOT/compose.yml.tmp" "$STATE_ROOT/compose.yml"
echo "Prepared frontend runtime: $STATE_ROOT/compose.yml"
