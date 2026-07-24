#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ "${INTEROP_DEVCONTAINER:-}" != "true" ]]; then
  echo "Skipping local full-stack startup outside the devcontainer."
  exit 0
fi

exec "$FRONTEND_ROOT/scripts/local-development/dashboard.sh"
