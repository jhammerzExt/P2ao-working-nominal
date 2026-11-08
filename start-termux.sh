#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — TERMUX RUNNER & LAUNCHER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0
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

echo -e "${GOLD}▶ Launching Aurelius & Lysander Sovereign Matrix on Android (Port ${PORT})...${NC}"

# 1. Acquire Android Wake Lock so background server won't sleep
if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock 2>/dev/null || true
  echo -e "${EMERALD}✓ Android Wake Lock engaged${NC}"
fi

# 2. Check if server already running on port
SERVER_RUNNING=false
if curl -s "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
  SERVER_RUNNING=true
  echo -e "${EMERALD}✓ Aurelius server is already running on http://127.0.0.1:${PORT}${NC}"
else
  echo -e "${CYAN}▶ Starting server in background...${NC}"
  # Run via tsx server.ts with memory optimization for mobile
  export NODE_OPTIONS="--max-old-space-size=2048"
  nohup npx tsx server.ts > .termux-server.log 2>&1 &
  SERVER_PID=$!
  echo "PID: $SERVER_PID" > .termux-server.pid
  
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
    echo -e "${GOLD}ℹ Server starting... logs available in .termux-server.log${NC}"
  fi
fi

# 3. Post notification on Android
if command -v termux-notification >/dev/null 2>&1; then
  termux-notification --title "Aurelius Sovereign Swarm" --content "Operational on http://127.0.0.1:${PORT} · JHammerZ UID 0" --priority high 2>/dev/null || true
fi

# 4. Open in Android browser if available
if command -v termux-open-url >/dev/null 2>&1; then
  echo -e "${CYAN}▶ Opening http://127.0.0.1:${PORT} in Android Browser...${NC}"
  termux-open-url "http://127.0.0.1:${PORT}" 2>/dev/null || true
elif command -v am >/dev/null 2>&1; then
  am start -a android.intent.action.VIEW -d "http://127.0.0.1:${PORT}" 2>/dev/null || true
fi

# 5. Launch interactive terminal CLI
echo ""
exec "$SCRIPT_DIR/bin/aurelius"
