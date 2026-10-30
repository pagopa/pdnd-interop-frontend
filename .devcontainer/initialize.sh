#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_ROOT="${INTEROP_BE_ROOT:-$(dirname "$FRONTEND_ROOT")/interop-be-monorepo}"
if [[ ! -e "$BACKEND_ROOT" ]]; then
  git clone --branch develop --single-branch https://github.com/pagopa/interop-be-monorepo.git "$BACKEND_ROOT"
elif [[ ! -d "$BACKEND_ROOT/.git" ]]; then
  echo "$BACKEND_ROOT exists but is not a Git repository" >&2
  exit 1
fi
INTEROP_BE_ROOT="$BACKEND_ROOT" bash "$BACKEND_ROOT/scripts/local-development/dashboard.sh" prepare
INTEROP_BE_ROOT="$BACKEND_ROOT" bash "$FRONTEND_ROOT/.devcontainer/prepare.sh"
if [[ "${1:-}" == --open-dashboard ]]; then
  bash "$FRONTEND_ROOT/.devcontainer/open-dashboard.sh" prepare "$FRONTEND_ROOT/.local-development/frontend"
fi
