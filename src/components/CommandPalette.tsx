import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Command, 
  Globe, 
  ShieldAlert, 
  MessageSquare, 
  Music, 
  Video, 
  Image as ImageIcon, 
  MapPin, 
  Mic, 
  Radio, 
  Archive, 
  FolderGit2, 
  Cpu, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  Play, 
  Download, 
  Shield, 
  Flame, 
  Zap, 
  Terminal, 
  X,
  Code,
  FileText,
  UserCheck,
  Smartphone,
  Mail,
  BookOpen,
  HardDrive,
  Network,
  Wrench,
  Activity
} from 'lucide-react';
import type { ModuleType, Artifact } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ModuleType) => void;
  artifacts: Artifact[];
  onNavigateUrlInBrowser: (url: string) => void;
  onTriggerEngineeringEngine?: () => void;
  userId?: string;
}

interface CommandItem {
  id: string;
  category: 'Modules' | 'Vault Artifacts' | 'GitHub Repositories' | 'Browser & Media' | 'Sovereign Actions';
  title: string;
  description: string;
  icon: any;
  color?: string;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  artifacts,
  onNavigateUrlInBrowser,
  onTriggerEngineeringEngine,
  userId
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // GitHub Repositories for instant navigation
  const githubRepos = useMemo(() => [
    { name: 'jhammerz.github.io', desc: 'Sovereign Personal Hub & Web Root', url: 'https://jhammerz.github.io', stars: 24 },
    { name: 'Sovereign-JHam-Core', desc: 'Core-Level Zero-Volatility Consensus Substrate', url: 'https://github.com/JHammerZ/Sovereign-JHam-Core', stars: 142 },
    { name: 'JHAMMERZ_OS', desc: 'Bare-Metal AI Orchestration Kernel', url: 'https://github.com/JHammerZ/JHAMMERZ_OS', stars: 89 },
    { name: 'Aurelius-Matrix-Orchestrator', desc: 'Autonomous Agent Edge Swarm Engine', url: 'https://github.com/JHammerZ', stars: 67 },
    { name: 'System--Verified', desc: 'Cryptographic Provenance Record & Spec', url: 'https://doi.org/Local-System-Integrity-Proof', stars: 310 },
    { name: 'GuitarAOKE-Factory', desc: 'Acoustic Signal Processing & Wave Synthesis', url: 'https://github.com/JHammerZ', stars: 53 }
  ], []);

  // Construct comprehensive command items pool
  const allCommands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // 1. App Modules (12 Total)
    const modulesConfig: Array<{ id: ModuleType; title: string; desc: string; icon: any; color: string; badge: string }> = [
      { id: 'war-room', title: 'PC War Room Cockpit', desc: 'Lysander 4.0 Cockpit, Alpha-14 swarm & sovereign nodes', icon: ShieldAlert, color: 'text-amber-400', badge: 'Core-Level' },
      { id: 'browser', title: 'Sovereign Web Browser v126', desc: 'Bare-metal anonymous browser, media player & 0-token crawler', icon: Globe, color: 'text-sky-400', badge: 'Tor-Mesh' },
      { id: 'termux', title: 'Android Termux Edge Module', desc: 'Node-09 CBP Edge coordinator, native haptics, TTS, battery & wake-lock', icon: Smartphone, color: 'text-emerald-400', badge: 'Android' },
      { id: 'chat', title: 'Sovereign Core Chat', desc: 'Continuous turn memory, Gemini 3.1 Pro & autonomous engine', icon: MessageSquare, color: 'text-amber-300', badge: 'Permanent' },
      { id: 'music', title: 'Lyria 3 Music Studio', desc: 'Acoustic waveform synthesis, arrangement & WAV export', icon: Music, color: 'text-fuchsia-400', badge: 'Audio' },
      { id: 'video', title: 'Veo 3.1 Motion Studio', desc: 'Cinematic video synthesis & HD camera motion controls', icon: Video, color: 'text-rose-400', badge: 'Video' },
      { id: 'image', title: 'Nano Banana 2.1 Visual Studio', desc: 'Vector blueprints, 4K diffusion & image transformation', icon: ImageIcon, color: 'text-purple-400', badge: 'Visual' },
      { id: 'search', title: 'Search Grounding Engine', desc: 'Real-time Google search verification & citations', icon: Search, color: 'text-sky-400', badge: 'Live Facts' },
      { id: 'maps', title: 'Maps Spatial Grounding', desc: 'Global geodata, coordinates triangulation & spatial vectors', icon: MapPin, color: 'text-emerald-400', badge: 'Spatial' },
      { id: 'transcribe', title: 'Acoustic Transcribe Engine', desc: 'Speech-to-text decoding with zero floor noise filtering', icon: Mic, color: 'text-teal-400', badge: 'Decoders' },
      { id: 'live', title: 'Gemini 3.8 Live Voice', desc: 'Low-latency bidirectional WebSocket voice conversation', icon: Radio, color: 'text-red-400', badge: 'WebSockets' },
      { id: 'vault', title: 'Firestore Sovereign Vault', desc: 'Real-time artifacts, media records, dossiers & provenance', icon: Archive, color: 'text-zinc-300', badge: `${artifacts.length} Items` },
      { id: 'scratchpad', title: 'Infinite Memory Scratchpad', desc: 'Permanent working memory & semantic vector cache with zero tokens burned', icon: FileText, color: 'text-teal-400', badge: 'Infinite' },
      { id: 'hitl', title: 'Human-In-The-Loop Workflows', desc: 'Live governance from JHammerZ.github.io governed by UID 0 & HFID', icon: UserCheck, color: 'text-amber-400', badge: 'Gatekeeper' },
      { id: 'github', title: 'GitHub Sovereign Ingestion', desc: 'Repositories status, endpoints latency monitor & commits', icon: FolderGit2, color: 'text-amber-400', badge: 'Active' },
      { id: 'osint', title: 'OSINT & Attack Surface Deck', desc: 'Passive external perimeter reconnaissance, DNS/mail defense, TLS SANs & RFC 9116 audit', icon: Search, color: 'text-cyan-400', badge: 'OWASP' },
      { id: 'burner-mail', title: 'Sovereign Burner Email Matrix', desc: 'Unlimited real disposable inboxes, instant OTP extraction, and automated link verification', icon: Mail, color: 'text-amber-400', badge: 'Burner' },
      { id: 'projects', title: 'Unified Projects Orchestrator', desc: 'Consolidate and merge all 8 sovereign repositories under Joshua Hamilton with Immutable seals', icon: FolderGit2, color: 'text-amber-400', badge: '17.8k Commits' },
      { id: 'functions', title: 'Function Deck & Toolbelt', desc: '12+ instant browser utilities (Base64, JSON, Regex, Hash, Passwords, UUIDs)', icon: Zap, color: 'text-rose-400', badge: '12 Tools' },
      { id: 'drive', title: 'Google Drive Storage', desc: 'Browse, view, create, and manage files in Google Drive with OAuth 2.0', icon: HardDrive, color: 'text-amber-400', badge: 'Drive' },
      { id: 'knowledge-graph', title: 'Autonomous Memory Knowledge Graph', desc: 'Living interactive knowledge topology & session consolidation', icon: Network, color: 'text-amber-400', badge: 'Graph' },
      { id: 'tool-shed', title: 'Dynamic Micro-Tool Shed', desc: 'On-the-fly AI tool generator & client JS sandbox runner', icon: Wrench, color: 'text-emerald-400', badge: 'Sandbox' },
      { id: 'autonomy-supervisor', title: 'Expanded Runtime Autonomy Supervisor', desc: 'Proactive background scratchpad de-cluttering & diagnostic pulse', icon: Activity, color: 'text-cyan-400', badge: 'Autonomy' },
    ];

    for (const m of modulesConfig) {
      list.push({
        id: `mod-${m.id}`,
        category: 'Modules',
        title: m.title,
        description: m.desc,
        icon: m.icon,
        color: m.color,
        badge: m.badge,
        action: () => {
          onSelectModule(m.id);
          onClose();
        }
      });
    }

    // 2. Sovereign Actions & Autonomous Self-Continuity Engine
    list.push({
      id: 'act-open-system-manual',
      category: 'Sovereign Actions',
      title: 'Open System Manual & README (Step-by-Step Guide)',
      description: 'Complete user guide explaining every function, how to use it, and beginner-proof instructions',
      icon: BookOpen,
      color: 'text-amber-300 font-bold',
      badge: 'Manual',
      action: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('open-system-manual'));
      }
    });

    list.push({
      id: 'act-super-agent-teraflop',
      category: 'Sovereign Actions',
      title: 'Engage Teraflop-Ω Super Agent Matrix',
      description: '4,096 GFLOPS ahead compute substrate with flawless GitHub schemas and quantum speculative decoding',
      icon: Zap,
      color: 'text-amber-400 font-bold',
      badge: '4,096 GFLOPS',
      action: () => {
        onSelectModule('chat');
        onClose();
      }
    });

    list.push({
      id: 'act-heo-orchestrate',
      category: 'Sovereign Actions',
      title: 'Execute HEO Schema (High Efficiency Orchestration v4.2)',
      description: 'Zero-overhead task dispatch and state transition validation across edge nodes',
      icon: Terminal,
      color: 'text-amber-300 font-semibold',
      badge: 'Modular Architecture',
      action: () => {
        fetch('/api/super-agent/schema-execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ protocol: 'HEO', action: 'PALETTE_ORCHESTRATE' })
        }).catch(() => {});
        onSelectModule('chat');
        onClose();
      }
    });

    list.push({
      id: 'act-hfid-attest',
      category: 'Sovereign Actions',
      title: 'Execute HFID Schema (Zero-Volatility Consensus 100/100)',
      description: 'UID 0 root provenance, Immutable hash ledger and System Proof attestation',
      icon: ShieldAlert,
      color: 'text-emerald-400 font-semibold',
      badge: 'HFID Attest',
      action: () => {
        fetch('/api/super-agent/schema-execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ protocol: 'HFID', action: 'PALETTE_PROVENANCE' })
        }).catch(() => {});
        onSelectModule('chat');
        onClose();
      }
    });

    list.push({
      id: 'act-eng-continuity',
      category: 'Sovereign Actions',
      title: 'Engage Autonomous Sovereign Engineering Core',
      description: 'Zero-token self-continuity engine: performs static audits, code generation & tasks without blocking',
      icon: Cpu,
      color: 'text-amber-400 font-bold',
      badge: '0-Tokens Unlimited',
      action: () => {
        if (onTriggerEngineeringEngine) onTriggerEngineeringEngine();
        onSelectModule('war-room');
        onClose();
      }
    });

    list.push({
      id: 'act-new-ghost-tab',
      category: 'Browser & Media',
      title: 'Launch Ghost / Stealth Browser Tab',
      description: 'Zero cookie footprint, randomized canvas fingerprint & Tor-style proxy routing',
      icon: Shield,
      color: 'text-emerald-400',
      badge: 'Anonymous',
      action: () => {
        onSelectModule('browser');
        onNavigateUrlInBrowser('sovereign://newtab');
        onClose();
      }
    });

    list.push({
      id: 'act-lofi-stream',
      category: 'Browser & Media',
      title: 'Play 24/7 Lofi Stream in Sovereign Player',
      description: 'Continuous background HD audio & video playback pipeline',
      icon: Play,
      color: 'text-red-400',
      badge: 'Ultra Video',
      action: () => {
        onSelectModule('browser');
        onNavigateUrlInBrowser('https://www.youtube.com/watch?v=jfKfPfyJRdk');
        onClose();
      }
    });

    list.push({
      id: 'act-synth-radio',
      category: 'Browser & Media',
      title: 'Stream DEFCON Cyber Radio',
      description: 'High-fidelity 24/7 stream (Music for Hackers) directly through audio engine',
      icon: Music,
      color: 'text-fuchsia-400',
      badge: 'Stereo Stream',
      action: () => {
        onSelectModule('browser');
        onNavigateUrlInBrowser('https://ice1.somafm.com/defcon-128-mp3');
        onClose();
      }
    });

    // 3. Vault Artifacts (User's real stored items)
    for (const art of artifacts) {
      list.push({
        id: `art-${art.id}`,
        category: 'Vault Artifacts',
        title: art.title || 'Untitled Artifact',
        description: `${art.type.toUpperCase()} • ${art.model || 'Aurelius'} • ${art.prompt.slice(0, 80)}`,
        icon: art.type === 'music' ? Music : art.type === 'video' ? Video : art.type === 'image' ? ImageIcon : FileTextIcon,
        color: 'text-amber-300',
        badge: art.type.toUpperCase(),
        action: () => {
          onSelectModule('vault');
          onClose();
        }
      });
    }

    // 4. GitHub Repositories
    for (const repo of githubRepos) {
      list.push({
        id: `repo-${repo.name}`,
        category: 'GitHub Repositories',
        title: repo.name,
        description: `${repo.desc} (${repo.stars} ⭐)`,
        icon: FolderGit2,
        color: 'text-sky-300',
        badge: 'GitHub',
        action: () => {
          onSelectModule('browser');
          onNavigateUrlInBrowser(repo.url);
          onClose();
        }
      });
    }

    return list;
  }, [artifacts, githubRepos, onSelectModule, onClose, onNavigateUrlInBrowser, onTriggerEngineeringEngine]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase().trim();
    return allCommands.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.badge && c.badge.toLowerCase().includes(q))
    );
  }, [allCommands, query]);

  // Reset selectedIndex when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Group filtered results by Category
  const groupedCategories = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filteredCommands) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredCommands]);

  if (!isOpen) return null;

  let flatCounter = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-zinc-950/80 backdrop-blur-md transition-all animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Command Modal Card */}
      <div 
        className="relative w-full max-w-2xl bg-zinc-900/95 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] z-10 text-zinc-100 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-950/70">
          <Search className="w-5 h-5 text-amber-400 shrink-0 mr-3 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all modules, vault artifacts, GitHub repos, or type a command... (Ctrl+K)"
            className="w-full bg-transparent border-none text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 text-[10px] font-mono text-zinc-400 border border-zinc-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[58vh] scrollbar-thin scrollbar-thumb-zinc-700"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-14 text-center">
              <Command className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-300">No matching commands, artifacts, or repositories found.</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for "browser", "war room", "youtube", "zenodo", or "image".</p>
            </div>
          ) : (
            Object.entries(groupedCategories).map(([categoryName, items]) => (
              <div key={categoryName} className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center justify-between">
                  <span>{categoryName}</span>
                  <span className="text-[10px] bg-zinc-800/60 px-1.5 py-0.5 rounded text-zinc-400">{items.length}</span>
                </div>

                <div className="space-y-1">
                  {items.map((item) => {
                    flatCounter++;
                    const currentFlatIndex = flatCounter;
                    const isSelected = currentFlatIndex === selectedIndex;
                    const IconComponent = item.icon || Sparkles;

                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(currentFlatIndex)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-amber-500/15 border border-amber-500/30 text-white shadow-sm' 
                            : 'hover:bg-zinc-800/70 border border-transparent text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <div className={`p-2 rounded-lg bg-zinc-800/90 ${item.color || 'text-zinc-300'} shrink-0 group-hover:scale-105 transition-transform`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-2">
                              <span>{item.title}</span>
                              {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                                  isSelected 
                                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                              {item.description}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isSelected && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-400 font-mono font-medium">
                              <span>Select</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">↵</kbd> Execute
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">ESC</kbd> Close
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-400/80">
            <Sparkles className="w-3 h-3" />
            <span>AURELIUS UNIFIED INDEX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fallback icon helper
function FileTextIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}
