#!/usr/bin/env bash
set -euo pipefail

: "${INTEROP_FE_ROOT:?Missing frontend checkout mount}"
if [[ "${1:-}" != --user ]]; then
  uid="${LOCAL_UID:-1000}"
  gid="${LOCAL_GID:-1000}"
  [[ "$uid" =~ ^[0-9]+$ && "$gid" =~ ^[0-9]+$ && "$uid" != 0 ]] || {
    echo 'Run the frontend from a non-root development checkout' >&2
    exit 1
  }
  if [[ "$(id -g node)" != "$gid" ]]; then groupmod -o -g "$gid" node; fi
  if [[ "$(id -u node)" != "$uid" ]]; then usermod -o -u "$uid" node; fi
  for directory in "$INTEROP_FE_ROOT/node_modules" /home/node/.local/share/pnpm /home/node/.cache; do
    mountpoint -q "$directory" || { echo "Missing frontend dependency volume: $directory" >&2; exit 1; }
    if [[ "$(stat -c '%u:%g' "$directory")" != "$uid:$gid" ]]; then chown -R "$uid:$gid" "$directory"; fi
  done
  exec gosu node /usr/local/bin/frontend-entrypoint --user
fi

for repository in "$INTEROP_FE_ROOT" "${INTEROP_BE_ROOT:-}" "$INTEROP_FE_ROOT/.local-development/interop-be-monorepo"; do
  [[ -n "$repository" ]] || continue
  [[ -e "$repository/.git" ]] || continue
  repository="$(cd "$repository" && pwd -P)"
  if ! git config --global --get-all safe.directory | grep -Fxq -- "$repository"; then
    git config --global --add safe.directory "$repository"
  fi
done

cd "$INTEROP_FE_ROOT"
mkdir -p .local-development/frontend
exec > >(tee -a .local-development/frontend/startup.log) 2>&1
exec node scripts/local-development/dashboard-client.mjs serve
