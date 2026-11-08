import React, { useState } from 'react';
import { ShieldCheck, Search, Database, AlertOctagon, Terminal, Copy, Check, Filter } from 'lucide-react';
import type { AuditLedgerItem } from '../types';

interface AuditLedgerModuleProps {
  ledger: AuditLedgerItem[];
}

export const AuditLedgerModule: React.FC<AuditLedgerModuleProps> = ({ ledger }) => {
  const [filter, setFilter] = useState<'all' | 'SUCCESS' | 'FAILED' | 'HEALED'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = ledger.filter(item => {
    const matchesStatus = filter === 'all' || item.status === filter;
    const matchesSearch = item.subsystem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              Forensic Execution Ledger
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ACTIVE AUDIT
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Immutable provenance record of all sovereign subsystem executions and self-healing events.
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Events', value: ledger.length },
          { label: 'Success Rate', value: `${ledger.length > 0 ? Math.round((ledger.filter(i => i.status === 'SUCCESS').length / ledger.length) * 100) : 0}%` },
          { label: 'Self-Healed Events', value: ledger.filter(i => i.status === 'HEALED').length }
        ].map((stat, idx) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{stat.label}</div>
            <div className="text-lg font-bold text-zinc-100 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950 p-2 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
          />
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 gap-1">
          {(['all', 'SUCCESS', 'FAILED', 'HEALED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === s ? 'bg-zinc-800 text-cyan-300 font-bold border border-zinc-700' : 'text-zinc-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-[11px] text-zinc-300">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Subsystem</th>
              <th className="p-3">Action</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Provenance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20">
                <td className="p-3 text-zinc-500 font-mono">{item.timestamp}</td>
                <td className="p-3 font-bold text-zinc-200">{item.subsystem}</td>
                <td className="p-3">{item.action}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    item.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950' :
                    item.status === 'FAILED' ? 'text-rose-400 bg-rose-950' :
                    'text-amber-400 bg-amber-950'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-right font-mono text-cyan-400">
                  {item.proofHash.slice(0, 12)}
                  <button onClick={() => handleCopy(item.proofHash, item.id)} className="ml-2 p-1 hover:text-zinc-200">
                    {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
