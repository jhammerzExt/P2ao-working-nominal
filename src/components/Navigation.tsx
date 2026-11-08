import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  MapPin, 
  Music, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  Radio, 
  Archive,
  FolderGit2,
  ShieldAlert,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  FileText,
  UserCheck,
  Eye,
  Cpu,
  Database,
  Terminal,
  Activity,
  Layers,
  Zap,
  CheckCircle2,
  Smartphone,
  Mail,
  Grid,
  X,
  ChevronRight,
  Filter,
  BookmarkPlus,
  Package,
  HardDrive,
  Network,
  Wrench,
  Download
} from 'lucide-react';
import type { ModuleType } from '../types';

interface NavigationProps {
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  artifactCount?: number;
}

type CategoryType = 'all' | 'command' | 'creative' | 'intelligence' | 'data';

export interface SubAgentStatus {
  id: 'vision' | 'logic' | 'memory' | 'audio' | 'grounding' | 'kernel';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'IDLE' | 'PROCESSING' | 'SYNCHRONIZED' | 'STANDBY';
  currentTask: string;
  loadPct: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface TabItem {
  id: ModuleType;
  label: string;
  category: 'command' | 'creative' | 'intelligence' | 'data';
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  activeBg: string;
  description: string;
  badge?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeModule, 
  onSelectModule,
  artifactCount = 0 
}) => {
  const [showAllModulesModal, setShowAllModulesModal] = useState<boolean>(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState<boolean>(false);
  const [moduleSearchQuery, setModuleSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [tick, setTick] = useState<number>(0);

  // Sub-Agents reactive status
  const [subAgents, setSubAgents] = useState<SubAgentStatus[]>([
    {
      id: 'vision',
      name: 'Vision Sub-Agent',
      icon: Eye,
      status: 'IDLE',
      currentTask: 'Spatial stream observer',
      loadPct: 12,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'logic',
      name: 'Logic Sub-Agent',
      icon: Cpu,
      status: 'SYNCHRONIZED',
      currentTask: 'Swarm consensus nominal',
      loadPct: 48,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'memory',
      name: 'Memory Sub-Agent',
      icon: Database,
      status: 'SYNCHRONIZED',
      currentTask: 'Immutable provenance sealed',
      loadPct: 24,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30'
    },
    {
      id: 'audio',
      name: 'Audio Sub-Agent',
      icon: Radio,
      status: 'IDLE',
      currentTask: 'Acoustic pipeline armed',
      loadPct: 8,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30'
    },
    {
      id: 'grounding',
      name: 'Grounding Sub-Agent',
      icon: Search,
      status: 'IDLE',
      currentTask: 'Open-web proxy ready',
      loadPct: 16,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'kernel',
      name: 'Kernel God-Node',
      icon: Terminal,
      status: 'SYNCHRONIZED',
      currentTask: 'Core-Level Hypervisor active',
      loadPct: 35,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/30'
    }
  ]);

  // Background activity heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSubAgents(prev => prev.map(agent => {
      let isBusy = false;
      let task = agent.currentTask;
      let status: 'IDLE' | 'PROCESSING' | 'SYNCHRONIZED' | 'STANDBY' = 'SYNCHRONIZED';
      let load = Math.floor(Math.random() * 20) + 15;

      if (agent.id === 'vision') {
        if (activeModule === 'image' || activeModule === 'video') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Veo/Imagen neural diffusion pass';
          load = 88;
        } else if (activeModule === 'browser') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Open-web DOM screenshot & OCR';
          load = 64;
        } else {
          status = 'STANDBY';
          task = 'Recursive spatial training';
          load = 22;
        }
      } else if (agent.id === 'logic') {
        if (activeModule === 'war-room' || activeModule === 'chat' || activeModule === 'hitl') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Tensor reasoning & DeepThink';
          load = 92;
        } else {
          status = 'SYNCHRONIZED';
          task = '32-branch reasoning trees';
          load = 34;
        }
      } else if (agent.id === 'memory') {
        if (activeModule === 'vault' || activeModule === 'scratchpad' || activeModule === 'github') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Axiom crystallization';
          load = 82;
        } else {
          status = 'SYNCHRONIZED';
          task = 'Permanent axiom indexing';
          load = 28;
        }
      } else if (agent.id === 'audio') {
        if (activeModule === 'music' || activeModule === 'transcribe' || activeModule === 'live') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Lyria & Live PCM 24kHz stream';
          load = 76;
        } else {
          status = 'STANDBY';
          task = 'Harmonic polyphony synthesis';
          load = 18;
        }
      } else if (agent.id === 'grounding') {
        if (activeModule === 'search' || activeModule === 'maps' || activeModule === 'browser') {
          isBusy = true;
          status = 'PROCESSING';
          task = 'Open-web crawler scraping';
          load = 74;
        } else {
          status = 'STANDBY';
          task = 'Substrate web alignment';
          load = 20;
        }
      } else if (agent.id === 'kernel') {
        status = 'SYNCHRONIZED';
        task = 'Core-Level bare-metal 0.08ms';
        load = 32;
      }

      return {
        ...agent,
        status,
        currentTask: task,
        loadPct: load
      };
    }));
  }, [activeModule, tick]);

  // All 19 modules completely preserved and categorized
  const allTabs: TabItem[] = [
    {
      id: 'chat',
      label: 'Sovereign Chat',
      category: 'command',
      icon: MessageSquare,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Premier Chat-First interface with all open-source models, agent wardrobe & tools'
    },
    {
      id: 'browser',
      label: 'Open-Web Browser',
      category: 'command',
      icon: Globe,
      accentColor: 'text-sky-400',
      activeBg: 'bg-sky-500/15 border-sky-500/40 text-sky-200',
      description: 'Full-spectrum open-web search, DuckDuckGo HTML scraping & autonomous agent learn'
    },
    {
      id: 'termux',
      label: 'Termux Android',
      category: 'command',
      icon: Smartphone,
      accentColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      description: 'One-shot installer script & local llama-server on phone (127.0.0.1:8080)'
    },
    {
      id: 'projects',
      label: 'Unified Projects',
      category: 'command',
      icon: FolderGit2,
      accentColor: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200',
      description: 'Workspace files, multi-file editor, and compilation tools'
    },
    {
      id: 'war-room',
      label: 'PC War Room',
      category: 'command',
      icon: ShieldAlert,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Multi-screen sovereign cockpit & operational situational matrix'
    },
    {
      id: 'osint',
      label: 'OSINT & Attack Surface',
      category: 'command',
      icon: ShieldAlert,
      accentColor: 'text-rose-400',
      activeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-200',
      description: 'Comprehensive digital footprint scanning & threat intelligence'
    },
    {
      id: 'burner-mail',
      label: 'Burner Mail Matrix',
      category: 'command',
      icon: Mail,
      accentColor: 'text-teal-400',
      activeBg: 'bg-teal-500/15 border-teal-500/40 text-teal-200',
      description: 'Disposable temporary email inboxes with zero tracking'
    },
    {
      id: 'functions',
      label: 'Function Deck',
      category: 'command',
      icon: Zap,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Zero-token autonomous tool execution & agent toolbelt'
    },
    {
      id: 'hitl',
      label: 'HITL Workflows',
      category: 'command',
      icon: UserCheck,
      accentColor: 'text-indigo-400',
      activeBg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200',
      description: 'Human-in-the-loop validation, approval gates & verification checkpoints'
    },
    {
      id: 'image',
      label: 'Visual Studio',
      category: 'creative',
      icon: ImageIcon,
      accentColor: 'text-purple-400',
      activeBg: 'bg-purple-500/15 border-purple-500/40 text-purple-200',
      description: 'High-res image generation with offline procedural Canvas/SVG synthesis'
    },
    {
      id: 'music',
      label: 'Lyria Music',
      category: 'creative',
      icon: Music,
      accentColor: 'text-fuchsia-400',
      activeBg: 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-200',
      description: 'Audio & soundtrack composer with offline Web Audio polyphonic synthesizer'
    },
    {
      id: 'video',
      label: 'Veo 3 Motion',
      category: 'creative',
      icon: Video,
      accentColor: 'text-rose-400',
      activeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-200',
      description: 'Cinematic motion video generator with procedural render'
    },
    {
      id: 'live',
      label: 'Live Voice',
      category: 'intelligence',
      icon: Radio,
      accentColor: 'text-red-400',
      activeBg: 'bg-red-500/15 border-red-500/40 text-red-200',
      description: 'Bidirectional real-time voice streaming bridge'
    },
    {
      id: 'transcribe',
      label: 'Transcribe',
      category: 'intelligence',
      icon: Mic,
      accentColor: 'text-teal-400',
      activeBg: 'bg-teal-500/15 border-teal-500/40 text-teal-200',
      description: 'Phonetic audio intake & high-accuracy speech transcription'
    },
    {
      id: 'search',
      label: 'Search Grounding',
      category: 'intelligence',
      icon: Search,
      accentColor: 'text-sky-400',
      activeBg: 'bg-sky-500/15 border-sky-500/40 text-sky-200',
      description: 'Live search grounding & real-time verified citations'
    },
    {
      id: 'maps',
      label: 'Maps Grounding',
      category: 'intelligence',
      icon: MapPin,
      accentColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      description: 'Spatial & location geospatial intelligence grounding'
    },
    {
      id: 'scratchpad',
      label: 'Infinite Scratchpad',
      category: 'data',
      icon: FileText,
      accentColor: 'text-teal-400',
      activeBg: 'bg-teal-500/15 border-teal-500/40 text-teal-200',
      description: 'Working memory, semantic cache & architectural scratch notes'
    },
    {
      id: 'vault',
      label: 'Vault Storage',
      category: 'data',
      icon: Archive,
      accentColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      description: 'Persistent encrypted artifact storage & forensic ledger',
      badge: artifactCount > 0 ? artifactCount : undefined
    },
    {
      id: 'presets',
      label: 'Prompt Presets',
      category: 'command',
      icon: BookmarkPlus,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Curated architectural directives, code reviews & creative instruction templates'
    },
    {
      id: 'audit',
      label: 'Forensic Ledger',
      category: 'data',
      icon: ShieldCheck,
      accentColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      description: 'Immutable execution audit trail & forensic memory ledger'
    },
    {
      id: 'swarm-test',
      label: 'Swarm Diagnostic',
      category: 'command',
      icon: Activity,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Automated multi-agent verification of sovereign subsystems'
    },
    {
      id: 'github',
      label: 'GitHub Matrix',
      category: 'data',
      icon: FolderGit2,
      accentColor: 'text-orange-400',
      activeBg: 'bg-orange-500/15 border-orange-500/40 text-orange-200',
      description: 'JHammerZ repository telemetry, commits & schema provenance'
    },
    {
      id: 'packager',
      label: 'APK Packager',
      category: 'command',
      icon: Package,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Convert modules into standalone Android APK applications'
    },
    {
      id: 'drive',
      label: 'Google Drive',
      category: 'data',
      icon: HardDrive,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Cloud file management, document browsing, text editing & artifact export'
    },
    {
      id: 'knowledge-graph',
      label: 'Knowledge Graph',
      category: 'intelligence',
      icon: Network,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Autonomous session memory consolidation & interactive architectural knowledge graph'
    },
    {
      id: 'tool-shed',
      label: 'Micro-Tool Shed',
      category: 'command',
      icon: Wrench,
      accentColor: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
      description: 'On-the-fly AI micro-tool generator, JS sandbox runner & OSINT utilities'
    },
    {
      id: 'autonomy-supervisor',
      label: 'Autonomy Supervisor',
      category: 'command',
      icon: Activity,
      accentColor: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200',
      description: 'Expanded runtime autonomy, proactive scratchpad de-cluttering & diagnostic pulse'
    },
    {
      id: 'download-models',
      label: 'Model Wardrobe',
      category: 'data',
      icon: Download,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Download sovereign Lyrailius Omega weights & baked engines for offline use'
    },
    {
      id: 'universal-installer',
      label: 'Universal Installer',
      category: 'command',
      icon: Download,
      accentColor: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
      description: 'Download universal installer and cross-platform runner to run orchestrator on any device'
    }
  ];

  // Primary fast hubs pinned in the sleek desktop bar
  const primaryHubIds: ModuleType[] = ['chat', 'knowledge-graph', 'tool-shed', 'universal-installer', 'browser', 'termux', 'image', 'drive', 'projects', 'download-models'];
  const primaryHubs = primaryHubIds.map(id => allTabs.find(t => t.id === id)!).filter(Boolean);

  const filteredModalTabs = allTabs.filter(tab => {
    const matchesCategory = selectedCategory === 'all' || tab.category === selectedCategory;
    const matchesSearch = tab.label.toLowerCase().includes(moduleSearchQuery.toLowerCase()) || 
                          tab.description.toLowerCase().includes(moduleSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeTabMeta = allTabs.find(t => t.id === activeModule) || allTabs[0];

  return (
    <>
      {/* Sleek, Uncluttered Navigation Bar */}
      <nav className="border-t border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md px-3 sm:px-4 py-2 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Primary Hubs Switcher (Sleek single row, generous breathing room) */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {primaryHubs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModule === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectModule(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all border cursor-pointer shrink-0 ${
                    isActive
                      ? `${tab.activeBg} font-bold shadow-sm shadow-amber-500/10`
                      : 'bg-zinc-900/40 hover:bg-zinc-850 border-zinc-800/60 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? tab.accentColor : 'text-zinc-500'}`} />
                  <span>{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}

            {/* "All 19 Modules" Mega-Launcher Button */}
            <button
              onClick={() => setShowAllModulesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 hover:brightness-110 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shrink-0 transition-all cursor-pointer shadow-sm"
              title="View all 19 Operational Modules"
            >
              <Grid className="w-3.5 h-3.5 text-amber-400" />
              <span>All Modules (20)</span>
              {artifactCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {artifactCount}
                </span>
              )}
            </button>
          </div>

          {/* Right: Sub-Agent Swarm Realtime Status Pill (Saves 80px of vertical space!) */}
          <button
            onClick={() => setShowTelemetryModal(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-amber-300 transition-all cursor-pointer shrink-0"
            title="Inspect 6 Sub-Agent telemetry & workload"
          >
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-semibold text-[11px]">
              6 Swarm Agents Synced
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Ergonomic Bottom App Bar (Only visible on small phones sm:hidden for easy 1-handed thumb usage) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around text-[10px] font-mono">
        <button
          onClick={() => onSelectModule('chat')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'chat' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => onSelectModule('browser')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'browser' ? 'text-sky-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Browser</span>
        </button>

        <button
          onClick={() => onSelectModule('termux')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'termux' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Termux</span>
        </button>

        <button
          onClick={() => onSelectModule('image')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeModule === 'image' || activeModule === 'music' || activeModule === 'video' ? 'text-purple-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => setShowAllModulesModal(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-amber-300 font-bold"
        >
          <Grid className="w-4 h-4 text-amber-400" />
          <span>More (20)</span>
        </button>
      </div>

      {/* All 19 Modules Spacious Drawer / Modal */}
      {showAllModulesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
            
            {/* Header & Search */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm flex items-center gap-2">
                    <span>Aurelius Operational Modules Directory</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      20 COMPLETE CAPABILITIES
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Select any subsystem to switch workspace view immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    placeholder="Search modules..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <button
                  onClick={() => setShowAllModulesModal(false)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 sm:px-6 pt-3 pb-1 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              {(['all', 'command', 'creative', 'intelligence', 'data'] as CategoryType[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                      : 'bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat === 'all' ? 'All (20)' : cat === 'command' ? 'Command & Web' : cat === 'creative' ? 'Creative Studio' : cat === 'intelligence' ? 'Sensory Intelligence' : 'Storage & Vault'}
                </button>
              ))}
            </div>

            {/* Grid of All 19 Modules */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredModalTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeModule === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onSelectModule(tab.id);
                      setShowAllModulesModal(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-98 cursor-pointer ${
                      isActive
                        ? `${tab.activeBg} shadow-md`
                        : 'bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800">
                          <Icon className={`w-4 h-4 ${tab.accentColor}`} />
                        </div>
                        <span className="font-bold text-zinc-100 text-xs">{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {tab.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/50 pt-2">
                      <span className="uppercase tracking-wider">{tab.category}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/60 text-[11px] text-zinc-400">
              <span>Aurelius Orchestrator v7.0.0-SOVEREIGN-APEX • Sovereign Matrix Edition</span>
              <button
                onClick={() => setShowAllModulesModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Agent Telemetry Details Modal */}
      {showTelemetryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-zinc-100">
                  SUB-AGENT CONCURRENT DATA PROCESSING MATRIX
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  ZERO TOKENS BURNED
                </span>
              </div>
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {subAgents.map(agent => {
                const Icon = agent.icon;
                return (
                  <div key={agent.id} className={`p-3 rounded-2xl border ${agent.bgColor} ${agent.borderColor} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon className={`w-4 h-4 ${agent.color}`} />
                        <span className="font-bold text-zinc-100">{agent.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        agent.status === 'PROCESSING'
                          ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                          : agent.status === 'SYNCHRONIZED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {agent.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-300 font-sans">
                      {agent.currentTask}
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Workload</span>
                        <span>{agent.loadPct}%</span>
                      </div>
                      <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${agent.loadPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end bg-zinc-900/60">
              <button
                onClick={() => setShowTelemetryModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
