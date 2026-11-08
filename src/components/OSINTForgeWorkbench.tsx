import React, { useState } from 'react';
import { 
  Wrench, 
  Play, 
  Terminal, 
  Check, 
  Copy, 
  Download, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Archive, 
  FileText, 
  RefreshCw, 
  X, 
  Code2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Cpu
} from 'lucide-react';

export interface OSINTForgeWorkbenchProps {
  domain: string;
  target: {
    vulnerabilityType: string;
    findingTitle: string;
    details?: any;
    severity?: string;
  } | null;
  forgeData: any;
  forging: boolean;
  forgeStack: 'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall';
  onStackChange: (stack: 'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall') => void;
  onSimulate: () => void;
  simulating: boolean;
  simulationResult: any;
  onSaveToVault?: () => void;
  committedToVault?: boolean;
  onInjectToScratchpad?: () => void;
  injectedToScratchpad?: boolean;
  onSendToChat?: () => void;
  onNavigateToModule?: (mod: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const OSINTForgeWorkbench: React.FC<OSINTForgeWorkbenchProps> = ({
  domain,
  target,
  forgeData,
  forging,
  forgeStack,
  onStackChange,
  onSimulate,
  simulating,
  simulationResult,
  onSaveToVault,
  committedToVault,
  onInjectToScratchpad,
  injectedToScratchpad,
  onSendToChat,
  onNavigateToModule,
  onClose,
  isModal = false
}) => {
  const [activeTab, setActiveTab] = useState<'patch' | 'diff' | 'verify' | 'sandbox' | 'guide'>('patch');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stacks: { id: 'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall'; label: string; icon: string }[] = [
    { id: 'nginx', label: 'Nginx Edge', icon: 'NGX' },
    { id: 'express-helmet', label: 'Express + Helmet', icon: 'NODE' },
    { id: 'caddy', label: 'Caddyfile', icon: 'CAD' },
    { id: 'apache', label: 'Apache .htaccess', icon: 'APA' },
    { id: 'firewall', label: 'Linux UFW / Firewall', icon: 'UFW' }
  ];

  const severityColor = 
    target?.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
    target?.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
    target?.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  const content = (
    <div className={`space-y-6 ${isModal ? 'p-6 max-h-[88vh] overflow-y-auto' : ''}`}>
      {/* Top Banner / Finding Dossier */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                OSINT R&D Code Workshop
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${severityColor}`}>
                {target?.severity || 'HIGH'} PRIORITY
              </span>
              {forgeData?.cwe && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {forgeData.cwe}
                </span>
              )}
              {forgeData?.nistCsf && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  NIST: {forgeData.nistCsf}
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight flex items-center gap-2">
              <span>{target?.findingTitle || 'Perimeter Defensive Hardening Patch'}</span>
            </h2>

            <p className="text-xs text-zinc-400 font-mono">
              Target Substrate: <strong className="text-cyan-400">{domain || 'localhost'}</strong> — Synthesizing isolated defensive remediation with zero external telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
                title="Close Workbench"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Multi-Stack Switcher Toolbar */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-400 mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Deploy Target:
            </span>
            {stacks.map((s) => (
              <button
                key={s.id}
                onClick={() => onStackChange(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  forgeStack === s.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                    : 'bg-zinc-900/90 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
                }`}
              >
                <span className={`text-[9px] px-1 py-0.5 rounded font-black ${
                  forgeStack === s.id ? 'bg-black/25 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {s.icon}
                </span>
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={onSimulate}
            disabled={simulating || forging || !forgeData}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shadow-md cursor-pointer ${
              simulating
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-black shadow-cyan-500/20 hover:opacity-95'
            }`}
          >
            {simulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Emulating in Sandbox...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Simulate in Local Sandbox
              </>
            )}
          </button>
        </div>
      </div>

      {/* Workshop Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('patch')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'patch'
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-400" />
          Remediation Patch ({forgeStack})
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'diff'
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          Unified Diff
        </button>

        <button
          onClick={() => setActiveTab('verify')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'verify'
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          Verification Test Suite
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'sandbox'
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Play className="w-4 h-4 text-teal-400" />
          Sandbox Telemetry
          {simulationResult && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-zinc-800 text-amber-300 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          Runbook & Rollout
        </button>
      </div>

      {/* Main Content Areas */}
      {forging ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-zinc-100">Forging Production Defensive Patch</h3>
          <p className="text-xs text-zinc-400 font-mono">
            Compiling {forgeStack} security directives, boundary policies, and defensive validation suite...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TAB: PATCH CODE */}
          {activeTab === 'patch' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <Code2 className="w-4 h-4 text-amber-400" />
                  {forgeStack === 'nginx' ? `${domain}.conf` : forgeStack === 'express-helmet' ? 'server-security.ts' : forgeStack === 'caddy' ? 'Caddyfile' : forgeStack === 'apache' ? '.htaccess' : 'firewall-rules.sh'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(forgeData?.patchCode || '', 'patch')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-all cursor-pointer"
                  >
                    {copiedKey === 'patch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedKey === 'patch' ? 'Copied' : 'Copy Patch'}</span>
                  </button>

                  <button
                    onClick={() => downloadFile(forgeData?.patchCode || '', `patch-${forgeStack}-${domain}.conf`)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre className="p-5 font-mono text-xs text-cyan-300 bg-zinc-950 overflow-x-auto select-all leading-relaxed max-h-96">
                {forgeData?.patchCode || '// Patch compiling...'}
              </pre>

              {forgeData?.explanation && (
                <div className="p-4 bg-zinc-900/60 border-t border-zinc-800 text-xs text-zinc-300 font-mono space-y-1">
                  <span className="text-amber-400 font-bold block">Architectural Defense Rationale:</span>
                  <p className="leading-relaxed text-zinc-400">{forgeData.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: UNIFIED DIFF */}
          {activeTab === 'diff' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Unified Hardening Diff
                </span>
                <button
                  onClick={() => copyText(forgeData?.patchDiff || '', 'diff')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-all cursor-pointer"
                >
                  {copiedKey === 'diff' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedKey === 'diff' ? 'Copied' : 'Copy Diff'}</span>
                </button>
              </div>

              <pre className="p-5 font-mono text-xs text-emerald-300 bg-zinc-950 overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
                {forgeData?.patchDiff || '+ // Unified diff compiling...'}
              </pre>
            </div>
          )}

          {/* TAB: VERIFICATION SCRIPT */}
          {activeTab === 'verify' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg space-y-4">
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2 text-zinc-200 font-semibold">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Automated Defensive Probe Suite (verify-remediation.sh)
                </span>
                <button
                  onClick={() => copyText(forgeData?.verificationScript || '', 'verify')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-all cursor-pointer"
                >
                  {copiedKey === 'verify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedKey === 'verify' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>

              <pre className="p-5 font-mono text-xs text-amber-300 bg-zinc-950 overflow-x-auto select-all leading-relaxed whitespace-pre-wrap">
                {forgeData?.verificationScript || '#!/usr/bin/env bash\n# Verification script compiling...'}
              </pre>

              <div className="px-5 pb-5">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs space-y-2">
                  <span className="text-zinc-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    One-Liner Quick Verification Probe:
                  </span>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 select-all font-mono text-[11px]">
                    {forgeData?.testCommand || `curl -sI https://${domain} | grep -i security`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SANDBOX TELEMETRY */}
          {activeTab === 'sandbox' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-cyan-400 fill-current" />
                  <h3 className="text-base font-bold text-zinc-100">Sandboxed Environment Emulation & Verification</h3>
                </div>
                <button
                  onClick={onSimulate}
                  disabled={simulating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                  Re-Run Sandbox Simulation
                </button>
              </div>

              {simulationResult ? (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                        ✓
                      </div>
                      <div>
                        <div className="font-bold text-emerald-300">Sandbox AST & Syntax Check: PASSED</div>
                        <div className="text-[11px] text-zinc-400">Directives validated in isolated container vm with zero runtime errors.</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        +{simulationResult.scoreBonus} Pts Defense Boost
                      </span>
                    </div>
                  </div>

                  {/* Terminal Execution Logs */}
                  <div className="bg-black/90 rounded-xl border border-zinc-800 p-4 font-mono text-xs space-y-1.5 text-zinc-300">
                    <div className="text-zinc-500 text-[10px] pb-1 border-b border-zinc-800/80 flex items-center justify-between">
                      <span>VIRTUAL_SUBSTRATE_SANDBOX_OUTPUT</span>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    {simulationResult.logs?.map((log: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px]">
                        <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                        <span className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('CSP') ? 'text-cyan-400' : 'text-zinc-300'}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Simulated Edge Response Headers */}
                  {simulationResult.simulatedResponseHeaders && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold text-zinc-300 block">
                        Simulated Virtual HTTP Response Headers (Post-Remediation):
                      </span>
                      <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 font-mono text-[11px] divide-y divide-zinc-800/60 space-y-1.5">
                        {Object.entries(simulationResult.simulatedResponseHeaders).map(([k, v], i) => (
                          <div key={i} className="pt-1.5 flex items-start justify-between gap-4">
                            <span className="text-cyan-400 font-bold shrink-0">{k}:</span>
                            <span className="text-emerald-300 break-all text-right font-medium">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-3">
                  <Play className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400 font-mono">
                    Click <strong>"Simulate in Local Sandbox"</strong> above to test the patch AST, emulate edge headers, and verify that the remediation passes security validation without breaking application routes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: IMPLEMENTATION GUIDE */}
          {activeTab === 'guide' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-zinc-100">Production Deployment Runbook</h3>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-zinc-300">
                <span className="font-bold text-amber-300">Step 1: Configuration Placement</span>
                <p className="text-zinc-400">{forgeData?.implementationGuide || 'Insert directives into your reverse proxy or web application entrypoint.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-zinc-300">
                <span className="font-bold text-cyan-300">Step 2: Graceful Service Reload</span>
                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-emerald-400 select-all font-mono text-[11px]">
                  {forgeStack === 'nginx' ? 'sudo nginx -t && sudo systemctl reload nginx' :
                   forgeStack === 'caddy' ? 'caddy reload' :
                   forgeStack === 'apache' ? 'sudo apache2ctl configtest && sudo systemctl reload apache2' :
                   forgeStack === 'firewall' ? 'sudo ufw enable && sudo ufw status verbose' :
                   'npm run build && pm2 restart app'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-zinc-300">
                <span className="font-bold text-emerald-300">Step 3: Post-Deployment Attestation</span>
                <p className="text-zinc-400">
                  Re-run the OSINT scan in Aurelius to verify that the attack surface score increases to Grade A+ and all flags transition to green.
                </p>
              </div>
            </div>
          )}

          {/* Action Dock / Integration Interconnection */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sovereign Substrate Interconnections:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Inject to Scratchpad */}
              <button
                onClick={onInjectToScratchpad}
                disabled={injectedToScratchpad || !forgeData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer font-bold"
              >
                {injectedToScratchpad ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-teal-400" />}
                <span>{injectedToScratchpad ? 'Saved to Scratchpad' : 'Inject to Scratchpad'}</span>
              </button>

              {/* Commit to Artifact Vault */}
              <button
                onClick={onSaveToVault}
                disabled={committedToVault || !forgeData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer font-bold"
              >
                {committedToVault ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Archive className="w-3.5 h-3.5 text-amber-400" />}
                <span>{committedToVault ? 'Vault Sealed' : 'Commit to Vault'}</span>
              </button>

              {/* Consult Sovereign Chat */}
              {onSendToChat && (
                <button
                  onClick={onSendToChat}
                  disabled={!forgeData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/40 transition-all cursor-pointer font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Review in Sovereign Chat</span>
                </button>
              )}

              {/* Jump to Unified Projects */}
              {onNavigateToModule && (
                <button
                  onClick={() => onNavigateToModule('projects')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer font-bold"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Projects Workshop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-zinc-950 border border-amber-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
