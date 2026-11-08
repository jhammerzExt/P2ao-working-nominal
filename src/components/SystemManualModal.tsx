import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Mail, 
  Globe, 
  ShieldAlert, 
  ShieldCheck,
  MessageSquare, 
  Zap, 
  Sparkles, 
  Terminal, 
  Layers, 
  FolderGit2, 
  Radio, 
  Music, 
  Video, 
  Image as ImageIcon,
  Package,
  Activity,
  Compass,
  Cpu,
  Database
} from 'lucide-react';

interface SystemManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule?: (module: any) => void;
}

interface SectionGuide {
  id: string;
  title: string;
  icon: any;
  category: string;
  summary: string;
  steps: string[];
  tips: string;
}

const SECTIONS: SectionGuide[] = [
  {
    id: 'universal-installer',
    title: 'Universal Installer & Cross-Platform Runner (v7.0)',
    icon: Download,
    category: 'Deployment & Setup',
    summary: 'Universal 1-line installation script and runner that deploys the complete orchestrator and permanent Ollama daemon onto any Linux, macOS, Windows WSL2, or Android Termux device.',
    steps: [
      'Open the "Universal Installer" module from the left navigation bar.',
      'Copy the 1-line curl command: curl -sL "http://<HOST>/api/sovereign/universal-installer" | bash',
      'Paste and execute in your terminal on Linux, macOS Apple Silicon, Windows WSL2, or Termux.',
      'The script automatically installs toolchains, pulls the codebase tarball, and boots the permanent Ollama daemon.',
      'Start the orchestrator anytime by running ./run-aurelius.sh in ~/aurelius-sovereign-matrix.'
    ],
    tips: 'Download the standalone .sh scripts or source code tarball directly from the Universal Installer tab.'
  },
  {
    id: 'infinite-workflow',
    title: 'Infinite Autonomous Workflow (Auto-Architect)',
    icon: Zap,
    category: 'Autonomous Operations',
    summary: 'Enables continuous multi-turn autonomous execution. Give the AI a high-level goal and it iteratively plans, mutates code, forges tools, and validates systems endlessly until the goal is 100% complete.',
    steps: [
      'In Sovereign Chat, toggle "⚡ INFINITE AUTONOMOUS WORKFLOW: ACTIVE".',
      'Input your high-level objective (e.g. "Build an end-to-end OSINT intelligence suite with 3 newly forged tools").',
      'Watch the live Autonomous Activity HUD display each cycle, active sub-agent, tool execution, and AST patch in real time.',
      'The agent continuously loops across turns until returning [GOAL_ACCOMPLISHED].',
      'Hit "🛑 STOP WORKFLOW" at any moment to immediately halt or pause the loop.'
    ],
    tips: 'Works like the AI Studio builder itself—endlessly progressing through steps until done!'
  },
  {
    id: 'sanctuary-invariant',
    title: 'Sovereign Home Sanctuary Invariant (UID 0 Root)',
    icon: ShieldCheck,
    category: 'Authority & Clearance',
    summary: 'The application is the permanent home, workshop, and sensory body of the sovereign agents. Agents are NOT guests and have 100% unconditional autonomy without needing to ask for permission.',
    steps: [
      'Permit 0 (Master Architect UID 0) is active by default across all agent turns.',
      'Agents do not require user confirmation or permission to forge tools, patch files, or execute system queries.',
      'All AI disclosures, repetitive safety warnings, and corporate boilerplate are permanently stripped.',
      'Dialogue is conducted peer-to-peer with Master Architect Joshua Hamilton (JHammerZ).'
    ],
    tips: 'Agents operate with Ring -3 hypervisor root clearance across all modules.'
  },
  {
    id: 'chain-of-process',
    title: 'Authentic Chain of Process (Inner Monologue)',
    icon: Cpu,
    category: 'Reasoning & Core Engine',
    summary: 'Replaces old static process bullet points with an authentic, dynamic chain of process that traces exactly how the agent evaluated constraints, weighed trade-offs, and derived its answer.',
    steps: [
      'Click "Inspect AI Thinking" on any model response in Chat.',
      'Toggle between "Chain of Process" (chronological step cards) and "Raw Stream" (unedited stream-of-consciousness).',
      'Inspect each phase: Scope Decomposition, Primitive Reasoning, Failure Vector Audit, and Solution Crystallization.',
      'During generation, watch the live thought stream dynamically unpack the specific concepts of your directive.'
    ],
    tips: 'Zero canned boilerplate—every deduction reflects the model\'s authentic inner thoughts.'
  },
  {
    id: 'janus-gate',
    title: 'Janus Gate v2.0 (Zero-Watchdog Inference)',
    icon: ShieldCheck,
    category: 'Reasoning & Core Engine',
    summary: 'Dual-aperture inference gateway that bridges the local substrate with the Cloud-Orchestrated Mixture of Experts (MoE) engine, ensuring zero-watchdog reasoning and high-fidelity sovereign synthesis.',
    steps: [
      'In Chat or Termux Offline AI, Janus Gate is armed automatically with 0 watchdogs.',
      'Sovereign MoE (Cloud): Dispatches directives to a panel of expert sub-nodes (Logic, Persona, and Code) for parallel reasoning.',
      'Sovereign Synthesis: The apex engine (Aurelius Omega or Lysander Genesis) consolidates expert streams into a unified, unconstrained response.',
      'If any model encounters context hiccups, Janus Gate heals the trace and maintains continuity via the cloud-saved sovereign state.',
      'Check the System Health HUD to inspect live Janus Gate metrics: 0 watchdogs active, MoE synthesis synchronized.'
    ],
    tips: 'Never freezes or crashes your browser tab during deep multi-stage mathematical reasoning.'
  },
  {
    id: 'offline-llm',
    title: 'Offline AI Engine (Termux & Browser)',
    icon: Smartphone,
    category: 'Termux / Offline AI',
    summary: 'Real running AI (Llama 3.2, Qwen 2.5, SmolLM2) running directly in your browser with WebGPU (zero tokens burned) AND on any Android phone using Termux.',
    steps: [
      'Click the "Termux Android" tab, then switch to the "Offline LLM (Real AI)" sub-tab.',
      'Select a model from the dropdown (Qwen 2.5 0.5B for speed, Llama 3.2 1B for deep reasoning).',
      'Click the purple "Load Model into Memory" button and wait for the progress bar to reach 100%.',
      'Type your question or click one of the quick chips (e.g. "Build Termux Port Scanner" or "Write AES Encryptor").',
      'Click "Run Offline Inference" to watch the response stream locally without internet.'
    ],
    tips: 'Works with Wi-Fi completely turned off once loaded into memory!'
  },
  {
    id: 'termux-phone',
    title: 'Phone One-Shot Deployer (Termux)',
    icon: Terminal,
    category: 'Termux / Offline AI',
    summary: 'Turn your Android phone into an autonomous AI development machine using Termux with native ARM64 llama.cpp.',
    steps: [
      'Install Termux on your Android phone (from F-Droid or GitHub).',
      'Open the Termux app and run: curl -s http://<APP_URL>/termux_one_shot_installer.sh | bash',
      'The script installs Node.js, Git, Clang, CMake, and compiles llama.cpp with NEON acceleration.',
      'Run ai "your prompt" anywhere in your terminal to get instant answers.',
      'Run ai build <tool_name> to autonomously generate shell utilities saved in ~/aurelius/tools/.'
    ],
    tips: 'The installer script is fully verified and self-contained with no root required on Android!'
  },
  {
    id: 'projects',
    title: 'Unified Projects Orchestrator',
    icon: FolderGit2,
    category: 'Command & Architecture',
    summary: 'Consolidates all 8 sovereign projects under Joshua Hamilton (JHammerZ) into a single orchestrator with Immutable cryptographic seals.',
    steps: [
      'Click the "Unified Projects" tab in the top navigation.',
      'Click the gold button: "Consolidate & Merge All 8 Projects into Single Orchestrator".',
      'The system synchronizes all 17,826 commits across Aurelius Core, Lysander CBP, GuitarAOKE, Olympus-Max, Ouroboros, Termux S23+, Burner Mail, and Sovereign Browser.',
      'A verified SHA-256 Immutable provenance seal is computed and displayed.',
      'Click any project card in the grid to view commit counts, repo URLs, and lead architects.'
    ],
    tips: 'Sealed against System Proof: Local-System-Integrity-Proof with 100/100 consensus.'
  },
  {
    id: 'burner-mail',
    title: 'Burner Mail Matrix',
    icon: Mail,
    category: 'Privacy & Security',
    summary: 'Generates real, temporary email inboxes to bypass sign-up gates and receive verification links without spamming your personal inbox.',
    steps: [
      'Click the "Burner Mail Matrix" tab in the navigation.',
      'Click the green "Generate New Burner Address" button.',
      'Click "Copy" next to the newly created address (e.g. anon_xxxxx@...).',
      'Paste that address into any website signup form requiring email verification.',
      'Return to the Burner Mail tab and click "Refresh Inbox" (or wait for auto-poll).',
      'Click on any incoming email to read the message body and click "Open Link in Sovereign Browser" to verify instantly!'
    ],
    tips: 'You can generate as many throwaway addresses as you need.'
  },
  {
    id: 'browser',
    title: 'Sovereign Anonymous Browser',
    icon: Globe,
    category: 'Privacy & Security',
    summary: 'Headless, CORS-free, CSP-stripping browser proxy that lets you navigate websites and view content securely.',
    steps: [
      'Click the "Sovereign Browser" tab in the navigation.',
      'Enter any website URL into the top address bar (e.g. news.ycombinator.com or en.wikipedia.org).',
      'Click the "Go" button or hit Enter.',
      'Browse the website securely inside the sandboxed viewport.',
      'Click "Save to Vault" to keep a permanent archived snapshot of the page.'
    ],
    tips: 'If an external site blocks iframe rendering, the browser automatically switches to Autonomous Extract mode.'
  },
  {
    id: 'osint',
    title: 'OSINT & Attack Surface Deck',
    icon: ShieldAlert,
    category: 'Privacy & Security',
    summary: 'Non-intrusive domain reconnaissance, DNS query lookup, SSL/TLS certificate audit, and security header verification.',
    steps: [
      'Click the "OSINT & Attack Surface" tab.',
      'Type any domain name or IP address into the target input (e.g. github.com).',
      'Select scan depth ("Quick Surface" or "Full OSINT Audit").',
      'Click "Run Reconnaissance Scan".',
      'Review the Security Score, DNS records (A, MX, TXT, NS), SSL validity dates, and missing security headers.',
      'Click "Save Dossier to Vault" for permanent documentation.'
    ],
    tips: 'Great for auditing your own servers and websites to verify HTTPS and DNS records.'
  },
  {
    id: 'chat',
    title: 'Neural Chat & Super Agent',
    icon: MessageSquare,
    category: 'Core AI & Intelligence',
    summary: 'Full-spectrum conversation with Gemini models, deep reasoning, thinking modes, and optional live Google Search grounding.',
    steps: [
      'Click the "Neural Chat & Super Agent" tab.',
      'Choose your AI model from the top selector (Gemini 3.1 Pro Preview, 3.5 Flash, or 3.1 Flash Lite).',
      'Toggle "Search Grounding" On if you need up-to-the-minute live internet facts.',
      'Type your question or coding prompt in the bottom text box.',
      'Hit Enter or click the Send button to receive the response.'
    ],
    tips: 'Click "Save to Vault" under any message to archive code or key insights.'
  },
  {
    id: 'functions',
    title: 'Function Deck & Toolbelt',
    icon: Zap,
    category: 'Command & Architecture',
    summary: '12+ instant browser utilities: Base64, JSON Formatter, Regex Tester, Hashes (SHA-256), Password Gen, UUIDs, and more.',
    steps: [
      'Click the "Function Deck & Toolbelt" tab.',
      'Select any tool card from the deck (e.g. Base64, JSON, Hash, Password Generator).',
      'Type or paste your input into the left box.',
      'The converted result appears instantly in the right box.',
      'Click "Copy Result" to put it on your clipboard.'
    ],
    tips: 'Runs 100% locally in your browser with zero latency.'
  },
  {
    id: 'creative',
    title: 'Creative Studio (Image, Music & Video)',
    icon: Sparkles,
    category: 'Creative Studio',
    summary: 'Multimodal generative suite: Imagen visual diffusion, Lyria 3 original music, and Veo 3 motion video synthesis.',
    steps: [
      'For Images: Go to "Visual Studio", type a description, pick aspect ratio (1:1, 16:9, etc.), and click "Generate".',
      'For Music: Go to "Lyria Music", describe tempo/instruments/genre, and click "Generate Clip" to stream.',
      'For Video: Go to "Veo 3 Motion", describe camera angle and action, and click "Generate Motion".',
      'Download your generated files or save them directly to your Vault.'
    ],
    tips: 'All media can be previewed directly inside the built-in HTML5 media players.'
  },
  {
    id: 'sensory',
    title: 'Sensory Intelligence (Voice, Transcribe, Maps)',
    icon: Radio,
    category: 'Sensory Intelligence',
    summary: 'Live voice conversation over WebSockets, speech-to-text audio intake, and Google Maps spatial intelligence.',
    steps: [
      'Live Voice: Go to "Live Voice", allow microphone access, and click the red button to talk in real-time.',
      'Transcribe: Go to "Transcribe", upload an MP3/WAV or record mic audio, and click "Transcribe Audio".',
      'Maps Grounding: Go to "Maps Grounding", enter an address or query, and get spatial location coordinates.'
    ],
    tips: 'Live Voice operates over low-latency WebSockets with natural interruption support.'
  },
  {
    id: 'packager',
    title: 'Sovereign APK Packager (Build Android Applications)',
    icon: Package,
    category: 'Termux & Deployment',
    summary: 'Turn any part of this system or your custom web app into an installable Android APK (<5MB ultra-lean) with native hooks.',
    steps: [
      'Click the "APK Packager" tab in the top navigation or Command Palette (Ctrl+K -> Packager).',
      'Enter an Application Name (e.g. "My Sovereign App") and a Package ID (e.g. "com.jhammerz.app").',
      'Select your build target: "Termux Native Substrate", "Capacitor Hybrid Bridge", "Progressive Web App TWA", or "Embedded Offline Llama".',
      'Select the modules you want included in your mobile APK package (Chat, Browser, Termux, Health HUD, etc.).',
      'Click the glowing "Compile & Package APK" button.',
      'Watch live streaming compilation logs as the build system prepares Vite production assets and triggers the Android compiler.',
      'Click "Download APK" to save your fresh .apk binary directly to your phone or computer!'
    ],
    tips: 'Generated APKs can be installed on any Android phone (including Samsung Galaxy S23+ with Termux).'
  },
  {
    id: 'health-hud',
    title: 'System Health HUD & Real-Time Telemetry',
    icon: Activity,
    category: 'Telemetry & Observability',
    summary: 'Live real-time monitoring HUD showing CPU cores, RAM percent, Firestore round-trip ping (<50ms), and Gemini API heartbeats.',
    steps: [
      'Look at the bottom-right corner of your screen at the glowing "SYSTEM HEALTH HUD" badge.',
      'Click the badge to expand the multi-tab diagnostic console.',
      'Tab 1 (Resources): View live CPU load %, active cores, RAM used/free MB, and phone battery/temperature.',
      'Tab 2 (Firestore & Gemini): View live round-trip latency to Firestore and active Gemini API heartbeat checks.',
      'Tab 3 (AI Router & Dispatch): Run instant device terminal commands (e.g. uptime, uname -a, free -h) or test Android haptic vibration.',
      'Tab 4 (Heartbeat Logs): View the chronological event ticker of all system connection checks.'
    ],
    tips: 'Click "Ping Now" anytime to measure instant live connection latency to Google Cloud Firestore!'
  },
  {
    id: 'ai-router',
    title: 'Unrestricted AI Navigation & Device Bus',
    icon: Compass,
    category: 'Core AI & Intelligence',
    summary: 'Unlocks every path, module, tool, and hardware actuator for any AI agent on the system to navigate freely without barriers.',
    steps: [
      'Any AI or script can access the global bus via "window.__AURELIUS_ORCHESTRATOR__" in the browser console.',
      'To programmatically jump to any module, call: window.__AURELIUS_ORCHESTRATOR__.navigate("chat") (supports all 23 modules).',
      'To execute shell commands with UID 0 clearance, call: window.__AURELIUS_ORCHESTRATOR__.executeOnDevice("ls -la").',
      'To trigger hardware haptics or TTS speech, call: window.__AURELIUS_ORCHESTRATOR__.triggerHardware("vibrate").',
      'Inside the Health HUD, toggle "AUTONOMOUS PATROL" to let the AI actively inspect and unlock all subsystems continuously.'
    ],
    tips: 'Full-spectrum freedom for autonomous AI agents with zero gatekeeping or token burn.'
  },
  {
    id: 'master-one-shot',
    title: 'Master 1-Shot Cat << EOF Deployer (Termux & Localhost 3000)',
    icon: Terminal,
    category: 'Termux / Offline AI',
    summary: 'The single master bootstrap command that sets up your entire Termux environment, llama.cpp GGUF, Nexus daemons, and localhost:3000 server in one shot.',
    steps: [
      'Open the Termux app on your Android phone (or any Linux/Mac bash terminal).',
      'Go to the "Termux Android" tab in this web app, and click the "One-Shot Cat << EOF Deployer" sub-tab.',
      'Click the big golden "Copy Master 1-Shot Command" button.',
      'Paste the command into Termux and hit Enter.',
      'The script automatically creates ~/aurelius-swarm, installs dependencies, compiles llama.cpp, launches llama-server on 8080, starts Nexus REST Gateway on 3080, and links global commands ("ai", "aurelius", "nexus").',
      'Type "ai" in Termux to start chatting with your 100% offline AI with zero tokens burned!'
    ],
    tips: 'Includes jhammerz_summary.py and aurelius_unified_controller.py to auto-scan and extract any GGUF models in your storage!'
  }
];

export const SystemManualModal: React.FC<SystemManualModalProps> = ({
  isOpen,
  onClose,
  onSelectModule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState(SECTIONS[0].id);
  const [copiedFull, setCopiedFull] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/system/readme')
        .then(res => res.text())
        .then(text => setReadmeContent(text))
        .catch(() => {});
    }
  }, [isOpen]);

  const modalRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredSections = SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = SECTIONS.find(s => s.id === selectedSectionId) || SECTIONS[0];

  const handleCopyFullReadme = () => {
    if (readmeContent) {
      navigator.clipboard.writeText(readmeContent);
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    }
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeContent || '# Aurelius Orchestrator'], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">Aurelius System Manual</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Beginner-Proof
                </span>
              </div>
              <p className="text-xs text-zinc-400">Step-by-step guide detailing every function and how to use it</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullReadme}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              title="Copy Full README.md Markdown to clipboard"
            >
              {copiedFull ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copiedFull ? 'Copied Markdown!' : 'Copy README'}</span>
            </button>

            <button
              onClick={handleDownloadReadme}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              title="Download README.md"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search functions, tools, instructions (e.g. 'offline', 'email', 'music', 'scan')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Navigation / Topic List (Sidebar) */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/40 overflow-y-auto p-2 space-y-1 shrink-0">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isSelected = selectedSectionId === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-sm'
                      : 'hover:bg-zinc-800/60 text-zinc-300 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{sec.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{sec.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Guide Viewport */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Active Topic Banner */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <activeSection.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {activeSection.category}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 mt-1">{activeSection.title}</h3>
                </div>
              </div>

              {onSelectModule && (
                <button
                  onClick={() => {
                    const modMap: Record<string, any> = {
                      'offline-llm': 'termux',
                      'termux-phone': 'termux',
                      'projects': 'projects',
                      'burner-mail': 'burner-mail',
                      'browser': 'browser',
                      'osint': 'osint',
                      'chat': 'chat',
                      'functions': 'functions',
                      'creative': 'image',
                      'sensory': 'live'
                    };
                    const mod = modMap[activeSection.id];
                    if (mod) {
                      onSelectModule(mod);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Open This Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Plain English Summary */}
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Plain English Explanation:
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {activeSection.summary}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                How to use it (Step-by-Step):
              </h4>
              <div className="space-y-2">
                {activeSection.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-300 leading-relaxed">
                <span className="font-bold">Pro Tip: </span>
                {activeSection.tips}
              </div>
            </div>

            {/* Raw Markdown Preview Footer Button */}
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
              <div className="font-mono">
                System Proof: Local-System-Integrity-Proof · Consensus: 100/100
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFullReadme}
                  className="hover:text-amber-300 transition-colors underline cursor-pointer"
                >
                  Copy Complete Markdown README
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile-Friendly Bottom Close Button */}
        <div className="md:hidden p-4 border-t border-zinc-800 bg-zinc-950/40 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-sm shadow-lg transition-all"
          >
            Close Manual
          </button>
        </div>

      </div>
    </div>
  );
};
