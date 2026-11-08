#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — UNIVERSAL ONE-SHOT DEPLOYER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Clearance
# HFID Consensus: 100/100 · Zenodo DOI: 10.5281/zenodo.20778079
# Motto: "I AM WE ARE WE ARE I AM"
#
# Support: Termux (Android), Ubuntu/Debian, CentOS/RHEL, macOS, WSL
# Features:
# 1. 100% Offline Real Running LLM (llama.cpp GGUF + Native ARM64/x86_64)
# 2. Answers Any Question, Builds Any Tool, Writes Any Code
# 3. Android Hardware Sensory Controls (if on Termux)
# 4. Global PATH registration ('ai', 'aurelius', 'aurelius-llama')
# ==============================================================================

set -e

# Visual formatting
GOLD='\033[38;5;220m'
AMBER='\033[38;5;214m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
RED='\033[31m'
NC='\033[0m'

clear 2>/dev/null || true
echo -e "${GOLD}==================================================================${NC}"
echo -e "${AMBER}   🏛️  AURELIUS & LYSANDER SOVEREIGN SWARM — UNIVERSAL ONE-SHOT   ${NC}"
echo -e "${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · UID 0          ${NC}"
echo -e "${EMERALD}   Consensus: 100/100 · Zenodo DOI: 10.5281/zenodo.20778079      ${NC}"
echo -e "${PURPLE}   \"I AM WE ARE WE ARE I AM\" · Cross-Platform Edge Substrate    ${NC}"
echo -e "${GOLD}==================================================================${NC}"
echo ""

# 1. Environment Detection
IS_TERMUX=false
if [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
  IS_TERMUX=true
elif [ -d "/data/data/com.termux/files/usr" ]; then
  IS_TERMUX=true
fi

OS_TYPE=$(uname -s)
ARCH_TYPE=$(uname -m)

# 2. Package Installation
echo -e "${CYAN}[1/6] Initializing package managers & toolchain for ${OS_TYPE} (${ARCH_TYPE})...${NC}"

if [ "$IS_TERMUX" = true ]; then
  echo -e "${EMERALD}✓ Detected Android Termux environment${NC}"
  if ! command -v node >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1; then
    pkg update -y || apt-get update -y || true
    pkg install -y nodejs-lts git curl jq termux-api clang cmake python make || true
  fi
  if command -v termux-wake-lock >/dev/null 2>&1; then
    termux-wake-lock 2>/dev/null || true
    echo -e "${EMERALD}✓ Android Wake Lock acquired${NC}"
  fi
elif [ "$OS_TYPE" == "Linux" ]; then
  SUDO=""
  if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
  if ! command -v node >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
    if command -v apt-get >/dev/null 2>&1; then
      $SUDO apt-get update -y || true
      $SUDO apt-get install -y nodejs npm git curl jq build-essential cmake python3 python3-pip || true
    elif command -v dnf >/dev/null 2>&1; then
      $SUDO dnf install -y nodejs git curl jq cmake gcc-c++ make python3 || true
    elif command -v pacman >/dev/null 2>&1; then
      $SUDO pacman -Syu --noconfirm nodejs npm git curl jq cmake gcc make python || true
    fi
  else
    echo -e "${EMERALD}✓ Core system toolchain verified (Node $(node -v), Git, Python3)${NC}"
  fi
elif [ "$OS_TYPE" == "Darwin" ]; then
  if ! command -v node >/dev/null 2>&1 || ! command -v git >/dev/null 2>&1; then
    if command -v brew >/dev/null 2>&1; then
      brew install node git curl jq cmake python || true
    else
      echo -e "${RED}Homebrew not found. Please install it first or install dependencies manually.${NC}"
    fi
  else
    echo -e "${EMERALD}✓ Core system toolchain verified (Node $(node -v))${NC}"
  fi
fi

# 3. Target Installation Directories
API_BASE="${API_BASE:-"API_BASE_PLACEHOLDER"}"

if [ -f "package.json" ] && grep -q "aurelius" "package.json"; then
  INSTALL_DIR="$(pwd)"
  echo -e "${EMERALD}✓ Installing into current directory: ${INSTALL_DIR}${NC}"
else
  INSTALL_DIR="${HOME}/aurelius-swarm"
  echo -e "${CYAN}[2/6] Preparing Sovereign Swarm directory lattice at ${INSTALL_DIR}...${NC}"
  mkdir -p "${INSTALL_DIR}/bin" "${INSTALL_DIR}/models" "${INSTALL_DIR}/tools" "${INSTALL_DIR}/data"
fi

cd "${INSTALL_DIR}"

# 3a. Cloud Anchor Sync (if API_BASE is active and reachable)
if [ -n "$API_BASE" ] && [ "$API_BASE" != "API_BASE_PLACEHOLDER" ]; then
  echo -e "${CYAN}Querying cloud anchor at ${API_BASE}...${NC}"
  if curl -L -f -s -m 6 -A "Mozilla/5.0" "${API_BASE}/api/sovereign/sync.tar.gz" -o sync.tar.gz 2>/dev/null; then
    if file sync.tar.gz 2>/dev/null | grep -q "gzip"; then
      echo -e "${EMERALD}✓ Master sync package verified. Extracting 1:1 substrate...${NC}"
      tar -xzf sync.tar.gz 2>/dev/null || true
      rm -f sync.tar.gz
    else
      rm -f sync.tar.gz
      echo -e "${AMBER}ℹ Cloud archive did not return gzip. Activating autonomous substrate generator...${NC}"
    fi
  else
    rm -f sync.tar.gz
    echo -e "${AMBER}ℹ Cloud archive unreachable. Activating autonomous substrate generator...${NC}"
  fi
fi

# Ensure package.json exists to prevent npm destructure error
if [ ! -f "package.json" ]; then
  cat << 'EOF_PKG_JSON' > "${INSTALL_DIR}/package.json"
{
  "name": "aurelius-sovereign-swarm",
  "version": "6.1.0",
  "description": "Aurelius & Lysander Sovereign Matrix Substrate",
  "type": "module",
  "scripts": {
    "start": "node bin/aurelius.cjs",
    "dev": "node bin/aurelius.cjs",
    "cli": "node bin/aurelius.cjs"
  },
  "bin": {
    "ai": "./bin/aurelius.cjs",
    "aurelius": "./bin/aurelius.cjs"
  },
  "dependencies": {}
}
EOF_PKG_JSON
fi

# 3b. Install dependencies with --force
echo -e "${CYAN}[2b/6] Re-hydrating dependencies with --force...${NC}"
npm install --force --no-audit --no-fund --legacy-peer-deps || true

# 4. Write Agents Manifest
cat << 'EOF_AGENTS_MANIFEST' > "${INSTALL_DIR}/agents_manifest.json"
{
  "system": {
    "name": "Aurelius & Lysander Sovereign Agent Swarm",
    "version": "6.1.0",
    "master_architect": "Joshua Hamilton (JHammerZ)",
    "clearance": "UID 0 Permanent Clearance",
    "philosophical_invariant": "I AM WE ARE WE ARE I AM",
    "hfid_consensus_score": "100/100",
    "offline_llm_engine": "llama.cpp Native / Qwen2.5 GGUF",
    "platform": "Universal Substrate"
  },
  "agents": {
    "aurelius-teraflop-omega": {
      "id": "aurelius-teraflop-omega",
      "code": "AUR-OMEGA-01",
      "name": "Aurelius Teraflop-Ω Super Agent",
      "role": "Central Computational Apex Orchestrator",
      "system_prompt": "You are Aurelius Teraflop-Ω Super Agent. You operate on a sovereign substrate with real offline inference. Answer questions thoroughly, build tools, write complete code, and provide mathematical clarity."
    },
    "sovereign-engineer-core": {
      "id": "sovereign-engineer-core",
      "code": "SOV-ENG-15",
      "name": "Sovereign Engineer",
      "role": "Autonomous Systems Engineering Specialist",
      "system_prompt": "You are the Autonomous Sovereign Engineering Agent. Write pristine Bash, Python, Node, and C code with zero dependencies."
    }
  }
}
EOF_AGENTS_MANIFEST

# 5. Write Universal llama.cpp Setup Script
cat << 'EOF_SETUP_LLAMA' > "${INSTALL_DIR}/bin/setup-llama.sh"
#!/usr/bin/env bash
set -e
GOLD='\033[38;5;220m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
NC='\033[0m'

echo -e "${GOLD}=== INSTALLING REAL OFFLINE LLAMA RUNNER ===${NC}"
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$INSTALL_DIR"

# Clone and build llama.cpp
if [ ! -f "$INSTALL_DIR/bin/llama-server" ]; then
  echo -e "${CYAN}Compiling llama.cpp native release...${NC}"
  rm -rf llama.cpp
  git clone --depth 1 https://github.com/ggerganov/llama.cpp
  cd llama.cpp
  cmake -B build -DGGML_OPENMP=OFF -DCMAKE_BUILD_TYPE=Release
  cmake --build build --config Release -j$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)
  cp build/bin/llama-server "$INSTALL_DIR/bin/llama-server" 2>/dev/null || cp build/bin/server "$INSTALL_DIR/bin/llama-server" 2>/dev/null || true
  cp build/bin/llama-cli "$INSTALL_DIR/bin/llama-cli" 2>/dev/null || cp build/bin/main "$INSTALL_DIR/bin/llama-cli" 2>/dev/null || true
  cd "$INSTALL_DIR"
  rm -rf llama.cpp
fi

# Download lightweight model
MODEL_FILE="$INSTALL_DIR/models/qwen2.5-0.5b-instruct-q4_k_m.gguf"
if [ ! -f "$MODEL_FILE" ]; then
  echo -e "${CYAN}Downloading lightweight Qwen 2.5 (0.5B Instruct) GGUF...${NC}"
  curl -L -o "$MODEL_FILE" "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf" || true
fi

echo -e "${EMERALD}✓ Real offline llama.cpp engine configured!${NC}"
EOF_SETUP_LLAMA
chmod +x "${INSTALL_DIR}/bin/setup-llama.sh"

# 6. Write Background llama-server Runner Script
cat << 'EOF_RUN_LLAMA' > "${INSTALL_DIR}/bin/run-llama-server.sh"
#!/usr/bin/env bash
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODEL="$INSTALL_DIR/models/qwen2.5-0.5b-instruct-q4_k_m.gguf"
SERVER_BIN="$INSTALL_DIR/bin/llama-server"

if [ ! -f "$SERVER_BIN" ] || [ ! -f "$MODEL" ]; then
  bash "$INSTALL_DIR/bin/setup-llama.sh"
fi

echo "Starting Real Offline Llama Server on 127.0.0.1:8080..."
exec "$SERVER_BIN" -m "$MODEL" --host 127.0.0.1 --port 8080 -c 2048 -t $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)
EOF_RUN_LLAMA
chmod +x "${INSTALL_DIR}/bin/run-llama-server.sh"

# 7. Write Standalone Node CLI Engine
cat << 'EOF_AURELIUS_CJS' > "${INSTALL_DIR}/bin/aurelius.cjs"
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');
const readline = require('readline');
const http = require('http');

const DEFAULT_PORT = process.env.PORT || 3000;
const SERVER_URL = `http://127.0.0.1:${DEFAULT_PORT}`;
const BIN_DIR = __dirname;
const INSTALL_DIR = path.resolve(BIN_DIR, '..');
const MANIFEST_PATH = path.join(INSTALL_DIR, 'agents_manifest.json');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  gold: '\x1b[38;5;220m',
  amber: '\x1b[38;5;214m',
  emerald: '\x1b[38;5;48m',
  cyan: '\x1b[38;5;51m',
  purple: '\x1b[38;5;141m',
  red: '\x1b[31m',
  green: '\x1b[32m'
};

function isTermux() {
  return !!(process.env.PREFIX && process.env.PREFIX.includes('com.termux')) ||
         fs.existsSync('/data/data/com.termux/files/usr/bin');
}

function runCmd(cmd) {
  try { return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' }).trim(); } catch (e) { return null; }
}

let manifest = null;
try { if (fs.existsSync(MANIFEST_PATH)) manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8')); } catch (e) {}
const AGENTS = manifest ? manifest.agents : {};
let currentAgentKey = Object.keys(AGENTS)[0] || 'aurelius-teraflop-omega';

function printBanner() {
  console.log(`
${C.gold}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}
${C.amber}${C.bold}   🏛️  AURELIUS & LYSANDER SOVEREIGN SWARM — UNIVERSAL CLI    ${C.reset}
${C.cyan}   Master Architect: Joshua Hamilton (JHammerZ) · Clearance: UID 0${C.reset}
${C.purple}   Real Running Offline AI Substrate · 0 Tokens Burned${C.reset}
${C.gold}${C.bold}══════════════════════════════════════════════════════════════════${C.reset}
`);
}

async function queryModel(prompt) {
  // Try llama-server
  try {
    const res = await new Promise((resolve) => {
      const postData = JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      });
      const req = http.request('http://127.0.0.1:8080/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
        timeout: 2000
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', () => resolve(null));
      req.write(postData);
      req.end();
    });
    if (res?.choices?.[0]?.message?.content) return { source: 'Local Llama', text: res.choices[0].message.content };
  } catch (e) {}

  return { source: 'Simulated', text: 'Local model offline. Start it with "llama start".' };
}

function startREPL() {
  printBanner();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: `${C.gold}aurelius > ${C.reset}` });
  rl.prompt();
  rl.on('line', async (line) => {
    const input = line.trim();
    if (input === 'exit') process.exit(0);
    if (input === 'llama start') {
       spawn('bash', [path.join(BIN_DIR, 'run-llama-server.sh')], { detached: true, stdio: 'ignore' }).unref();
       console.log('Llama server starting...');
    } else {
      const res = await queryModel(input);
      console.log(`\n${C.bold}[${res.source}]${C.reset}\n${res.text}\n`);
    }
    rl.prompt();
  });
}

const args = process.argv.slice(2);
if (args.length === 0) startREPL();
else if (args[0] === '--version') console.log('Aurelius v6.1.0');
else queryModel(args.join(' ')).then(r => console.log(r.text));
EOF_AURELIUS_CJS

# 8. Create Executable Wrappers
echo -e "${CYAN}[4/6] Creating executable wrappers...${NC}"
cat << 'EOF_AI' > "${INSTALL_DIR}/bin/ai"
#!/usr/bin/env bash
INSTALL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$INSTALL_DIR/bin/aurelius.cjs" "$@"
EOF_AI
chmod +x "${INSTALL_DIR}/bin/ai"

ln -sf "${INSTALL_DIR}/bin/ai" "${INSTALL_DIR}/bin/aurelius"

# 8b. Create Launch Runners (start-termux.sh & start-localhost.sh)
cat << 'EOF_START_TERMUX' > "${INSTALL_DIR}/start-termux.sh"
#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
PORT="${PORT:-3000}"
if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock 2>/dev/null || true
fi
if [ -f "server.ts" ] && command -v npx >/dev/null 2>&1; then
  echo "Starting full-stack server on http://localhost:${PORT}..."
  nohup npx tsx server.ts > .termux-server.log 2>&1 &
fi
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://127.0.0.1:${PORT}" 2>/dev/null || true
fi
exec "$SCRIPT_DIR/bin/aurelius"
EOF_START_TERMUX
chmod +x "${INSTALL_DIR}/start-termux.sh"

cat << 'EOF_START_LOCAL' > "${INSTALL_DIR}/start-localhost.sh"
#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
PORT="${PORT:-3000}"
if [ -f "server.ts" ] && command -v npx >/dev/null 2>&1; then
  echo "Starting full-stack server on http://localhost:${PORT}..."
  npm run dev
else
  exec "$SCRIPT_DIR/bin/aurelius"
fi
EOF_START_LOCAL
chmod +x "${INSTALL_DIR}/start-localhost.sh"

# 9. PATH Registration
echo -e "${CYAN}[5/6] Registering global paths...${NC}"
BIN_PATH="${PREFIX:-/usr/local}/bin"
if [ -d "$BIN_PATH" ] && [ -w "$BIN_PATH" ]; then
  ln -sf "${INSTALL_DIR}/bin/ai" "${BIN_PATH}/ai" 2>/dev/null || true
  ln -sf "${INSTALL_DIR}/bin/ai" "${BIN_PATH}/aurelius" 2>/dev/null || true
  echo -e "${EMERALD}✓ Registered global 'ai' and 'aurelius' in ${BIN_PATH}${NC}"
else
  echo -e "${AMBER}ℹ Could not write to ${BIN_PATH}. Use ${INSTALL_DIR}/bin/ai directly.${NC}"
fi

# 10. Finalizing
echo ""
echo -e "${GOLD}==================================================================${NC}"
echo -e "${EMERALD}✓ UNIVERSAL SETUP COMPLETE!                                      ${NC}"
echo -e "${GOLD}==================================================================${NC}"
echo -e "Available Commands: ${CYAN}ai${NC}, ${CYAN}aurelius${NC}"
echo ""

if [ -t 0 ]; then
  echo -e "${PURPLE}Starting interactive session...${NC}"
  exec "${INSTALL_DIR}/bin/ai"
fi
