#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_ROOT="$(dirname "$FRONTEND_ROOT")/interop-be-monorepo"
TOKEN_FILE="$BACKEND_ROOT/.local-development/frontend-token"

[[ -s "$TOKEN_FILE" ]] || { echo "Missing local token. Run pnpm local:start first." >&2; exit 1; }
TOKEN="$(tr -d '\n' < "$TOKEN_FILE")"

curl --max-time 30 --fail --silent --output /dev/null http://localhost:5173/ui/it
curl --max-time 10 --fail --silent --output /dev/null \
  http://localhost:3600/backend-for-frontend/0.0/status
curl --max-time 10 --fail --silent http://localhost:8006/health \
  | jq --exit-status '.status == "ok"' >/dev/null

CATALOG="$(curl --max-time 30 --fail --silent \
  -H "Authorization: Bearer $TOKEN" \
  'http://localhost:5173/0.0/backend-for-frontend/catalog?offset=0&limit=50')"
jq --exit-status \
  '.results | any(.name == "Catalogo Demo" and .producer.name == "Provider Demo")' \
  <<<"$CATALOG" >/dev/null

(cd "$BACKEND_ROOT" && docker compose -f docker/docker-compose.yml ps --status running --quiet) \
  | grep --quiet .

echo "Local full-stack smoke checks passed"
