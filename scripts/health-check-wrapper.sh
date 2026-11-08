#!/usr/bin/env bash
set -euo pipefail

# Health-Check Process Wrapper Script
# Performs environment verification, monitors service process lifecycle, and logs restarts.

LOG_PREFIX="[HA-WRAPPER]"
MAX_RESTARTS=10
RESTART_COUNT=0

echo "${LOG_PREFIX} Executing pre-start environment state sync..."
if [ -f "./scripts/state-sync.sh" ]; then
  bash ./scripts/state-sync.sh
fi

echo "${LOG_PREFIX} Initializing application service supervisor loop..."

while true; do
  echo "${LOG_PREFIX} Launching primary process (Attempt $((RESTART_COUNT + 1)))..."
  
  # Execute the node server entrypoint
  npm run dev &
  PID=$!
  
  echo "${LOG_PREFIX} Application running with PID ${PID}."
  
  # Monitor application process
  EXIT_CODE=0
  wait "${PID}" || EXIT_CODE=$?
  
  echo "${LOG_PREFIX} Service process (PID ${PID}) exited with code ${EXIT_CODE}."
  
  RESTART_COUNT=$((RESTART_COUNT + 1))
  
  if [ "${RESTART_COUNT}" -ge "${MAX_RESTARTS}" ]; then
    echo "${LOG_PREFIX} ERROR: Maximum restart limit (${MAX_RESTARTS}) reached. Exiting wrapper." >&2
    exit 1
  fi
  
  echo "${LOG_PREFIX} Pausing 5 seconds before attempting restart..."
  sleep 5
done
