#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ "${INTEROP_DEVCONTAINER:-}" != "true" ]]; then
  echo "Skipping local full-stack startup outside the devcontainer."
  exit 0
fi

CONTAINER_START_ID="$(awk '{print $22}' /proc/1/stat)"
POST_START_STATUS="/tmp/interop-post-start-$CONTAINER_START_ID.status"

echo "Waiting for the devcontainer post-start command"
until [[ -f "$POST_START_STATUS" ]]; do
  sleep 1
done

if [[ "$(cat "$POST_START_STATUS")" != "started" ]]; then
  echo "The devcontainer post-start command failed. Check the Dev Containers log."
  exit 1
fi

exec "$FRONTEND_ROOT/scripts/local-development/dashboard.sh" --follow-only
