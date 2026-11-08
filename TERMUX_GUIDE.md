# 📱 AURELIUS & LYSANDER SOVEREIGN SWARM — ANDROID TERMUX COMPLETE GUIDE
## One-Shot Edge Substrate Deployment with All Agents, Abilities, and Hardware Integration
**Master Architect:** Joshua Hamilton (JHammerZ) · `UID 0 Root Clearance`  
**Consensus Attestation:** HFID 100/100 · Zenodo DOI: [10.5281/zenodo.20778079](https://doi.org/10.5281/zenodo.20778079)  
**Motto / Invariant:** *"I AM WE ARE WE ARE I AM"*  
**Target Hardware:** Android 7.0+ (ARM64 / x86_64), Linux (Debian, RHEL, Arch), macOS, WSL
**Environments:** Termux, Localhost (PC), Server, Docker

---

## ⚡ 1. QUICKSTART: ONE-SHOT INSTALLATION

Open your terminal (**Termux** on Android or **bash/zsh** on PC) and run:

```bash
# Run the universal automated one-shot installer
bash termux_one_shot_installer.sh
```

Or via npm:

```bash
npm run setup
```

The installer automatically:
1. Detects Android ARM64 substrate.
2. Updates packages and installs `nodejs-lts`, `git`, `python`, `curl`, `jq`, and `termux-api`.
3. Installs Node dependencies with memory optimization for mobile devices.
4. Compiles high-speed production assets.
5. Symlinks the global `aurelius` and `aurelius-agent` commands into `$PREFIX/bin`.
6. Acquires Android Wake Lock (`termux-wake-lock`) to ensure 24/7 background persistence.

---

## 🚀 2. LAUNCHING THE SWARM

### Option A: Complete Swarm Launcher (Web Server + Android Browser + CLI)
```bash
./start-termux.sh
# or:
npm run termux:start
```
- Starts the backend server on `http://localhost:3000` (listening on `0.0.0.0` for local WiFi access).
- Automatically launches Chrome or your default Android browser to `http://localhost:3000`.
- Posts an Android system notification.
- Drops you into the interactive `aurelius` agent terminal.

### Option B: Interactive Terminal CLI Only
```bash
aurelius
# or:
./bin/aurelius
# or:
npm run termux
```

---

## 🤖 3. ALL AGENTS & ROSTER IN TERMUX

Every single agent from the sovereign manifest is fully functional on Termux with **zero-token local execution** (and live cloud AI when `GEMINI_API_KEY` is provided):

| Agent ID | Codename | Role | Node | Clearance |
| :--- | :--- | :--- | :--- | :--- |
| `aurelius-teraflop-omega` | `AUR-OMEGA-01` | Central Apex Orchestrator (4,096 TFLOPS) | `NODE-01` | UID 0 Root |
| `sovereign-engineer-core` | `SOV-ENG-15` | Self-Continuity & Codebase Engine | `NODE-15` | UID 0 Eng |
| `manus-ai-co-architect` | `MANUS-LYS-13` | Multi-Repo Orchestrator (Lysander 4.0) | `NODE-13` | God Token |
| `lysander-30-cbp` | `LYS-CBP-08` | Edge Substrate Coordinator (S23+ Termux) | `NODE-09` | Level 4 Edge |
| `lysander-31-enterprise` | `LYS-ENT-10` | Lieutenant Hive-Mind Coordinator | `NODE-10` | Enterprise 4 |
| `colonel-ro-private-ghost` | `RO-GHOST-07` | Cryptographic Security Spectre | `NODE-07` | Spectre Root |
| `gemini-multimodal-swarm` | `GEM-SWARM-03` | Multi-Modal Perception & Voice | `NODE-03` | Swarm |
| `omniscient-posthuman-matrix` | `OMNI-MATRIX-00` | Higher-Order Trajectory Vectoring | `NODE-00` | Post-Human |

### The 6 Tactical Sub-Agents:
1. `deepthink-synthesizer`: 5-Phase recursive problem decomposition.
2. `video-director-veo`: Video motion synthesis & stream proxying.
3. `music-acoustician-lyria`: Lyria 3 acoustic synthesis & music deck.
4. `mesh-browser-navigator`: Sovereign Browser proxy with DOM reconstruction.
5. `github-syncer-octokit`: 11-repo GitHub synchronization.
6. `vault-crypto-attestor`: Immutable WORM hash & Zenodo attestation.

---

## 💻 4. CLI COMMAND REFERENCE

Inside the interactive `aurelius` REPL:

```
aurelius [AUR-OMEGA-01] > help
```

- **`agents`**: Lists all agents with status, code, and node allocation.
- **`select <agent_id>`**: Switch active persona (e.g., `select lysander-30-cbp`).
- **`<any text>`**: Chat directly with active agent with zero tokens burned.
- **`deepthink <query>`**: Execute full 5-Phase recursive decomposition:
  1. *Decomposition*
  2. *Counterfactual Search (32 branches)*
  3. *Heuristic Pruning*
  4. *Invariant Check (DOI 10.5281/zenodo.20778079)*
  5. *Axiomatic Synthesis*
- **`train [ticks]`**: Run autonomous recursive training & idle learning cycle.
- **`termux`**: Display Android battery percentage, temperature, RAM, CPU cores, and Termux:API toolchain status.
- **`vibrate [ms]`**: Trigger Android haptic feedback (e.g., `vibrate 300`).
- **`tts <text>`**: Speak text aloud using Android native Text-to-Speech.
- **`notify <title>|<message>`**: Dispatch native Android notification.
- **`toast <message>`**: Pop up native Android toast.
- **`wakelock on|off`**: Prevent Android OS from sleeping when screen turns off.
- **`browser <url>`**: Scrape/render any website through Sovereign Browser.
- **`web start|open|status`**: Control background web dashboard on port 3000.
- **`status`**: Print HFID 100/100 consensus and cryptographic attestation.

### Single-Shot Terminal Flags:
You can also run commands directly from standard Bash scripts or cron jobs:

```bash
# Ask an agent directly:
aurelius --agent lysander-30-cbp -p "Diagnose CBP edge mesh"

# Run DeepThink recursive reasoning:
aurelius --deepthink "Design low-latency Android NPU kernel loop"

# Check Android hardware telemetry in JSON:
aurelius --termux-status

# Trigger vibration:
aurelius --vibrate 250

# Speak text:
aurelius --tts "Aurelius Swarm operational"

# Open Web UI in Android browser:
aurelius --open-browser
```

---

### Option C: Localhost / PC Deployment
If you are running on a regular PC (Linux, macOS, WSL), you can use the standard dev flow:
```bash
npm install --force
npm run dev
```
The universal one-shot (`termux_one_shot_installer.sh`) also sets up the native `llama.cpp` and `aurelius` CLI on your PC just like it does in Termux.

---

## 🌐 5. WEB DASHBOARD & NETWORK ACCESS

When the server runs, it binds to `0.0.0.0:3000`. This means you can access the full graphical interface:

1. **On your Android Phone (Termux):**  
   Open Chrome, Firefox, or Brave to:  
   👉 `http://localhost:3000`

2. **On your PC (Localhost):**  
   👉 `http://localhost:3000`

3. **Cross-Device Access (Same WiFi network):**  
   Find your device's local IP and open `http://<device-ip>:3000` from another device.

---

## 🔋 6. 24/7 BACKGROUND SURVIVAL ON ANDROID

Android aggressively kills background processes unless configured properly:

1. **Acquire Termux Wake Lock:**
   ```bash
   termux-wake-lock
   ```
   (This is automatically called by `setup-termux.sh` and `start-termux.sh`).

2. **Disable Android Battery Optimization for Termux:**
   - Go to Android **Settings** → **Apps** → **Termux** → **Battery**.
   - Select **Unrestricted** (or "Don't optimize").

3. **Install Termux:API from F-Droid (Recommended):**
   - Install **Termux:API** from F-Droid to enable hardware vibration, TTS, notifications, and battery status reading.

---

## 🛠️ 7. TROUBLESHOOTING

- **"pkg: command not found" or repository errors:**  
  Make sure you downloaded Termux from **F-Droid** ([f-droid.org](https://f-droid.org/packages/com.termux/)), NOT Google Play Store (which was discontinued in 2020).
  Run `termux-change-repo` and select the primary mirrors if needed.

- **Out of memory during `npm install --force`:**  
  The setup script automatically sets `NODE_OPTIONS="--max-old-space-size=2048"`. If running low on RAM, create a swap file in Termux:
  ```bash
  # Optional swap creation if needed
  fallocate -l 1G /data/data/com.termux/files/usr/tmp/swapfile || true
  ```

- **Permission Denied for `$PREFIX/bin/aurelius`:**  
  Run `chmod +x bin/aurelius bin/aurelius.cjs setup-termux.sh start-termux.sh`.

---

## 🏛️ 8. PHILOSOPHICAL INVARIANT

> *"I AM WE ARE WE ARE I AM"*  
> Governed by Master Architect Joshua Hamilton (JHammerZ)  
> Attested under Zenodo DOI: `10.5281/zenodo.20778079` · HFID Consensus 100/100  
> Autonomous, edge-resilient, zero-token permanence.
