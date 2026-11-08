#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS SOVEREIGN MATRIX CROSS-PLATFORM RUNNER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Clearance
# ==============================================================================

set -e

GOLD='\033[38;5;220m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
NC='\033[0m'

echo -e "${GOLD}==================================================================${NC}"
echo -e "${CYAN}   🏛️  BOOTING AURELIUS SOVEREIGN MATRIX & OLLAMA DAEMON...     ${NC}"
echo -e "${GOLD}==================================================================${NC}"

cd "$(dirname "$0")"

# Ensure dependencies are present
if [ ! -d "node_modules" ]; then
  echo -e "${CYAN}Installing initial dependencies...${NC}"
  npm install --force 2>/dev/null || true
fi

echo -e "${EMERALD}Starting Sovereign Server on port 3000 (with permanent Ollama daemon)...${NC}"
export PORT=3000
npm run dev
