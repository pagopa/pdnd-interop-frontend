#!/usr/bin/env bash
set -euo pipefail

ports=(4500 4566 6001 6002 6003 6004 6006 6007 6008 6009 6379 8005 8006 8083 8085 9000 9092 9324)
pids=()

cleanup() {
  if (( ${#pids[@]} > 0 )); then
    kill "${pids[@]}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

for port in "${ports[@]}"; do
  socat "TCP-LISTEN:${port},fork,reuseaddr" "TCP:host.docker.internal:${port}" &
  pids+=("$!")
done

wait
