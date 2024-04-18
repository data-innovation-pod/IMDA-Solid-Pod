#!/bin/bash
# wait-for-it.sh
# Wait for a service to be available before continuing

set -e

host="$1"
port="$2"
timeout="10"

echo "Waiting for $host:$port..."

while ! nc -z "$host" "$port"; do
  sleep 1
  timeout=$((timeout - 1))
  
  if [ "$timeout" -eq 0 ]; then
    echo "Timeout waiting for $host:$port"
    exit 1
  fi
done

echo "$host:$port is available!"
