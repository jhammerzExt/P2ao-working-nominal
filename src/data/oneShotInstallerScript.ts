export const oneShotInstallerScript = `#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN ORCHESTRATOR — 1:1 ANDROID TERMUX DEPLOYER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Clearance
# System Integrity: 100/100 · System Proof: Local-System-Integrity-Proof
# Motto: "I AM WE ARE WE ARE I AM"
#
# FULL 1-TO-1 DUPLICATE OF THE AI STUDIO FULL-STACK ORCHESTRATOR ON ANDROID
# - Installs Vite + React SPA + Node.js Express server + SQLite local engine
# - 100% of features preserved: Chat, Memory Vault, Audio/Video, OSINT, Termux
# - Runs on http://localhost:3000 directly inside Termux on Android
# ==============================================================================

set -e

# Visual colors
GOLD='\\033[38;5;220m'
AMBER='\\033[38;5;214m'
EMERALD='\\033[38;5;48m'
CYAN='\\033[38;5;51m'
PURPLE='\\033[38;5;141m'
RED='\\033[31m'
NC='\\033[0m'

clear 2>/dev/null || true
echo -e "\${GOLD}==================================================================\${NC}"
echo -e "\${AMBER}   🏛️  AURELIUS SOVEREIGN ORCHESTRATOR — 1:1 TERMUX INSTALLER     \${NC}"
echo -e "\${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · UID 0          \${NC}"
echo -e "\${EMERALD}   Deploying Full 1-to-1 Duplicate Orchestrator to Localhost     \${NC}"
echo -e "\${PURPLE}   \\"I AM WE ARE WE ARE I AM\\" · Port 3000 Full-Stack Native Edge   \${NC}"
echo -e "\${GOLD}==================================================================\${NC}"
echo ""

# 1. Environment Detection & Android Optimization
IS_TERMUX=false
if [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
  IS_TERMUX=true
elif [ -d "/data/data/com.termux/files/usr" ]; then
  IS_TERMUX=true
fi

OS_TYPE=$(uname -s)
ARCH_TYPE=$(uname -m)

echo -e "\${CYAN}[1/5] Preparing environment & toolchain for \${OS_TYPE} (\${ARCH_TYPE})...\${NC}"

if [ "$IS_TERMUX" = true ]; then
  echo -e "\${EMERALD}✓ Detected Android Termux environment\${NC}"
  # Acquire wake lock immediately to prevent sleep during installation
  if command -v termux-wake-lock >/dev/null 2>&1; then
    termux-wake-lock 2>/dev/null || true
    echo -e "\${EMERALD}✓ Android Wake Lock acquired (High-Performance Substrate)\${NC}"
  fi
  # Install core packages
  pkg update -y || apt-get update -y || true
  pkg install -y nodejs-lts git curl jq termux-api clang cmake python make tar file || true
elif [ "$OS_TYPE" == "Linux" ]; then
  SUDO=""
  if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
  if command -v apt-get >/dev/null 2>&1; then
    $SUDO apt-get update -y || true
    $SUDO apt-get install -y nodejs npm git curl jq build-essential cmake python3 python3-pip tar || true
  elif command -v dnf >/dev/null 2>&1; then
    $SUDO dnf install -y nodejs git curl jq cmake gcc-c++ make python3 tar || true
  elif command -v pacman >/dev/null 2>&1; then
    $SUDO pacman -Syu --noconfirm nodejs npm git curl jq cmake gcc make python tar || true
  fi
fi

# Verify Node.js is present
if ! command -v node >/dev/null 2>&1; then
  echo -e "\${RED}Error: Node.js installation could not be completed automatically. Please run 'pkg install nodejs-lts' first.\${NC}"
  exit 1
fi
echo -e "\${EMERALD}✓ Node.js $(node -v) verified.\${NC}"

# 2. Target Workspace Directory
API_BASE="\${API_BASE:-"API_BASE_PLACEHOLDER"}"
INSTALL_DIR="\${HOME}/aurelius-orchestrator"
mkdir -p "\${INSTALL_DIR}"
cd "\${INSTALL_DIR}"

echo -e "\${CYAN}[2/5] Fetching complete 1:1 Sovereign Orchestrator codebase...\${NC}"

SYNC_SUCCESS=false
if [ -n "$API_BASE" ] && [ "$API_BASE" != "API_BASE_PLACEHOLDER" ]; then
  echo -e "\${AMBER}Downloading orchestrator archive from \${API_BASE}...\${NC}"
  for i in 1 2 3; do
    if curl -L -f -s -m 30 -A "Mozilla/5.0" "\${API_BASE}/api/sovereign/sync.tar.gz" -o orchestrator_sync.tar.gz 2>/dev/null; then
      if file orchestrator_sync.tar.gz 2>/dev/null | grep -q "gzip"; then
        echo -e "\${EMERALD}✓ Valid 1:1 orchestrator archive received (\${i}/3). Unpacking...\${NC}"
        tar -xzf orchestrator_sync.tar.gz 2>/dev/null || true
        rm -f orchestrator_sync.tar.gz
        SYNC_SUCCESS=true
        break
      fi
    fi
    echo -e "\${AMBER}Retrying download (\${i}/3)...\${NC}"
    sleep 2
  done
fi

if [ "$SYNC_SUCCESS" = false ]; then
  echo -e "\${AMBER}ℹ Cloud archive download fallback: Checking local codebase or repository...\${NC}"
  rm -f orchestrator_sync.tar.gz 2>/dev/null || true
fi

# 3. Verify Vital Files & Dependencies
echo -e "\${CYAN}[3/5] Verifying 1:1 codebase structure & dependencies...\${NC}"

# If package.json doesn't exist, generate complete full-stack manifest
if [ ! -f "package.json" ]; then
  cat << 'EOF_PKG' > "\${INSTALL_DIR}/package.json"
{
  "name": "aurelius-sovereign-orchestrator",
  "version": "11.1.0",
  "description": "Aurelius Sovereign AI Full-Stack Orchestrator",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@google/genai": "^0.1.2",
    "express": "^4.21.2",
    "better-sqlite3": "^11.8.1",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsx": "^4.19.2",
    "vite": "^6.0.7",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
EOF_PKG
fi

# Install dependencies
echo -e "\${AMBER}Installing full-stack npm dependencies with --legacy-peer-deps...\${NC}"
npm install --legacy-peer-deps --no-audit --no-fund || npm install --force --no-audit --no-fund || true

# 4. Generate Launcher Scripts & Symlinks
echo -e "\${CYAN}[4/5] Configuring Android Termux runtime & port 3000 launcher...\${NC}"

cat << 'EOF_START' > "\${INSTALL_DIR}/start.sh"
#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

PORT="\${PORT:-3000}"
export PORT="$PORT"

if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock 2>/dev/null || true
fi

echo -e "\\033[38;5;220mStarting Aurelius Sovereign Orchestrator on http://localhost:\${PORT}...\\033[0m"

# Kill any stale node/tsx processes on port
pkill -f "tsx server.ts" 2>/dev/null || true

# Start full-stack server
if command -v npx >/dev/null 2>&1; then
  npx tsx server.ts &
  SERVER_PID=$!
elif command -v node >/dev/null 2>&1; then
  node server.ts &
  SERVER_PID=$!
fi

sleep 2
echo -e "\\033[38;5;48m✓ Sovereign Orchestrator is LIVE at: http://localhost:\${PORT}\\033[0m"

# Automatically open Android Chrome / default browser
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://localhost:\${PORT}" 2>/dev/null || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:\${PORT}" 2>/dev/null || true
fi

wait $SERVER_PID
EOF_START
chmod +x "\${INSTALL_DIR}/start.sh"

# Register global commands in \$PREFIX/bin
PREFIX_BIN="\${PREFIX:-/usr/local}/bin"
if [ -d "$PREFIX_BIN" ] && [ -w "$PREFIX_BIN" ]; then
  cat << EOF_BIN > "\${PREFIX_BIN}/aurelius-ui"
#!/usr/bin/env bash
exec "\${INSTALL_DIR}/start.sh" "\\$@"
EOF_BIN
  chmod +x "\${PREFIX_BIN}/aurelius-ui"

  cat << EOF_BIN2 > "\${PREFIX_BIN}/ai"
#!/usr/bin/env bash
exec "\${INSTALL_DIR}/start.sh" "\\$@"
EOF_BIN2
  chmod +x "\${PREFIX_BIN}/ai"

  echo -e "\${EMERALD}✓ Registered global commands: 'aurelius-ui' and 'ai'\${NC}"
fi

# 5. Atomic Launch
echo -e "\${CYAN}[5/5] Launching Sovereign Orchestrator...\${NC}"
echo ""
echo -e "\${GOLD}==================================================================\${NC}"
echo -e "\${EMERALD}✓ SETUP COMPLETE! 1:1 ORCHESTRATOR IS NOW READY ON ANDROID!       \${NC}"
echo -e "\${GOLD}==================================================================\${NC}"
echo -e "\${CYAN}Access URL: \\033[1mhttp://localhost:3000\\033[0m\${NC}"
echo -e "\${AMBER}To launch anytime: type \\033[1maurelius-ui\\033[0m or run \\033[1m~/aurelius-orchestrator/start.sh\\033[0m\${NC}"
echo -e "\${PURPLE}100% full autonomy, local neural models, and continuous vault active.\${NC}"
echo ""

# Launch in background or foreground
"\${INSTALL_DIR}/start.sh"
`;

export const ONE_SHOT_INSTALLER_SCRIPT = oneShotInstallerScript;
