#!/usr/bin/env bash
set -euo pipefail

if [[ "${INTEROP_FRONTEND_RUNTIME:-}" != true ]]; then
  echo 'Startup logs are available inside the frontend devcontainer.'
  exit 0
fi

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)"
exec node "$FRONTEND_ROOT/scripts/local-development/frontend-logs.mjs"
