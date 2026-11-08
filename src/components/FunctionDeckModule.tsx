import React, { useState, useEffect } from 'react';
import {
  Zap,
  Terminal,
  FileCode,
  FileText,
  FolderTree,
  Hammer,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  Copy,
  Check,
  Cpu,
  ChevronRight,
  Code2,
  Search,
  Wrench,
  Bot,
  Flame,
  ArrowRight,
  Lock,
  Globe,
  Send,
  Key,
  Hash,
  RefreshCw
} from 'lucide-react';
import { 
  SOVEREIGN_FUNCTION_DEFINITIONS, 
  executeSovereignFunction, 
  executeAutonomousDirectiveWithFunctions,
  getRegisteredTools,
  type ForgedToolRecord 
} from '../utils/functionEngine';
import { SOVEREIGN_AGENT_SPECS, type AgentId } from '../utils/bakedNeuralEngine';
import type { 
  SovereignFunction, 
  FunctionExecutionResult, 
  AutonomousTaskPlan,
  AutonomousAgentPlanStep 
} from '../types';

interface FunctionDeckModuleProps {
  onSaveToVault?: (title: string, content: string, model: string) => void;
}

export const FunctionDeckModule: React.FC<FunctionDeckModuleProps> = ({ onSaveToVault }) => {
  const [activeTab, setActiveTab] = useState<'discrete' | 'autonomous-plan' | 'toolbelt' | 'crypto-suite' | 'rest-workbench'>('discrete');
  const [selectedFunction, setSelectedFunction] = useState<SovereignFunction>(SOVEREIGN_FUNCTION_DEFINITIONS[0]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('sovereign-engineer-core');
  const [functionArgs, setFunctionArgs] = useState<Record<string, any>>({
    filePath: 'package.json'
  });
  const [executionLoading, setExecutionLoading] = useState<boolean>(false);
  const [executionHistory, setExecutionHistory] = useState<FunctionExecutionResult[]>([]);
  const [lastResult, setLastResult] = useState<FunctionExecutionResult | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Autonomous Directive Plan state
  const [autonomousDirective, setAutonomousDirective] = useState<string>('Run strict TypeScript typecheck and verify compile purity');
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<AutonomousTaskPlan | null>(null);

  // Forged toolbelt state
  const [registeredTools, setRegisteredTools] = useState<ForgedToolRecord[]>([]);

  // Cryptographic Suite State
  const [cryptoInput, setCryptoInput] = useState<string>('Sovereign Clearance UID 0 Invariant Handshake');
  const [cryptoSecret, setCryptoSecret] = useState<string>('aurelius-master-key-2026');
  const [cryptoHashes, setCryptoHashes] = useState<Record<string, string> | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState<boolean>(false);
  const [jwtInput, setJwtInput] = useState<string>('');
  const [jwtResult, setJwtResult] = useState<any>(null);
  const [entropyData, setEntropyData] = useState<any>(null);

  // REST API Workbench State
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  const [httpUrl, setHttpUrl] = useState<string>('/api/burner/providers');
  const [httpHeadersJson, setHttpHeadersJson] = useState<string>('{\n  "Accept": "application/json"\n}');
  const [httpBodyText, setHttpBodyText] = useState<string>('');
  const [httpLoading, setHttpLoading] = useState<boolean>(false);
  const [httpResponse, setHttpResponse] = useState<any>(null);

  useEffect(() => {
    setRegisteredTools(getRegisteredTools());
  }, []);

  const handleSelectFunction = (fn: SovereignFunction) => {
    setSelectedFunction(fn);
    // Initialize default arguments
    const defaults: Record<string, any> = {};
    fn.parameters.forEach(p => {
      defaults[p.name] = p.defaultValue ?? '';
    });
    // Set friendly initial values
    if (fn.examples && fn.examples.length > 0) {
      setFunctionArgs(fn.examples[0].args);
    } else {
      setFunctionArgs(defaults);
    }
  };

  const handleExecuteFunction = async () => {
    if (executionLoading) return;
    setExecutionLoading(true);

    try {
      const result = await executeSovereignFunction(
        selectedFunction.id,
        functionArgs,
        selectedAgentId
      );
      setLastResult(result);
      setExecutionHistory(prev => [result, ...prev.slice(0, 19)]);
      setRegisteredTools(getRegisteredTools());
    } catch (err: any) {
      console.error('Function execution error:', err);
    } finally {
      setExecutionLoading(false);
    }
  };

  const handleRunAutonomousDirective = async () => {
    if (!autonomousDirective.trim() || isPlanning) return;
    setIsPlanning(true);

    try {
      const plan = await executeAutonomousDirectiveWithFunctions(
        autonomousDirective.trim(),
        selectedAgentId,
        (updatedStep) => {
          setCurrentPlan(prev => {
            if (!prev) return null;
            return {
              ...prev,
              steps: prev.steps.map(s => s.stepIndex === updatedStep.stepIndex ? updatedStep : s)
            };
          });
        }
      );
      setCurrentPlan(plan);
      setRegisteredTools(getRegisteredTools());
    } catch (err: any) {
      console.error('Autonomous planner error:', err);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleCopy = (text: string, id: string = 'copy') => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const currentAgent = SOVEREIGN_AGENT_SPECS[selectedAgentId as AgentId] || SOVEREIGN_AGENT_SPECS['sovereign-engineer-core'];

  const categories = [
    { id: 'all', label: 'All Functions' },
    { id: 'file', label: 'File & AST' },
    { id: 'build', label: 'Build & Test' },
    { id: 'tool-forge', label: 'Dynamic Tools' },
    { id: 'swarm', label: 'Swarm & Mesh' },
    { id: 'security', label: 'Air-Gapped' },
    { id: 'compendium', label: 'Compendium' }
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFunctions = selectedCategory === 'all'
    ? SOVEREIGN_FUNCTION_DEFINITIONS
    : SOVEREIGN_FUNCTION_DEFINITIONS.filter(f => f.category === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Cockpit Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-zinc-100 tracking-tight font-mono">
                SOVEREIGN FUNCTION DECK & TOOLBELT
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold uppercase tracking-wider">
                Direct Execution · No Chat Needed
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Execute discrete operational functions, file surgeries, and dynamic in-process tools directly with zero token spend.
            </p>
          </div>
        </div>

        {/* Operating Agent Selector */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1.5 shadow-inner">
          <Bot className="w-4 h-4 text-amber-400 ml-2" />
          <span className="text-xs text-zinc-400 font-medium">Executing Agent:</span>
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500 font-mono font-medium"
          >
            {Object.values(SOVEREIGN_AGENT_SPECS).map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.code} · {agent.teraflops} GFLOPS)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Mode Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-800/60 bg-zinc-900/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('discrete')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'discrete'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Separate Functions ({SOVEREIGN_FUNCTION_DEFINITIONS.length})
          </button>

          <button
            onClick={() => setActiveTab('autonomous-plan')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'autonomous-plan'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Autonomous Agent Planner (Multi-Step)
          </button>

          <button
            onClick={() => setActiveTab('toolbelt')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'toolbelt'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            Forged Toolbelt ({registeredTools.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('crypto-suite');
              if (!cryptoHashes) {
                // Auto compute initial hashes
                fetch('/api/tools/crypto', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'hash', input: cryptoInput, secret: cryptoSecret })
                }).then(r => r.json()).then(d => { if (d.success) setCryptoHashes(d.hashes); }).catch(() => {});
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'crypto-suite'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Crypto Suite & Hashes
          </button>

          <button
            onClick={() => setActiveTab('rest-workbench')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'rest-workbench'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            REST API Workbench
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-semibold">100% In-Process Autonomy</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-amber-300">0.00 Tokens Burned</span>
        </div>
      </div>

      {/* Main Operational View */}
      <div className="flex-1 overflow-hidden">
        {/* TAB 1: DISCRETE FUNCTIONS */}
        {activeTab === 'discrete' && (
          <div className="h-full grid grid-cols-12 overflow-hidden">
            {/* Left Column: Function Palette */}
            <div className="col-span-12 lg:col-span-4 border-r border-zinc-800/80 bg-zinc-900/20 flex flex-col h-full overflow-hidden">
              {/* Category Filter */}
              <div className="p-3 border-b border-zinc-800/60 overflow-x-auto flex gap-1.5 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Function List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredFunctions.map((fn) => {
                  const isSelected = selectedFunction.id === fn.id;
                  return (
                    <div
                      key={fn.id}
                      onClick={() => handleSelectFunction(fn)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-500/50 text-zinc-100 shadow-md'
                          : 'bg-zinc-900/40 border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-800/30 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" />
                          {fn.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {fn.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {fn.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/50 text-[10px] text-zinc-500 font-mono">
                        <span>{fn.parameters.length} params</span>
                        <span>•</span>
                        <span>{fn.examples?.length || 0} presets</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Middle & Right Column: Function Execution Deck & Live Results */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full overflow-hidden bg-zinc-950">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Function Header & Metadata Card */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-500/5 via-transparent to-transparent pointer-events-none" />

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                          {selectedFunction.id}()
                        </span>
                        <h2 className="text-base font-bold text-zinc-100 font-mono">
                          {selectedFunction.name}
                        </h2>
                      </div>
                      <p className="text-xs text-zinc-300 mt-2 leading-relaxed max-w-2xl">
                        {selectedFunction.description}
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <div className="text-zinc-400">Agent Substrate</div>
                      <div className="text-amber-300 font-bold">{currentAgent.name}</div>
                      <div className="text-[10px] text-zinc-500">{currentAgent.badge}</div>
                    </div>
                  </div>

                  {/* 1-Click Example Presets */}
                  {selectedFunction.examples && selectedFunction.examples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/60 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                        <Play className="w-3 h-3 text-emerald-400" />
                        Quick Presets:
                      </span>
                      {selectedFunction.examples.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFunctionArgs(ex.args)}
                          className="px-2.5 py-1 rounded-md text-[11px] bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 transition-colors font-mono"
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Function Arguments Form */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-md">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    Function Arguments & Input Parameters
                  </h3>

                  {selectedFunction.parameters.length === 0 ? (
                    <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 font-mono">
                      ✨ This function requires 0 arguments. Ready for immediate execution.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedFunction.parameters.map((param) => {
                        const isTextarea = param.name === 'content' || param.name === 'code' || param.name === 'codeOrError' || param.name === 'replacementContent';
                        return (
                          <div key={param.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                                <span>{param.name}</span>
                                {param.required && <span className="text-rose-400 text-[10px]">*required</span>}
                              </label>
                              <span className="text-[10px] text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                                type: {param.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">{param.description}</p>
                            
                            {isTextarea ? (
                              <textarea
                                value={typeof functionArgs[param.name] === 'object' ? JSON.stringify(functionArgs[param.name], null, 2) : (functionArgs[param.name] ?? '')}
                                onChange={(e) => setFunctionArgs({ ...functionArgs, [param.name]: e.target.value })}
                                placeholder={param.placeholder}
                                rows={6}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all resize-y"
                              />
                            ) : param.type === 'boolean' ? (
                              <div className="flex items-center gap-3 pt-1">
                                <label className="flex items-center gap-2 text-xs text-zinc-300 font-mono cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!functionArgs[param.name]}
                                    onChange={(e) => setFunctionArgs({ ...functionArgs, [param.name]: e.target.checked })}
                                    className="rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-0"
                                  />
                                  <span>Enabled</span>
                                </label>
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={typeof functionArgs[param.name] === 'object' ? JSON.stringify(functionArgs[param.name]) : (functionArgs[param.name] ?? '')}
                                onChange={(e) => setFunctionArgs({ ...functionArgs, [param.name]: e.target.value })}
                                placeholder={param.placeholder}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Execution Action Button */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-zinc-800/60">
                    <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>UID 0 Root Clearance Verified</span>
                    </div>

                    <button
                      onClick={handleExecuteFunction}
                      disabled={executionLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-zinc-950 font-bold font-mono text-xs hover:from-rose-400 hover:to-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {executionLoading ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin text-zinc-950" />
                          Executing Function...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-zinc-950" />
                          Execute {selectedFunction.name}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Execution Result Box */}
                {lastResult && (
                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        {lastResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-mono text-xs font-bold text-zinc-100">
                          Execution Report: {lastResult.functionId}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          lastResult.success 
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        }`}>
                          {lastResult.success ? 'CONVERGED / SUCCESS' : 'FAILED'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {lastResult.elapsedMs}ms
                        </span>
                        <span>•</span>
                        <span className="text-amber-300">0 Tokens</span>
                      </div>
                    </div>

                    {/* Diff Viewer if available */}
                    {lastResult.diff && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                          Surgical Patch / Diff Output:
                        </span>
                        <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
                          {lastResult.diff}
                        </pre>
                      </div>
                    )}

                    {/* Stdout / Terminal Output */}
                    {lastResult.stdout && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                          Terminal STDOUT:
                        </span>
                        <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                          {lastResult.stdout}
                        </pre>
                      </div>
                    )}

                    {/* Stderr if present */}
                    {lastResult.stderr && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">
                          Terminal STDERR:
                        </span>
                        <pre className="p-3.5 rounded-xl bg-zinc-950 border border-rose-900/50 font-mono text-[11px] text-rose-300 overflow-x-auto whitespace-pre leading-relaxed">
                          {lastResult.stderr}
                        </pre>
                      </div>
                    )}

                    {/* General Output / Payload */}
                    {lastResult.output && !lastResult.stdout && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                            Function Output Payload:
                          </span>
                          <button
                            onClick={() => handleCopy(typeof lastResult.output === 'object' ? JSON.stringify(lastResult.output, null, 2) : String(lastResult.output), 'payload')}
                            className="text-[11px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1 transition-colors"
                          >
                            {copiedHash === 'payload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            Copy Output
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                          {typeof lastResult.output === 'object' 
                            ? JSON.stringify(lastResult.output, null, 2) 
                            : String(lastResult.output)}
                        </pre>
                      </div>
                    )}

                    {/* Proof Attestation Seal */}
                    <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Immutable Proof Hash:</span>
                        <span className="text-cyan-400 font-semibold">{lastResult.proofHash}</span>
                        <button
                          onClick={() => handleCopy(lastResult.proofHash, 'hash')}
                          className="hover:text-zinc-200"
                        >
                          {copiedHash === 'hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="text-zinc-500">
                        Provenance: System Proof Local-System-Integrity-Proof • System Verified
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTONOMOUS AGENT PLANNER (MULTI-STEP) */}
        {activeTab === 'autonomous-plan' && (
          <div className="h-full overflow-y-auto p-6 max-w-5xl mx-auto space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-100 font-mono">
                    Autonomous Multi-Step Function Planner
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Dispatch high-level directives to the agent. The agent decomposes the goal into separate functions, executes them in sequence, and verifies outcomes automatically.
                  </p>
                </div>
              </div>

              {/* Directive Input */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-mono font-semibold text-zinc-300">
                  Architectural Directive / Task Goal:
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={autonomousDirective}
                    onChange={(e) => setAutonomousDirective(e.target.value)}
                    placeholder="e.g. Run strict TypeScript typecheck and verify compile purity..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleRunAutonomousDirective}
                    disabled={isPlanning || !autonomousDirective.trim()}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-lg shadow-amber-950/40 disabled:opacity-50 cursor-pointer"
                  >
                    {isPlanning ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin text-zinc-950" />
                        Executing Plan...
                      </>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 fill-zinc-950" />
                        Dispatch Plan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Preset Directives */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-500 font-mono">Presets:</span>
                {[
                  'Run strict TypeScript typecheck and verify compile purity',
                  'Synthesize high-performance LRU cache and audit types',
                  'Synchronize Alpha-14 swarm nodes and 11 repositories',
                  'Audit codebase security and execute memory purge'
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setAutonomousDirective(preset)}
                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Multi-Step Execution Pipeline */}
            {currentPlan && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-300">
                      PLAN #{currentPlan.id}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                      currentPlan.status === 'COMPLETED' 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : currentPlan.status === 'EXECUTING'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}>
                      {currentPlan.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-3">
                    <span>{currentPlan.steps.length} Steps</span>
                    <span>•</span>
                    <span>{currentPlan.totalElapsedMs}ms</span>
                    <span>•</span>
                    <span className="text-cyan-400">{currentPlan.proofHash.slice(0, 16)}</span>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {currentPlan.steps.map((step) => (
                    <div
                      key={step.stepIndex}
                      className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-[10px] font-bold text-zinc-300">
                            {step.stepIndex}
                          </span>
                          <span className="font-mono text-xs font-bold text-rose-300">
                            {step.functionId}()
                          </span>
                          <span className="text-xs text-zinc-300">
                            {step.description}
                          </span>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          step.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/50' :
                          step.status === 'EXECUTING' ? 'text-amber-400 bg-amber-950/40 border border-amber-800/50 animate-pulse' :
                          step.status === 'FAILED' ? 'text-rose-400 bg-rose-950/40 border border-rose-800/50' :
                          'text-zinc-500 bg-zinc-900'
                        }`}>
                          {step.status}
                        </span>
                      </div>

                      {/* Step Result Output if completed */}
                      {step.result && (
                        <div className="mt-2 pt-2 border-t border-zinc-800/60 font-mono text-[11px] text-zinc-300">
                          {step.result.stdout && (
                            <div className="text-emerald-300 bg-zinc-900/60 p-2 rounded">
                              {step.result.stdout}
                            </div>
                          )}
                          {step.result.diff && (
                            <pre className="p-2 bg-zinc-900/80 rounded overflow-x-auto text-zinc-300">
                              {step.result.diff}
                            </pre>
                          )}
                          {step.result.output && !step.result.stdout && (
                            <div className="text-zinc-300 bg-zinc-900/40 p-2 rounded max-h-48 overflow-y-auto">
                              {typeof step.result.output === 'object' ? JSON.stringify(step.result.output, null, 2) : String(step.result.output)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Overall Summary */}
                {currentPlan.overallSummary && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentPlan.overallSummary}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED FORGED TOOLBELT */}
        {activeTab === 'toolbelt' && (
          <div className="h-full overflow-y-auto p-6 max-w-5xl mx-auto space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-100 font-mono flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-cyan-400" />
                  In-Process Forged Tool Registry
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Dynamically synthesized autonomous tools stored in-process for direct offline execution.
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-zinc-500">Registered Tools:</span>{' '}
                <span className="text-cyan-400 font-bold">{registeredTools.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {tool.name}
                      </span>
                      <div className="font-mono text-[10px] text-zinc-500 mt-0.5">
                        ID: {tool.id}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 font-mono">
                      SANDBOXED
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      Executable Code:
                    </span>
                    <pre className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto max-h-36">
                      {tool.code}
                    </pre>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500">
                      Proof: {tool.proofHash.slice(0, 16)}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedFunction(SOVEREIGN_FUNCTION_DEFINITIONS.find(f => f.id === 'executeTool')!);
                        setFunctionArgs({ toolId: tool.id, inputArgs: {} });
                        setActiveTab('discrete');
                      }}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      Run Tool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CRYPTO SUITE */}
        {activeTab === 'crypto-suite' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-amber-300 font-mono flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  Sovereign Cryptographic Engine & Hash Laboratory
                </h2>
                <p className="text-xs text-zinc-400">
                  Compute SHA-256, SHA-512, HMAC, decode JWT claims, and generate cryptographically secure entropy.
                </p>
              </div>
              <button
                onClick={async () => {
                  const res = await fetch('/api/tools/crypto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'generate-entropy' })
                  });
                  const d = await res.json();
                  if (d.success) setEntropyData(d.entropy);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition-colors flex items-center gap-2 shadow-sm"
              >
                <Key className="w-3.5 h-3.5" />
                Generate Entropy & UUID
              </button>
            </div>

            {/* Generated Entropy Banner if active */}
            {entropyData && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs space-y-2">
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>Cryptographic Entropy Generated</span>
                  <button onClick={() => setEntropyData(null)} className="text-zinc-400 hover:text-zinc-200">Dismiss</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">UUID v4:</span>
                    <span className="text-zinc-200 font-bold">{entropyData.uuidV4}</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-400">Key:</span>
                    <span className="text-amber-300 font-bold truncate max-w-[200px]">{entropyData.cryptographicApiKey}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Hashing Laboratory */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Live Digest & HMAC Generator
              </span>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Payload / Text Input:</label>
                  <textarea
                    value={cryptoInput}
                    onChange={(e) => setCryptoInput(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500"
                    placeholder="Enter string to hash..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-zinc-400 block mb-1">HMAC Secret Key (Optional):</label>
                    <input
                      type="text"
                      value={cryptoSecret}
                      onChange={(e) => setCryptoSecret(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500"
                      placeholder="HMAC secret key..."
                    />
                  </div>
                  <button
                    onClick={async () => {
                      setCryptoLoading(true);
                      try {
                        const res = await fetch('/api/tools/crypto', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'hash', input: cryptoInput, secret: cryptoSecret })
                        });
                        const d = await res.json();
                        if (d.success) setCryptoHashes(d.hashes);
                      } finally {
                        setCryptoLoading(false);
                      }
                    }}
                    disabled={cryptoLoading}
                    className="mt-5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${cryptoLoading ? 'animate-spin' : ''}`} />
                    <span>Calculate Hashes</span>
                  </button>
                </div>
              </div>

              {/* Hash Outputs */}
              {cryptoHashes && (
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  {Object.entries(cryptoHashes).map(([algo, hashVal]) => (
                    <div key={algo} className="flex items-center justify-between gap-3 bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800/80 text-xs font-mono">
                      <span className="text-amber-400 uppercase font-bold w-28 shrink-0">{algo}:</span>
                      <span className="text-zinc-300 truncate flex-1">{hashVal}</span>
                      <button
                        onClick={() => handleCopy(hashVal)}
                        className="p-1 hover:text-amber-300 text-zinc-500 transition-colors"
                        title="Copy hash"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* JWT Token Decoder */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-2">
                <Key className="w-4 h-4" />
                JWT Token Inspector & Claims Decoder
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  placeholder="Paste JWT token (header.payload.signature)..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={async () => {
                    if (!jwtInput.trim()) return;
                    const res = await fetch('/api/tools/crypto', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'jwt-inspect', input: jwtInput })
                    });
                    const d = await res.json();
                    if (d.success) setJwtResult(d);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono rounded-lg transition-colors"
                >
                  Decode JWT
                </button>
              </div>

              {jwtResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Decoded Header:</span>
                    <pre className="text-xs text-purple-300 font-mono overflow-x-auto">
                      {JSON.stringify(jwtResult.header, null, 2)}
                    </pre>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500 uppercase">Decoded Payload Claims:</span>
                      {jwtResult.isExpired !== null && (
                        <span className={`px-1.5 py-0.2 rounded ${jwtResult.isExpired ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {jwtResult.isExpired ? 'EXPIRED' : 'VALID'}
                        </span>
                      )}
                    </div>
                    <pre className="text-xs text-emerald-300 font-mono overflow-x-auto max-h-48">
                      {JSON.stringify(jwtResult.payload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: REST API WORKBENCH */}
        {activeTab === 'rest-workbench' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-emerald-300 font-mono flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" />
                  Sovereign REST API Testing Workbench
                </h2>
                <p className="text-xs text-zinc-400">
                  Transmit live HTTP calls, inspect latency, test backend endpoints, or audit external webhooks directly.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">Presets:</span>
                <button
                  onClick={() => { setHttpMethod('GET'); setHttpUrl('/api/health'); }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Health
                </button>
                <button
                  onClick={() => { setHttpMethod('GET'); setHttpUrl('/api/burner/providers'); }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  Burners
                </button>
                <button
                  onClick={() => { setHttpMethod('GET'); setHttpUrl('/api/burner/domain-health'); }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                >
                  MX Matrix
                </button>
              </div>
            </div>

            {/* Request Bar */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex gap-2">
                <select
                  value={httpMethod}
                  onChange={(e: any) => setHttpMethod(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 shrink-0"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>

                <input
                  type="text"
                  value={httpUrl}
                  onChange={(e) => setHttpUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/resource or /api/endpoint..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
                />

                <button
                  onClick={async () => {
                    if (!httpUrl.trim()) return;
                    setHttpLoading(true);
                    setHttpResponse(null);
                    try {
                      let parsedHeaders = {};
                      try { parsedHeaders = JSON.parse(httpHeadersJson); } catch (_) {}
                      
                      let parsedBody: any = httpBodyText;
                      if (httpBodyText.trim().startsWith('{')) {
                        try { parsedBody = JSON.parse(httpBodyText); } catch (_) {}
                      }

                      const res = await fetch('/api/tools/http-client', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          method: httpMethod,
                          url: httpUrl.startsWith('/') ? `http://127.0.0.1:3000${httpUrl}` : httpUrl,
                          headers: parsedHeaders,
                          body: ['POST', 'PUT', 'PATCH'].includes(httpMethod) ? parsedBody : undefined
                        })
                      });
                      const d = await res.json();
                      setHttpResponse(d);
                    } catch (e: any) {
                      setHttpResponse({ error: e.message });
                    } finally {
                      setHttpLoading(false);
                    }
                  }}
                  disabled={httpLoading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs font-mono rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${httpLoading ? 'animate-pulse' : ''}`} />
                  <span>{httpLoading ? 'Sending...' : 'Transmit'}</span>
                </button>
              </div>

              {/* Headers and Body Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Request Headers (JSON):</label>
                  <textarea
                    value={httpHeadersJson}
                    onChange={(e) => setHttpHeadersJson(e.target.value)}
                    rows={4}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Request Payload Body (JSON / Raw):</label>
                  <textarea
                    value={httpBodyText}
                    onChange={(e) => setHttpBodyText(e.target.value)}
                    rows={4}
                    placeholder='{"key": "value"}'
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Response Section */}
            {httpResponse && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-400">Response Status:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      httpResponse.statusCode >= 200 && httpResponse.statusCode < 300 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {httpResponse.statusCode || 'ERR'} {httpResponse.statusText || ''}
                    </span>
                    {httpResponse.latencyMs !== undefined && (
                      <span className="text-xs font-mono text-zinc-500">
                        {httpResponse.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(httpResponse.body, null, 2))}
                    className="text-xs font-mono text-zinc-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Body</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Response Body:</span>
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-200/90 overflow-x-auto max-h-80 leading-relaxed">
                    {typeof httpResponse.body === 'object' 
                      ? JSON.stringify(httpResponse.body, null, 2)
                      : String(httpResponse.body || httpResponse.error || 'Empty response')}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
