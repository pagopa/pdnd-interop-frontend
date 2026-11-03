#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Inside the devcontainer, localhost belongs to the container while the public
# frontend is published by Docker on the host. Keep localhost as the browser
# origin (required by the application) and resolve it to the host only in
# Chromium. On the host itself, or with an explicitly selected frontend on
# another origin, no automatic override is needed.
base_url="${PLAYWRIGHT_BASE_URL:-http://localhost:3000}"
if [[ "${INTEROP_DEVCONTAINER:-}" == "true" ]] \
  && [[ "$base_url" == "http://localhost:3000" || "$base_url" == "http://localhost:3000/" ]]; then
  host_gateway="${PLAYWRIGHT_HOST_GATEWAY:-}"
  if [[ -z "$host_gateway" ]] && command -v getent >/dev/null 2>&1; then
    host_gateway="$(getent ahostsv4 host.docker.internal 2>/dev/null | awk 'NR == 1 { print $1 }' || true)"
  fi
  if [[ -z "$host_gateway" ]]; then
    echo "Cannot resolve host.docker.internal inside the devcontainer. Check Docker host access and rebuild the container before running E2E tests." >&2
    exit 1
  fi
  export PLAYWRIGHT_HOST_GATEWAY="$host_gateway"
  export PLAYWRIGHT_PUBLIC_FRONTEND_URL="${PLAYWRIGHT_PUBLIC_FRONTEND_URL:-http://host.docker.internal:3000/ui/it/}"
fi

cd "$FRONTEND_ROOT"
exec pnpm exec playwright test e2e "$@"
