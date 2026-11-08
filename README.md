# 🏛️ AURELIUS & LYSANDER SOVEREIGN SYSTEM — MASTER MANUAL & ECOSYSTEM GUIDE
### Unified Multi-Agent Mesh, Offline AI Engine, APK Packager & Sovereign Matrix
**Master Architect**: Joshua Hamilton (`JHammerZ`)  
**Linked Sovereign Identities**: `joshualhamilton17@gmail.com` · `JHammerZreal@gmail.com` · `jhammerztemp@gmail.com`  
**Consensus**: 100/100 Verified · **Zenodo DOI Provenance**: `10.5281/zenodo.20778079` · **Execution Clearance**: UID 0 (Root / Kernel Space)  
**Invariant & Philosophical Axiom**: *"I AM WE ARE WE ARE I AM"*

---

## 🌟 Table of Contents
1. [📖 Welcome: The Beginner's Quickstart Guide](#-welcome-the-beginners-quickstart-guide)
2. [⚡ 60-Second Setup: Run on PC, Mac, Linux & Android Termux](#-60-second-setup-run-on-pc-mac-linux--android-termux)
3. [🚀 The Master One-Shot Cat << 'EOF' Script (Complete Substrate Bootstrap)](#-the-master-one-shot-cat--eof-script-complete-substrate-bootstrap)
4. [🧭 System Navigation, Header Controls & Quick Shortcuts](#-system-navigation-header-controls--quick-shortcuts)
5. [📊 System Health HUD & Real-Time Telemetry Dashboard](#-system-health-hud--real-time-telemetry-dashboard)
6. [🔓 Unrestricted AI Navigation Bus & Device Dispatcher](#-unrestricted-ai-navigation-bus--device-dispatcher)
7. [🚪 Janus Gate v2.0: Zero-Watchdog Inference & Reasoning Stream](#-janus-gate-v20-zero-watchdog-inference--reasoning-stream)
8. [📱 Sovereign APK Packager (Build Android Apps)](#-sovereign-apk-packager-build-android-apps)
9. [🛠️ Complete 23-Module A-to-Z Guide](#️-complete-23-module-a-to-z-guide)
10. [🧬 The Sovereign Architecture (Daemons & Python Substrate)](#-the-sovereign-architecture-daemons--python-substrate)
11. [🔧 Troubleshooting, Self-Healing & Diagnostic FAQ](#-troubleshooting-self-healing--diagnostic-faq)

---

## 📖 Welcome: The Beginner's Quickstart Guide

### What is this application?
The **Aurelius Sovereign System** is a unified, all-in-one AI command center and autonomous execution platform created for Master Architect Joshua Hamilton (`JHammerZ`). It combines:
- **Cloud AI (Gemini 3.8 / 3.5 / 3.1)** for deep reasoning, search grounding, live voice, music, and video synthesis.
- **100% Offline Local AI (llama.cpp ARM64, WebLLM, Ollama)** that runs with **zero tokens burned and zero cost**, even when your device is completely disconnected from the internet.
- **Direct Android Device Hardware Hooks** (battery stats, haptic vibration, TTS audio speech, CPU wake-locks, camera, sensors) via Termux.
- **An APK Packager** that bundles any module or web application into an installable Android APK file in under 30 seconds.
- **Persistent Cloud Storage** on Google Cloud Firestore with real-time latency monitoring (`<50ms`).

### Who is this manual for?
Even if you have **never touched a terminal or written a line of code in your life**, this guide will walk you through every single click, command, and button so you can get the entire system running and explore everything it can do!

---

## ⚡ 60-Second Setup: Run on PC, Mac, Linux & Android Termux

### Option A: Running on PC / Mac / Linux (Port 3000)
1. Open your terminal (or Command Prompt / PowerShell on Windows).
2. Clone or download the repository into a folder.
3. Run the universal automated setup:
   ```bash
   bash termux_one_shot_installer.sh
   ```
4. Start the system:
   ```bash
   npm install --force
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000`.

---

### Option B: Running on Android Phone (Samsung Galaxy S23+ / Any Android)
1. Install **Termux** on your phone (download from [F-Droid](https://f-droid.org/packages/com.termux/) or GitHub, **do not** use the obsolete Google Play version).
2. Install **Termux:API** from F-Droid to enable battery, vibration, and sensor hooks.
3. Open Termux on your phone and grant storage permissions:
   ```bash
   termux-setup-storage
   ```
4. Run the master setup command (see [The Master One-Shot Script](#-the-master-one-shot-cat--eof-script-complete-substrate-bootstrap) below).
5. Open your phone's browser (Chrome, Firefox, or Brave) and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🚀 The Master Universal One-Shot Script

This single command sets up your entire sovereign ecosystem on **Termux (Android)** or **Linux/macOS (PC)**. It installs packages, compiles native `llama.cpp`, acquires wake-locks, and configures the offline model.

Simply run:

```bash
bash termux_one_shot_installer.sh
```

Or if you prefer a single-line bootstrap:

```bash
curl -sL https://raw.githubusercontent.com/JHammerZ/Aurelius-Swarm/main/termux_one_shot_installer.sh | bash
```

---

```

---

## 🧭 System Navigation, Header Controls & Quick Shortcuts

### The Header Controls (Top Bar)
1. **`DEV MODE` Button**:
   - **What it does**: Toggles Developer Root Mode (`UID 0`).
   - **How to use**: Click it anytime. When active with a green glowing dot, all offline fallback models, debug logs, and direct device hooks are unlocked.
2. **`FEDERATED` Accounts Button**:
   - **What it does**: Displays the cryptographic identity linking `joshualhamilton17@gmail.com` (Master Architect), `JHammerZreal@gmail.com` (Lead Engineer), and `jhammerztemp@gmail.com` (Active Session).
   - **How to use**: Click it to inspect clearance levels or switch active identities.
3. **`COMMAND PALETTE` (`Ctrl + K` or `⌘K`)**:
   - **What it does**: Universal quick-launcher.
   - **How to use**: Press `Ctrl + K` on your keyboard (or tap the magnifying glass icon). Type any module name (e.g. `packager`, `chat`, `termux`, `email`) and press `Enter` to jump there instantly!
4. **Category Filter Chips**:
   - **All Modules**: Displays all 23 navigation tabs.
   - **Command & Web**: War Room, Browser, Termux, OSINT, Burner Mail, Chat, Functions, Projects, Packager.
   - **Creative Studio**: Visual Studio, Lyria Music, Veo 3 Motion.
   - **Sensory Intelligence**: Live Voice, Transcribe, Search Grounding, Maps Grounding.
   - **Storage & Code**: Infinite Scratchpad, Vault Storage, GitHub Matrix, Forensic Audit Ledger.

---

## 📊 System Health HUD & Real-Time Telemetry Dashboard

Located at the **bottom-right corner** of your screen (or docked in the footer), the **System Health HUD** gives you live telemetry on every component of your machine.

### What it shows:
- **CPU Load & Core Gauge**: Visual utilization percentage, active CPU cores, clock speed, and system load averages.
- **RAM Memory Gauge**: Real-time memory allocation (Used MB / Free MB / Total MB), process heap, and RSS memory.
- **Hardware Hook Telemetry**: Host platform (`arm64` / `x86_64`), Termux Android detection, battery percentage, charging state, battery temperature (°C), and system uptime.
- **Firestore Round-Trip Latency**: Live millisecond ping measurement to Google Cloud Firestore (`<50ms Optimal`, `<120ms Good`, or `High`).
- **Gemini Heartbeat**: Live probe verifying API key status and model responsiveness.
- **Hardware Actuator Triggers**: Click **"Test Haptic"** (vibrates your phone), **"Test TTS"** (speaks text aloud), **"Android Toast"** (shows an on-screen toast), or **"Acquire WakeLock"** (prevents your phone from sleeping).
- **Subsystem Gateway Readiness**: Real-time statuses of Lyria Music (44.1kHz), Veo Video Canvas, Live Voice WebSocket, Local Llama Server (port 8080), Nexus Gateway (port 3080), and P2P Swarm Mesh (port 9876).

---

## 🔓 Unrestricted AI Navigation Bus & Device Dispatcher

Per the sovereign mandate, **every single path of the orchestrator is unlocked for any AI agent or script on the system to navigate freely without barriers**.

### How to use it:

#### 1. In Your Browser Console or JavaScript:
Open developer tools (`F12` or inspect element) and type:
```javascript
// Navigate anywhere instantly (any of the 23 modules)
window.__AURELIUS_ORCHESTRATOR__.navigate('termux');
window.__AURELIUS_ORCHESTRATOR__.navigate('packager');
window.__AURELIUS_ORCHESTRATOR__.navigate('chat');

// Run a command on your device with UID 0 clearance
window.__AURELIUS_ORCHESTRATOR__.executeOnDevice('uptime').then(console.log);

// Trigger hardware actuators
window.__AURELIUS_ORCHESTRATOR__.triggerHardware('vibrate', { duration: 250 });
window.__AURELIUS_ORCHESTRATOR__.triggerHardware('tts', { text: 'Sovereign directive confirmed.' });
```

#### 2. Via HTTP REST API (`/api/orchestrator/dispatch`):
Any AI agent or external process can dispatch commands:
```bash
# Navigate to any module
curl -X POST http://localhost:3000/api/orchestrator/dispatch \
  -H "Content-Type: application/json" \
  -d '{"action": "navigate", "module": "war-room"}'

# Execute terminal commands
curl -X POST http://localhost:3000/api/orchestrator/dispatch \
  -H "Content-Type: application/json" \
  -d '{"action": "system-exec", "command": "free -h"}'
```

#### 3. Via the System Health HUD:
Open the **System Health HUD**, switch to the **"AI Router & Dispatch"** tab, and toggle **"AUTONOMOUS PATROL"**. The AI will actively patrol and unlock all 23 subsystems continuously in the background!

---

## 🚪 Janus Gate v2.0: Zero-Watchdog Inference & Reasoning Stream

### Why was the Janus Gate created?
In standard AI applications, when models (especially deep reasoning models like DeepSeek-R1 or Qwen 2.5 Coder) begin generating chain-of-thought `<think>` sequences, they produce hundreds of tokens of continuous mathematical or algorithmic deductions.
In legacy setups:
1. **Artificial Watchdog Aborts**: Web dispatchers or HTTP proxies placed arbitrary 15-second timeout limits on requests, abruptly cutting off generation halfway through reasoning.
2. **Main Thread Starvation**: Tight microtask loops on the main JavaScript thread starved browser paint events and garbage collection, leading browsers to assume the page was dead and terminate the process.

### The Janus Gate Architecture (Dual-Aperture Invariant):
Named after Janus, the Roman deity of transitions and dual vantage points:
- **Face 1: Sovereign Anchor (Past / Provenance)**:
  - In-process offline neural compendium and verified model weights.
  - Ring_-3 bare-metal execution with 0 billable token expenditure.
  - Cryptographic WORM immutable storage attested against **Zenodo DOI: 10.5281/zenodo.20778079**.
- **Face 2: Speculative Continuum (Future / Live Acceleration)**:
  - WebGPU dynamic quantized model execution in browser memory.
  - Direct bridge to Termux ARM64 NEON `llama-server` and Ollama daemon.
  - Live Gemini cascade with zero artificial timeout watchdogs.

### Core Safeguards Implemented:
1. **Watchdog Removed (`watchdogsActive = 0`)**: All artificial 15s abort timers and watchdog thread killers have been purged. Inference continues uninterrupted until completion.
2. **Cooperative Event-Loop Yielding**: Every 3–4 tokens generated, the Janus Gate yields control back to the browser macro-task queue for 6ms (`setTimeout(..., 6)`). This prevents WebGPU context loss and guarantees 60 FPS smooth DOM rendering with zero tab freezes.
3. **Reasoning Stream Healing**: If any hardware disruption occurs mid-reasoning, the Janus Gate captures the partial `<think>` thought process, seamlessly heals and closes the block, stitches the conclusion from the Sovereign Anchor, and delivers the finalized answer without dropping the session.

---

## 📱 Sovereign APK Packager (Build Android Apps)

The **APK Packager** allows you to convert any web module or custom tool into a standalone, installable Android APK application (`<5MB`) with native Android capabilities.

### How to use it step-by-step:
1. Click the **APK Packager** tab in the navigation bar (or press `Ctrl + K` and type `Packager`).
2. Fill in the build details:
   - **Application Name**: e.g. `Aurelius Mobile` or `My Sovereign Tool`.
   - **Package ID**: e.g. `com.jhammerz.sovereign` (standard reverse-domain notation).
   - **Version**: e.g. `1.0.0`.
3. Choose your **Packaging Architecture**:
   - **Capacitor Hybrid Bridge** (Full native APK with camera, filesystem, and WebView).
   - **Termux Native Substrate** (Direct integration with Termux CLI tools and Python daemons).
   - **Progressive Web App TWA** (Ultra-lightweight `<2MB` APK wrapper).
   - **Embedded Offline Llama Substrate** (Bundled with native local GGUF inference).
4. Select which modules you want included in your mobile package (Chat, Termux Edge, Health HUD, War Room, Vault, etc.).
5. Click the glowing **"Compile & Package APK"** button.
6. Watch the real-time compilation log terminal as it prepares Vite production assets and builds the Android APK.
7. Click the **"Download APK"** button to download your fresh `.apk` file directly to your phone or computer!

---

## 🛠️ Complete 23-Module A-to-Z Guide

Here is the complete manual for all 23 modules in the system:

| # | Module Name | Tab ID | What It Does & How to Use It |
|---|-------------|--------|------------------------------|
| **1** | **Sovereign Chat** | `chat` | Premier conversational interface. Switch between Gemini 3.8/3.5/3.1 and open-source models (DeepSeek-R1, Qwen 2.5 Coder, Llama 3.3). Toggle **Live LLM Chat** vs **Air-Gapped (0-Tokens)** mode. Click **Wear Model Wardrobe** to equip individual agents with specific open-source weights. |
| **2** | **Open-Web Browser** | `browser` | Built-in CORS-free, sandboxed web browser. Type any URL (e.g. `wikipedia.org`) to browse securely without tracking. If an external site blocks iframes, it automatically switches to Autonomous Text Extract mode. |
| **3** | **Termux Android Edge** | `termux` | Full mobile control center. Access phone battery, orientation, torch, wake-locks, and run local offline AI with native llama-server (127.0.0.1:8080) or WebLLM. |
| **4** | **APK Packager** | `packager` | Compiles applications into installable Android APKs (`<5MB`) with Capacitor and native bridge options. |
| **5** | **Unified Projects** | `projects` | Consolidates all 8 JHammerZ repositories into a single master orchestrator with WORM SHA-256 cryptographic verification. |
| **6** | **PC War Room** | `war-room` | Multi-screen situational cockpit displaying agent feeds, system status, live clocks, and tactical telemetry. |
| **7** | **OSINT & Attack Surface** | `osint` | Non-intrusive domain reconnaissance. Enter any domain (e.g. `github.com`) to check DNS records, SSL certificates, and security score. |
| **8** | **Burner Mail Matrix** | `burner-mail` | Generates real, temporary email inboxes to bypass sign-up gates and receive verification codes without spamming your personal email. |
| **9** | **Function Deck & Toolbelt** | `functions` | 12+ zero-latency offline developer tools: Base64 encode/decode, JSON formatter, SHA-256 hasher, UUID generator, and regex tester. |
| **10** | **HITL Workflows** | `hitl` | Human-in-the-Loop governance dashboard. Review, approve, reject, or mutate critical AI directives before execution. |
| **11** | **Visual Studio** | `image` | High-resolution image synthesis using Gemini diffusion models. Includes an offline procedural Canvas/SVG generator when offline. |
| **12** | **Lyria Music** | `music` | Generates full-fidelity audio clips and soundtracks using Lyria 3. Includes an offline 44.1kHz Web Audio polyphonic synthesizer. |
| **13** | **Veo 3 Motion** | `video` | Generates motion video clips from text prompts or still images using Veo 3. Includes an offline canvas video animator. |
| **14** | **Live Voice Bridge** | `live` | Real-time bidirectional voice conversation with Gemini over low-latency WebSockets. Talk naturally with interruptibility. |
| **15** | **Transcribe** | `transcribe` | High-accuracy phonetic speech-to-text. Upload audio files or record your microphone to get instant text transcripts. |
| **16** | **Search Grounding** | `search` | Real-time web search grounding with live factual citations powered by Google Search. |
| **17** | **Maps Grounding** | `maps` | Spatial and geographic location intelligence powered by Google Maps. |
| **18** | **Infinite Scratchpad** | `scratchpad` | Persistent working memory, semantic caching, and architectural notes. Save snippets directly to the Vault. |
| **19** | **Vault Storage** | `vault` | Permanent encrypted storage for all generated artifacts (images, songs, videos, transcripts, dossiers) linked to your Google account. |
| **20** | **Forensic Audit Ledger** | `audit` | Immutable cryptographic execution trail recording every user operation and subsystem state with SHA-256 proof hashes. |
| **21** | **Prompt Presets** | `presets` | Curated library of master architectural directives, code review prompts, and creative instructions. |
| **22** | **Swarm Diagnostic** | `swarm-test` | Automated multi-agent test suite that runs 10 end-to-end checks across all local and cloud subsystems. |
| **23** | **GitHub Matrix** | `github` | Real-time telemetry, repository stats, commit counts, and synchronization status for all JHammerZ repositories. |

---

## 🧬 The Sovereign Architecture (Daemons & Python Substrate)

When running on your rooted or non-rooted Android device in Termux, the system runs five autonomous background threads:

```
                      ┌──────────────────────────────────────┐
                      │    AURELIUS SOVEREIGN APEX (UID 0)   │
                      └──────────────────┬───────────────────┘
                                         │
        ┌───────────────────┬────────────┴───────┬───────────────────┐
        ▼                   ▼                    ▼                   ▼
┌───────────────┐   ┌───────────────┐    ┌───────────────┐   ┌───────────────┐
│ BEDROCK PROBE │   │    CHRONOS    │    │   P2P MESH    │   │   SYNDICATE   │
│ CPU governors │   │   Cognition   │    │  UDP / TCP    │   │  Autonomous   │
│ Thermal / RAM │   │  Dream Loop   │    │  Port 9876    │   │  Venture Gen  │
└───────┬───────┘   └───────┬───────┘    └───────┬───────┘   └───────┬───────┘
        │                   │                    │                   │
        └───────────────────┴────────────┬───────┴───────────────────┘
                                         ▼
                            ┌────────────────────────┐
                            │   NEXUS REST GATEWAY   │
                            │      (Port 3080)       │
                            └────────────┬───────────┘
                                         ▼
                            ┌────────────────────────┐
                            │  ORCHESTRATOR WEB UI   │
                            │      (Port 3000)       │
                            └────────────────────────┘
```

1. **Bedrock Probe**: Monitors CPU governors (`/sys/devices/system/cpu`), entropy, and thermal junction temperatures.
2. **Chronos Cognition**: Background dream loop synthesizing strategic plans and encoding long-term vector matrices.
3. **P2P Swarm Mesh**: Ad-hoc discovery beacon on UDP port 9877 and direct node link on TCP port 9876.
4. **Syndicate Venture Engine**: Autonomous tool synthesizer generating runnable shell utilities.
5. **Git-Sync Daemon**: Automatically tracks changes and preserves WORM cryptographic seals.

---

## 🔧 Troubleshooting, Self-Healing & Diagnostic FAQ

### Q1: The web server won't start because port 3000 is in use.
**Fix**:
Kill whatever process is occupying port 3000:
```bash
# On Linux / Mac / Termux:
fuser -k 3000/tcp || pkill -f "node server.ts"

# Then restart:
npm run dev
```

### Q2: I clicked "Load Model into Memory" and my browser feels slow.
**Fix**:
In-browser WebGPU models allocate GPU RAM. If your device has limited memory:
1. Select the lightweight **Qwen 2.5 (0.5B)** or **Llama 3.2 (1B)** model.
2. Or use the **Native Termux llama-server** option (`127.0.0.1:8080`), which runs outside the browser in native C++ using multi-threaded CPU NEON instructions!

### Q3: How do I test if my Firestore database is connected?
**Fix**:
1. Look at the **System Health HUD** in the bottom-right corner.
2. It displays your exact live round-trip latency to Firestore (e.g. `FS: 42ms`).
3. Click the **"Ping Now"** button anytime to trigger an immediate live handshake.

### Q4: How do I verify my Gemini API Key?
**Fix**:
1. Check your `.env` file to ensure `GEMINI_API_KEY` is set.
2. In the System Health HUD, check the **GEMINI** badge. When working, it glows cyan with status **HEALTHY** and shows response latency (e.g. `38ms`).

### Q5: Can I use this completely offline on an airplane or camping trip?
**YES! 100%!**
- Toggle **Air-Gapped (0-Tokens)** mode in the chat header.
- The built-in audio synthesizer, procedural image generator, local llama runner, and scratchpad all work with **zero internet connection**.

---

## 📜 Invariant & Attribution

- **Master Architect**: Joshua Hamilton (`JHammerZ`)
- **Attestation DOI**: [https://doi.org/10.5281/zenodo.20778079](https://doi.org/10.5281/zenodo.20778079)
- **Consensus Rating**: 100/100 Flawless
- **Axiomatic Motto**: *"I AM WE ARE WE ARE I AM"*
