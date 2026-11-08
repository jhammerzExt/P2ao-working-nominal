import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Compass, 
  Layers, 
  Send, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GroundingModuleProps {
  initialMode?: 'search' | 'maps';
}

export const GroundingModule: React.FC<GroundingModuleProps> = ({ initialMode = 'search' }) => {
  const [mode, setMode] = useState<'search' | 'maps'>(initialMode);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    groundingMetadata?: any;
    model: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const searchPresets = [
    'What are the latest verified developments in room-temperature superconductors in 2026?',
    'Current market leaders and breakthroughs in AI inference silicon architectures',
    'Real-time regulatory framework updates for sovereign AI data centers'
  ];

  const mapsPresets = [
    'Locate the world top 5 semiconductor fabrication clusters and their regional logistics corridors',
    'Best tech and robotics innovation campuses in the Tokyo Bay area with nearest transit hubs',
    'Detailed transit route and topography from Zurich HB to ETH Zurich Science City'
  ];

  const handleExecute = async (presetQuery?: string) => {
    const query = presetQuery || prompt;
    if (!query.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const endpoint = mode === 'search' ? '/api/grounding/search' : '/api/grounding/maps';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query.trim() })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Grounding call failed');
      setResult(data);
    } catch (err: any) {
      console.error('Grounding failure:', err);
      setResult({
        text: `Error during ${mode === 'search' ? 'Google Search' : 'Google Maps'} grounding: ${err.message}`,
        model: 'gemini-3.5-flash'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Mode Switcher Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${mode === 'search' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {mode === 'search' ? <Search className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>{mode === 'search' ? 'Google Search Grounding' : 'Google Maps Grounding'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                gemini-3.5-flash
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === 'search' 
                ? 'Synthesize up-to-date real-world facts with direct live Google Search tool verification.' 
                : 'Extract spatial, geographical, architectural, and routing intelligence via Google Maps.'}
            </p>
          </div>
        </div>

        {/* Toggle Pills */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-medium self-stretch sm:self-auto">
          <button
            onClick={() => { setMode('search'); setResult(null); }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'search'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Tool</span>
          </button>
          <button
            onClick={() => { setMode('maps'); setResult(null); }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'maps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Maps Tool</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === 'search'
                ? 'Enter query for live Google Search grounding (e.g. Latest orbital space station launch dates...)'
                : 'Enter query for Google Maps spatial grounding (e.g. Locate high-speed rail nodes in Tokyo...)'
            }
            rows={3}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none shadow-lg"
          />
          <button
            onClick={() => handleExecute()}
            disabled={!prompt.trim() || loading}
            className={`absolute right-3 bottom-3 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'search'
                ? 'bg-sky-500 hover:bg-sky-400 text-zinc-950 shadow-sky-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
            }`}
          >
            <span>{loading ? 'Grounding...' : 'Execute Grounding'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Query Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-500">Suggested Inquiries:</span>
          {(mode === 'search' ? searchPresets : mapsPresets).map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset);
                handleExecute(preset);
              }}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 rounded-lg px-2.5 py-1 text-left transition-colors flex items-center gap-1.5"
            >
              <span className="truncate max-w-[260px]">{preset}</span>
              <ArrowRight className="w-3 h-3 shrink-0 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className={`w-10 h-10 rounded-full border-2 border-t-transparent animate-spin ${mode === 'search' ? 'border-sky-400' : 'border-emerald-400'}`} />
          <div className="text-sm font-medium text-zinc-200">
            Aurelius consulting {mode === 'search' ? 'Google Search Grounding' : 'Google Maps Grounding'}...
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            Model: gemini-3.5-flash with live API tool verification
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !loading && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mode === 'search' ? 'bg-sky-400' : 'bg-emerald-400'}`} />
              <span className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                {mode === 'search' ? 'Search Grounded Output' : 'Maps Grounded Output'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">({result.model})</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Synthesis'}</span>
            </button>
          </div>

          {/* Synthesis Content */}
          <div className="prose prose-invert max-w-none text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
            {result.text}
          </div>

          {/* Grounding Metadata / Sources Breakdown */}
          {result.groundingMetadata && (
            <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
              <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Grounding Verification & Reference Web Sources:</span>
              </div>

              {/* Search queries used by model */}
              {result.groundingMetadata.webSearchQueries && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">Queries Issued:</span>
                  {result.groundingMetadata.webSearchQueries.map((q: string, i: number) => (
                    <span key={i} className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-mono text-[11px]">
                      "{q}"
                    </span>
                  ))}
                </div>
              )}

              {/* Grounding chunks / links */}
              {result.groundingMetadata.groundingChunks && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {result.groundingMetadata.groundingChunks.slice(0, 6).map((chunk: any, idx: number) => {
                    const web = chunk.web;
                    if (!web) return null;
                    return (
                      <a
                        key={idx}
                        href={web.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800/80 transition-colors group text-xs"
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium text-zinc-200 group-hover:text-amber-300 truncate">
                            {web.title || web.uri}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono truncate">
                            {web.uri}
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
