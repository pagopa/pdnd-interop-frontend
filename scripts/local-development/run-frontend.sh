#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$(dirname "$FRONTEND_ROOT")/interop-be-monorepo"
MODE="${1:-local}"

cd "$FRONTEND_ROOT"
export INTEROP_FRONTEND_PORT="${INTEROP_FRONTEND_PORT:-5173}"
export INTEROP_FRONTEND_POLLING="${INTEROP_FRONTEND_POLLING:-true}"
export INTEROP_LOCAL_DEVELOPMENT="true"
export REACT_APP_LOCAL_DASHBOARD="true"

if [[ "$MODE" == "local" ]]; then
  export REACT_APP_LOCAL_IDENTITY_SELECTION="true"
  export SELFCARE_LOGIN_URL="${SELFCARE_LOGIN_URL:-http://localhost:3000/ui/it/local-identity-selection/}"
  TOKEN_FILE="$BACKEND_ROOT/.local-development/frontend-token"
  if [[ ! -s "$TOKEN_FILE" ]]; then
    echo "Missing local token. Run pnpm local:start first." >&2
    exit 1
  fi
  export REACT_APP_MOCK_TOKEN="$(tr -d '\n' < "$TOKEN_FILE")"
  export INTEROP_BACKEND_TARGET="http://localhost:3600"
elif [[ "$MODE" == "bootstrap" ]]; then
  export REACT_APP_LOCAL_IDENTITY_SELECTION="true"
  export SELFCARE_LOGIN_URL="${SELFCARE_LOGIN_URL:-http://localhost:3000/ui/it/local-identity-selection/}"
  export INTEROP_BACKEND_TARGET="http://localhost:3600"
elif [[ "$MODE" != "dev" ]]; then
  echo "Unknown frontend mode: $MODE (expected bootstrap, local, or dev)" >&2
  exit 1
fi

exec pnpm dev --host 0.0.0.0
