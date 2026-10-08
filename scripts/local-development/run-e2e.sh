#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Inside the devcontainer, localhost belongs to the container while the public
# frontend is published by Docker on the host. Keep localhost as the browser
# origin (required by the application) and resolve it to the host only in
# Chromium. On the host itself, no override is needed.
if command -v getent >/dev/null 2>&1; then
  host_gateway="$(getent ahostsv4 host.docker.internal 2>/dev/null | awk 'NR == 1 { print $1 }' || true)"
  if [[ -n "$host_gateway" ]]; then
    export PLAYWRIGHT_HOST_GATEWAY="$host_gateway"
    export PLAYWRIGHT_PUBLIC_FRONTEND_URL="http://host.docker.internal:3000/ui/it/"
  fi
fi

cd "$FRONTEND_ROOT"
exec pnpm exec playwright test e2e "$@"
