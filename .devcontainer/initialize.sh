#!/usr/bin/env bash
set -euo pipefail

FRONTEND_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_ROOT="$(dirname "$FRONTEND_ROOT")/interop-be-monorepo"

if [[ ! -e "$BACKEND_ROOT" ]]; then
  git clone --branch develop --single-branch \
    https://github.com/pagopa/interop-be-monorepo.git "$BACKEND_ROOT"
elif [[ ! -d "$BACKEND_ROOT/.git" ]]; then
  echo "$BACKEND_ROOT exists but is not a Git repository" >&2
  exit 1
fi

echo "Backend repository available at $BACKEND_ROOT"

# A stopped container holds the dynamically discovered mounts. The devcontainer
# inherits them through --volumes-from without needing a static list of packages.
MODULES_CONTAINER="interop-backend-workspace-modules"
PENDING_CONTAINER="$MODULES_CONTAINER-$$"
MODULES_LABEL="interop.devcontainer.workspace-modules"
mount_arguments=()
for manifest in "$BACKEND_ROOT"/packages/*/package.json; do
  [[ -f "$manifest" ]] || continue
  package_directory="$(dirname "$manifest")"
  package_name="${package_directory##*/}"
  mount_arguments+=(--mount \
    "type=volume,source=interop-backend-$package_name-node-modules,target=$package_directory/node_modules,volume-nocopy")
done
if (( ${#mount_arguments[@]} == 0 )); then
  echo "No backend workspace packages found under $BACKEND_ROOT/packages" >&2
  exit 1
fi

docker info >/dev/null
if docker container inspect "$MODULES_CONTAINER" >/dev/null 2>&1; then
  if [[ "$(docker inspect --format '{{index .Config.Labels "interop.devcontainer.workspace-modules"}}' "$MODULES_CONTAINER")" != true ]]; then
    echo "Container $MODULES_CONTAINER already exists and is not managed by this setup" >&2
    exit 1
  fi
fi

trap 'docker container rm "$PENDING_CONTAINER" >/dev/null 2>&1 || true' EXIT
docker create --name "$PENDING_CONTAINER" --network none \
  --label "$MODULES_LABEL=true" "${mount_arguments[@]}" \
  busybox:1.37.0 true >/dev/null
if docker container inspect "$MODULES_CONTAINER" >/dev/null 2>&1; then
  # Removing the holder leaves all named dependency volumes intact.
  docker container rm "$MODULES_CONTAINER" >/dev/null
fi
docker container rename "$PENDING_CONTAINER" "$MODULES_CONTAINER"
trap - EXIT
echo "Prepared Docker dependency volumes for $((${#mount_arguments[@]} / 2)) backend packages"
