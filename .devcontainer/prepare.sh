#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="${INTEROP_FE_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)}"
BACKEND_ROOT="$(cd "${INTEROP_BE_ROOT:-$(dirname "$FRONTEND_ROOT")/interop-be-monorepo}" && pwd -P)"
BACKEND_WORKSPACE_MOUNT="$FRONTEND_ROOT/.local-development/interop-be-monorepo"
STATE_ROOT="${INTEROP_FRONTEND_STATE_ROOT:-$FRONTEND_ROOT/.local-development/frontend}"
mkdir -p "$STATE_ROOT" "$FRONTEND_ROOT/.local-development"

# Migrate the former host symlink without touching its checkout. Docker Desktop
# must expose a directory here, rather than resolve a host symlink in the guest.
if [[ -L "$BACKEND_WORKSPACE_MOUNT" ]]; then
  rm -- "$BACKEND_WORKSPACE_MOUNT"
fi
if [[ -e "$BACKEND_WORKSPACE_MOUNT" ]] && {
  [[ ! -d "$BACKEND_WORKSPACE_MOUNT" ]] || [[ -n "$(ls -A "$BACKEND_WORKSPACE_MOUNT")" ]]
}; then
  echo "$BACKEND_WORKSPACE_MOUNT exists and is not an empty workspace mountpoint" >&2
  exit 1
fi
mkdir -p "$BACKEND_WORKSPACE_MOUNT"

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
if [[ "$(uname -s)" == Darwin ]]; then
  # Docker Desktop maps bind-mount permissions. Keep node's identity stable for VS Code attachment.
  runtime_uid=1000
  runtime_gid=1000
else
  runtime_uid="$(id -u)"
  runtime_gid="$(id -g)"
fi
{
  printf '{"services":{"frontend":{"build":{"context":'
  json_string "$FRONTEND_ROOT/.devcontainer"
  printf '},"working_dir":'
  json_string "$FRONTEND_ROOT"
  printf ',"environment":{"INTEROP_FE_ROOT":'
  json_string "$FRONTEND_ROOT"
  printf ',"INTEROP_BE_ROOT":'
  json_string "$BACKEND_ROOT"
  printf ',"LOCAL_UID":"%s","LOCAL_GID":"%s"},' "$runtime_uid" "$runtime_gid"
  printf '"volumes":[{"type":"bind","source":'
  json_string "$FRONTEND_ROOT"
  printf ',"target":'
  json_string "$FRONTEND_ROOT"
  printf '},{"type":"bind","source":'
  json_string "$BACKEND_ROOT"
  printf ',"target":'
  json_string "$BACKEND_ROOT"
  printf '},{"type":"bind","source":'
  json_string "$BACKEND_ROOT"
  printf ',"target":'
  json_string "$BACKEND_WORKSPACE_MOUNT"
  printf '},{"type":"volume","source":"frontend-modules","target":'
  json_string "$FRONTEND_ROOT/node_modules"
  printf ',"volume":{"nocopy":true}}]}}}\n'
} > "$STATE_ROOT/compose.yml.tmp"
mv "$STATE_ROOT/compose.yml.tmp" "$STATE_ROOT/compose.yml"
echo "Prepared frontend runtime: $STATE_ROOT/compose.yml"
