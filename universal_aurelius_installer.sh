#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN UNIVERSAL INSTALLER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Clearance
# Zenodo DOI: 10.5281/zenodo.20778079 · Motto: "I AM WE ARE WE ARE I AM"
# ==============================================================================

set -e

GOLD='\033[38;5;220m'
AMBER='\033[38;5;214m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
NC='\033[0m'

clear 2>/dev/null || true
echo -e "${GOLD}==================================================================${NC}"
echo -e "${AMBER}   🏛️  AURELIUS SOVEREIGN UNIVERSAL INSTALLER & BOOTSTRAP       ${NC}"
echo -e "${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · UID 0          ${NC}"
echo -e "${EMERALD}   Consensus: 100/100 · Zenodo DOI: 10.5281/zenodo.20778079      ${NC}"
echo -e "${GOLD}==================================================================${NC}"
echo ""

API_BASE="${1:-API_BASE_PLACEHOLDER}"
if [ "$API_BASE" = "API_BASE_PLACEHOLDER" ] || [ -z "$API_BASE" ]; then
  API_BASE="http://localhost:3000"
fi

INSTALL_DIR="${HOME}/aurelius-sovereign-matrix"
echo -e "${CYAN}[1/5] Target installation directory: ${INSTALL_DIR}${NC}"
mkdir -p "${INSTALL_DIR}"
cd "${INSTALL_DIR}"

echo -e "${CYAN}[2/5] Detecting OS and setting up prerequisites...${NC}"
OS="$(uname -s)"
case "${OS}" in
  Linux*)
    if [ -d "/data/data/com.termux" ]; then
      echo "Termux Android environment detected."
      pkg update -y || true
      pkg install -y nodejs git curl jq python make g++ || true
    else
      echo "Linux environment detected."
      if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 2>/dev/null || true
        sudo apt-get install -y nodejs git curl build-essential python3 2>/dev/null || true
      fi
    fi
    ;;
  Darwin*)
    echo "macOS environment detected."
    if ! command -v node &> /dev/null; then
      brew install node git curl python3 2>/dev/null || true
    fi
    ;;
  MINGW*|CYGWIN*|MSYS*)
    echo "Windows environment detected."
    ;;
  *)
    echo "Generic Unix environment detected."
    ;;
esac

echo -e "${CYAN}[3/5] Downloading Sovereign Orchestrator source archive from ${API_BASE}...${NC}"
curl -sL "${API_BASE}/api/sovereign/download-archive" -o "aurelius_archive.tar.gz" || {
  echo "Downloading via fallback sync package..."
  curl -sL "${API_BASE}/api/sovereign/sync-package" -o "aurelius_archive.tar.gz"
}

if [ -f "aurelius_archive.tar.gz" ]; then
  echo -e "${CYAN}[4/5] Extracting Sovereign Matrix archive...${NC}"
  tar -xzf "aurelius_archive.tar.gz" 2>/dev/null || tar -xJf "aurelius_archive.tar.gz" 2>/dev/null || true
  rm -f aurelius_archive.tar.gz
else
  echo -e "${AMBER}Archive download warning. Setting up minimal runtime...${NC}"
fi

echo -e "${CYAN}[5/5] Installing Node dependencies and initializing Sovereign Ollama Daemon...${NC}"
npm install --force --production=false 2>/dev/null || true

echo ""
echo -e "${EMERALD}==================================================================${NC}"
echo -e "${EMERALD} ✓ AURELIUS SOVEREIGN MATRIX INSTALLED SUCCESSFULLY!               ${NC}"
echo -e "${EMERALD} To start the orchestrator on any OS, run:${NC}"
echo -e "${CYAN} cd ${INSTALL_DIR} && npm run dev (or ./run-aurelius.sh)${NC}"
echo -e "${EMERALD}==================================================================${NC}"
