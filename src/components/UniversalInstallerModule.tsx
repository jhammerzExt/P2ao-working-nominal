import React, { useState } from 'react';
import { Download, Terminal, ShieldCheck, Cpu, Check, Copy, HardDrive, Smartphone, Sparkles, RefreshCw } from 'lucide-react';

export const UniversalInstallerModule: React.FC = () => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'linux' | 'macos' | 'windows' | 'termux'>('linux');

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const installerUrl = `${origin}/api/sovereign/universal-installer`;
  const runnerUrl = `${origin}/api/sovereign/runner-script`;
  const archiveUrl = `${origin}/api/sovereign/download-archive`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(label);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  const [compilingBootloader, setCompilingBootloader] = useState(false);
  const [bootloaderMsg, setBootloaderMsg] = useState<string | null>(null);

  const handleGenerateOnDemand = async () => {
    try {
      setCompilingBootloader(true);
      setBootloaderMsg('Compiling 1:1 sovereign bootloader package on demand...');
      const res = await fetch('/api/sovereign/generate-bootloader', { method: 'POST' });
      const data = await res.json();
      if (data?.success) {
        setBootloaderMsg('✓ Bootloader package compiled successfully on demand!');
        window.location.href = '/one_shot_bootloader.sh';
      } else {
        setBootloaderMsg(`Compilation notice: ${data?.error || 'Completed'}`);
      }
    } catch (err: any) {
      setBootloaderMsg(`Notice: ${err.message}`);
    } finally {
      setCompilingBootloader(false);
      setTimeout(() => setBootloaderMsg(null), 4000);
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 p-4 sm:p-8 overflow-y-auto font-mono">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-sky-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  SOVEREIGN DEPLOYMENT SUITE
                </span>
                <span className="text-zinc-400 text-xs">UID 0 Root Clearance</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
                Universal Installer & Cross-Platform Runner
              </h1>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Download and deploy the Aurelius & Lysander Sovereign Matrix with its permanent built-in Ollama offline neural engine on any device, server, or operating system with zero manual configuration.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerateOnDemand}
                disabled={compilingBootloader}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${compilingBootloader ? 'animate-spin' : ''}`} />
                <span>{compilingBootloader ? 'Compiling Package...' : 'Compile On-Demand Bootloader (.sh)'}</span>
              </button>
              <a
                href={installerUrl}
                download="universal_aurelius_installer.sh"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Universal Installer</span>
              </a>
            </div>
          </div>

          {bootloaderMsg && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{bootloaderMsg}</span>
            </div>
          )}
        </div>

        {/* Quick Start Terminal Box */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-zinc-200">One-Line Universal Install & Run</h3>
            </div>
            <button
              onClick={() => copyToClipboard(`curl -sL "${installerUrl}" | bash`, 'oneline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors cursor-pointer"
            >
              {copiedScript === 'oneline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copiedScript === 'oneline' ? 'Copied!' : 'Copy Command'}</span>
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
            <code>curl -sL "{installerUrl}" | bash</code>
          </div>

          <p className="text-xs text-zinc-400">
            This universal script automatically detects your operating system, installs prerequisites (Node.js, git, curl), downloads the complete orchestrator archive, spins up the permanent Ollama local model daemon, and boots the application.
          </p>
        </div>

        {/* Download Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200">1. Universal Installer Script</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Universal setup shell script (`universal_aurelius_installer.sh`) designed for Linux, macOS, WSL, and Termux.
              </p>
            </div>
            <a
              href={installerUrl}
              download="universal_aurelius_installer.sh"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download .sh Script
            </a>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200">2. Cross-Platform Runner</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The execution runner (`run-aurelius.sh`) that starts the Node server and permanent Ollama daemon instantly.
              </p>
            </div>
            <a
              href={runnerUrl}
              download="run-aurelius.sh"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Runner Script
            </a>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-zinc-200">3. Complete Source Archive</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Full 1:1 orchestrator codebase source tarball (`aurelius-sovereign-matrix.tar.gz`) for fully offline air-gapped deployment.
              </p>
            </div>
            <a
              href={archiveUrl}
              download="aurelius-sovereign-matrix.tar.gz"
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Archive (Tar.gz)
            </a>
          </div>

        </div>

        {/* Operating System Specific Guides */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-sm text-zinc-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Operating System Deployment Guide</span>
          </h3>

          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3 text-xs">
            {(['linux', 'macos', 'windows', 'termux'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer uppercase tracking-wider ${
                  activeTab === tab
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {tab === 'linux' ? 'Linux Workstation' : tab === 'macos' ? 'macOS Apple Silicon' : tab === 'windows' ? 'Windows / WSL2' : 'Android Termux'}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2 text-xs text-zinc-300 leading-relaxed">
            {activeTab === 'linux' && (
              <>
                <p className="font-bold text-amber-400">Linux Ubuntu / Debian / Fedora Deployment:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400">
                  <li>Open your terminal and run: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">curl -sL "{installerUrl}" | bash</code></li>
                  <li>Navigate to the installed directory: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">cd ~/aurelius-sovereign-matrix</code></li>
                  <li>Run the orchestrator with the custom runner: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">./run-aurelius.sh</code></li>
                </ol>
              </>
            )}

            {activeTab === 'macos' && (
              <>
                <p className="font-bold text-amber-400">macOS Apple Silicon (M1/M2/M3/M4) Deployment:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400">
                  <li>Ensure Homebrew is installed, then run in Terminal: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">curl -sL "{installerUrl}" | bash</code></li>
                  <li>The installer will configure Metal GPU acceleration and local model weights.</li>
                  <li>Start the application: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">cd ~/aurelius-sovereign-matrix && ./run-aurelius.sh</code></li>
                </ol>
              </>
            )}

            {activeTab === 'windows' && (
              <>
                <p className="font-bold text-amber-400">Windows 10/11 via WSL2 (Ubuntu):</p>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400">
                  <li>Open your WSL2 Ubuntu terminal.</li>
                  <li>Execute the universal installer: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">curl -sL "{installerUrl}" | bash</code></li>
                  <li>Open browser at <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">http://localhost:3000</code> to access the full control center with permanent Ollama daemon.</li>
                </ol>
              </>
            )}

            {activeTab === 'termux' && (
              <>
                <p className="font-bold text-amber-400">Android Termux (Samsung Galaxy / Mobile):</p>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400">
                  <li>Open Termux app on your Android device.</li>
                  <li>Run: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">pkg update && pkg install curl -y</code></li>
                  <li>Execute installer: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">curl -sL "{installerUrl}" | bash</code></li>
                  <li>Launch matrix: <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded">cd ~/aurelius-sovereign-matrix && ./run-aurelius.sh</code></li>
                </ol>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
