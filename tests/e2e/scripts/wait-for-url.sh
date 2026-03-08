#!/usr/bin/env sh
set -e

URL="$1"
TRIES=40

until curl -sSf "$URL" > /dev/null; do
  TRIES=$((TRIES - 1))
  if [ "$TRIES" -le 0 ]; then
    echo "Timed out waiting for $URL"
    exit 1
  fi
  sleep 2
done
