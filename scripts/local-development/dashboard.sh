#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="${INTEROP_BE_ROOT:-$(dirname "$FRONTEND_ROOT")/interop-be-monorepo}"

if [[ "${INTEROP_FRONTEND_RUNTIME:-}" != "true" ]]; then
  bash "$BACKEND_ROOT/scripts/local-development/dashboard.sh" start
else
  node "$FRONTEND_ROOT/scripts/local-development/dashboard-client.mjs" ready
fi
echo "Development dashboard: http://localhost:8076"
