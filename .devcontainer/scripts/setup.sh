#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$(dirname "$FRONTEND_ROOT")/interop-be-monorepo"

workspace_modules=()
for manifest in "$BACKEND_ROOT"/packages/*/package.json; do
  [[ -f "$manifest" ]] || continue
  modules_directory="$(dirname "$manifest")/node_modules"
  if ! mountpoint -q "$modules_directory"; then
    echo "Missing dependency volume for $modules_directory. Run Dev Containers: Rebuild Container." >&2
    exit 1
  fi
  workspace_modules+=("$modules_directory")
done

sudo chown -R "$(id -u):$(id -g)" \
  "$FRONTEND_ROOT/node_modules" \
  "$BACKEND_ROOT/node_modules" \
  "${workspace_modules[@]}" \
  /home/node/.local/share/pnpm \
  /home/node/.cache

echo "Installing backend dependencies"
(cd "$BACKEND_ROOT" && CI=true pnpm install --frozen-lockfile)
echo "Installing frontend dependencies"
(cd "$FRONTEND_ROOT" && CI=true pnpm install --frozen-lockfile)
echo "Installing the Playwright Chromium browser"
(cd "$FRONTEND_ROOT" && pnpm exec playwright install chromium)

echo "Frontend, backend, and Playwright dependencies are installed"
