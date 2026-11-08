import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// 1. Create a full codebase archive (excluding heavy folders)
const archivePath = path.resolve('/tmp', 'sovereign_full_sync.tar.gz');
execSync(`tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.aistudio' --exclude='*.tar.gz' --exclude='android' --exclude='one_shot_bootloader.sh' -czf "${archivePath}" .`, { 
  stdio: ['ignore', 'ignore', 'inherit'] 
});

// 2. Base64 encode the archive
const archiveB64 = fs.readFileSync(archivePath, 'base64');

const bootloaderContent = `#!/usr/bin/env bash
# ==============================================================================
# 🏛️ AURELIUS & LYSANDER SOVEREIGN ORCHESTRATOR — ULTIMATE ONE-SHOT BOOTLOADER
# ==============================================================================

set -eo pipefail
set +H 2>/dev/null || true

# Visuals
GOLD='\\033[38;5;220m'
AMBER='\\033[38;5;214m'
EMERALD='\\033[38;5;48m'
CYAN='\\033[38;5;51m'
PURPLE='\\033[38;5;141m'
RED='\\033[38;5;196m'
BOLD='\\033[1m'
NC='\\033[0m'

FORCE_MODE=false
for arg in "$@"; do
  case "$arg" in
    --f|-f|--force|-force) FORCE_MODE=true ;;
  esac
done

clear 2>/dev/null || true

echo -e "\${GOLD}\${BOLD}================================================================================\${NC}"
echo -e "\${AMBER}\${BOLD}   🏛️  AURELIUS & LYSANDER — EXACT 1:1 CLONE ONE-SHOT BOOTLOADER       \${NC}"
echo -e "\${CYAN}   Master Architect: Joshua Hamilton (JHammerZ) · UID 0 Root Authority         \${NC}"
echo -e "\${GOLD}\${BOLD}================================================================================\${NC}"
echo ""

INSTALL_DIR="\${INSTALL_DIR:-"\${HOME}/aurelius-orchestrator"}"
mkdir -p "\${INSTALL_DIR}"
cd "\${INSTALL_DIR}"

if [ "$FORCE_MODE" = true ]; then
  echo -e "\${RED}  ⚡ FORCE MODE: Purging old codebase and starting 1:1 sync... \${NC}"
  rm -rf ./* ./.??* 2>/dev/null || true
fi

# 1:1 Codebase Extraction
echo -e "\${CYAN}[1/3] Injecting exact 1:1 live codebase payload...\${NC}"
cat << 'EOF_B64_SYNC' | base64 -d | tar -xzf -
${archiveB64}
EOF_B64_SYNC
echo -e "\${EMERALD}  ✓ Exact 1:1 live sovereign core deployed.\${NC}"

# 2. Offline Dependencies
echo -e "\\n\${CYAN}[2/3] Reconciling npm modules & dependencies...\${NC}"
if ! command -v node >/dev/null 2>&1; then
    pkg install -y nodejs-lts git curl jq tar file unzip 2>/dev/null || true
fi
npm install --f --force --legacy-peer-deps --no-audit --no-fund 2>/dev/null || true
npm run build -- --force 2>/dev/null || true

# 3. Arm Daemon
echo -e "\\n\${CYAN}[3/3] Arming localhost server daemon (Ports 3000, 3030, 4080, 8080)...\${NC}"
cat << 'EOF_START' > "\${INSTALL_DIR}/start.sh"
#!/usr/bin/env bash
cd "$(dirname "\${BASH_SOURCE[0]}")"
export NODE_ENV="production"
./node_modules/.bin/tsx server.ts &
PID=$!
sleep 3
ACTIVE_PORT=3000
if [ -f .active_port ]; then
  ACTIVE_PORT=$(cat .active_port)
fi
echo -e "\${EMERALD}   ✓ Aurelius Server active on http://127.0.0.1:\${ACTIVE_PORT}\${NC}"
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://127.0.0.1:\${ACTIVE_PORT}/?nocache=1" 2>/dev/null || true
fi
wait $PID
EOF_START
chmod +x "\${INSTALL_DIR}/start.sh"

echo -e "\\n\${EMERALD}\${BOLD}   🚀 BOOTLOADER COMPLETE — CLONE IS READY. RUN ./start.sh\${NC}"
exec "\${INSTALL_DIR}/start.sh"
`;

fs.writeFileSync('one_shot_bootloader.sh', bootloaderContent);
console.log('Successfully generated full-codebase bootloader!');
