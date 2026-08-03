#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$(dirname "$FRONTEND_ROOT")/interop-be-monorepo"

sudo chown -R "$(id -u):$(id -g)" \
  "$FRONTEND_ROOT/node_modules" \
  "$BACKEND_ROOT/node_modules" \
  /home/node/.local/share/pnpm \
  /home/node/.cache/ms-playwright

(cd "$BACKEND_ROOT" && CI=true pnpm install --frozen-lockfile)
(cd "$FRONTEND_ROOT" && CI=true pnpm install --frozen-lockfile)
(cd "$FRONTEND_ROOT" && pnpm exec playwright install chromium)

echo "Frontend, backend, and Playwright dependencies are installed"
