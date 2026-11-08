import React, { useState, useEffect } from 'react';
import { safeCopyToClipboard } from '../utils/clipboard.js';
import { 
  Package, 
  Smartphone, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Terminal, 
  Zap,
  Activity,
  CheckCircle2,
  HardDrive,
  Cpu,
  Play,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const PackagerModule: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [copiedInstallCmd, setCopiedInstallCmd] = useState<boolean>(false);
  const [activeInstallerTab, setActiveInstallerTab] = useState<'apk' | 'pwa' | 'script' | 'bootloader' | 'local_installer' | 'sandbox'>('bootloader');
  const [bootloaderCode, setBootloaderCode] = useState<string>('# Loading ultimate one-shot bootloader script...');
  const [copiedBootloader, setCopiedBootloader] = useState<boolean>(false);
  const [localInstallerCode, setLocalInstallerCode] = useState<string>('# Loading local archiver installer script...');
  const [copiedLocalInstaller, setCopiedLocalInstaller] = useState<boolean>(false);

  useEffect(() => {
    if (activeInstallerTab === 'bootloader') {
      fetch('/one_shot_bootloader.sh')
        .then(res => res.text())
        .then(text => setBootloaderCode(text))
        .catch(err => setBootloaderCode('# Error loading bootloader script: ' + err.message));
    } else if (activeInstallerTab === 'local_installer') {
      fetch('/termux_local_installer.sh')
        .then(res => res.text())
        .then(text => setLocalInstallerCode(text))
        .catch(err => setLocalInstallerCode('# Error loading local installer script: ' + err.message));
    }
  }, [activeInstallerTab]);

  const handleCopyBootloader = async () => {
    await safeCopyToClipboard(bootloaderCode);
    setCopiedBootloader(true);
    logAction('✓ Copied ultimate one-shot bootloader script to clipboard.');
    setTimeout(() => setCopiedBootloader(false), 2500);
  };

  const handleDownloadBootloader = () => {
    const blob = new Blob([bootloaderCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'one_shot_bootloader.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logAction('✓ Downloaded one_shot_bootloader.sh file directly to device downloads.');
  };

  const handleCopyLocalInstaller = async () => {
    await safeCopyToClipboard(localInstallerCode);
    setCopiedLocalInstaller(true);
    logAction('✓ Copied Termux local archive installer script to clipboard.');
    setTimeout(() => setCopiedLocalInstaller(false), 2500);
  };

  const handleDownloadLocalInstaller = () => {
    const blob = new Blob([localInstallerCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'termux_local_installer.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logAction('✓ Downloaded termux_local_installer.sh file directly to device.');
  };

  useEffect(() => {
    const checkStandalone = () => {
      const isWindowStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isNavStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isWindowStandalone || isNavStandalone);
    };
    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      logAction('✓ Android WebAPK install handler registered and ready.');
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      logAction('✓ Aurelius Sovereign Application installed on Android home screen!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const logAction = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleCompileMasterApk = async () => {
    setLoading(true);
    setError(null);
    setApkUrl(null);
    setLogs([]);
    logAction('🚀 Initializing Unified Sovereign Master APK Build & Compiler...');

    try {
      const response = await fetch('/api/package/apk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'full',
          appName: 'Aurelius Sovereign',
          version: '6.0.0'
        })
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to open compilation stream');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.log) logAction(data.log);
            if (data.error) throw new Error(data.error);
            if (data.apkUrl) {
              setApkUrl(data.apkUrl);
              logAction('✓ Master Sovereign APK Compiled & Signed Successfully.');
              logAction('📲 Ready for direct 1-click on-device binary installation.');
            }
          } catch (e: any) {
            if (e instanceof SyntaxError) {
              logAction(line);
            } else {
              throw e;
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Fatal error during APK compilation');
      logAction(`❌ COMPILER FAILURE: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Direct Blob Download to prevent preview iframe proxy appending .html
  const handleDownloadApkBlob = async () => {
    setDownloading(true);
    try {
      logAction('Fetching binary APK buffer directly from memory...');
      const targetUrl = apkUrl || '/api/package/download?file=aurelius-sovereign-v1.apk';
      const response = await fetch(targetUrl);
      if (!response.ok) throw new Error(`Server returned HTTP ${response.status}`);
      
      const blobData = await response.blob();
      const apkBlob = new Blob([blobData], { type: 'application/vnd.android.package-archive' });
      
      const blobUrl = URL.createObjectURL(apkBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'aurelius-sovereign-master.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      logAction('✓ APK binary payload delivered directly to device download manager (aurelius-sovereign-master.apk).');
    } catch (e: any) {
      logAction(`❌ Download error: ${e.message}`);
      setError(`Failed to download APK: ${e.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      logAction('Triggering 1-tap Android home screen installation...');
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        logAction('✓ User accepted Android WebAPK installation.');
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      logAction('Opening Android menu guide: Tap browser menu (⋮) -> "Add to Home Screen"');
      alert('To install directly via browser: Tap your browser menu (⋮) -> Tap "Add to Home Screen" or "Install App". Android will install the app immediately.');
    }
  };

  const copyInstallCmd = async () => {
    const cmd = 'curl -sSL https://raw.githubusercontent.com/JHammerZ/Aurelius-Swarm/main/setup-termux.sh | bash';
    await safeCopyToClipboard(cmd);
    setCopiedInstallCmd(true);
    logAction('Copied sovereign 1-line installer command.');
    setTimeout(() => setCopiedInstallCmd(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                Unified Sovereign APK Compiler & In-App Installer
              </h1>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Encapsulates the entire system into an immediate, 100% functional Android app that runs offline or online.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              IN-APP INSTALLER ENGINE
            </span>
          </div>
        </div>
      </div>

      {/* Main Installer Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveInstallerTab('bootloader')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'bootloader'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Terminal className="w-4 h-4 text-amber-400" />
          One-Shot Bootloader (.sh)
        </button>

        <button
          onClick={() => setActiveInstallerTab('local_installer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'local_installer'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <HardDrive className="w-4 h-4 text-emerald-400" />
          Termux Local Archive Installer (.sh)
        </button>

        <button
          onClick={() => setActiveInstallerTab('apk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'apk'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Master APK Builder
        </button>

        <button
          onClick={() => setActiveInstallerTab('pwa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'pwa'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          1-Tap WebAPK Installer
        </button>

        <button
          onClick={() => setActiveInstallerTab('script')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'script'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Universal Script Installer
        </button>

        <button
          onClick={() => setActiveInstallerTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeInstallerTab === 'sandbox'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Play className="w-4 h-4" />
          Test App in Sandbox
        </button>
      </div>

      {/* Tab: One-Shot Bootloader (.sh) */}
      {activeInstallerTab === 'bootloader' && (
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                <Terminal className="w-3.5 h-3.5" />
                Ultimate Localhost:3000 Orchestrator Bootloader
              </div>
              <h2 className="text-xl font-bold text-zinc-100">
                one_shot_bootloader.sh (Termux &amp; Linux Compatible)
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Supports <code className="text-amber-400">--f</code> / <code className="text-amber-400">--force</code> cleanup, automated package repairs, and robust fallback sync. Copy or download directly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyBootloader}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                {copiedBootloader ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                {copiedBootloader ? 'Copied Full Script!' : 'Copy Entire Bootloader Code'}
              </button>

              <button
                onClick={handleDownloadBootloader}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold font-mono text-xs transition-all border border-zinc-700 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download .sh File
              </button>
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">one_shot_bootloader.sh (Complete Source)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">bash compatible · EOF ready</span>
            </div>

            <div className="h-96 overflow-y-auto p-4 font-mono text-[11px] text-zinc-300 bg-zinc-950 selection:bg-amber-500/30 whitespace-pre leading-relaxed">
              {bootloaderCode}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Termux Local Archive Installer (.sh) */}
      {activeInstallerTab === 'local_installer' && (
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                <HardDrive className="w-3.5 h-3.5" />
                100% Offline Local .zip / .tar.gz Termux Installer
              </div>
              <h2 className="text-xl font-bold text-zinc-100">
                termux_local_installer.sh (Zero Internet Required)
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Unpacks a local archive (.zip or .tar.gz) in Termux storage, installs offline node modules, compiles Vite production bundle, and launches localhost:3000 offline.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLocalInstaller}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                {copiedLocalInstaller ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                {copiedLocalInstaller ? 'Copied Local Installer!' : 'Copy Local Installer Code'}
              </button>

              <button
                onClick={handleDownloadLocalInstaller}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold font-mono text-xs transition-all border border-zinc-700 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Download termux_local_installer.sh
              </button>
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">termux_local_installer.sh (Complete Offline Source)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">offline termux ready · 100% local</span>
            </div>

            <div className="h-96 overflow-y-auto p-4 font-mono text-[11px] text-zinc-300 bg-zinc-950 selection:bg-emerald-500/30 whitespace-pre leading-relaxed">
              {localInstallerCode}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Master APK Compiler & Direct Binary Downloader */}
      {activeInstallerTab === 'apk' && (
        <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              100% Fully Self-Contained Sovereign Package
            </div>
            <h2 className="text-xl font-bold text-zinc-100">
              Build & Install Master Android Application
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Compiles Binary XML manifest, Dalvik DEX bytecode, OpenSSL RSA 2048 certificates, and offline web runtime into a single Android APK.
            </p>
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <button
              onClick={handleCompileMasterApk}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-black font-extrabold font-mono text-base transition-all shadow-xl shadow-amber-500/25 cursor-pointer active:scale-98"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
              {loading ? 'Compiling Master Sovereign APK...' : '⚡ Compile & Build Master Android APK'}
            </button>
          </div>

          {/* Binary Blob Direct Downloader */}
          {apkUrl && (
            <div className="max-w-xl mx-auto bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-emerald-950/30 border-2 border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in duration-300 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Master APK Binary Ready</h3>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Delivered directly as <code className="text-emerald-300">aurelius-sovereign-master.apk</code> (raw binary payload).
                </p>
              </div>

              <button
                onClick={handleDownloadApkBlob}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-sm font-mono transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                {downloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Delivering APK Payload...' : '📲 Download & Install Sovereign APK'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 1-Tap WebAPK Installer */}
      {activeInstallerTab === 'pwa' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100">Native 1-Tap Home Screen WebAPK Installer</h3>
            <p className="text-xs text-zinc-400">
              Installs Aurelius directly onto your Android home screen via native WebAPK registration with zero file downloads.
            </p>
          </div>

          <button
            onClick={handleInstallPwa}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            {isStandalone ? '✓ App Already Installed on Device' : '📲 Install Aurelius to Home Screen Now'}
          </button>
        </div>
      )}

      {/* Tab 3: Universal Script Installer */}
      {activeInstallerTab === 'script' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100">Universal Sovereign Terminal Installer</h3>
            <p className="text-xs text-zinc-400">
              Run this 1-line command on any terminal (Linux, macOS, Windows WSL, or Termux) to install and launch Aurelius as a background service.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-amber-400 flex items-center justify-between gap-2">
            <div className="truncate">
              curl -sSL https://raw.githubusercontent.com/JHammerZ/Aurelius-Swarm/main/setup-termux.sh | bash
            </div>
            <button
              onClick={copyInstallCmd}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer"
            >
              {copiedInstallCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedInstallCmd ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: In-Sandbox App Runner */}
      {activeInstallerTab === 'sandbox' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4 text-center">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100">Run App in Sovereign Local Sandbox</h3>
            <p className="text-xs text-zinc-400">
              Launch and test the full packaged application in local sandbox mode right now.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch Standalone App Session
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Build Telemetry Terminal */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Compiler Telemetry Output</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
        </div>
        
        <div className="h-60 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 selection:bg-amber-500/30">
          {logs.length === 0 && !error && (
            <div className="text-zinc-700 italic">Idle. Click &ldquo;Compile &amp; Build Master Android APK&rdquo; above...</div>
          )}
          
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/20 p-3 rounded-lg text-rose-400 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {logs.map((log, i) => (
            <div key={i} className={`flex gap-3 ${log.includes('✓') ? 'text-emerald-400' : log.includes('❌') ? 'text-rose-400' : log.includes('ℹ') ? 'text-amber-300' : 'text-zinc-400'}`}>
              <span className="text-zinc-600 shrink-0 select-none">[{logs.length - i}]</span>
              <span className="break-all whitespace-pre-wrap">{log}</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/30 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-500" />
              STATUS: {loading ? 'COMPILING' : downloading ? 'DELIVERING PAYLOAD' : 'IDLE'}
            </span>
            <span>SUBSTRATE: ANDROID APK / ARM64-V8A</span>
          </div>
          <div>VER: 6.0.0-SOVEREIGN</div>
        </div>
      </div>

      {/* Feature Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Immediate Android Install</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
              Delivered as raw binary payload. Taps open directly in Android PackageInstaller.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">100% Offline & Online</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
              All web UI, AI agents, tools, styling, and assets run standalone on your device.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">OpenSSL RSA Signed</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
              Includes compiled Binary XML, Dalvik DEX bytecode, and valid X.509 signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
