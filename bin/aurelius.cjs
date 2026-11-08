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
