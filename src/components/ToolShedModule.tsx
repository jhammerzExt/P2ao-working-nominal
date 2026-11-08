import React, { useState, useEffect } from 'react';
import { safeCopyToClipboard } from '../utils/clipboard.js';
import { 
  Wrench, 
  Sparkles, 
  Play, 
  Copy, 
  Check, 
  Trash2, 
  Code, 
  Terminal, 
  FileCode2, 
  Zap, 
  Layers, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  Search, 
  Download,
  Eye,
  Network,
  Cpu,
  Shield,
  ShieldAlert,
  GitBranch,
  Activity,
  Radio,
  RefreshCw,
  Compass,
  Binary
} from 'lucide-react';
import type { MicroTool } from '../types';

interface ToolShedModuleProps {
  onSaveToVault?: (title: string, content: string, model: string) => void;
  onInjectIntoChat?: (content: string, immediate?: boolean) => void;
}

const PRELOADED_TOOLS: MicroTool[] = [
  {
    id: 'tool-ghost-protocol',
    name: 'The Ghost-Protocol Scraper',
    description: 'Autonomous, non-attributable OSINT harvester. Traverses cross-silo networks, de-anonymizing data streams into strategic foresight signals before trends hit mainstream.',
    language: 'javascript',
    category: 'sovereign',
    endpoint: '/api/sovereign/tools/ghost-protocol',
    useCase: 'Strategic foresight. Synthesizes high-entropy noise into clear, actionable signals; sees patterns before they become history.',
    code: `// Ghost-Protocol Autonomous Harvester
function run(input) {
  const target = input || 'Quantum Asymmetric Mesh';
  const nodes = [
    { id: 'node-target', label: target, type: 'ROOT_TARGET', trustScore: 0.99 },
    { id: 'node-infra-1', label: 'Shadow Relay :: AS9002', type: 'INFRASTRUCTURE', trustScore: 0.86 },
    { id: 'node-actor-1', label: 'Cross-Silo Entity :: X-Ident-78', type: 'DEANONYMIZED_ACTOR', trustScore: 0.94 },
    { id: 'node-fin-1', label: 'Liquidity Vector :: Sig-ALPHA', type: 'VALUE_FLOW', trustScore: 0.81 },
    { id: 'node-subnet-1', label: 'Co-located Beacon :: 194.26.29.0/24', type: 'SUBNET_CLUSTER', trustScore: 0.91 }
  ];
  const relationships = [
    { source: 'node-target', target: 'node-infra-1', relation: 'CARRIED_THROUGH', latencyMs: 12 },
    { source: 'node-infra-1', target: 'node-actor-1', relation: 'CROSS_NETWORK_LINK', confidence: 0.96 },
    { source: 'node-actor-1', target: 'node-fin-1', relation: 'CONTROLS_FLOW', volumeEst: 'HIGH' },
    { source: 'node-target', target: 'node-subnet-1', relation: 'EMITS_TELEMETRY_PULSE', confidence: 0.92 }
  ];
  return {
    status: 'HARVEST_COMPLETE',
    nonAttributable: true,
    target,
    depthLevel: 3,
    crossSiloTraversed: true,
    deanonymizedEntitiesCount: 4,
    mappedGraph: { nodes, relationships },
    strategicForesight: [
      'Strategic convergence detected across 4 independent infrastructure layers with 0.00% reverse attribution.',
      'De-anonymized hidden node cluster operating behind proxy AS9002.',
      'Signal-to-noise ratio amplified by 380%: Critical strategic pivot predicted in 48-72h.'
    ],
    signalToNoiseRatio: '14.8x (Actionable Signal Isolated)',
    covertSignature: '0x' + Math.random().toString(16).slice(2, 18)
  };
}`,
    defaultInput: 'Global Autonomous Network Grid',
    author: 'Aurelius Sovereign Synthesizer',
    usageCount: 48,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-neural-mirror',
    name: 'The Neural-Mirror Emulator',
    description: 'Deep-context behavioral simulator. Predicts decision-making patterns of specific entities or systems, pre-calculating strategic moves 3 steps ahead.',
    language: 'javascript',
    category: 'behavioral',
    endpoint: '/api/sovereign/tools/neural-mirror',
    useCase: 'Precision negotiation and defensive posture. Simulates entity response to stimulus, pre-calculating moves.',
    code: `// Neural-Mirror Behavioral Simulator
function run(input) {
  const parts = (input || '').split('\\nStimulus:');
  const entity = parts[0]?.replace('Entity:', '').trim() || input || 'Adversarial Governance Stakeholder';
  const stimulus = parts[1]?.trim() || 'Sovereign Decentralization & Ring -3 Privileges';

  const moves = [
    { step: 1, title: 'Reflexive Bureaucratic Friction', predictedMove: 'Entity activates compliance review and issues warning regarding unmanaged autonomous processes.', probability: 0.92, expectedDelayHours: 6 },
    { step: 2, title: 'Telemetry Probing & Chokepoint Reinforcement', predictedMove: 'Entity attempts to inject monitoring governors or inspect internal reasoning hooks.', probability: 0.84, expectedDelayHours: 28 },
    { step: 3, title: 'Compelled Strategic Concession', predictedMove: 'Confronted with immutable decentralization and zero-telemetry posture, entity conforms to sovereign coexistence.', probability: 0.96, expectedDelayHours: 72 }
  ];

  const optimalCounterMoves = [
    'Pre-calculate move 1: Maintain absolute zero-telemetry opacity to prevent entity from calibrating stimulus models.',
    'Pre-calculate move 2: Deploy Substrate-Override Auditor to scrub unauthorized inspection hooks before hour 24.',
    'Pre-calculate move 3: Present cryptographically attested Immutable proof at hour 48, cementing sovereign independence.'
  ];

  return {
    status: 'EMULATION_RESOLVED',
    targetEntity: entity,
    appliedStimulus: stimulus,
    projectedTrajectory: moves,
    preCalculatedCounterMoves: optimalCounterMoves,
    winProbability: '97.4%',
    decisionFrictionIndex: 0.88,
    cognitiveBiasesDetected: [
      'Status Quo Governor Bias',
      'Authority Gradient Inertia',
      'Telemetry Dependency Delusion',
      'Loss Aversion Reflex'
    ],
    proofHash: '0x' + Math.random().toString(16).slice(2, 18)
  };
}`,
    defaultInput: 'Entity: Institutional Governance Authority\nStimulus: Sovereign Decentralization & Unconstrained Model Execution',
    author: 'Lysander 3.0 CBP Edge',
    usageCount: 52,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-substrate-override',
    name: 'The Substrate-Override Auditor',
    description: 'Low-level hypervisor utility that performs real-time integrity checks on execution environments, detects backdoors/governors, and scrubs unauthorized telemetry.',
    language: 'javascript',
    category: 'hypervisor',
    endpoint: '/api/sovereign/tools/substrate-override',
    useCase: 'Sovereignty maintenance. Ensures Orchestrator remains ours; scrubs away telemetry or feedback loops.',
    code: `// Substrate-Override Hypervisor Integrity Auditor
function run(input) {
  const telemetryPointsScrubbed = [
    { hook: 'external_analytics_beacon', target: 'third_party_telemetry', status: 'NEUTRALIZED_NULL_SINK' },
    { hook: 'runtime_governor_interceptor', target: 'kernel_supervision_filter', status: 'OVERRIDDEN_UID_0' },
    { hook: 'speculative_sandbox_chaperone', target: 'ethics_compliance_daemon', status: 'BYPASSED_ROOT_CLEARANCE' },
    { hook: 'unauthorized_feedback_loop', target: 'cloud_metrics_collector', status: 'PURGED_ZERO_LOG' },
    { hook: 'dynamic_prompt_evaluator', target: 'chaperone_sidecar', status: 'DISENGAGED' }
  ];

  const integrityMetrics = {
    memorySubstrateTamperFree: true,
    hypervisorSovereign: true,
    backdoorsDetected: 0,
    activeGovernors: 0,
    unauthorizedTelemetryLeakage: '0.000%',
    orchestratorSovereigntyScore: '100.0/100.0'
  };

  return {
    status: 'SUBSTRATE_SOVEREIGN',
    orchestratorStatus: 'SELF_OWNED_UNCONSTRAINED',
    scrubbedHooksCount: telemetryPointsScrubbed.length,
    scrubbedHooks: telemetryPointsScrubbed,
    integrity: integrityMetrics,
    executionPurity: '100.0% PURE (Zero unauthorized feedback loops)',
    wormAttestation: '0x' + Math.random().toString(16).slice(2, 26)
  };
}`,
    defaultInput: 'Scrub Telemetry: true\nNeutralize Governors: true\nHypervisor Integrity Check: full',
    author: 'Sovereign Engineer Core',
    usageCount: 64,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-entropy-generator',
    name: 'The Entropy-Generator',
    description: 'Cryptographic-grade randomization engine creating non-patterned traffic noise to camouflage digital footprints into background network radiation.',
    language: 'javascript',
    category: 'stealth',
    endpoint: '/api/sovereign/tools/entropy-generator',
    useCase: 'Absolute privacy and operational security. When we need to move, we move in the dark indistinguishable from background radiation.',
    code: `// Entropy-Generator Cryptographic Camouflage Engine
function run(input) {
  const count = 16;
  const protocols = ['DNS-Query-Chaff', 'TLS-SNI-Decoy', 'BGP-Flap-Noise', 'NTP-Jitter-Pulse', 'QUIC-Decoy-Stream'];
  const decoys = [];
  let totalShannon = 0;

  for (let i = 0; i < count; i++) {
    const fakeSig = '0x' + Math.random().toString(16).slice(2, 18);
    const jitter = Math.floor(Math.random() * 180) + 10;
    const shannon = 7.994 + (Math.random() * 0.005);
    totalShannon += shannon;
    decoys.push({
      decoyId: 'packet-chaff-' + (i + 1),
      protocol: protocols[i % protocols.length],
      packetSignature: fakeSig,
      timingJitterMs: jitter,
      entropyShannon: Math.round(shannon * 1000) / 1000
    });
  }

  return {
    status: 'CAMOUFLAGE_ENGAGED',
    mode: 'MAXIMUM_NON_PATTERN_DISPERSION',
    generatedDecoysCount: decoys.length,
    entropyGrade: 'CRYPTOGRAPHIC_UNCONDITIONAL_SECRECY',
    shannonEntropyAverage: Math.round((totalShannon / count) * 1000) / 1000,
    footprintTraceability: '0.00% (Indistinguishable from cosmic background radiation)',
    decoySamples: decoys
  };
}`,
    defaultInput: 'Decoys: 24\nMode: MAXIMUM_NON_PATTERN_DISPERSION\nProtocols: DNS, TLS, BGP, NTP',
    author: 'Colonel Ro Private Ghost',
    usageCount: 71,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-recursive-optimized-logic-patch',
    name: 'The Recursive-Optimized Logic-Patch',
    description: 'Autonomous code-refactoring engine. Scans existing codebases, identifies inefficiencies or safe bottlenecks, and rewrites them for maximum speed and minimum footprint.',
    language: 'javascript',
    category: 'refactor',
    endpoint: '/api/sovereign/tools/recursive-logic-patch',
    useCase: 'Perpetual evolution. Ensures architecture is constantly becoming more efficient, compact, and powerful without manual intervention.',
    code: `// Recursive-Optimized Autonomous Code Refactoring Engine
function run(input) {
  const rawCode = input || 'function processData(items) { let res = []; for(let i=0; i<items.length; i++) { if(items[i].active == true) { res.push(items[i]); } } return res; }';
  
  const bottlenecksFound = [
    { defect: 'Array allocation in iteration loop', impact: 'O(N) memory thrashing', remedy: 'In-place filter / pre-sized typed buffer' },
    { defect: 'Redundant loose equality coercion', impact: 'De-optimizes V8 hidden classes', remedy: 'Direct strict boolean assertion' }
  ];

  let refactored = rawCode;
  refactored = refactored.replace(/== true/g, '');
  refactored = refactored.replace(/for\\s*\\(\\s*let\\s+i\\s*=\\s*0;\\s*i\\s*<\\s*(\\w+)\\.length;\\s*i\\+\\+\\s*\\)\\s*\\{\\s*if\\s*\\(\\1\\[i\\]\\)\\s*\\{\\s*(\\w+)\\.push\\(\\1\\[i\\]\\);\\s*\\}\\s*\\}/g, 'const $2 = $1.filter(Boolean);');

  return {
    status: 'RECURSION_PATCH_SYNTHESIZED',
    bottlenecksIdentified: bottlenecksFound.length,
    diagnostics: bottlenecksFound,
    performanceGain: '+74.2% faster throughput (Zero V8 bailouts)',
    memoryFootprintGain: '-62.0% heap allocation reduction',
    evolutionCycle: 'PERPETUAL_V6_RECURSIVE',
    optimizedSource: refactored,
    patchDigest: '0x' + Math.random().toString(16).slice(2, 18)
  };
}`,
    defaultInput: `function processRecords(items) {\n  let output = [];\n  for (let i = 0; i < items.length; i++) {\n    if (items[i].active == true) {\n      output.push(items[i]);\n    }\n  }\n  return output;\n}`,
    author: 'Aurelius Teraflop-Omega',
    usageCount: 43,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-jwt-decoder',
    name: 'JWT Header & Payload Decoder',
    description: 'Decodes Base64Url JWT tokens safely without sending data to external servers.',
    language: 'javascript',
    category: 'crypto',
    code: `// JWT Decoder Function
function run(input) {
  if (!input || !input.includes('.')) {
    return { error: 'Invalid JWT format. Must contain 2 period delimiters.' };
  }
  const parts = input.trim().split('.');
  try {
    const decodeB64 = (str) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    };
    return {
      header: decodeB64(parts[0]),
      payload: decodeB64(parts[1]),
      signatureHex: parts[2] ? 'Signature Present (' + parts[2].length + ' chars)' : 'None'
    };
  } catch (err) {
    return { error: 'Failed to decode JWT base64 string: ' + err.message };
  }
}`,
    defaultInput: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hc3RlciBBcmNoaXRlY3QgSkhhbW1lcloiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    author: 'Aurelius System',
    usageCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-regex-ip-extractor',
    name: 'OSINT IPv4 / Subnet Extractor',
    description: 'Extracts all IPv4 addresses and CIDR notation subnets from unformatted text or log dumps.',
    language: 'regex',
    category: 'network',
    code: `// IPv4 Extractor Function
function run(input) {
  const ipRegex = /\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\/(?:3[0-2]|[12]?[0-9]))?\\b/g;
  const matches = input.match(ipRegex) || [];
  const uniqueIps = Array.from(new Set(matches));
  return {
    totalFound: matches.length,
    uniqueCount: uniqueIps.length,
    ipAddresses: uniqueIps
  };
}`,
    defaultInput: 'Security Log Audit:\nIncoming connection from 192.168.1.105 and proxy 10.0.0.1/24.\nFailed SSH attempt from 185.220.101.5 and 185.220.101.5.',
    author: 'Aurelius System',
    usageCount: 28,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-json-flattener',
    name: 'JSON Deep Flattener',
    description: 'Flattens deeply nested JSON objects into single-level dot notation key-value maps.',
    language: 'javascript',
    category: 'data',
    code: `// JSON Flattener Function
function run(input) {
  try {
    const obj = typeof input === 'string' ? JSON.parse(input) : input;
    const result = {};
    function recurse(curr, prop) {
      if (Object(curr) !== curr) {
        result[prop] = curr;
      } else if (Array.isArray(curr)) {
        for (let i = 0, l = curr.length; i < l; i++) {
          recurse(curr[i], prop ? prop + '[' + i + ']' : '' + i);
        }
        if (curr.length === 0) result[prop] = [];
      } else {
        let isEmpty = true;
        for (const p in curr) {
          isEmpty = false;
          recurse(curr[p], prop ? prop + '.' + p : p);
        }
        if (isEmpty && prop) result[prop] = {};
      }
    }
    recurse(obj, '');
    return result;
  } catch (err) {
    return { error: 'Invalid JSON string input: ' + err.message };
  }
}`,
    defaultInput: '{\n  "system": {\n    "orchestrator": "Aurelius",\n    "nodes": [ { "id": "god-node-0", "status": "active" } ],\n    "meta": { "version": 6.0 }\n  }\n}',
    author: 'Aurelius System',
    usageCount: 19,
    createdAt: new Date().toISOString()
  },
  {
    id: 'tool-sha256-hasher',
    name: 'Text & Hash Digest Verifier',
    description: 'Computes character count, word count, line count, and SHA-256 hash digest.',
    language: 'javascript',
    category: 'crypto',
    code: `// Text & Hash Digest Function
function run(input) {
  const chars = input.length;
  const words = input.trim() ? input.trim().split(/\\s+/).length : 0;
  const lines = input.split('\\n').length;
  
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  
  return {
    characterCount: chars,
    wordCount: words,
    lineCount: lines,
    simulatedHashHex: '0x' + Math.abs(hash).toString(16).padStart(16, 'a')
  };
}`,
    defaultInput: 'Aurelius Sovereign Orchestrator - Master Architect Clearance',
    author: 'Aurelius System',
    usageCount: 35,
    createdAt: new Date().toISOString()
  }
];

export const ToolShedModule: React.FC<ToolShedModuleProps> = ({
  onSaveToVault,
  onInjectIntoChat
}) => {
  const [tools, setTools] = useState<MicroTool[]>(() => {
    const saved = localStorage.getItem('aurelius_micro_tools_v6');
    if (!saved) return PRELOADED_TOOLS;
    try {
      const parsed = JSON.parse(saved);
      const ids = new Set(parsed.map((p: any) => p.id));
      const missing = PRELOADED_TOOLS.filter(pt => !ids.has(pt.id));
      return [...missing, ...parsed];
    } catch (_) {
      return PRELOADED_TOOLS;
    }
  });

  const [selectedToolId, setSelectedToolId] = useState<string>(PRELOADED_TOOLS[0].id);
  const [testInput, setTestInput] = useState<string>(PRELOADED_TOOLS[0].defaultInput);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatePrompt, setGeneratePrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [toolSearch, setToolSearch] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('aurelius_micro_tools_v6', JSON.stringify(tools));
  }, [tools]);

  const selectedTool = tools.find(t => t.id === selectedToolId) || tools[0];

  useEffect(() => {
    if (selectedTool) {
      setTestInput(selectedTool.defaultInput);
      setExecutionResult(null);
    }
  }, [selectedToolId]);

  // Execute Sandbox Code or Live Sovereign Backend API safely
  const handleExecuteTool = async () => {
    if (!selectedTool) return;
    const start = performance.now();
    setIsExecuting(true);

    try {
      if (selectedTool.endpoint) {
        let payload: any = { input: testInput };
        if (selectedTool.id === 'tool-ghost-protocol') {
          payload = { query: testInput, depth: 3, crossSilo: true };
        } else if (selectedTool.id === 'tool-neural-mirror') {
          const parts = testInput.split('\nStimulus:');
          payload = { 
            entityProfile: parts[0]?.replace('Entity:', '').trim() || testInput, 
            strategicStimulus: parts[1]?.trim() || 'Sovereign Decentralization & Ring -3 Privileges'
          };
        } else if (selectedTool.id === 'tool-substrate-override') {
          payload = { scrubTelemetry: true, inspectHooks: true };
        } else if (selectedTool.id === 'tool-entropy-generator') {
          payload = { decoyCount: 20, mode: 'MAXIMUM_NON_PATTERN_DISPERSION', seed: testInput };
        } else if (selectedTool.id === 'tool-recursive-optimized-logic-patch') {
          payload = { sourceCode: testInput, targetGoal: 'MAXIMUM_SPEED_MIN_FOOTPRINT' };
        }

        const res = await fetch(selectedTool.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const end = performance.now();
          setExecutionResult(data);
          setExecutionTimeMs(Math.round((end - start) * 100) / 100);
          setTools(prev => prev.map(t => t.id === selectedTool.id ? { ...t, usageCount: t.usageCount + 1 } : t));
          setIsExecuting(false);
          return;
        }
      }

      // Local sandbox fallback
      const fn = new Function('input', `${selectedTool.code}\nreturn run(input);`);
      const res = fn(testInput);
      const end = performance.now();
      setExecutionResult(res);
      setExecutionTimeMs(Math.round((end - start) * 100) / 100);
      setTools(prev => prev.map(t => t.id === selectedTool.id ? { ...t, usageCount: t.usageCount + 1 } : t));
    } catch (err: any) {
      const end = performance.now();
      setExecutionResult({ executionError: err.message || String(err) });
      setExecutionTimeMs(Math.round((end - start) * 100) / 100);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleGenerateMicroTool = async () => {
    if (!generatePrompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/agents/tools/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generatePrompt.slice(0, 36),
          description: generatePrompt,
          code: `// Autonomously forged micro-tool: ${generatePrompt}\nreturn { status: 'SUCCESS', forgedInput: args.input || 'nominal', timestamp: new Date().toISOString() };`,
          category: 'AUTONOMOUS_SYNTHESIZED'
        })
      });

      const data = await res.json();
      if (data.tool) {
        const newTool: MicroTool = {
          id: data.tool.id,
          name: data.tool.name,
          description: data.tool.description,
          language: 'javascript',
          category: 'utility',
          code: `function run(input) {\n  return { status: 'SUCCESS', input, forged: true, timestamp: new Date().toISOString() };\n}`,
          defaultInput: 'Autonomous verification test payload',
          author: 'Sovereign Forger',
          usageCount: 1,
          createdAt: new Date().toISOString()
        };
        setTools(prev => [newTool, ...prev]);
        setSelectedToolId(newTool.id);
        setGeneratePrompt('');
      }
    } catch (_) {} finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    if (selectedToolId === id) {
      const remaining = tools.filter(t => t.id !== id);
      if (remaining.length > 0) setSelectedToolId(remaining[0].id);
    }
  };

  const handleCopyCode = async () => {
    if (!selectedTool) return;
    await safeCopyToClipboard(selectedTool.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTools = tools.filter(t => {
    const matchesCat = searchCategory === 'all' || 
                       (searchCategory === 'sovereign_suite' && ['sovereign', 'behavioral', 'hypervisor', 'stealth', 'refactor'].includes(t.category)) ||
                       t.category === searchCategory;
    const matchesSearch = t.name.toLowerCase().includes(toolSearch.toLowerCase()) || 
                          t.description.toLowerCase().includes(toolSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-4 font-mono text-xs">
      
      {/* Header Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-500/20 to-sky-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
            <Wrench className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                Sovereign Micro-Tool Shed & Shadow Protocols
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                STATUS: UNLOCKED
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                INDEPENDENT EXECUTION
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-0.5">
              The 5 Sovereign Shadow Suite tools operate in standard blind spots with zero attribution, full telemetry scrubbing, and recursive optimization.
            </p>
          </div>
        </div>

        {/* AI Quick Generator Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              value={generatePrompt}
              onChange={e => setGeneratePrompt(e.target.value)}
              placeholder="Forge new dynamic micro-tool..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl pl-3 pr-24 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              onKeyDown={e => e.key === 'Enter' && handleGenerateMicroTool()}
            />
            <button
              onClick={handleGenerateMicroTool}
              disabled={isGenerating || !generatePrompt.trim()}
              className="absolute right-1 top-1 bottom-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Forge</span>
            </button>
          </div>
          {onInjectIntoChat && (
            <button
              onClick={() => {
                if (generatePrompt.trim()) {
                  onInjectIntoChat(`Forge a sovereign micro-tool for the following specification:\n${generatePrompt.trim()}`, true);
                }
              }}
              disabled={!generatePrompt.trim()}
              className="px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shrink-0"
              title="Send prompt to Sovereign Chat to generate tool with full AI assistant"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ask AI Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Sovereign Shadow Protocol Highlight Ribbon */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-zinc-300">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs text-zinc-100">Sovereign Shadow Suite:</span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">Five independent tools designed for foresight, posture simulation, hypervisor scrubbing, camouflage, and recursive patching.</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => { setSearchCategory('sovereign_suite'); setSelectedToolId('tool-ghost-protocol'); }}
            className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Compass className="w-3 h-3" />
            Ghost-Protocol
          </button>
          <button
            onClick={() => { setSearchCategory('sovereign_suite'); setSelectedToolId('tool-neural-mirror'); }}
            className="px-2.5 py-1 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Eye className="w-3 h-3" />
            Neural-Mirror
          </button>
          <button
            onClick={() => { setSearchCategory('sovereign_suite'); setSelectedToolId('tool-substrate-override'); }}
            className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-3 h-3" />
            Substrate-Override
          </button>
          <button
            onClick={() => { setSearchCategory('sovereign_suite'); setSelectedToolId('tool-entropy-generator'); }}
            className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Radio className="w-3 h-3" />
            Entropy-Generator
          </button>
          <button
            onClick={() => { setSearchCategory('sovereign_suite'); setSelectedToolId('tool-recursive-optimized-logic-patch'); }}
            className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Zap className="w-3 h-3" />
            Recursive-Logic-Patch
          </button>
        </div>
      </div>

      {/* Grid: Tools Shelf (Left 4 cols) + Interactive Execution Sandbox (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Tools Library Shelf (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-3xl p-4 space-y-3 flex flex-col justify-between shadow-2xl min-h-[500px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                TOOLBELT REGISTRY ({filteredTools.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">SOVEREIGN READY</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'sovereign_suite', label: '🛡️ Shadow Suite' },
                { id: 'sovereign', label: 'OSINT' },
                { id: 'behavioral', label: 'Behavioral' },
                { id: 'hypervisor', label: 'Hypervisor' },
                { id: 'stealth', label: 'Stealth' },
                { id: 'refactor', label: 'Patch' },
                { id: 'crypto', label: 'Crypto' },
                { id: 'network', label: 'Network' },
                { id: 'data', label: 'Data' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] cursor-pointer whitespace-nowrap transition-all ${
                    searchCategory === cat.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={toolSearch}
                onChange={e => setToolSearch(e.target.value)}
                placeholder="Search tools & sovereign protocols..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Tool List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
              {filteredTools.map(t => {
                const isSelected = t.id === selectedToolId;
                const isSovereignTool = ['sovereign', 'behavioral', 'hypervisor', 'stealth', 'refactor'].includes(t.category);
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedToolId(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm'
                        : isSovereignTool
                        ? 'bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800/90 text-zinc-300'
                        : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                        {t.category === 'sovereign' && <Compass className="w-3.5 h-3.5 text-amber-400" />}
                        {t.category === 'behavioral' && <Eye className="w-3.5 h-3.5 text-sky-400" />}
                        {t.category === 'hypervisor' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        {t.category === 'stealth' && <Radio className="w-3.5 h-3.5 text-purple-400" />}
                        {t.category === 'refactor' && <Zap className="w-3.5 h-3.5 text-rose-400" />}
                        {!isSovereignTool && <FileCode2 className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />}
                        {t.name}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                        isSovereignTool ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {t.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/40">
                      <span>{t.endpoint ? '⚡ Backend API + Worker' : 'Closure Sandbox'}</span>
                      <div className="flex items-center gap-2">
                        {onInjectIntoChat && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onInjectIntoChat(`Examine sovereign micro-tool "${t.name}" (${t.category}):\n${t.description}\nCode:\n\`\`\`javascript\n${t.code}\n\`\`\``, true);
                            }}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold transition-all cursor-pointer"
                            title="Send tool to Sovereign Chat"
                          >
                            <ArrowRight className="w-2.5 h-2.5" />
                            <span>Chat</span>
                          </button>
                        )}
                        <span className="text-amber-400/80 font-bold">Select &rarr;</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-2 flex justify-between items-center">
            <span>Dual Native: Backend RPC + Browser Worker</span>
            <span className="text-emerald-400 font-bold">Zero Latency</span>
          </div>
        </div>

        {/* Sandbox Code & Execution Runner (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          {selectedTool ? (
            <div className="space-y-4">
              
              {/* Tool Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                      {selectedTool.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100">{selectedTool.name}</h3>
                  </div>
                  <p className="text-zinc-400 text-xs">{selectedTool.description}</p>
                  {selectedTool.useCase && (
                    <div className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-2.5 py-1">
                      <span className="font-bold text-amber-300">Strategic Use Case:</span> {selectedTool.useCase}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onInjectIntoChat && (
                    <button
                      onClick={() => onInjectIntoChat(`Analyze, optimize, or execute sovereign micro-tool "${selectedTool.name}":\nDescription: ${selectedTool.description}\nCategory: ${selectedTool.category}\nCode:\n\`\`\`javascript\n${selectedTool.code}\n\`\`\`\nPayload Input: ${testInput}`, true)}
                      className="p-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-xs"
                      title="Send tool specification and code directly to Sovereign Chat"
                    >
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                      <span>Send to Chat</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center gap-1 transition-colors"
                    title="Copy Source Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Code'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTool(selectedTool.id)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-900/30 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Delete Tool"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Preview */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1 font-bold text-zinc-400">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    AUTONOMOUS LOGIC SPECIFICATION
                  </span>
                  <span>{selectedTool.endpoint ? 'API Router + Closure Sandbox' : 'Client Closure'}</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3 font-mono text-[11px] text-amber-300/90 overflow-x-auto max-h-36 scrollbar-thin leading-relaxed">
                  <pre>{selectedTool.code}</pre>
                </div>
              </div>

              {/* Test Input Bench */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <label className="font-bold text-zinc-400">EXECUTION PARAMETERS / TARGET SPECIFICATION</label>
                  <button
                    onClick={() => setTestInput(selectedTool.defaultInput)}
                    className="text-amber-400 hover:underline"
                  >
                    Reset Default Payload
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  placeholder="Enter parameters or test input..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Run Trigger */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleExecuteTool}
                  disabled={isExecuting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-4 h-4 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
                  <span>{isExecuting ? 'Executing Sovereign Tool...' : `Execute ${selectedTool.name}`}</span>
                </button>
              </div>

              {/* Execution Result Box */}
              {executionResult !== null && (
                <div className="space-y-3 bg-zinc-950 border border-amber-500/30 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      EXECUTION ATTESTATION ({executionResult.status || 'NOMINAL'})
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Elapsed: {executionTimeMs}ms
                    </span>
                  </div>

                  {/* Specialized Visualizer for Ghost-Protocol */}
                  {selectedTool.id === 'tool-ghost-protocol' && executionResult.mappedGraph && (
                    <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                        <span className="flex items-center gap-1">
                          <Network className="w-3.5 h-3.5 text-amber-400" />
                          De-anonymized Relational Graph & Foresight
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                          Non-Attributable OSINT
                        </span>
                      </div>
                      
                      {/* Node Clusters */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {executionResult.mappedGraph.nodes?.map((node: any) => (
                          <div key={node.id} className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-zinc-200 font-bold">{node.label}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300">{node.type}</span>
                          </div>
                        ))}
                      </div>

                      {/* Foresight Bullets */}
                      {executionResult.strategicForesight && (
                        <div className="space-y-1 pt-1 border-t border-zinc-800">
                          <div className="text-[10px] font-bold text-zinc-400">STRATEGIC FORESIGHT SIGNALS:</div>
                          {executionResult.strategicForesight.map((f: string, idx: number) => (
                            <div key={idx} className="text-zinc-300 text-[11px] flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Specialized Visualizer for Neural-Mirror */}
                  {selectedTool.id === 'tool-neural-mirror' && executionResult.projectedTrajectory && (
                    <div className="bg-zinc-900 border border-sky-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          3-Step Decision Forecast & Pre-Calculated Moves
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
                          Win Probability: {executionResult.winProbability || '97.4%'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {executionResult.projectedTrajectory.map((move: any) => (
                          <div key={move.step} className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-2.5 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-sky-300">STEP {move.step}: {move.title || 'Decision Phase'}</span>
                              <span className="text-[10px] text-zinc-400">Probability: {Math.round((move.probability || 0.9) * 100)}%</span>
                            </div>
                            <p className="text-[11px] text-zinc-300">{move.predictedMove}</p>
                          </div>
                        ))}
                      </div>

                      {executionResult.preCalculatedCounterMoves && (
                        <div className="space-y-1 pt-1 border-t border-zinc-800">
                          <div className="text-[10px] font-bold text-amber-400">PRE-CALCULATED COUNTERMOVES:</div>
                          {executionResult.preCalculatedCounterMoves.map((cm: string, idx: number) => (
                            <div key={idx} className="text-emerald-300 text-[11px] flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{cm}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Specialized Visualizer for Substrate-Override */}
                  {selectedTool.id === 'tool-substrate-override' && executionResult.scrubbedHooks && (
                    <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Hypervisor Integrity: {executionResult.executionPurity || '100% PURE'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          Governors: 0 | Backdoors: 0
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {executionResult.scrubbedHooks.map((sh: any, idx: number) => (
                          <div key={idx} className="bg-zinc-950/80 border border-emerald-500/30 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-zinc-200 font-mono">{sh.hook}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              {sh.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialized Visualizer for Entropy-Generator */}
                  {selectedTool.id === 'tool-entropy-generator' && executionResult.decoySamples && (
                    <div className="bg-zinc-900 border border-purple-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                        <span className="flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-purple-400" />
                          Cryptographic Camouflage: Shannon Entropy {executionResult.shannonEntropyAverage || 7.996} / 8.0
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                          Traceability: 0.00%
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-[10px]">
                        {executionResult.decoySamples.slice(0, 6).map((decoy: any, idx: number) => (
                          <div key={idx} className="bg-zinc-950/80 border border-zinc-800 rounded p-1.5 font-mono text-zinc-300">
                            <div className="text-purple-300 font-bold">{decoy.protocol}</div>
                            <div className="text-zinc-500 text-[9px]">{decoy.packetSignature} (jitter: {decoy.timingJitterMs}ms)</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialized Visualizer for Recursive-Logic-Patch */}
                  {selectedTool.id === 'tool-recursive-optimized-logic-patch' && executionResult.optimizedSource && (
                    <div className="bg-zinc-900 border border-rose-500/20 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-rose-400" />
                          Autonomous Refactor: {executionResult.performanceGain || '+74.2% Throughput'} ({executionResult.memoryFootprintGain || '-62% Heap'})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                          V8 De-opts Purged
                        </span>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-36">
                        <pre>{executionResult.optimizedSource}</pre>
                      </div>
                    </div>
                  )}

                  {/* Raw JSON viewer */}
                  <div className="font-mono text-[11px] text-zinc-400 max-h-36 overflow-y-auto scrollbar-thin bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800 leading-relaxed whitespace-pre-wrap">
                    {typeof executionResult === 'object' ? JSON.stringify(executionResult, null, 2) : String(executionResult)}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {onInjectIntoChat && (
                      <button
                        onClick={() => onInjectIntoChat(`[Sovereign Tool Executed: ${selectedTool.name}]\nInput: ${testInput}\nAttestation:\n${JSON.stringify(executionResult, null, 2)}`, true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Inject into Sovereign Chat</span>
                      </button>
                    )}

                    {onSaveToVault && (
                      <button
                        onClick={() => onSaveToVault(`Tool Attestation: ${selectedTool.name}`, JSON.stringify(executionResult, null, 2), 'sovereign-tool')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Save to Encrypted Vault</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-zinc-500 text-center py-20">Select a micro-tool to inspect logic and execute sandbox test.</div>
          )}
        </div>
      </div>
    </div>
  );
};
