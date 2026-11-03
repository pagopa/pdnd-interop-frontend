#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CONTAINER_START_ID="$(awk '{print $22}' /proc/1/stat)"
POST_START_STATUS="/tmp/interop-post-start-$CONTAINER_START_ID.status"

if "$FRONTEND_ROOT/scripts/local-development/start-background.sh"; then
  printf 'started\n' > "$POST_START_STATUS"
else
  printf 'failed\n' > "$POST_START_STATUS"
  exit 1
fi
