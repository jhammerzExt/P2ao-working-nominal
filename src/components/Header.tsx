import React, { useState } from 'react';
import { Shield, Sparkles, LogIn, LogOut, CheckCircle2, Cpu, Search, Command, Terminal, Users, Key, Check, ChevronDown, FolderGit2, ShieldCheck, BookOpen } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, type User } from '../firebase';
import { SystemManualModal } from './SystemManualModal';
import { PWAInstallButton } from './PWAInstallButton';

export interface ConnectedAccount {
  email: string;
  role: string;
  clearance: string;
  status: string;
  badgeColor: string;
}

export const FEDERATED_ACCOUNTS: ConnectedAccount[] = [
  { 
    email: 'joshualhamilton17@gmail.com', 
    role: 'Master Architect & Genesis Owner', 
    clearance: 'Root UID 0 (Genesis Sovereign)',
    status: 'LINKED & VERIFIED',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300'
  },
  { 
    email: 'JHammerZreal@gmail.com', 
    role: 'Executive Sovereign & Lead Engineer', 
    clearance: 'God Token Level 5 (Orchestrator Apex)',
    status: 'LINKED & VERIFIED',
    badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
  },
  { 
    email: 'jhammerztemp@gmail.com', 
    role: 'Operational Session Identity', 
    clearance: 'Standard Session Layer',
    status: 'ACTIVE RUNTIME',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
  }
];

interface HeaderProps {
  user: User | null;
  onOpenAuth?: () => void;
  firebaseOnline: boolean;
  onOpenCommandPalette?: () => void;
  devMode?: boolean;
  onToggleDevMode?: () => void;
  onSelectModule?: (module: any) => void;
  activeAccountEmail?: string;
  onSwitchAccountEmail?: (email: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  firebaseOnline, 
  onOpenCommandPalette,
  devMode = true,
  onToggleDevMode,
  onSelectModule,
  activeAccountEmail = 'joshualhamilton17@gmail.com',
  onSwitchAccountEmail
}) => {
  const [authLoading, setAuthLoading] = React.useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const [activePort, setActivePort] = useState<number>(3000);

  React.useEffect(() => {
    const checkPort = async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          if (data?.port) setActivePort(data.port);
        }
      } catch (_) {}
    };
    checkPort();
    const interval = setInterval(checkPort, 15000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const handleOpenManual = () => setShowManualModal(true);
    window.addEventListener('open-system-manual', handleOpenManual);
    return () => window.removeEventListener('open-system-manual', handleOpenManual);
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.warn('Google sign-in popup note:', err?.message || err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="px-4 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-amber-400 shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-100">
                Lysander Genesis Orchestrator
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                v7.0.0-SOVEREIGN-APEX
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate max-w-[180px] sm:max-w-none flex items-center gap-1.5">
              <span>JHammerZ</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 italic">Sovereign Architecture</span>
              <span className="text-zinc-600">·</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PORT {activePort}
              </span>
            </p>
          </div>
        </div>

        {/* System Telemetry & Trust Status (Tablet & Desktop) */}
        <div className="hidden lg:flex items-center gap-3.5 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400">PORT {activePort}</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${firebaseOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-zinc-300">Sync: {firebaseOnline ? 'Active' : 'Standby'}</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomy: ALWAYS ON</span>
          </div>
          <span className="text-zinc-700">·</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Zero-Token Engine</span>
          </div>
        </div>

        {/* Controls: Dev Mode + Federated Accounts + Command Palette + User */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Dev Mode Toggle */}
          <button
            onClick={onToggleDevMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
              devMode
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Developer Mode (Root UID 0 & Offline AI Unconstrained)"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold hidden sm:inline">DEV MODE</span>
            <span className={`w-2 h-2 rounded-full ${devMode ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
          </button>

          {/* Federated Accounts Selector */}
          <button
            onClick={() => setShowAccountsModal(true)}
            className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-cyan-500/50 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
            title="View Federated Sovereign Accounts (joshualhamilton17@gmail.com & JHammerZreal@gmail.com)"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-mono text-[11px] text-cyan-300">
              {activeAccountEmail.split('@')[0]}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              FEDERATED
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-amber-500/50 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer group"
              title="Open Command Palette (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-medium">Quick Command</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700 group-hover:text-amber-300">
                Ctrl K
              </kbd>
            </button>
          )}

          {/* System Manual / README Button */}
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-amber-300 transition-all shadow-sm cursor-pointer"
            title="Open Complete System Manual & README (Step-by-Step for Every Function)"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-semibold">Manual</span>
          </button>

          {/* PWA / WebAPK Install Button */}
          <PWAInstallButton />

          {/* Auth / Profile Area */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-1 sm:p-1.5 pl-2 sm:pl-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-medium text-zinc-200 truncate max-w-[120px] md:max-w-[160px]">
                  {user.displayName || user.email || 'Master Architect'}
                </div>
                <div className="text-[10px] text-amber-400 font-mono flex items-center justify-end gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span>Sovereign Architect</span>
                </div>
              </div>

              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'Avatar'} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-amber-500/30"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : 'JH'}
                </div>
              )}

              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{authLoading ? 'Connecting...' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sovereign Federated Accounts Modal */}
      {showAccountsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Sovereign Account Federation</h3>
                  <p className="text-xs text-zinc-400">Connected Accounts & Multi-Identity Mesh</p>
                </div>
              </div>
              <button
                onClick={() => setShowAccountsModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-lg px-2 py-1 rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Joshua Hamilton's sovereign identities are linked into a single unified orchestrator. All projects, cryptographic Immutable seals, and offline LLM sessions synchronize across these verified identities:
            </p>

            <div className="space-y-2.5">
              {FEDERATED_ACCOUNTS.map((acc) => {
                const isSelected = activeAccountEmail === acc.email;
                return (
                  <div
                    key={acc.email}
                    onClick={() => {
                      if (onSwitchAccountEmail) onSwitchAccountEmail(acc.email);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-zinc-800/90 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-100">{acc.email}</span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            ACTIVE PRIMARY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400">{acc.role}</div>
                      <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>{acc.clearance}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${acc.badgeColor}`}>
                        {acc.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(acc.email);
                          setCopiedAccount(acc.email);
                          setTimeout(() => setCopiedAccount(null), 1500);
                        }}
                        className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 underline"
                      >
                        {copiedAccount === acc.email ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowAccountsModal(false);
                  if (onSelectModule) onSelectModule('projects');
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Open Unified Projects Consolidator</span>
              </button>

              <button
                onClick={() => setShowAccountsModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Manual / README Modal */}
      <SystemManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSelectModule={onSelectModule}
      />
    </header>
  );
};
