#!/usr/bin/env bash
set -euo pipefail

# State Synchronization Script
# Verifies environment state and essential configuration integrity prior to service start.

LOG_PREFIX="[STATE-SYNC]"

echo "${LOG_PREFIX} Starting environment state synchronization..."

# Ensure data directory exists
if [ ! -d "data" ]; then
  echo "${LOG_PREFIX} Data directory missing. Initializing /data directory..."
  mkdir -p data
fi

# Verify core project files
if [ ! -f "package.json" ]; then
  echo "${LOG_PREFIX} ERROR: package.json missing from workspace root." >&2
  exit 1
fi

if [ ! -f "metadata.json" ]; then
  echo "${LOG_PREFIX} WARNING: metadata.json missing. Initializing placeholder configuration..."
  echo '{"name":"Aurelius Orchestrator","description":"High Availability Service"}' > metadata.json
fi

echo "${LOG_PREFIX} Verification passed. State sync complete."
exit 0
