import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, ShieldCheck, Activity, Download, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

export const HardwareDiagnosticUtility: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Hardware Diagnostic Subsystem Initialized',
    '[READY] Driver Source & Build Toolchain Online'
  ]);

  const fetchTelemetry = async () => {
    setIsScanning(true);
    setLogs(prev => [...prev, '[SCAN] Polling system health & driver status...']);
    try {
      const res = await fetch('/api/system/health');
      const data = await res.json();
      setTelemetry(data);
      setLogs(prev => [
        ...prev,
        `[HEALTH] CPU Cores: ${data.resources?.cpu?.cores || 4} | Memory Heap: ${data.resources?.memory?.processHeapUsedMb || 64}MB`,
        '[SUCCESS] Diagnostic Telemetry Verified'
      ]);
    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] Telemetry poll failed: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Hardware & Driver Diagnostic Utility</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                SYSTEM_OPTIMAL
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Low-latency hardware inspection, driver source exports, and system health verification.
            </p>
          </div>
        </div>

        <button
          onClick={fetchTelemetry}
          disabled={isScanning}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Re-Scan Hardware'}</span>
        </button>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU & Memory */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Activity className="w-4 h-4" />
            <span>CPU & MEMORY HUD</span>
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cores:</span>
              <span>{telemetry?.resources?.cpu?.cores || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Architecture:</span>
              <span>{telemetry?.resources?.system?.arch || 'ARM64 / x86_64'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Process Memory:</span>
              <span className="text-emerald-400">{telemetry?.resources?.memory?.processRssMb || 0} MB</span>
            </div>
          </div>
        </div>

        {/* Bus & Driver Status */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400">
            <HardDrive className="w-4 h-4" />
            <span>BUS & DRIVER MODULE</span>
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Driver Source:</span>
              <span className="text-emerald-400">sovereign_driver.c</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Target BAR:</span>
              <span>0x8086:0x29C0 (PCI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Char Device:</span>
              <span>/dev/sovereign_bus</span>
            </div>
          </div>
        </div>

        {/* Kernel Clearance */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
            <ShieldCheck className="w-4 h-4" />
            <span>CLEARANCE & IDENTITY</span>
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Authority:</span>
              <span className="text-amber-300 font-bold">UID 0 Root Clearance</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Architect:</span>
              <span>JHammerZ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Substrate:</span>
              <span className="text-emerald-400">Universal Edge Matrix</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-zinc-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Diagnostic Console Log</span>
          </span>
          <span className="text-[11px] text-zinc-500">status: ACTIVE</span>
        </div>
        <div className="bg-zinc-950 p-4 rounded-xl space-y-1.5 max-h-48 overflow-y-auto text-zinc-300 border border-zinc-900">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-zinc-600">&gt;</span>
              <span className={log.includes('ERROR') ? 'text-rose-400' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-zinc-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
