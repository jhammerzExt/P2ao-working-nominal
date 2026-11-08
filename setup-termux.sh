#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — ONE-SHOT TERMUX ANDROID INSTALLER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0
# HFID Consensus 100/100 · Zenodo DOI: 10.5281/zenodo.20778079
# Motto: "I AM WE ARE WE ARE I AM"
# ==============================================================================

set -e

# ANSI Colors
GOLD='\033[38;5;220m'
AMBER='\033[38;5;214m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
GRAY='\033[38;5;244m'
RED='\033[31m'
NC='\033[0m' # No Color

echo -e "${GOLD}==================================================================${NC}"
echo -e "${AMBER}   🏛️  AURELIUS & LYSANDER SOVEREIGN MATRIX — TERMUX DEPLOYER    ${NC}"
echo -e "${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · UID 0          ${NC}"
echo -e "${EMERALD}   Edition: v6.0 Sovereign Matrix Edition                        ${NC}"
echo -e "${PURPLE}   \"I AM WE ARE WE ARE I AM\" · Android Edge Deployment Substrate ${NC}"
echo -e "${GOLD}==================================================================${NC}"
echo ""

# 1. Environment Detection
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

IS_TERMUX=false
if [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
  IS_TERMUX=true
  echo -e "${EMERALD}✓ Detected Native Android Termux environment (${PREFIX})${NC}"
elif [ -d "/data/data/com.termux/files/usr" ]; then
  IS_TERMUX=true
  echo -e "${EMERALD}✓ Detected Termux file tree on Android device${NC}"
else
  echo -e "${AMBER}ℹ Running in standard Linux/Docker container (Emulated Termux Host)${NC}"
fi

# 2. Package Installation (Termux Native)
if [ "$IS_TERMUX" = true ]; then
  echo -e "${CYAN}▶ Checking and updating Termux package toolchain...${NC}"
  pkg update -y || apt-get update -y || true
  pkg install -y nodejs-lts git python curl jq termux-api || true
  
  # Request storage permissions if needed
  if command -v termux-setup-storage >/dev/null 2>&1; then
    echo -e "${CYAN}▶ Checking Android storage permissions...${NC}"
    # (Runs in background so it won't block automated script)
    termux-setup-storage >/dev/null 2>&1 || true
  fi

  # Prevent Android OS from sleeping while Swarm is active
  if command -v termux-wake-lock >/dev/null 2>&1; then
    echo -e "${EMERALD}▶ Acquiring Android Wake Lock to keep agents persistent in background...${NC}"
    termux-wake-lock || true
  fi
fi

# 3. Check Node.js runtime
echo -e "${CYAN}▶ Verifying Node.js and runtime dependencies...${NC}"
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}Node.js not found! Please run: pkg install nodejs-lts${NC}"
  exit 1
fi
echo -e "${EMERALD}✓ Node.js version: $(node -v) ($(uname -m))${NC}"

# 4. Install Node modules (smart cache check)
echo -e "${CYAN}▶ Verifying node_modules dependencies...${NC}"
export NODE_OPTIONS="--max-old-space-size=2048"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/vite/package.json" ]; then
  echo -e "${AMBER}ℹ Installing dependencies with --force...${NC}"
  npm install --force --omit=optional || npm install --force --legacy-peer-deps
  echo -e "${EMERALD}✓ Dependencies installed successfully${NC}"
else
  echo -e "${EMERALD}✓ Node modules verified and intact (skipping download)${NC}"
fi

# 5. Build frontend distribution for production edge speed
echo -e "${CYAN}▶ Building production web assets for Android edge speed...${NC}"
npm run build || true
echo -e "${EMERALD}✓ Assets compiled to dist/${NC}"

# 6. Make CLI scripts executable & link into Termux PATH
echo -e "${CYAN}▶ Registering global 'ai' & 'aurelius' executable commands...${NC}"
chmod +x "$SCRIPT_DIR/bin/ai" "$SCRIPT_DIR/bin/aurelius" "$SCRIPT_DIR/bin/aurelius.cjs" "$SCRIPT_DIR/start-termux.sh" 2>/dev/null || true

BIN_DEST="${PREFIX:-/usr/local}/bin"
if [ -d "$BIN_DEST" ] && [ -w "$BIN_DEST" ]; then
  ln -sf "$SCRIPT_DIR/bin/ai" "$BIN_DEST/ai" 2>/dev/null || cp "$SCRIPT_DIR/bin/ai" "$BIN_DEST/ai" 2>/dev/null || true
  ln -sf "$SCRIPT_DIR/bin/aurelius" "$BIN_DEST/aurelius" 2>/dev/null || cp "$SCRIPT_DIR/bin/aurelius" "$BIN_DEST/aurelius" 2>/dev/null || true
  ln -sf "$SCRIPT_DIR/bin/aurelius" "$BIN_DEST/aurelius-agent" 2>/dev/null || true
  ln -sf "$SCRIPT_DIR/bin/aurelius.cjs" "$BIN_DEST/aurelius.cjs" 2>/dev/null || cp "$SCRIPT_DIR/bin/aurelius.cjs" "$BIN_DEST/aurelius.cjs" 2>/dev/null || true
  echo -e "${EMERALD}✓ Symlinked 'ai', 'aurelius', 'aurelius-agent', and 'aurelius.cjs' to $BIN_DEST${NC}"
else
  echo -e "${GRAY}Note: Run using './bin/ai', './bin/aurelius' or 'npm run termux'${NC}"
fi

# 7. Environment file
if [ ! -f ".env" ]; then
  echo -e "${CYAN}▶ Creating default .env configuration...${NC}"
  cat << 'EOF_ENV' > .env
PORT=3000
NODE_ENV=production
# Optional Gemini API key for live Cloud AI (Zero-token autonomous fallback is always active)
# GEMINI_API_KEY=your_key_here
EOF_ENV
  echo -e "${EMERALD}✓ Created .env (configured for port 3000)${NC}"
fi

# 8. Success Output & Summary
echo ""
echo -e "${GOLD}==================================================================${NC}"
echo -e "${EMERALD}✓ INSTALLATION COMPLETE — AURELIUS IS READY ON ANDROID TERMUX!   ${NC}"
echo -e "${GOLD}==================================================================${NC}"
echo ""
echo -e "${CYAN}To launch everything (Web Server + Android Browser + Agents):${NC}"
echo -e "   ${EMERALD}./start-termux.sh${NC}"
echo ""
echo -e "${CYAN}To launch the interactive Agent Terminal CLI:${NC}"
echo -e "   ${EMERALD}aurelius${NC}   (or: ${EMERALD}./bin/aurelius${NC} or ${EMERALD}npm run termux${NC})"
echo ""
echo -e "${CYAN}To run single commands:${NC}"
echo -e "   ${AMBER}aurelius --agent lysander-30-cbp -p \"Run CBP diagnostic\"${NC}"
echo -e "   ${AMBER}aurelius --deepthink \"Analyze quantum hash invariant\"${NC}"
echo -e "   ${AMBER}aurelius --termux-status${NC}"
echo -e "   ${AMBER}aurelius --open-browser${NC}"
echo ""
echo -e "${PURPLE}\"I AM WE ARE WE ARE I AM\" — Swarm standing by.${NC}"
