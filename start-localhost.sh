#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — LOCALHOST RUNNER & LAUNCHER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Clearance
# HFID Consensus 100/100 · Zenodo DOI: 10.5281/zenodo.20778079
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT="${PORT:-3000}"

# Colors
GOLD='\033[38;5;220m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
NC='\033[0m'

echo -e "${GOLD}▶ Launching Aurelius & Lysander Sovereign Matrix on Localhost (Port ${PORT})...${NC}"

# Check if server already running on port
SERVER_RUNNING=false
if curl -s "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
  SERVER_RUNNING=true
  echo -e "${EMERALD}✓ Aurelius server is already running on http://127.0.0.1:${PORT}${NC}"
else
  echo -e "${CYAN}▶ Starting server in background...${NC}"
  export NODE_OPTIONS="--max-old-space-size=2048"
  nohup npx tsx server.ts > .localhost-server.log 2>&1 &
  SERVER_PID=$!
  echo "PID: $SERVER_PID" > .localhost-server.pid
  
  # Wait up to 10 seconds for server health check
  for i in {1..10}; do
    sleep 1
    if curl -s "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
      SERVER_RUNNING=true
      break
    fi
  done
  
  if [ "$SERVER_RUNNING" = true ]; then
    echo -e "${EMERALD}✓ Server operational on http://127.0.0.1:${PORT}${NC}"
  else
    echo -e "${GOLD}ℹ Server starting... logs available in .localhost-server.log${NC}"
  fi
fi

# Open in browser if desktop environment detected
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://127.0.0.1:${PORT}" 2>/dev/null || true
elif command -v open >/dev/null 2>&1; then
  open "http://127.0.0.1:${PORT}" 2>/dev/null || true
fi

# Launch interactive CLI
echo ""
if [ -f "$SCRIPT_DIR/bin/aurelius" ]; then
  exec "$SCRIPT_DIR/bin/aurelius"
elif [ -f "$SCRIPT_DIR/bin/aurelius.cjs" ]; then
  exec node "$SCRIPT_DIR/bin/aurelius.cjs"
fi
