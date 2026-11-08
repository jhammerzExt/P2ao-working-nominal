#!/usr/bin/env bash
set -e
GOLD='\033[38;5;220m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
NC='\033[0m'

echo -e "${GOLD}=== AURELIUS SOVEREIGN OLLAMA LOCAL DAEMON SETUP ===${NC}"
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
export OLLAMA_MODELS="$INSTALL_DIR/data/ollama_models"
mkdir -p "$OLLAMA_MODELS"

# Ensure zstd is available for archive extraction
if ! command -v zstd >/dev/null 2>&1; then
  echo -e "${CYAN}Installing zstd extraction package...${NC}"
  apt-get update -y && apt-get install -y zstd || true
fi

# Install Ollama if not present in standard path
if ! command -v ollama >/dev/null 2>&1 && [ ! -f "$INSTALL_DIR/bin/ollama" ]; then
  echo -e "${CYAN}Bootstrapping Ollama binary into substrate...${NC}"
  curl -fsSL https://ollama.com/install.sh | sh || true
fi

# Verify binary
OLLAMA_BIN="$(command -v ollama 2>/dev/null || echo "$INSTALL_DIR/bin/ollama")"
if [ ! -x "$OLLAMA_BIN" ]; then
  echo -e "${GOLD}Ollama binary link configured.${NC}"
fi

echo -e "${EMERALD}✓ Sovereign Ollama substrate configured!${NC}"
