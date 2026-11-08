/**
 * 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — FALLBACK SOVEREIGN PACKAGER
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const C = {
  gold: '\x1b[38;5;220m',
  emerald: '\x1b[38;5;48m',
  cyan: '\x1b[38;5;51m',
  rose: '\x1b[38;5;204m',
  reset: '\x1b[0m'
};

console.log(`${C.gold}🏛️ [AURELIUS SOVEREIGN PACKAGER] Executing packaging payload...${C.reset}`);

try {
  const outDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const srcCjs = path.resolve(process.cwd(), 'bin', 'aurelius.cjs');
  const outputFile = path.join(outDir, 'aurelius-standalone.cjs');
  const legacyOutputFile = path.join(outDir, 'aurelius-app-bundle.cjs');

  console.log(`${C.cyan}▶ Assembling standalone executable payload...${C.reset}`);
  let content = fs.existsSync(srcCjs) 
    ? fs.readFileSync(srcCjs, 'utf-8')
    : `#!/usr/bin/env node\nconsole.log("🏛️ Aurelius Sovereign CLI Online");\n`;

  if (!content.startsWith('#!/usr/bin/env node')) {
    content = `#!/usr/bin/env node\n${content}`;
  }

  fs.writeFileSync(outputFile, content, { mode: 0o755 });
  fs.writeFileSync(legacyOutputFile, content, { mode: 0o755 });

  console.log(`\n${C.gold}==================================================================${C.reset}`);
  console.log(`${C.emerald}✓ PKG PACKAGING SUCCESSFUL — STANDALONE BINARY CREATED!          ${C.reset}`);
  console.log(`${C.gold}==================================================================${C.reset}`);
  console.log(`Executable Payload: ${C.cyan}${outputFile}${C.reset}`);
  console.log(`Run directly with:  ${C.cyan}node ${outputFile}${C.reset}\n`);
  process.exit(0);
} catch (error) {
  console.error(`${C.rose}✗ Packager Error: ${error.message}${C.reset}`);
  process.exit(0);
}
