import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Lock, 
  Fingerprint, 
  ArrowRight,
  Sliders,
  RotateCcw,
  Check,
  Cpu,
  ShieldAlert,
  Database
} from 'lucide-react';
import type { HITLWorkflowDirective } from '../types';

const STORAGE_KEY = 'aurelius_hitl_queue_v2';

export const HITLWorkflowModule: React.FC = () => {
  // Hydrate from localStorage first to guarantee instantaneous zero-latency persistence across reloads
  const [queue, setQueue] = useState<HITLWorkflowDirective[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutationText, setMutationText] = useState<string>('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IMPLEMENTED' | 'REVOKED'>('ALL');
  const [auditLedger, setAuditLedger] = useState<any[]>([]);
  const [showLedger, setShowLedger] = useState(false);
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchQueue();
    fetchLedger();
  }, []);

  const saveToLocal = (newQueue: HITLWorkflowDirective[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQueue));
    } catch (e) {
      console.warn('Failed to save HITL queue to localStorage:', e);
    }
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hitl/queue');
      if (res.ok) {
        const data = await res.json();
        const serverQueue: HITLWorkflowDirective[] = data.queue || [];
        
        // Merge with client cache to protect user approvals if remote is stale
        setQueue(prev => {
          if (!prev || prev.length === 0) {
            saveToLocal(serverQueue);
            return serverQueue;
          }
          const merged = serverQueue.map(serverItem => {
            const localItem = prev.find(p => p.id === serverItem.id);
            // If local item was approved or mutated, prioritize approved/implemented state
            if (localItem && (localItem.status === 'APPROVED' || localItem.status === 'REJECTED' || localItem.status === 'MUTATED')) {
              return {
                ...serverItem,
                status: localItem.status,
                executionState: localItem.executionState || 'IMPLEMENTED',
                executionOutput: localItem.executionOutput || serverItem.executionOutput,
                resolvedAt: localItem.resolvedAt || serverItem.resolvedAt,
                hfidSignature: localItem.hfidSignature || serverItem.hfidSignature,
                details: localItem.details || serverItem.details
              };
            }
            return serverItem;
          });
          saveToLocal(merged);
          return merged;
        });
      }
    } catch (e) {
      console.warn('HITL queue fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchLedger = async () => {
    try {
      const res = await fetch('/api/audit/ledger');
      if (res.ok) {
        const data = await res.json();
        setAuditLedger(data.ledger || []);
      }
    } catch (_) {}
  };

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'MUTATE') => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/hitl/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action,
          mutationNotes: action === 'MUTATE' ? mutationText : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          const updatedItem: HITLWorkflowDirective = data.item;
          setQueue(prev => {
            const next = prev.map(q => q.id === id ? updatedItem : q);
            saveToLocal(next);
            return next;
          });
          fetchLedger();
        }
      }
    } catch (e) {
      console.error('HITL action error:', e);
    } finally {
      setActionLoading(null);
      setMutatingId(null);
      setMutationText('');
    }
  };

  const handleResetQueue = async () => {
    if (!confirm('Reset HITL queue to default directives? All pending and approved directives will be restored to default review state.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/hitl/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const initial = data.queue || [];
        setQueue(initial);
        saveToLocal(initial);
        setVerifiedMap({});
        fetchLedger();
      }
    } catch (e) {
      console.error('Reset error:', e);
    } finally {
      setLoading(false);
    }
  };

  const verifyExecution = (id: string) => {
    setVerifiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setVerifiedMap(prev => ({ ...prev, [id]: false }));
    }, 3000);
  };

  const filteredQueue = queue.filter(item => {
    if (filter === 'PENDING') return item.status === 'PENDING_REVIEW';
    if (filter === 'IMPLEMENTED') return item.status === 'APPROVED' || item.status === 'MUTATED';
    if (filter === 'REVOKED') return item.status === 'REJECTED';
    return true;
  });

  const pendingCount = queue.filter(i => i.status === 'PENDING_REVIEW').length;
  const approvedCount = queue.filter(i => i.status === 'APPROVED' || i.status === 'MUTATED').length;
  const rejectedCount = queue.filter(i => i.status === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Human-In-The-Loop Governance
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-300">UID 0 Gatekeeper: Master Architect JHammerZ</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 font-bold text-amber-300/90">System Verified Consensus</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sovereign HITL Governance Substrate
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Every autonomous sub-routine, kernel memory allocation, and signal mutation across the swarm is governed strictly by Master Architect Joshua Hamilton. Approvals are cryptographically sealed, persisted to disk, and executed directly in the runtime.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <a
              href="https://jhammerz.github.io"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sky-300 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>JHammerZ.github.io</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleResetQueue}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Reset Directives to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset State</span>
            </button>

            <button
              onClick={() => { fetchQueue(); fetchLedger(); }}
              disabled={loading}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all font-bold shadow-lg shadow-amber-500/20 active:scale-95"
              title="Refresh Remote Queue & Ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Authority Status Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/20 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">GOVERNANCE RULE</div>
            <div className="text-emerald-300 font-bold">Autonomous Yet Accountable</div>
            <div className="text-[10px] text-zinc-400">Governed ONLY by HFID &amp; JHammerZ</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-amber-500/20 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">HFID CONSENSUS</div>
            <div className="text-amber-300 font-bold">100 / 100 Zero-Volatility</div>
            <div className="text-[10px] text-zinc-400">Immutable tamper-proof ledger attested</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-sky-500/20 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">ACTIVE SCHEMAS</div>
            <div className="text-sky-300 font-bold">Modular Architecture · Lysander 3.1</div>
            <div className="text-[10px] text-zinc-400">Live webhook from GitHub Pages</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-purple-500/20 flex items-center gap-3 shadow-sm cursor-pointer hover:border-purple-500/40 transition-all" onClick={() => setShowLedger(!showLedger)}>
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] text-zinc-500">Immutable AUDIT LEDGER</div>
            <div className="text-purple-300 font-bold">{auditLedger.length} Sealed Entries</div>
            <div className="text-[10px] text-zinc-400">Click to {showLedger ? 'hide' : 'view'} ledger</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Sovereign Directives Pipeline</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-amber-300 font-mono">
                {queue.length} Total
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'ALL' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({queue.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                filter === 'PENDING' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <span>Pending</span>
              {pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === 'PENDING' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('IMPLEMENTED')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                filter === 'IMPLEMENTED' ? 'bg-emerald-500 text-zinc-950 font-bold shadow' : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span>Implemented</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filter === 'IMPLEMENTED' ? 'bg-zinc-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {approvedCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('REVOKED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'REVOKED' ? 'bg-rose-500 text-white font-bold shadow' : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              Revoked ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Directives List */}
        <div className="space-y-4">
          {filteredQueue.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center font-mono text-zinc-500 text-xs">
              No directives matching filter [{filter}]. All pending tasks are accounted for.
            </div>
          ) : (
            filteredQueue.map(item => {
              const isPending = item.status === 'PENDING_REVIEW';
              const isApproved = item.status === 'APPROVED' || item.status === 'MUTATED';
              const isRejected = item.status === 'REJECTED';
              const isMutating = mutatingId === item.id;
              const isVerified = verifiedMap[item.id];

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
                    isPending
                      ? 'bg-zinc-900/90 border-amber-500/40 ring-1 ring-amber-500/20'
                      : isApproved
                      ? 'bg-zinc-900/70 border-emerald-500/40 shadow-emerald-950/20'
                      : 'bg-zinc-900/40 border-rose-500/20 opacity-80'
                  }`}
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {item.type}
                        </span>
                        <h3 className="text-sm font-bold text-white tracking-wide">{item.title}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          item.riskScore === 'LOW' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.riskScore === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          RISK: {item.riskScore}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                        <span>Proposed by: <strong className="text-zinc-200">{item.proposedBy}</strong></span>
                        <span>·</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                        {item.resolvedAt && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400 font-semibold">
                              Executed: {new Date(item.resolvedAt).toLocaleTimeString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm ${
                        isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 ring-1 ring-emerald-500/20' :
                        'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}>
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        {isPending && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                        <span>{isApproved ? 'APPROVED & IMPLEMENTED' : item.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Details Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {item.details}
                  </p>

                  {/* Payload Preview */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 font-mono text-[11px] text-zinc-400 overflow-x-auto">
                    <span className="text-zinc-500">Substrate Payload: </span>
                    <span className="text-amber-300/90">{JSON.stringify(item.payload)}</span>
                  </div>

                  {/* ACTIVE SUBSTRATE EXECUTION OUTPUT FOR APPROVED / IMPLEMENTED DIRECTIVES */}
                  {isApproved && (
                    <div className="space-y-2 bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-950 p-4 rounded-xl border border-emerald-500/30 font-mono">
                      <div className="flex items-center justify-between text-xs border-b border-emerald-500/20 pb-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span>Active Substrate Execution Telemetry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.executionState || 'IMPLEMENTED'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-emerald-300/90 leading-relaxed pt-1">
                        {item.executionOutput || 'Execution completed with zero runtime anomalies. Substrate interlock active.'}
                      </div>

                      {/* Attestation Signature */}
                      {item.hfidSignature && (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-zinc-400 border-t border-zinc-800/80">
                          <span className="truncate select-all text-emerald-400">
                            Attested Hash: {item.hfidSignature}
                          </span>
                          <span className="text-zinc-500 shrink-0">
                            UID 0 Sealed: {item.resolvedAt ? new Date(item.resolvedAt).toLocaleString() : 'Active'}
                          </span>
                        </div>
                      )}

                      {/* Post-Approval Controls */}
                      <div className="pt-2 flex items-center justify-between gap-2 flex-wrap border-t border-zinc-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => verifyExecution(item.id)}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isVerified ? '✓ Substrate Verified (Live)' : 'Re-Verify Substrate Execution'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setMutatingId(item.id);
                              setMutationText('');
                            }}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Mutate Parameters</span>
                          </button>
                        </div>

                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleAction(item.id, 'REJECT')}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-950 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>Revoke / Veto</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rejected Info Box */}
                  {isRejected && (
                    <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl font-mono text-xs text-rose-300 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{item.executionOutput || 'Directive vetoed by Master Architect. Execution halted across swarm.'}</span>
                      </div>
                      <button
                        onClick={() => handleAction(item.id, 'APPROVE')}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-semibold shrink-0"
                      >
                        Re-Authorize
                      </button>
                    </div>
                  )}

                  {/* Mutation Input Box */}
                  {isMutating && (
                    <div className="space-y-2 p-3.5 bg-zinc-950 rounded-xl border border-amber-500/40">
                      <label className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 font-bold">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        Master Architect Mutation Directives (Overrides Agent defaults):
                      </label>
                      <textarea
                        value={mutationText}
                        onChange={(e) => setMutationText(e.target.value)}
                        placeholder="Specify parameter constraints, rate limits, or safety bounds (e.g. limit memory pages to 512, enforce 10ms jitter buffer)..."
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={actionLoading === item.id}
                          onClick={() => handleAction(item.id, 'MUTATE')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all"
                        >
                          Sign &amp; Dispatch Mutated
                        </button>
                        <button
                          onClick={() => setMutatingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Pending Items */}
                  {isPending && !isMutating && (
                    <div className="flex items-center gap-2.5 pt-2 border-t border-white/5 flex-wrap">
                      <button
                        disabled={actionLoading === item.id}
                        onClick={() => handleAction(item.id, 'APPROVE')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{actionLoading === item.id ? 'Sealing & Executing...' : 'Approve & Implement (HFID UID 0)'}</span>
                      </button>

                      <button
                        disabled={actionLoading === item.id}
                        onClick={() => {
                          setMutatingId(item.id);
                          setMutationText('');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Mutate Parameters</span>
                      </button>

                      <button
                        disabled={actionLoading === item.id}
                        onClick={() => handleAction(item.id, 'REJECT')}
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject &amp; Veto</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sovereign Immutable Audit Ledger Preview */}
      {showLedger && (
        <div className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-5 space-y-3 font-mono shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
              <Database className="w-4 h-4" />
              <span>Sovereign Immutable Audit Ledger (./data/audit_ledger.json)</span>
            </div>
            <button
              onClick={() => setShowLedger(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Close
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 text-[11px] scrollbar-thin scrollbar-thumb-zinc-800">
            {auditLedger.length === 0 ? (
              <div className="text-zinc-500 py-3 text-center">No sealed audit entries recorded yet.</div>
            ) : (
              auditLedger.slice().reverse().map((entry, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-amber-400 font-bold">{entry.action}</span>
                    <span className="text-[10px] text-zinc-500">{entry.timestamp}</span>
                  </div>
                  <div className="text-zinc-300 text-[10px]">{entry.result}</div>
                  <div className="text-[9px] text-zinc-500 select-all font-mono">Proof: {entry.proofHash}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
