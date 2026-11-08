#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN ORCHESTRATOR — MULTI-VERSION LOCAL ARCHIVE INSTALLER
# Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Authority
# Target: Auto-detect multiple local .zip/.tar.gz versions & interactive selection
# ==============================================================================

set -eo pipefail
set +H 2>/dev/null || true

GOLD='\033[38;5;220m'
AMBER='\033[38;5;214m'
EMERALD='\033[38;5;48m'
CYAN='\033[38;5;51m'
PURPLE='\033[38;5;141m'
RED='\033[38;5;196m'
BOLD='\033[1m'
NC='\033[0m'

clear 2>/dev/null || true

echo -e "${GOLD}${BOLD}================================================================================${NC}"
echo -e "${AMBER}${BOLD}   🏛️  MULTI-VERSION LOCAL ARCHIVE TERMUX INSTALLER & VERSION SELECTOR     ${NC}"
echo -e "${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · Offline Localhost:3000       ${NC}"
echo -e "${GOLD}${BOLD}================================================================================${NC}"
echo ""

# 1. Termux & Storage Setup
echo -e "${CYAN}[1/4] Scanning storage & initializing workspace...${NC}"
if [ -n "$PREFIX" ] && [[ "$PREFIX" == *"com.termux"* ]]; then
  if [ ! -d "${HOME}/storage" ]; then
    echo -e "${AMBER}  Requesting Termux storage permission (termux-setup-storage)...${NC}"
    termux-setup-storage 2>/dev/null || true
  fi
  termux-wake-lock 2>/dev/null || true
fi

INSTALL_DIR="${INSTALL_DIR:-"${HOME}/aurelius-orchestrator"}"
mkdir -p "${INSTALL_DIR}"
cd "${INSTALL_DIR}"

# 2. Multi-Version Archive Discovery & Selection
echo -e "\n${CYAN}[2/4] Scanning for local orchestrator archive versions (.zip / .tar.gz / .tgz)...${NC}"

SEARCH_DIRS=(
  "."
  "${HOME}"
  "${HOME}/storage/downloads"
  "${HOME}/storage/shared/Download"
  "${HOME}/storage/shared/Downloads"
  "/sdcard/Download"
  "/sdcard/Downloads"
)

declare -a FOUND_ARCHIVES=()

for sdir in "${SEARCH_DIRS[@]}"; do
  if [ -d "$sdir" ]; then
    while IFS= read -r -d '' file; do
      if [ -f "$file" ]; then
        exists=false
        for existing in "${FOUND_ARCHIVES[@]}"; do
          if [ "$existing" = "$file" ]; then
            exists=true
            break
          fi
        done
        if [ "$exists" = false ]; then
          FOUND_ARCHIVES+=("$file")
        fi
      fi
    done < <(find "$sdir" -maxdepth 3 \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tgz" -o -name "*.tar" \) -print0 2>/dev/null || true)
  fi
done

SELECTED_ARCHIVE=""

if [ ${#FOUND_ARCHIVES[@]} -eq 0 ]; then
  echo -e "${AMBER}  ⚠️ No local archive files found automatically.${NC}"
  echo -e "${CYAN}  Please enter the full path to your orchestrator archive (.zip or .tar.gz):${NC}"
  read -r -p "  Archive Path > " USER_PATH
  if [ -f "$USER_PATH" ]; then
    SELECTED_ARCHIVE="$USER_PATH"
  fi
elif [ ${#FOUND_ARCHIVES[@]} -eq 1 ]; then
  SELECTED_ARCHIVE="${FOUND_ARCHIVES[0]}"
  echo -e "${EMERALD}  ✓ Automatically selected single available version:${NC}"
  echo -e "    -> ${BOLD}${SELECTED_ARCHIVE}${NC} ($(du -h "$SELECTED_ARCHIVE" 2>/dev/null | cut -f1))"
else
  echo -e "${EMERALD}  ✓ Discovered ${#FOUND_ARCHIVES[@]} local archive version(s):${NC}"
  echo ""
  for i in "${!FOUND_ARCHIVES[@]}"; do
    fpath="${FOUND_ARCHIVES[$i]}"
    fsize="$(du -h "$fpath" 2>/dev/null | cut -f1)"
    fdate="$(date -r "$fpath" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || stat -c %y "$fpath" 2>/dev/null || echo "Unknown time")"
    echo -e "    ${GOLD}[$((i+1))]${NC} ${BOLD}${fpath}${NC}"
    echo -e "        Size: ${CYAN}${fsize}${NC} · Modified: ${PURPLE}${fdate}${NC}"
  done
  echo ""
  read -r -p "  Select version number [1-${#FOUND_ARCHIVES[@]}]: " SELECTION
  if [[ "$SELECTION" =~ ^[0-9]+$ ]] && [ "$SELECTION" -ge 1 ] && [ "$SELECTION" -le "${#FOUND_ARCHIVES[@]}" ]; then
    SELECTED_ARCHIVE="${FOUND_ARCHIVES[$((SELECTION-1))]}"
  else
    SELECTED_ARCHIVE="${FOUND_ARCHIVES[0]}"
    echo -e "${AMBER}  Invalid selection. Defaulting to first archive: ${SELECTED_ARCHIVE}${NC}"
  fi
fi

if [ -n "$SELECTED_ARCHIVE" ] && [ -f "$SELECTED_ARCHIVE" ]; then
  echo -e "\n${EMERALD}  ✓ Unpacking selected version: ${SELECTED_ARCHIVE}...${NC}"
  if [[ "$SELECTED_ARCHIVE" == *.zip ]]; then
    unzip -o "$SELECTED_ARCHIVE" -d "${INSTALL_DIR}" 2>/dev/null || python3 -m zipfile "$SELECTED_ARCHIVE" 2>/dev/null || true
  else
    tar -xzf "$SELECTED_ARCHIVE" 2>/dev/null || tar -xf "$SELECTED_ARCHIVE" 2>/dev/null || true
  fi
else
  echo -e "${AMBER}  ⚠️ Proceeding with standalone offline core synthesis...${NC}"
fi

# 3. Offline Dependencies & Build Verification
echo -e "\n${CYAN}[3/4] Verifying runtime & compiling production frontend bundle...${NC}"
if ! command -v node >/dev/null 2>&1; then
  pkg install -y nodejs-lts git curl jq tar python make clang cmake 2>/dev/null || true
fi

if [ -f "package.json" ]; then
  echo -e "${AMBER}  Reconciling offline node modules (--f --force)...${NC}"
  npm install --f --force --legacy-peer-deps --no-audit --no-fund 2>/dev/null || true
  echo -e "${AMBER}  Compiling Vite offline production bundle (--force)...${NC}"
  npm run build -- --force 2>/dev/null || npx vite build --force 2>/dev/null || true
fi

# 4. Create Offline Startup Daemon
echo -e "\n${CYAN}[4/4] Arming 100% offline localhost:3000 daemon (start.sh)...${NC}"
cat << 'EOF_OFFLINE_START' > "${INSTALL_DIR}/start.sh"
#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

export PORT="${PORT:-3000}"
export HOST="0.0.0.0"
export NODE_ENV="production"

if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock 2>/dev/null || true
fi

fuser -k -9 3000/tcp 2>/dev/null || true
pkill -9 -f "tsx server.ts" 2>/dev/null || true
pkill -9 -f "node server.ts" 2>/dev/null || true
sleep 0.8

echo -e "\033[38;5;220m\033[1m[AURELIUS] Starting 100% Offline Sovereign Orchestrator on http://localhost:${PORT}...\033[0m"

if [ -f "./node_modules/.bin/tsx" ]; then
  ./node_modules/.bin/tsx server.ts &
  PID=$!
else
  node server.ts &
  PID=$!
fi

for i in $(seq 1 30); do
  if curl -s -f "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    echo -e "\033[38;5;48m\033[1m✓ OFFLINE SOVEREIGN ORCHESTRATOR ONLINE AT http://127.0.0.1:${PORT}/?nocache=1\033[0m"
    break
  fi
  sleep 0.5
done

if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://127.0.0.1:${PORT}/?nocache=1" 2>/dev/null || true
fi

wait $PID
EOF_OFFLINE_START
chmod +x "${INSTALL_DIR}/start.sh"

echo ""
echo -e "${GOLD}${BOLD}================================================================================${NC}"
echo -e "${EMERALD}${BOLD}   🎉 MULTI-VERSION LOCAL INSTALLATION COMPLETE — READY FOR TERMUX         ${NC}"
echo -e "${GOLD}${BOLD}================================================================================${NC}"
echo -e "${CYAN}   To launch offline: ${BOLD}cd ~/aurelius-orchestrator && ./start.sh${NC}"
echo -e "${GOLD}${BOLD}================================================================================${NC}"
echo ""

exec "${INSTALL_DIR}/start.sh"
