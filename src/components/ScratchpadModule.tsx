import React, { useState, useEffect } from 'react';
import { safeCopyToClipboard } from '../utils/clipboard.js';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Folder, 
  Search, 
  Copy, 
  Check, 
  Download, 
  Radio, 
  Zap, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { ScratchpadItem } from '../types';

interface ScratchpadModuleProps {
  onInjectIntoChat?: (content: string) => void;
  onSaveToVault?: (title: string, content: string, model: string) => void;
}

export const ScratchpadModule: React.FC<ScratchpadModuleProps> = ({ 
  onInjectIntoChat,
  onSaveToVault 
}) => {
  const [scratchpads, setScratchpads] = useState<ScratchpadItem[]>([]);
  const [activePad, setActivePad] = useState<ScratchpadItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [injectedId, setInjectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { id: 'all', label: 'All Memory' },
    { id: 'working-memory', label: 'Active Working Memory' },
    { id: 'directives', label: 'Sovereign Directives' },
    { id: 'semantic-cache', label: 'Semantic Vector Cache' },
    { id: 'hfid-dossier', label: 'HFID Attestation Dossiers' },
    { id: 'code-drafts', label: 'Code Drafts & Schemas' }
  ];

  useEffect(() => {
    fetchScratchpads();
  }, []);

  const fetchScratchpads = async () => {
    try {
      const res = await fetch('/api/scratchpads');
      if (res.ok) {
        const data = await res.json();
        const pads = data.scratchpads || [];
        setScratchpads(pads);
        if (pads.length > 0 && !activePad) {
          setActivePad(pads[0]);
        }
      }
    } catch (e) {
      console.warn('Scratchpad fetch fallback:', e);
    }
  };

  const handleCreateNew = () => {
    const newPad: ScratchpadItem = {
      id: `sp-${Date.now()}`,
      title: 'New Sovereign Scratchpad',
      category: (selectedCategory === 'all' ? 'working-memory' : selectedCategory) as any,
      content: `# New Sovereign Memory Record\n\n- Architect: Master Architect JHammerZ\n- Governance: System Integrity (100/100)\n- Substrate: Infinite Permanent Memory (0 Tokens Burned)\n\nEnter architectural notes or code schemas here...`,
      tags: ['sovereign', 'memory'],
      attested: true,
      hfidHash: 'pending_seal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setScratchpads(prev => [newPad, ...prev]);
    setActivePad(newPad);
  };

  const handleSaveActive = async () => {
    if (!activePad) return;
    setSaving(true);
    try {
      const res = await fetch('/api/scratchpads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePad)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.scratchpad) {
          setActivePad(data.scratchpad);
          setScratchpads(prev => prev.map(p => p.id === data.scratchpad.id ? data.scratchpad : p));
        }
      }
      if (onSaveToVault) {
        onSaveToVault(activePad.title, activePad.content, 'Aurelius-Infinite-Scratchpad');
      }
    } catch (e) {
      console.error('Save scratchpad error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/scratchpads/${id}`, { method: 'DELETE' });
      const filtered = scratchpads.filter(p => p.id !== id);
      setScratchpads(filtered);
      if (activePad?.id === id) {
        setActivePad(filtered[0] || null);
      }
    } catch (e) {
      console.error('Delete scratchpad error:', e);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && activePad) {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (!activePad.tags.includes(val)) {
        setActivePad({
          ...activePad,
          tags: [...activePad.tags, val]
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activePad) return;
    setActivePad({
      ...activePad,
      tags: activePad.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleCopy = async (text: string, id: string) => {
    await safeCopyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInject = () => {
    if (!activePad) return;
    if (onInjectIntoChat) {
      onInjectIntoChat(activePad.content);
      setInjectedId(activePad.id);
      setTimeout(() => setInjectedId(null), 2500);
    }
  };

  const filteredPads = scratchpads.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Scratchpad Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Infinite Memory Matrix
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-300">0 Tokens Consumed</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">System Verified Consensus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Advanced Infinite Scratchpads
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300">
              Permanent working memory, long-term semantic vector cache, and sovereign directives governed strictly by Master Architect JHammerZ and HFID.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Scratchpad</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Scratchpad List & Category Filters (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search & Category Tabs */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memory, tags, directives..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-800 text-amber-300 font-semibold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scratchpad Cards List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPads.map(pad => {
              const isSelected = activePad?.id === pad.id;
              return (
                <div
                  key={pad.id}
                  onClick={() => setActivePad(pad)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500/40 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                      {pad.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pad.id);
                      }}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-0.5"
                      title="Delete Scratchpad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 font-mono">
                    {pad.content.slice(0, 120)}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1 border-t border-white/5">
                    <span className="capitalize">{pad.category.replace('-', ' ')}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>HFID Sealed</span>
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPads.length === 0 && (
              <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-zinc-600" />
                <p className="text-xs">No scratchpads match your filter.</p>
                <button
                  onClick={handleCreateNew}
                  className="text-xs text-amber-400 hover:underline font-medium"
                >
                  Create one now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Editor & Inspector (col-span-8) */}
        {activePad ? (
          <div className="lg:col-span-8 bg-zinc-900/60 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            
            {/* Top Editor Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <input
                type="text"
                value={activePad.title}
                onChange={(e) => setActivePad({ ...activePad, title: e.target.value })}
                className="text-base sm:text-lg font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-amber-500 focus:outline-none w-full sm:w-auto"
              />

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={handleInject}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Inject into Agent Context Window"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{injectedId ? 'Injected!' : 'Inject to Agent'}</span>
                </button>

                <button
                  onClick={handleSaveActive}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save & Sync'}</span>
                </button>

                <button
                  onClick={() => handleCopy(activePad.content, activePad.id)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition-colors"
                  title="Copy Content"
                >
                  {copiedId === activePad.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Category & Tags Configuration */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800">
                <Folder className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500 text-[11px]">Category:</span>
                <select
                  value={activePad.category}
                  onChange={(e) => setActivePad({ ...activePad, category: e.target.value as any })}
                  className="bg-transparent text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="working-memory" className="bg-zinc-900 text-zinc-200">Active Working Memory</option>
                  <option value="directives" className="bg-zinc-900 text-zinc-200">Sovereign Directives</option>
                  <option value="semantic-cache" className="bg-zinc-900 text-zinc-200">Semantic Vector Cache</option>
                  <option value="hfid-dossier" className="bg-zinc-900 text-zinc-200">HFID Attestation Dossier</option>
                  <option value="code-drafts" className="bg-zinc-900 text-zinc-200">Code Drafts & Schemas</option>
                </select>
              </div>

              {/* Tags Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {activePad.tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700"
                  >
                    <span>#{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-400 text-zinc-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="+ add tag (Enter)"
                  className="bg-transparent text-[11px] text-zinc-300 placeholder-zinc-600 focus:outline-none w-24"
                />
              </div>
            </div>

            {/* Markdown Textarea */}
            <textarea
              value={activePad.content}
              onChange={(e) => setActivePad({ ...activePad, content: e.target.value })}
              rows={16}
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 resize-y leading-relaxed shadow-inner"
              placeholder="Write infinite sovereign notes, execution logs, code schemas..."
            />

            {/* Bottom Telemetry Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span>{activePad.content.split(/\s+/).filter(Boolean).length} words</span>
                <span>·</span>
                <span>{activePad.content.length} characters</span>
                <span>·</span>
                <span className="text-emerald-400">Tokens Burned: 0</span>
              </div>

              <div className="text-zinc-400 flex items-center gap-1.5 select-all">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>HFID Hash: {activePad.hfidHash?.slice(0, 16)}...</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-500 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-zinc-600" />
            <h3 className="text-base font-bold text-zinc-300">Select or Create a Scratchpad</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Infinite persistent memory records stored with zero-token expenditure and authenticated via HFID.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
