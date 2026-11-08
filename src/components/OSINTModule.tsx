import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Lock, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Activity, 
  Download, 
  Key, 
  Mail, 
  Layers,
  FileCode2,
  AlertCircle,
  Sparkles,
  Radio,
  Archive,
  Wrench,
  Play,
  Terminal,
  ArrowRight,
  Cpu,
  Code2,
  X
} from 'lucide-react';
import { OSINTForgeWorkbench } from './OSINTForgeWorkbench';

interface OSINTModuleProps {
  onSaveToVault?: (artifact: { type: string; title: string; prompt: string; model: string; metadataJson?: string }) => void;
  userId?: string;
  onInjectIntoChat?: (content: string) => void;
  onNavigateToModule?: (module: any) => void;
}

export const OSINTModule: React.FC<OSINTModuleProps> = ({ 
  onSaveToVault, 
  userId, 
  onInjectIntoChat, 
  onNavigateToModule 
}) => {
  const [targetDomain, setTargetDomain] = useState<string>('github.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dns' | 'tls' | 'headers' | 'assets' | 'ports' | 'ai-audit' | 'remediation' | 'forge-workshop'>('overview');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scan Results State
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Defensive Port Probe State
  const [portProbeResult, setPortProbeResult] = useState<any>(null);
  const [probingPorts, setProbingPorts] = useState<boolean>(false);

  // Autonomous AI Security Audit State
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);
  const [runningAiAudit, setRunningAiAudit] = useState<boolean>(false);

  // Live Targeted TLS Probe State
  const [tlsCustomHost, setTlsCustomHost] = useState<string>('');
  const [tlsCustomPort, setTlsCustomPort] = useState<number>(443);
  const [liveTlsResult, setLiveTlsResult] = useState<any>(null);
  const [liveTlsLoading, setLiveTlsLoading] = useState<boolean>(false);
  const [liveTlsError, setLiveTlsError] = useState<string | null>(null);

  // Live Targeted Security Headers State
  const [headersCustomUrl, setHeadersCustomUrl] = useState<string>('');
  const [liveHeadersResult, setLiveHeadersResult] = useState<any>(null);
  const [liveHeadersLoading, setLiveHeadersLoading] = useState<boolean>(false);
  const [liveHeadersError, setLiveHeadersError] = useState<string | null>(null);

  // One-Click Forge & Local R&D Code Workshop State
  const [forgeOpen, setForgeOpen] = useState<boolean>(false);
  const [forgeTarget, setForgeTarget] = useState<{
    vulnerabilityType: string;
    findingTitle: string;
    domain?: string;
    details?: any;
    severity?: string;
  } | null>(null);
  const [forgeStack, setForgeStack] = useState<'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall'>('nginx');
  const [forgeData, setForgeData] = useState<any>(null);
  const [forging, setForging] = useState<boolean>(false);
  const [forgeTab, setForgeTab] = useState<'patch' | 'diff' | 'verify' | 'sandbox' | 'guide'>('patch');
  
  // Sandbox Simulation State
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [injectedToScratchpad, setInjectedToScratchpad] = useState<boolean>(false);
  const [committedToVault, setCommittedToVault] = useState<boolean>(false);

  const openOneClickForge = async (finding: {
    vulnerabilityType: string;
    findingTitle: string;
    details?: any;
    severity?: string;
  }, stackOverride?: 'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall') => {
    const stack = stackOverride || forgeStack;
    const cleanDomain = targetDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'target-system.internal';
    setForgeTarget({
      ...finding,
      domain: cleanDomain
    });
    setForgeOpen(true);
    setForging(true);
    setSimulationResult(null);
    setInjectedToScratchpad(false);
    setCommittedToVault(false);
    setForgeTab('patch');

    try {
      const res = await fetch('/api/osint/forge-remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vulnerabilityType: finding.vulnerabilityType,
          findingTitle: finding.findingTitle,
          domain: cleanDomain,
          details: finding.details,
          targetStack: stack
        })
      });
      const data = await res.json();
      if (data.success) {
        setForgeData(data);
      }
    } catch (err) {
      console.warn('Forge synthesis notice:', err);
    } finally {
      setForging(false);
    }
  };

  const handleStackChange = (newStack: 'nginx' | 'express-helmet' | 'caddy' | 'apache' | 'firewall') => {
    setForgeStack(newStack);
    if (forgeTarget) {
      openOneClickForge(forgeTarget, newStack);
    }
  };

  const executeSandboxSimulation = async () => {
    if (!forgeData?.patchCode) return;
    setSimulating(true);
    try {
      const res = await fetch('/api/osint/simulate-remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patchCode: forgeData.patchCode,
          targetStack: forgeStack,
          findingTitle: forgeTarget?.findingTitle
        })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationResult(data);
        setForgeTab('sandbox');
      }
    } catch (e) {
      console.warn('Simulation notice:', e);
    } finally {
      setSimulating(false);
    }
  };

  const handleSavePatchToVault = () => {
    if (!forgeData || !onSaveToVault) return;
    onSaveToVault({
      type: 'knowledge',
      title: `Remediation Patch: ${forgeTarget?.findingTitle || 'Defensive Hardening'}`,
      prompt: `Synthesized ${forgeStack} defensive remediation patch for ${targetDomain}.\n\nCWE: ${forgeData.cwe}\nNIST CSF: ${forgeData.nistCsf}\n\nPatch:\n${forgeData.patchCode}\n\nVerification Script:\n${forgeData.verificationScript}`,
      model: 'aurelius-sovereign-engineer',
      metadataJson: JSON.stringify({
        category: 'remediation-patch',
        stack: forgeStack,
        domain: targetDomain,
        finding: forgeTarget?.findingTitle,
        timestamp: new Date().toISOString()
      })
    });
    setCommittedToVault(true);
  };

  const handleInjectToScratchpad = async () => {
    if (!forgeData) return;
    try {
      await fetch('/api/scratchpads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `🛡️ Patch: ${forgeTarget?.findingTitle || 'Defensive Fix'} [${forgeStack}]`,
          category: 'code-drafts',
          tags: ['security', 'remediation', forgeStack, targetDomain],
          content: `// ========================================================\n// DEFENSIVE REMEDIATION PATCH FOR ${targetDomain}\n// Target: ${forgeTarget?.findingTitle}\n// Stack: ${forgeStack}\n// CWE: ${forgeData.cwe} | NIST: ${forgeData.nistCsf}\n// ========================================================\n\n${forgeData.patchCode}\n\n// --- VERIFICATION RUNBOOK ---\n${forgeData.verificationScript}\n\n// --- IMPLEMENTATION GUIDE ---\n${forgeData.implementationGuide}`
        })
      });
      setInjectedToScratchpad(true);
    } catch (e) {
      console.warn('Scratchpad note:', e);
    }
  };

  const handleSendToChat = () => {
    if (!forgeData || !onInjectIntoChat) return;
    const prompt = `I have forged a defensive remediation patch for "${forgeTarget?.findingTitle}" on target "${targetDomain}" using ${forgeStack}.\n\n\`\`\`\n${forgeData.patchCode}\n\`\`\`\n\nPlease review this patch against our production security architecture, evaluate any potential side-effects, and assist me with rolling it out safely.`;
    onInjectIntoChat(prompt);
    if (onNavigateToModule) {
      onNavigateToModule('chat');
    }
    setForgeOpen(false);
  };

  const executeLiveTlsProbe = async (hostOverride?: string, portOverride?: number) => {
    const host = (hostOverride || tlsCustomHost || targetDomain || '').trim();
    const port = portOverride || tlsCustomPort || 443;
    if (!host) return;
    setLiveTlsLoading(true);
    setLiveTlsError(null);
    try {
      const res = await fetch('/api/osint/ssl-cert-probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port })
      });
      const data = await res.json();
      if (data.success && data.certificate) {
        setLiveTlsResult(data.certificate);
      } else {
        setLiveTlsError(data.error || 'Failed to establish TLS handshake');
      }
    } catch (err: any) {
      setLiveTlsError(err.message || 'Error probing TLS certificate');
    } finally {
      setLiveTlsLoading(false);
    }
  };

  const executeLiveHeadersAudit = async (urlOverride?: string) => {
    const rawUrl = (urlOverride || headersCustomUrl || targetDomain || '').trim();
    if (!rawUrl) return;
    setLiveHeadersLoading(true);
    setLiveHeadersError(null);
    try {
      const res = await fetch('/api/osint/headers-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawUrl })
      });
      const data = await res.json();
      if (data.success) {
        setLiveHeadersResult(data);
      } else {
        setLiveHeadersError(data.error || 'Failed to audit HTTP headers');
      }
    } catch (err: any) {
      setLiveHeadersError(err.message || 'Error auditing HTTP security headers');
    } finally {
      setLiveHeadersLoading(false);
    }
  };

  const quickTargets = ['github.com', 'cloudflare.com', 'google.com', 'wikipedia.org'];

  const executePortProbe = async (hostToProbe?: string) => {
    const host = (hostToProbe || targetDomain || '').trim();
    if (!host) return;
    setProbingPorts(true);
    try {
      const res = await fetch('/api/osint/port-probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host })
      });
      const data = await res.json();
      if (data.success) {
        setPortProbeResult(data);
      }
    } catch (e: any) {
      console.warn('Port probe note:', e);
    } finally {
      setProbingPorts(false);
    }
  };

  const executeAiAudit = async () => {
    if (!scanResult) return;
    setRunningAiAudit(true);
    try {
      const res = await fetch('/api/osint/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: scanResult.domain,
          scanData: scanResult
        })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAuditResult(data.analysis);
      }
    } catch (e: any) {
      console.warn('AI audit note:', e);
    } finally {
      setRunningAiAudit(false);
    }
  };

  const executeScan = async (domainToScan?: string) => {
    const domain = (domainToScan || targetDomain || '').trim();
    if (!domain) return;
    setLoading(true);
    setErrorMsg(null);
    setPortProbeResult(null);
    setAiAuditResult(null);

    try {
      const res = await fetch('/api/osint/full-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });

      if (!res.ok) {
        throw new Error(`Scan request failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setScanResult(data);
        // Automatically trigger socket probe
        executePortProbe(domain);
      } else {
        throw new Error(data.error || 'Failed to complete OSINT reconnaissance');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing OSINT audit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeScan('github.com');
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveReport = () => {
    if (!scanResult || !onSaveToVault) return;
    onSaveToVault({
      type: 'knowledge',
      title: `OSINT Attack Surface Audit: ${scanResult.domain}`,
      prompt: `Comprehensive defensive OSINT audit of ${scanResult.domain} with Defense Score ${scanResult.defenseScore}/100`,
      model: 'aurelius-osint-spectre',
      metadataJson: JSON.stringify(scanResult, null, 2)
    });
    copyToClipboard('Saved to Vault!', 'save-vault');
  };

  const downloadJsonReport = () => {
    if (!scanResult) return;
    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `osint_report_${scanResult.domain}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                  Sovereign OSINT & Attack Surface Defense Deck
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  OWASP WSTG-INFO-01..10
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Passive external perimeter reconnaissance, DNS mail defense (SPF/DMARC/CAA), live TLS certificate transparency, and RFC 9116 disclosure auditing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {scanResult && (
              <>
                <button
                  onClick={handleSaveReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition-all cursor-pointer"
                >
                  {copiedId === 'save-vault' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5 text-amber-400" />}
                  {copiedId === 'save-vault' ? 'Saved!' : 'Save to Vault'}
                </button>

                <button
                  onClick={downloadJsonReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 transition-all cursor-pointer"
                  title="Export JSON report"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  Export JSON
                </button>
              </>
            )}
          </div>
        </div>

        {/* Target Search & Recon Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeScan()}
              placeholder="Enter target domain (e.g. github.com, cloudflare.com, yourcompany.com)"
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <button
            disabled={loading}
            onClick={() => executeScan()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black text-xs sm:text-sm font-bold font-mono transition-all shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Recon in Progress...' : 'Execute OSINT Audit'}
          </button>
        </div>

        {/* Quick Target Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <span className="text-zinc-500 font-mono text-[11px]">Quick Audit Targets:</span>
          {quickTargets.map((d) => (
            <button
              key={d}
              onClick={() => {
                setTargetDomain(d);
                executeScan(d);
              }}
              className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                targetDomain === d
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Attack Surface Scorecard
          {scanResult && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'overview' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-cyan-400'}`}>
              {scanResult.defenseScore}/100
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('dns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'dns'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          DNS & Mail Defense
          <span className="text-[10px] font-mono text-zinc-400">SPF · DMARC · CAA</span>
        </button>

        <button
          onClick={() => setActiveTab('tls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tls'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          TLS & SANs Subdomains
          {scanResult?.certificate?.sans?.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300">
              {scanResult.certificate.sans.length} SANs
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'headers'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          HTTP Security Headers
          {scanResult?.headers?.grade && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              Grade {scanResult.headers.grade}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'assets'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Public Assets & RFC 9116
        </button>

        <button
          onClick={() => {
            setActiveTab('ports');
            if (!portProbeResult) executePortProbe();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ports'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          TCP Port Reachability
          {portProbeResult && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'ports' ? 'bg-black/20 text-black' : 'bg-zinc-800 text-emerald-400'}`}>
              {portProbeResult.openCount} Open
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('ai-audit');
            if (!aiAuditResult) executeAiAudit();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai-audit'
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Autonomous AI Defense Posture
          {aiAuditResult?.postureGrade && (
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${activeTab === 'ai-audit' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'}`}>
              Grade {aiAuditResult.postureGrade}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('remediation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'remediation'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
          }`}
        >
          <Key className="w-4 h-4" />
          Defensive Directives
        </button>

        <button
          onClick={() => {
            setActiveTab('forge-workshop');
            if (!forgeTarget) {
              openOneClickForge({
                vulnerabilityType: 'CONTENT_SECURITY_POLICY',
                findingTitle: 'Perimeter Defensive Header & CSP Hardening',
                details: { status: 'RECOMMENDED' },
                severity: 'HIGH'
              });
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'forge-workshop'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-400 font-extrabold'
              : 'bg-zinc-900 hover:bg-zinc-850 text-amber-300 border border-amber-500/40 shadow-sm'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          R&D Code Workshop & Forge
          <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
            One-Click
          </span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && !scanResult && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-zinc-200">Executing Passive OSINT Reconnaissance</h3>
          <p className="text-xs text-zinc-400 font-mono">
            Resolving DNS records, querying mail authentication (SPF/DMARC), establishing TLS handshake for X.509 cert SANs, and evaluating HTTP defensive headers...
          </p>
        </div>
      )}

      {/* TAB 1: ATTACK SURFACE SCORECARD */}
      {activeTab === 'overview' && scanResult && (
        <div className="space-y-6">
          {/* Top Scorecard Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main Score Gauge */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs font-mono text-zinc-400">DEFENSIVE POSTURE SCORE</span>
              <div className="text-4xl font-extrabold font-mono text-cyan-400 tracking-tight">
                {scanResult.defenseScore}<span className="text-lg text-zinc-500">/100</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2.5 p-0.5 border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${scanResult.defenseScore}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {scanResult.defenseScore >= 80 ? 'HIGH RESILIENCE' : scanResult.defenseScore >= 60 ? 'MODERATE DEFENSE' : 'REMEDIATION RECOMMENDED'}
              </span>
            </div>

            {/* Mail Defense Status */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Mail Spoofing Protection
                </span>
                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  scanResult.dns?.mailSecurity?.dmarc?.status === 'SECURE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {scanResult.dns?.mailSecurity?.dmarc?.status === 'SECURE' ? 'ENFORCED' : 'SOFT_PASS'}
                </span>
              </div>
              <div className="text-xs font-mono text-zinc-200">
                SPF: {scanResult.dns?.mailSecurity?.spf?.present ? '✓ Active' : '✗ Missing'}
              </div>
              <div className="text-xs font-mono text-zinc-200">
                DMARC: {scanResult.dns?.mailSecurity?.dmarc?.present ? '✓ Active' : '✗ Missing'}
              </div>
              <div className="text-[10px] text-zinc-500">
                CAA: {scanResult.dns?.mailSecurity?.caa?.present ? '✓ Lockout Active' : 'No CAA restriction'}
              </div>
            </div>

            {/* Cryptographic TLS Posture */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  TLS / SSL Certificate
                </span>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {scanResult.certificate?.status || 'VALID'}
                </span>
              </div>
              <div className="text-xs font-mono text-zinc-200 truncate">
                Issuer: {scanResult.certificate?.issuer || 'Verified CA'}
              </div>
              <div className="text-xs font-mono text-zinc-200">
                Protocol: {scanResult.certificate?.protocol || 'TLSv1.3'}
              </div>
              <div className="text-[10px] text-zinc-500">
                Expires in: <strong className="text-zinc-300">{scanResult.certificate?.daysRemaining} days</strong>
              </div>
            </div>

            {/* HTTP Headers Grade */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Web Defensive Headers
                </span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  scanResult.headers?.grade === 'A+' || scanResult.headers?.grade === 'A'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  Grade {scanResult.headers?.grade || 'A+'}
                </span>
              </div>
              <div className="text-xs font-mono text-zinc-200">
                Server: {scanResult.headers?.server || 'Protected'}
              </div>
              <div className="text-xs font-mono text-zinc-200">
                RFC 9116 security.txt: {scanResult.metaRecon?.securityTxt?.found ? '✓ Present' : '✗ Absent'}
              </div>
              <div className="text-[10px] text-zinc-500">
                Score: {scanResult.headers?.score || 95}/100
              </div>
            </div>
          </div>

          {/* Attack Surface Summary Findings */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-zinc-100">Attack Surface Reconnaissance Findings</h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">Target: {scanResult.domain}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="font-bold text-zinc-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Attested Defensive Controls
                </div>
                <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                  {scanResult.certificate?.protocol && (
                    <li>✓ Modern Encrypted Transport: {scanResult.certificate.protocol} with {scanResult.certificate.cipher?.name}</li>
                  )}
                  {scanResult.dns?.mailSecurity?.spf?.present && (
                    <li>✓ SPF Authorized Mail Infrastructure: {scanResult.dns.mailSecurity.spf.policy}</li>
                  )}
                  {scanResult.dns?.mailSecurity?.dmarc?.present && (
                    <li>✓ DMARC Domain Identity Validation: {scanResult.dns.mailSecurity.dmarc.policy}</li>
                  )}
                  {scanResult.headers?.auditItems?.filter((h: any) => h.present).map((h: any, i: number) => (
                    <li key={i}>✓ Defensive Header Deployed: {h.name}</li>
                  ))}
                  {scanResult.metaRecon?.securityTxt?.found && (
                    <li>✓ RFC 9116 Vulnerability Disclosure Policy Publicly Disclosed</li>
                  )}
                </ul>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2.5">
                <div className="font-bold text-zinc-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Attack Surface Expansion & Recon Items
                </div>
                <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                  <li>• Certified Subdomains in TLS SANs: <strong>{scanResult.certificate?.sans?.length || 1} hosts</strong> identified</li>
                  <li>• Resolved IPv4 Perimeter Nodes: <strong>{scanResult.dns?.aRecords?.length || 0} addresses</strong></li>
                  <li>• Public Mail Exchangers (MX): <strong>{scanResult.dns?.mxRecords?.length || 0} nodes</strong></li>
                  {scanResult.metaRecon?.robotsTxt?.disallowedPaths?.length > 0 && (
                    <li>• Disclosed Crawler Paths in robots.txt: <strong>{scanResult.metaRecon.robotsTxt.disallowedPaths.length} routes</strong></li>
                  )}
                  {!scanResult.dns?.mailSecurity?.caa?.present && (
                    <li className="text-amber-400">⚠ CAA DNS Records not detected (vulnerable to rogue CA issuance)</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Quick Action: One-Click Forge Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-200">Detected attack surface items? Automatically spin up a remediation patch in the R&D sandbox.</span>
              </div>
              <button
                onClick={() => openOneClickForge({
                  vulnerabilityType: 'CONTENT_SECURITY_POLICY',
                  findingTitle: 'Perimeter Defensive Hardening Suite',
                  details: { domain: scanResult.domain, score: scanResult.defenseScore },
                  severity: scanResult.defenseScore < 80 ? 'HIGH' : 'MEDIUM'
                })}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-lg shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>One-Click Forge Workshop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DNS & MAIL DEFENSE */}
      {activeTab === 'dns' && scanResult?.dns && (
        <div className="space-y-6">
          {/* Mail Security Cards (SPF, DMARC, CAA) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-zinc-100">Mail Security & Domain Spoofing Audit</h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">Anti-Phishing & Anti-Spoofing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* SPF */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">SPF (Sender Policy Framework)</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    scanResult.dns.mailSecurity.spf.status === 'SECURE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {scanResult.dns.mailSecurity.spf.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-zinc-400">
                    Policy: <strong className="text-zinc-200">{scanResult.dns.mailSecurity.spf.policy}</strong>
                  </div>
                  <button
                    onClick={() => openOneClickForge({
                      vulnerabilityType: 'SPF_RECORD',
                      findingTitle: 'SPF Domain Identity & Anti-Spoofing TXT Record',
                      details: scanResult.dns.mailSecurity.spf,
                      severity: scanResult.dns.mailSecurity.spf.status === 'SECURE' ? 'LOW' : 'HIGH'
                    })}
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                  >
                    <Wrench className="w-3 h-3 text-amber-400" />
                    <span>Forge DNS Patch</span>
                  </button>
                </div>
                {scanResult.dns.mailSecurity.spf.raw && (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-[11px] text-cyan-300 break-all select-all">
                    {scanResult.dns.mailSecurity.spf.raw}
                  </div>
                )}
              </div>

              {/* DMARC */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">DMARC (_dmarc.{scanResult.domain})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    scanResult.dns.mailSecurity.dmarc.status === 'SECURE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {scanResult.dns.mailSecurity.dmarc.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-zinc-400">
                    Policy: <strong className="text-zinc-200">{scanResult.dns.mailSecurity.dmarc.policy}</strong>
                  </div>
                  <button
                    onClick={() => openOneClickForge({
                      vulnerabilityType: 'DMARC_RECORD',
                      findingTitle: 'DMARC Domain Enforcement & Quarantine Record',
                      details: scanResult.dns.mailSecurity.dmarc,
                      severity: scanResult.dns.mailSecurity.dmarc.status === 'SECURE' ? 'LOW' : 'HIGH'
                    })}
                    className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                  >
                    <Wrench className="w-3 h-3 text-amber-400" />
                    <span>Forge DMARC Patch</span>
                  </button>
                </div>
                {scanResult.dns.mailSecurity.dmarc.raw ? (
                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-[11px] text-emerald-300 break-all select-all">
                    {scanResult.dns.mailSecurity.dmarc.raw}
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-400 italic">No DMARC record found at _dmarc.{scanResult.domain}</div>
                )}
              </div>
            </div>
          </div>

          {/* DNS Records Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* A & AAAA Records */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  A & AAAA Resolution
                </span>
                <span className="text-[10px] text-zinc-500">IPv4 / IPv6</span>
              </div>
              <div className="space-y-1.5">
                {scanResult.dns.aRecords.map((ip: string, i: number) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 p-2 rounded-lg flex items-center justify-between">
                    <span className="text-cyan-300 font-semibold">{ip}</span>
                    <span className="text-[10px] text-zinc-500">A Record</span>
                  </div>
                ))}
                {scanResult.dns.ptrRecords?.map((ptr: string, i: number) => (
                  <div key={i} className="text-[11px] text-zinc-400 pl-1">
                    PTR: {ptr}
                  </div>
                ))}
                {scanResult.dns.aaaaRecords.map((ip6: string, i: number) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 p-2 rounded-lg flex items-center justify-between">
                    <span className="text-purple-300 font-semibold">{ip6}</span>
                    <span className="text-[10px] text-zinc-500">AAAA Record</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MX Mail Exchangers */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  Mail Exchangers (MX)
                </span>
                <span className="text-[10px] text-zinc-500">{scanResult.dns.mxRecords.length} hosts</span>
              </div>
              <div className="space-y-1.5">
                {scanResult.dns.mxRecords.map((mx: any, i: number) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 p-2 rounded-lg flex items-center justify-between">
                    <span className="text-zinc-200 truncate">{mx.exchange}</span>
                    <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-zinc-800">
                      Pri: {mx.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nameservers (NS) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Authoritative Nameservers (NS)
                </span>
                <span className="text-[10px] text-zinc-500">{scanResult.dns.nsRecords.length} servers</span>
              </div>
              <div className="space-y-1.5">
                {scanResult.dns.nsRecords.map((ns: string, i: number) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800/80 p-2 rounded-lg text-zinc-300">
                    {ns}
                  </div>
                ))}
              </div>
            </div>

            {/* Start of Authority (SOA) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-100 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  Start of Authority (SOA)
                </span>
                <span className="text-[10px] text-zinc-500">Zone Details</span>
              </div>
              {scanResult.dns.soaRecord ? (
                <div className="space-y-1 text-zinc-400 text-[11px]">
                  <div>Primary NS: <strong className="text-zinc-200">{scanResult.dns.soaRecord.nsname}</strong></div>
                  <div>Hostmaster: <strong className="text-zinc-200">{scanResult.dns.soaRecord.hostmaster}</strong></div>
                  <div>Serial: <strong className="text-zinc-200">{scanResult.dns.soaRecord.serial}</strong></div>
                  <div>Refresh: {scanResult.dns.soaRecord.refresh}s · Retry: {scanResult.dns.soaRecord.retry}s · Expire: {scanResult.dns.soaRecord.expire}s</div>
                </div>
              ) : (
                <div className="text-zinc-500 italic">No SOA data returned</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TLS & CERT SANS SUBDOMAINS */}
      {activeTab === 'tls' && (
        <div className="space-y-6">
          {/* Live Targeted TLS Handshake Probe Bar */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-zinc-100 font-mono">Live TLS Handshake & X.509 Probe Engine</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Direct Node.js TLS Socket Handshake
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder={targetDomain || 'Host to probe (e.g. github.com)'}
                value={tlsCustomHost}
                onChange={(e) => setTlsCustomHost(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none"
              />
              <input
                type="number"
                placeholder="443"
                value={tlsCustomPort}
                onChange={(e) => setTlsCustomPort(parseInt(e.target.value, 10) || 443)}
                className="w-24 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none"
              />
              <button
                onClick={() => executeLiveTlsProbe()}
                disabled={liveTlsLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${liveTlsLoading ? 'animate-spin' : ''}`} />
                <span>{liveTlsLoading ? 'Probing Handshake...' : 'Deep TLS Probe'}</span>
              </button>
            </div>

            {liveTlsError && (
              <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{liveTlsError}</span>
              </div>
            )}

            {liveTlsResult && (
              <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-xl p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300">Handshake Report: {liveTlsResult.host}:{liveTlsResult.port}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    liveTlsResult.authorized ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {liveTlsResult.authorized ? 'CA CHAIN VERIFIED' : 'SELFSIGNED / CA_UNTRUSTED'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">Common Name</span>
                    <span className="text-zinc-200 font-semibold">{liveTlsResult.subjectCn}</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">Issuer</span>
                    <span className="text-amber-300 font-semibold truncate block">{liveTlsResult.issuerOrg}</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-500 block">Validity</span>
                    <span className={`font-semibold ${liveTlsResult.isExpired ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {liveTlsResult.daysRemaining} Days Left
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400">
                  <span>Protocol: <strong className="text-zinc-200">{liveTlsResult.protocol}</strong></span>
                  <span>Cipher: <strong className="text-zinc-200">{liveTlsResult.cipher}</strong></span>
                  <span>SANs Count: <strong className="text-cyan-300">{liveTlsResult.sans?.length || 0}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* X.509 Certificate Profile Card (from full scan) */}
          {scanResult?.certificate && (
            <>
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base font-bold text-zinc-100">Live X.509 Certificate Transparency</h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {scanResult.certificate.protocol} Handshake Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3">
                    <span className="text-zinc-500 block text-[10px]">Subject Common Name</span>
                    <span className="font-semibold text-zinc-100 text-sm truncate block mt-0.5">{scanResult.certificate.subject}</span>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3">
                    <span className="text-zinc-500 block text-[10px]">Issuing Certificate Authority</span>
                    <span className="font-semibold text-amber-300 text-sm truncate block mt-0.5">{scanResult.certificate.issuer}</span>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3">
                    <span className="text-zinc-500 block text-[10px]">Validity Window</span>
                    <span className="font-semibold text-emerald-400 text-sm block mt-0.5">
                      {scanResult.certificate.daysRemaining} Days Left
                    </span>
                    <span className="text-[10px] text-zinc-500">Expires: {scanResult.certificate.validTo}</span>
                  </div>
                </div>

                {/* Cipher & Fingerprints */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs font-mono space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-zinc-400">Negotiated Cipher Suite:</span>
                    <span className="text-cyan-300 font-semibold">{scanResult.certificate.cipher?.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-zinc-400">SHA-256 Fingerprint:</span>
                    <span className="text-zinc-300 text-[11px] select-all truncate">{scanResult.certificate.fingerprint256}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-zinc-400">Serial Number:</span>
                    <span className="text-zinc-300 text-[11px] select-all">{scanResult.certificate.serialNumber}</span>
                  </div>
                </div>
              </div>

              {/* SANs Subdomain Discovery Grid */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold text-zinc-100">Discovered Subject Alternative Names (SANs)</h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {scanResult.certificate.sans?.length || 0} External Attack Surface Endpoints
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  The X.509 certificate lists certified subdomains and domain aliases. This is a passive OSINT reconnaissance technique for discovering subdomains without intrusive active probing:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
                  {scanResult.certificate.sans?.map((san: string, idx: number) => (
                    <div key={idx} className="bg-zinc-900/70 border border-zinc-800/80 p-2.5 rounded-xl flex items-center justify-between gap-2 group hover:border-zinc-700 transition-colors">
                      <span className="text-zinc-200 truncate">{san}</span>
                      <button
                        onClick={() => copyToClipboard(san, `san-${idx}`)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
                        title="Copy hostname"
                      >
                        {copiedId === `san-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 4: HTTP SECURITY HEADERS */}
      {activeTab === 'headers' && (
        <div className="space-y-6">
          {/* Live Targeted HTTP Security Headers Audit Bar */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100 font-mono">Live HTTP Security Headers Audit Engine</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                HSTS · CSP · X-Frame · Referrer · CORS
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-xs">
              <input
                type="text"
                placeholder={targetDomain ? `https://${targetDomain}` : 'https://example.com'}
                value={headersCustomUrl}
                onChange={(e) => setHeadersCustomUrl(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none"
              />
              <button
                onClick={() => executeLiveHeadersAudit()}
                disabled={liveHeadersLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${liveHeadersLoading ? 'animate-spin' : ''}`} />
                <span>{liveHeadersLoading ? 'Auditing Headers...' : 'Run Headers Audit'}</span>
              </button>
            </div>

            {liveHeadersError && (
              <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{liveHeadersError}</span>
              </div>
            )}

            {liveHeadersResult && (
              <div className="bg-zinc-900/80 border border-emerald-500/30 rounded-xl p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-300">{liveHeadersResult.url}</span>
                    <span className="text-zinc-500 ml-2">HTTP {liveHeadersResult.statusCode} ({liveHeadersResult.latencyMs}ms)</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    liveHeadersResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : liveHeadersResult.score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    GRADE {liveHeadersResult.grade} ({liveHeadersResult.score}/100)
                  </span>
                </div>

                <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/50">
                  {liveHeadersResult.findings?.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 text-[11px] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200">{f.header}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            f.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : f.status === 'WARN' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {f.status}
                          </span>
                          <button
                            onClick={() => openOneClickForge({
                              vulnerabilityType: f.header,
                              findingTitle: `Remediation Directive: ${f.header}`,
                              details: f,
                              severity: f.status === 'FAIL' ? 'HIGH' : 'MEDIUM'
                            })}
                            className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 rounded font-mono text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                          >
                            <Wrench className="w-3 h-3 text-amber-400" />
                            <span>One-Click Forge</span>
                          </button>
                        </div>
                      </div>
                      <div className="text-zinc-400 text-[10px] break-all">{f.details}</div>
                      <div className="text-cyan-400 text-[10px]">{f.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Full Scan Headers List */}
          {scanResult?.headers && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-zinc-100">Full Attack Surface Security Headers Evaluation</h2>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  DEFENSE GRADE {scanResult.headers.grade} ({scanResult.headers.score}/100)
                </span>
              </div>

              <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40 text-xs">
                {scanResult.headers.auditItems?.map((header: any, idx: number) => (
                  <div key={idx} className="p-4 space-y-2 hover:bg-zinc-850/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono font-semibold text-zinc-100">
                        {header.present ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span>{header.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          header.status === 'OPTIMAL' || header.status === 'PROTECTED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : header.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {header.status}
                        </span>

                        <button
                          onClick={() => openOneClickForge({
                            vulnerabilityType: header.name,
                            findingTitle: `Defensive Hardening: ${header.name}`,
                            details: header,
                            severity: header.present ? 'LOW' : 'HIGH'
                          })}
                          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all shadow-sm"
                        >
                          <Wrench className="w-3 h-3 text-amber-400" />
                          <span>One-Click Forge</span>
                        </button>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 break-all select-all">
                      {header.value}
                    </div>

                    <div className="text-[11px] text-zinc-400 flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold shrink-0">Guidance:</span>
                      <span>{header.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PUBLIC ASSETS & RFC 9116 */}
      {activeTab === 'assets' && scanResult?.metaRecon && (
        <div className="space-y-6">
          {/* RFC 9116 security.txt */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-zinc-100">RFC 9116 Security Disclosure (security.txt)</h2>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                scanResult.metaRecon.securityTxt?.found ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {scanResult.metaRecon.securityTxt?.found ? 'HTTP 200 FOUND' : 'ABSENT'}
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              The standardized <code className="text-zinc-200 font-mono">/.well-known/security.txt</code> file allows ethical security researchers to report vulnerabilities directly to the organization:
            </p>

            {scanResult.metaRecon.securityTxt?.preview ? (
              <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap select-all leading-relaxed">
                {scanResult.metaRecon.securityTxt.preview}
              </pre>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-500 italic">
                No security.txt file located at /.well-known/security.txt or /security.txt
              </div>
            )}
          </div>

          {/* robots.txt Disallowed Endpoints */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-zinc-100">Crawler Instructions & Disclosed Paths (robots.txt)</h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {scanResult.metaRecon.robotsTxt?.found ? `HTTP ${scanResult.metaRecon.robotsTxt.status}` : 'Not Found'}
              </span>
            </div>

            {scanResult.metaRecon.robotsTxt?.disallowedPaths?.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-mono">Disallowed Paths Enumerable:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {scanResult.metaRecon.robotsTxt.disallowedPaths.map((p: string, i: number) => (
                    <div key={i} className="bg-zinc-900/70 border border-zinc-800 p-2 rounded-lg text-amber-300 truncate">
                      Disallow: {p}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-500 italic">
                No restricted paths found in robots.txt
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DEFENSIVE TCP PORT & PERIMETER REACHABILITY */}
      {activeTab === 'ports' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold text-zinc-100">Perimeter TCP Port & Service Reachability Matrix</h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Direct socket-level probe evaluating active perimeter listening services, TLS termination, and firewall ingress policies for <strong>{targetDomain}</strong>:
                </p>
              </div>

              <button
                onClick={() => executePortProbe()}
                disabled={probingPorts}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${probingPorts ? 'animate-spin' : ''}`} />
                <span>{probingPorts ? 'Probing Sockets...' : 'Re-Probe Ports'}</span>
              </button>
            </div>

            {probingPorts && !portProbeResult ? (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Establishing TCP socket connections across target perimeter...</span>
              </div>
            ) : portProbeResult ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Total Probed: <strong className="text-zinc-200">{portProbeResult.totalProbed}</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">Open Services: <strong className="text-emerald-400">{portProbeResult.openCount}</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">Target Host: <strong className="text-cyan-400">{portProbeResult.host}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {portProbeResult.ports.map((p: any, idx: number) => {
                    const isOpen = p.status === 'OPEN';
                    const isFiltered = p.status.includes('FILTERED') || p.status.includes('TIMEOUT');
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border space-y-2 ${
                          isOpen
                            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                            : isFiltered
                            ? 'bg-amber-950/10 border-amber-500/30 text-amber-200'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-wider">Port {p.port}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOpen 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : isFiltered
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        <div className="text-[11px] font-semibold text-zinc-300">
                          {p.service}
                        </div>

                        <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1 border-t border-zinc-800/60">
                          <span>{p.latencyMs}ms RTT</span>
                          <button
                            onClick={() => openOneClickForge({
                              vulnerabilityType: 'PORT_FILTERING',
                              findingTitle: `Firewall Ingress Rule: Port ${p.port} (${p.service})`,
                              details: p,
                              severity: isOpen && p.port !== 443 && p.port !== 80 ? 'HIGH' : 'LOW'
                            }, 'firewall')}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 cursor-pointer"
                          >
                            <Wrench className="w-3 h-3 text-amber-400" />
                            <span>Forge UFW</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-zinc-500 font-mono text-xs">
                No active socket telemetry. Click "Re-Probe Ports" to query standard services.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5b: AUTONOMOUS AI SECURITY POSTURE SYNTHESIS */}
      {activeTab === 'ai-audit' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-bold text-zinc-100">Autonomous AI Attack Surface Synthesis</h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    NIST Cybersecurity Framework alignment & predictive defensive hardening
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveReport}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono flex items-center gap-1.5"
                >
                  <Archive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save to Vault</span>
                </button>
                <button
                  onClick={executeAiAudit}
                  disabled={runningAiAudit}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-xs font-mono flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{runningAiAudit ? 'Synthesizing...' : 'Re-Run AI Audit'}</span>
                </button>
              </div>
            </div>

            {runningAiAudit && !aiAuditResult ? (
              <div className="py-16 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>Evaluating external reconnaissance vectors with Gemini 3.8 Flash...</span>
              </div>
            ) : aiAuditResult ? (
              <div className="space-y-5 font-mono text-xs">
                {/* Posture Grade & Executive Summary Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl font-bold text-amber-300 shadow-inner">
                      {aiAuditResult.postureGrade || 'A'}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 tracking-wider">Perimeter Security Posture</div>
                      <div className="text-sm font-bold text-zinc-100">
                        {aiAuditResult.postureGrade === 'A+' || aiAuditResult.postureGrade === 'A' ? 'Hardened Enterprise Perimeter' : 'Moderate Exposure Detected'}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Evaluated against RFC 9116, OWASP WSTG & NIST SP 800-115
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    aiAuditResult.overallRisk === 'CRITICAL' || aiAuditResult.overallRisk === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : aiAuditResult.overallRisk === 'MODERATE'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    Risk Level: {aiAuditResult.overallRisk || 'LOW'}
                  </span>
                </div>

                {/* Executive Summary */}
                <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-300 leading-relaxed text-xs">
                  <span className="text-amber-400 font-bold block mb-1">Executive Defense Summary:</span>
                  {aiAuditResult.executiveSummary}
                </div>

                {/* NIST CSF Alignment Triad */}
                {aiAuditResult.nistCsfAlignment && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-cyan-400 font-bold block text-xs">1. IDENTIFY</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">{aiAuditResult.nistCsfAlignment.identify}</p>
                    </div>
                    <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-emerald-400 font-bold block text-xs">2. PROTECT</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">{aiAuditResult.nistCsfAlignment.protect}</p>
                    </div>
                    <div className="p-3.5 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-amber-400 font-bold block text-xs">3. DETECT</span>
                      <p className="text-[11px] text-zinc-400 leading-normal">{aiAuditResult.nistCsfAlignment.detect}</p>
                    </div>
                  </div>
                )}

                {/* Critical Vulnerabilities & Remediation Directives */}
                {aiAuditResult.criticalVulnerabilities?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-200 block">Identified Vulnerabilities & Mitigation:</span>
                    <div className="space-y-2">
                      {aiAuditResult.criticalVulnerabilities.map((v: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-200">{v.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {v.severity}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-850">
                            <p className="text-[11px] text-zinc-400 flex-1"><strong className="text-zinc-300">Remediation:</strong> {v.remediation}</p>
                            <button
                              onClick={() => openOneClickForge({
                                vulnerabilityType: v.title,
                                findingTitle: v.title,
                                details: v,
                                severity: v.severity
                              })}
                              className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-mono text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <Wrench className="w-3.5 h-3.5 text-amber-400" />
                              <span>One-Click Forge</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hardening Checklist */}
                {aiAuditResult.hardeningChecklist?.length > 0 && (
                  <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
                    <span className="text-xs font-bold text-amber-400 block">Prioritized Hardening Roadmap:</span>
                    <div className="space-y-1.5">
                      {aiAuditResult.hardeningChecklist.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-800/80 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                              {item.priority || 'P1'}
                            </span>
                            <span className="text-zinc-200">{item.action}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono">Effort: {item.estimatedEffort || 'Low'}</span>
                            <button
                              onClick={() => openOneClickForge({
                                vulnerabilityType: item.action,
                                findingTitle: item.action,
                                details: item,
                                severity: item.priority === 'P1' ? 'HIGH' : 'MEDIUM'
                              })}
                              className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded font-mono text-[10px] font-bold cursor-pointer transition-all"
                            >
                              <Wrench className="w-3 h-3 text-amber-400" />
                              <span>Forge</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400/50 mx-auto" />
                <p className="text-zinc-300 font-semibold">Ready for Autonomous Posture Evaluation</p>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                  Click below to synthesize all DNS, TLS, Security Headers, and Socket Probe findings into an executive defense scorecard.
                </p>
                <button
                  onClick={executeAiAudit}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-2 mx-auto shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Defense Posture</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: DEFENSIVE REMEDIATION */}
      {activeTab === 'remediation' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-zinc-100">Production Defensive Hardening Directives</h2>
            </div>
            <p className="text-xs text-zinc-300">
              Apply these certified configuration directives to your edge web servers (Nginx / Apache / Caddy) to attain an <strong>A+ Security Posture</strong> and mitigate spoofing, framing, and MITM vectors:
            </p>

            {/* Nginx Hardening Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Nginx Reverse Proxy Security Headers (/etc/nginx/conf.d/security.conf)</span>
                <button
                  onClick={() => copyToClipboard(`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`, 'nginx-conf')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {copiedId === 'nginx-conf' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'nginx-conf' ? 'Copied!' : 'Copy Directive'}
                </button>
              </div>
              <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto select-all leading-relaxed">
{`# 1. HSTS (Enforce HTTPS Strict Transport Security for 1 year with preloading)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 2. Clickjacking Defense
add_header X-Frame-Options "DENY" always;

# 3. MIME-Sniffing Protection
add_header X-Content-Type-Options "nosniff" always;

# 4. Referrer Leakage Prevention
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 5. Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;

# 6. Permissions / Feature Policy
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;`}
              </pre>
            </div>

            {/* RFC 9116 security.txt Template */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>RFC 9116 Standard Template (/.well-known/security.txt)</span>
                <button
                  onClick={() => copyToClipboard(`Contact: mailto:security@${targetDomain}\nPreferred-Languages: en\nPolicy: https://${targetDomain}/security-policy\nCanonical: https://${targetDomain}/.well-known/security.txt\nExpires: 2027-12-31T23:59:59.000Z`, 'sec-txt')}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {copiedId === 'sec-txt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'sec-txt' ? 'Copied!' : 'Copy Template'}
                </button>
              </div>
              <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto select-all leading-relaxed">
{`Contact: mailto:security@${targetDomain}
Preferred-Languages: en
Policy: https://${targetDomain}/security-policy
Canonical: https://${targetDomain}/.well-known/security.txt
Expires: 2027-12-31T23:59:59.000Z`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DEDICATED R&D CODE WORKSHOP FORGE */}
      {activeTab === 'forge-workshop' && (
        <OSINTForgeWorkbench
          domain={targetDomain}
          target={forgeTarget}
          forgeData={forgeData}
          forging={forging}
          forgeStack={forgeStack}
          onStackChange={handleStackChange}
          onSimulate={executeSandboxSimulation}
          simulating={simulating}
          simulationResult={simulationResult}
          onSaveToVault={handleSavePatchToVault}
          committedToVault={committedToVault}
          onInjectToScratchpad={handleInjectToScratchpad}
          injectedToScratchpad={injectedToScratchpad}
          onSendToChat={handleSendToChat}
          onNavigateToModule={onNavigateToModule}
          isModal={false}
        />
      )}

      {/* ONE-CLICK FORGE WORKBENCH MODAL OVER ANY TAB */}
      {forgeOpen && (
        <OSINTForgeWorkbench
          domain={targetDomain}
          target={forgeTarget}
          forgeData={forgeData}
          forging={forging}
          forgeStack={forgeStack}
          onStackChange={handleStackChange}
          onSimulate={executeSandboxSimulation}
          simulating={simulating}
          simulationResult={simulationResult}
          onSaveToVault={handleSavePatchToVault}
          committedToVault={committedToVault}
          onInjectToScratchpad={handleInjectToScratchpad}
          injectedToScratchpad={injectedToScratchpad}
          onSendToChat={handleSendToChat}
          onNavigateToModule={onNavigateToModule}
          onClose={() => setForgeOpen(false)}
          isModal={true}
        />
      )}
    </div>
  );
};
