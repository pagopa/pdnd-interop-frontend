#!/usr/bin/env bash
set -euo pipefail

mode="${1:?Missing browser opener mode}"
state_root="${2:?Missing frontend state directory}"

if [[ "$mode" == prepare ]]; then
  mkdir -p "$state_root"
  request_dir="$(mktemp -d "$state_root/browser-open.XXXXXXXX")"
  printf '%s\n' "${request_dir##*/}" > "$request_dir/token"
  mv "$request_dir/token" "$state_root/browser-request"
  # Dev Containers closes its initialization PTY as soon as this command exits.
  # Ignore the hangup before forking, including the window before nohup starts.
  trap '' HUP
  nohup bash "${BASH_SOURCE[0]}" wait "$state_root" "${request_dir##*/}" \
    > "$state_root/browser-open.log" 2>&1 < /dev/null &
  exit 0
fi

[[ "$mode" == wait ]] || exit 1
request="${3:?Missing browser request}"
[[ "$request" =~ ^browser-open\.[a-zA-Z0-9]{8}$ ]] || exit 1
request_dir="$state_root/$request"
cleanup() {
  if [[ -f "$request_dir/ready" ]]; then rm -- "$request_dir/ready"; fi
  rmdir "$request_dir" 2>/dev/null || true
}
trap cleanup EXIT

deadline=$((SECONDS + 1800))
while (( SECONDS < deadline )); do
  [[ "$(cat "$state_root/browser-request" 2>/dev/null)" == "$request" ]] || exit 0
  if [[ -f "$request_dir/ready" ]]; then
    [[ "$(cat "$state_root/browser-request" 2>/dev/null)" == "$request" ]] || exit 0
    url='http://localhost:8076/#/status'
    if [[ -n "${WSL_INTEROP:-}" || "$(uname -r)" == *[Mm]icrosoft* ]]; then
      powershell.exe -NoProfile -NonInteractive -Command "Start-Process '$url'"
    elif [[ "$(uname -s)" == Darwin ]]; then
      open "$url"
    else
      xdg-open "$url"
    fi
    exit 0
  fi
  sleep 1
done
echo 'Timed out waiting to open http://localhost:8076/#/status' >&2
