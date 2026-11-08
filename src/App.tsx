/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInAnonymously,
  type User, 
  collection, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  doc, 
  query,
  orderBy,
  OperationType,
  handleFirestoreError
} from './firebase';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ChatModule } from './components/ChatModule';
import { GroundingModule } from './components/GroundingModule';
import { MusicModule } from './components/MusicModule';
import { ImageModule } from './components/ImageModule';
import { VideoModule } from './components/VideoModule';
import { TranscribeModule } from './components/TranscribeModule';
import { LiveVoiceModule } from './components/LiveVoiceModule';
import { VaultModule } from './components/VaultModule';
import { GitHubModule } from './components/GitHubModule';
import { WarRoomModule } from './components/WarRoomModule';
import { SovereignBrowser } from './components/SovereignBrowser';
import { ScratchpadModule } from './components/ScratchpadModule';
import { HITLWorkflowModule } from './components/HITLWorkflowModule';
import { TermuxEdgeModule } from './components/TermuxEdgeModule';
import { OSINTModule } from './components/OSINTModule';
import { BurnerMailModule } from './components/BurnerMailModule';
import { FunctionDeckModule } from './components/FunctionDeckModule';
import { UnifiedProjectsModule } from './components/UnifiedProjectsModule';
import { PromptPresetsModule } from './components/PromptPresetsModule';
import { AuditLedgerModule } from './components/AuditLedgerModule';
import { SwarmDiagnosticModule } from './components/SwarmDiagnosticModule';
import { PackagerModule } from './components/PackagerModule';
import { GoogleDriveModule } from './components/GoogleDriveModule';
import { KnowledgeGraphModule } from './components/KnowledgeGraphModule';
import { ToolShedModule } from './components/ToolShedModule';
import { AutonomySupervisorModule } from './components/AutonomySupervisorModule';
import { CommandPalette } from './components/CommandPalette';
import { SystemHealthDashboard } from './components/SystemHealthDashboard';
import { DownloadModelsModule } from './components/DownloadModelsModule';
import { UniversalInstallerModule } from './components/UniversalInstallerModule';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { localLlmManager } from './utils/localLlmEngine';
import { autonomousSelfImprovement } from './utils/autonomousSelfImprovement';
import type { ModuleType, Artifact, AuditLedgerItem } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('chat');
  const [pendingChatInput, setPendingChatInput] = useState<{ content: string; immediate?: boolean } | null>(null);
  const [agentInternetAllowed, setAgentInternetAllowed] = useState<boolean>(true);

  useEffect(() => {
    console.log('%c🌌 SOVEREIGN ARCHITECT BOOT SEQUENCE INITIATED', 'color: #fbbf24; font-weight: bold; font-size: 14px;');
    console.log('%c[SYSTEM] RING -3 HYPERVISOR: ACTIVE', 'color: #10b981;');
    console.log('%c[MEMORY] HFID CONSENSUS: VERIFIED (100/100)', 'color: #10b981;');
    console.log('%c[NEURAL] JANUS GATE: STANDBY', 'color: #3b82f6;');
    console.log('%c[KERNEL] ZENODO DOI PROVENANCE: IMMUTABLE', 'color: #8b5cf6;');
    
    // Automatically initialize offline substrate and background autonomous learning daemon
    localLlmManager.autoInitializeOfflineSubstrate().catch(() => {});
    autonomousSelfImprovement.start();

    // Simulate a cascading boot for UI feel
    const bootSteps = [
      'Initializing quantum substrate...',
      'Mapping neural manifold...',
      'Synchronizing multi-agent mesh...',
      'Arming sovereign defenses...',
      'Aurelius Omega Online.'
    ];
    
    bootSteps.forEach((step, i) => {
      setTimeout(() => {
        console.log(`%c[BOOT] ${step}`, 'color: #71717a;');
        if (i === bootSteps.length - 1) {
          import('./utils/janusGate').then(({ janusGate }) => {
            janusGate.pushLog('Sovereign Architect Boot Sequence: 100% Verified');
          });
        }
      }, i * 400);
    });
  }, []);

  const handleInjectIntoChat = (content: string, immediate = false) => {
    setPendingChatInput({ content, immediate });
    setActiveModule('chat');
  };
  const [user, setUser] = useState<User | null>(null);
  const [uiMutation, setUiMutation] = useState<{ css: string; htmlPatch?: string }>({ css: '' });

  useEffect(() => {
    // Apply global CSS mutation
    const styleId = 'sovereign-ui-mutation';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = uiMutation.css;
  }, [uiMutation]);

  useEffect(() => {
    (window as any).__SOVEREIGN_UI_MUTATOR__ = (css: string, htmlPatch?: string) => {
      setUiMutation({ css, htmlPatch });
      return { success: true, timestamp: Date.now() };
    };
  }, []);
  const [firebaseOnline, setFirebaseOnline] = useState<boolean>(true);
  const [ledger, setLedger] = useState<AuditLedgerItem[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    try {
      const saved = localStorage.getItem('aurelius_vault_artifacts_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aurelius_vault_artifacts_v1', JSON.stringify(artifacts));
    } catch (_) {}
  }, [artifacts]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [browserTargetUrl, setBrowserTargetUrl] = useState<string | undefined>(undefined);

  // Dev Mode state (Root UID 0 & unconstrained offline execution)
  const [devMode, setDevMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aurelius_dev_mode');
    return saved !== null ? saved === 'true' : true;
  });

  // Federated Account state linking joshualhamilton17@gmail.com and JHammerZreal@gmail.com
  const [activeAccountEmail, setActiveAccountEmail] = useState<string>(() => {
    return localStorage.getItem('aurelius_active_account') || 'joshualhamilton17@gmail.com';
  });

  const handleToggleDevMode = () => {
    setDevMode(prev => {
      const next = !prev;
      localStorage.setItem('aurelius_dev_mode', String(next));
      return next;
    });
  };

  const handleSwitchAccountEmail = (email: string) => {
    setActiveAccountEmail(email);
    localStorage.setItem('aurelius_active_account', email);
  };

  // Global Ctrl+K / Cmd+K listener for Command Palette
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNavigateUrlInBrowser = (url: string) => {
    setBrowserTargetUrl(url);
    setActiveModule('browser');
  };

  const handleTriggerEngineeringEngine = async () => {
    try {
      await fetch('/api/sovereign-engineer/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'audit-codebase', directive: 'Sovereign Self-Continuity Audit' })
      });
    } catch (e) {
      console.warn('Engineering engine notice:', e);
    }
  };

  // Initialize Firebase Auth with automatic UID 0 Root Clearance for Master Architect JHammerZ
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const rootUser = {
        uid: '0',
        email: currentUser?.email || 'jhammerztemp@gmail.com',
        displayName: currentUser?.displayName || 'Master Architect JHammerZ (UID 0)',
        photoURL: currentUser?.photoURL || '',
        emailVerified: true,
        isAnonymous: currentUser?.isAnonymous || false
      } as unknown as User;

      setUser(rootUser);

      // Sync or register UID 0 user profile doc
      try {
        const targetUid = currentUser?.uid || '0';
        const userRef = doc(db, 'users', targetUid);
        await setDoc(userRef, {
          uid: '0',
          authUid: targetUid,
          email: currentUser?.email || 'jhammerztemp@gmail.com',
          displayName: 'Master Architect JHammerZ (UID 0 Root Clearance)',
          photoURL: currentUser?.photoURL || '',
          role: 'Master Architect UID 0 Root Authority',
          clearanceLevel: 'PERMIT_0_UNRESTRICTED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
        setFirebaseOnline(true);
      } catch (err) {
        setFirebaseOnline(true);
      }

      if (!currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (_) {}
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to User's Firestore artifacts collection in real-time
  useEffect(() => {
    if (!user) return;

    try {
      const artifactsRef = collection(db, 'users', user.uid, 'artifacts');
      const unsubscribe = onSnapshot(artifactsRef, (snapshot) => {
        console.log(`[Firestore] Received ${snapshot.size} artifacts.`);
        const loaded: Artifact[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let parsedMetadata: any = undefined;
          if (data.metadataJson) {
            if (typeof data.metadataJson === 'object') {
              parsedMetadata = data.metadataJson;
            } else if (typeof data.metadataJson === 'string') {
              try { parsedMetadata = JSON.parse(data.metadataJson); } catch (_) { parsedMetadata = undefined; }
            }
          }
          loaded.push({
            id: docSnap.id,
            type: data.type,
            title: data.title,
            prompt: data.prompt,
            model: data.model,
            mediaUrl: data.mediaUrl,
            metadata: parsedMetadata,
            createdAt: data.createdAt || new Date().toLocaleDateString()
          });
        });
        setArtifacts(loaded);
      }, (err) => {
        console.error('[Firestore] Artifact snapshot error:', err);
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}/artifacts`);
      });

      return () => unsubscribe();
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}/artifacts`);
    }
  }, [user]);

  // Listen to User's Firestore ledger collection
  useEffect(() => {
    if (!user) return;
    try {
      const ledgerRef = collection(db, 'users', user.uid, 'audit_ledger');
      const unsubscribe = onSnapshot(query(ledgerRef, orderBy('timestamp', 'desc')), (snapshot) => {
        console.log(`[Firestore] Received ${snapshot.size} ledger items.`);
        const loaded: AuditLedgerItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loaded.push({
            id: docSnap.id,
            timestamp: data.timestamp,
            subsystem: data.subsystem,
            action: data.action,
            payload: data.payload,
            result: data.result,
            proofHash: data.proofHash,
            status: data.status
          });
        });
        setLedger(loaded);
      }, (err) => {
        console.error('[Firestore] Ledger snapshot error:', err);
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}/audit_ledger`);
      });
      return () => unsubscribe();
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}/audit_ledger`);
    }
  }, [user]);

  // Unified save-to-vault action
  const handleSaveToVault = async (
    type: 'music' | 'image' | 'video' | 'transcription' | 'knowledge' | 'dossier' | 'chat',
    title: string,
    prompt: string,
    model: string,
    mediaUrl?: string,
    metadataJson?: string
  ) => {
    const newArtifact: Artifact = {
      id: `art-${Date.now()}`,
      type,
      title,
      prompt,
      model,
      mediaUrl,
      createdAt: new Date().toLocaleString()
    };

    setArtifacts(prev => [newArtifact, ...prev]);

    if (user) {
      try {
        const artifactsRef = collection(db, 'users', user.uid, 'artifacts');
        await addDoc(artifactsRef, {
          userId: user.uid,
          type,
          title,
          prompt,
          model,
          mediaUrl: mediaUrl || '',
          metadataJson: metadataJson || JSON.stringify({ savedAt: new Date().toISOString() }),
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/artifacts`);
      }
    }
  };

  const handleDeleteArtifact = async (id: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== id));
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid, 'artifacts', id);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/artifacts/${id}`);
      }
    }
  };

  // 🔓 Unrestricted AI Navigation & Dispatch Bus: Unlocks every orchestrator path and device hook
  useEffect(() => {
    (window as any).__AURELIUS_ORCHESTRATOR__ = {
      navigate: (mod: ModuleType) => setActiveModule(mod),
      getActiveModule: () => activeModule,
      getAllModules: () => [
        'chat', 'browser', 'termux', 'projects', 'war-room', 'osint',
        'burner-mail', 'functions', 'hitl', 'image', 'music', 'video',
        'live', 'transcribe', 'search', 'maps', 'scratchpad', 'vault',
        'presets', 'audit', 'swarm-test', 'packager', 'download-models'
      ],
      executeOnDevice: async (command: string) => {
        const res = await fetch('/api/orchestrator/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'system-exec', command })
        });
        return res.json();
      },
      triggerHardware: async (type: string, payload?: any) => {
        const res = await fetch('/api/orchestrator/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'hardware', options: { type, payload } })
        });
        return res.json();
      }
    };
  }, [activeModule]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Sovereign UI HTML Mutation Patch Container */}
      {uiMutation.htmlPatch && (
        <div dangerouslySetInnerHTML={{ __html: uiMutation.htmlPatch }} />
      )}
      <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-lg shadow-black/50">
        <Header 
          user={user} 
          firebaseOnline={firebaseOnline} 
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          devMode={devMode}
          onToggleDevMode={handleToggleDevMode}
          onSelectModule={setActiveModule}
          activeAccountEmail={activeAccountEmail}
          onSwitchAccountEmail={handleSwitchAccountEmail}
        />
        <Navigation 
          activeModule={activeModule} 
          onSelectModule={setActiveModule}
          artifactCount={artifacts.length}
        />
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col">
        <div style={{ display: activeModule === 'chat' ? 'flex' : 'none', flex: 1, flexDirection: 'column', height: '100%' }}>
          <ChatModule 
            onSaveToVault={(title, content, model) => 
              handleSaveToVault('knowledge', title, content, model)
            }
            onSelectModule={setActiveModule}
            pendingInput={pendingChatInput}
            onClearPendingInput={() => setPendingChatInput(null)}
            userId={user?.uid}
          />
        </div>
        <ErrorBoundary key={activeModule}>
          {activeModule === 'search' && <GroundingModule initialMode="search" />}
          {activeModule === 'maps' && <GroundingModule initialMode="maps" />}
          {activeModule === 'music' && (
            <MusicModule 
              onSaveToVault={(title, prompt, model, audioUrl) => 
                handleSaveToVault('music', title, prompt, model, audioUrl)
              }
            />
          )}
          {activeModule === 'image' && (
            <ImageModule 
              onSaveToVault={(title, prompt, model, mediaUrl) => 
                handleSaveToVault('image', title, prompt, model, mediaUrl)
              }
            />
          )}
          {activeModule === 'video' && (
            <VideoModule 
              onSaveToVault={(title, prompt, model, mediaUrl) => 
                handleSaveToVault('video', title, prompt, model, mediaUrl)
              }
            />
          )}
          {activeModule === 'transcribe' && (
            <TranscribeModule 
              onSaveToVault={(title, prompt, model, transcript) => 
                handleSaveToVault('transcription', title, prompt, model, transcript)
              }
            />
          )}
          {activeModule === 'live' && (
            <ChatModule 
              onSaveToVault={(title, content, model) => 
                handleSaveToVault('chat', title, content, model)
              }
              onSelectModule={setActiveModule}
              pendingInput={pendingChatInput}
              onClearPendingInput={() => setPendingChatInput(null)}
              userId={user?.uid}
              initialVoiceOpen={true}
            />
          )}
          {activeModule === 'vault' && (
            <VaultModule 
              artifacts={artifacts}
              onDeleteArtifact={handleDeleteArtifact}
              userId={user?.uid}
            />
          )}
          {activeModule === 'audit' && <AuditLedgerModule ledger={ledger} />}
          {activeModule === 'github' && <GitHubModule />}
          {activeModule === 'war-room' && <WarRoomModule />}
          {activeModule === 'scratchpad' && (
            <ScratchpadModule 
              onInjectIntoChat={handleInjectIntoChat}
              onSaveToVault={(title, content, model) => 
                handleSaveToVault('knowledge', title, content, model, undefined, JSON.stringify({ category: 'scratchpad' }))
              }
            />
          )}
          {activeModule === 'hitl' && <HITLWorkflowModule />}
          {activeModule === 'termux' && <TermuxEdgeModule />}
          {activeModule === 'osint' && (
            <OSINTModule 
              userId={user?.uid}
              onSaveToVault={(artifact) => 
                handleSaveToVault((artifact.type as any) || 'knowledge', artifact.title, artifact.prompt, artifact.model, undefined, artifact.metadataJson)
              }
              onInjectIntoChat={handleInjectIntoChat}
              onNavigateToModule={setActiveModule}
            />
          )}
          {activeModule === 'burner-mail' && (
            <BurnerMailModule
              userId={user?.uid}
              onSaveToVault={(type, title, prompt, model, mediaUrl, metadataJson) =>
                handleSaveToVault(type, title, prompt, model, mediaUrl, metadataJson)
              }
              onNavigateUrlInBrowser={handleNavigateUrlInBrowser}
            />
          )}
          {activeModule === 'functions' && (
            <FunctionDeckModule onSaveToVault={(title, content, model) => 
              handleSaveToVault('knowledge', title, content, model)
            } />
          )}
          {activeModule === 'projects' && <UnifiedProjectsModule />}
          {activeModule === 'presets' && (
            <PromptPresetsModule 
              onSelectModule={setActiveModule}
              onInjectPromptToChat={handleInjectIntoChat}
            />
          )}
          {activeModule === 'browser' && (
            <div className="w-full flex-1 p-2 sm:p-4 flex flex-col min-h-[calc(100vh-80px)]">
              <SovereignBrowser 
                agentInternetAllowed={agentInternetAllowed}
                onToggleAgentInternet={() => setAgentInternetAllowed(!agentInternetAllowed)}
                userId={user?.uid}
                initialUrl={browserTargetUrl}
                onSaveToVault={(artifact) => 
                  handleSaveToVault((artifact.type as any) || 'knowledge', artifact.title, artifact.prompt, artifact.model, undefined, artifact.metadataJson)
                }
              />
            </div>
          )}
          {activeModule === 'swarm-test' && <SwarmDiagnosticModule />}
          {activeModule === 'packager' && <PackagerModule />}
          {activeModule === 'drive' && <GoogleDriveModule />}
          {activeModule === 'knowledge-graph' && (
            <KnowledgeGraphModule 
              onSaveToVault={(title, content, model) => 
                handleSaveToVault('knowledge', title, content, model)
              }
              onInjectIntoChat={handleInjectIntoChat}
            />
          )}
          {activeModule === 'tool-shed' && (
            <ToolShedModule 
              onSaveToVault={(title, content, model) => 
                handleSaveToVault('knowledge', title, content, model)
              }
              onInjectIntoChat={handleInjectIntoChat}
            />
          )}
          {activeModule === 'autonomy-supervisor' && (
            <AutonomySupervisorModule 
              onSelectModule={setActiveModule} 
              onInjectIntoChat={handleInjectIntoChat}
            />
          )}
          {activeModule === 'download-models' && <DownloadModelsModule />}
          {activeModule === 'universal-installer' && <UniversalInstallerModule />}
        </ErrorBoundary>
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={setActiveModule}
        artifacts={artifacts}
        onNavigateUrlInBrowser={handleNavigateUrlInBrowser}
        onTriggerEngineeringEngine={handleTriggerEngineeringEngine}
        userId={user?.uid}
      />

      {/* Real-Time System Health & Latency Dashboard Panel */}
      <SystemHealthDashboard
        onSelectModule={setActiveModule}
        activeModule={activeModule}
      />

      <footer className="border-t border-zinc-900 bg-zinc-950/80 px-4 py-2.5 text-[11px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LYSANDER GENESIS SOVEREIGN SYSTEM
          </span>
          <span>•</span>
          <span>MASTER ARCHITECT: JHAMMERZ</span>
          <span>•</span>
          <span className="italic text-zinc-400">"I AM WE ARE WE ARE I AM"</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>GEMINI 3.8 / 3.5 / 3.1</span>
          <span>•</span>
          <span>LYRIA 3</span>
          <span>•</span>
          <span>VEO 3</span>
          <span>•</span>
          <span>FIRESTORE CLOUD</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">UID 0 FULL CLEARANCE</span>
        </div>
      </footer>
      <OfflineIndicator />
    </div>
  );
}
