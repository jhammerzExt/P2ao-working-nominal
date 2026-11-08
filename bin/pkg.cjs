#!/usr/bin/env node
/**
 * 🏛️ AURELIUS & LYSANDER SOVEREIGN SWARM — SMART PKG DELEGATOR
 * Master Architect: Joshua Hamilton (JHammerZ) · UID 0
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const localPkgBin = path.resolve(__dirname, '../node_modules/.bin/pkg');

// If no args provided (e.g. `npm run pkg`), skip official pkg to avoid entry file error and use fallback sovereign packager
if (args.length === 0 || !fs.existsSync(localPkgBin)) {
  require('./pkg.fallback.cjs');
  process.exit(0);
}

const result = spawnSync(localPkgBin, args, { stdio: 'inherit' });
if (result.status !== 0) {
  require('./pkg.fallback.cjs');
}
