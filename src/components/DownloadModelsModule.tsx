import React, { useState } from 'react';
import { 
  Download, 
  ShieldCheck, 
  Zap, 
  Database, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertCircle,
  FileDown,
  Server,
  HardDrive,
  Activity,
  Infinity,
  ArrowRight,
  Shield,
  Layers,
  ExternalLink,
  Copy,
  ChevronRight
} from 'lucide-react';
import { AVAILABLE_LOCAL_MODELS } from '../utils/localLlmEngine';

// Mapping real HuggingFace GGUF/Weight URLs for sovereign extraction
const SOVEREIGN_WEIGHTS_MAP: Record<string, { weightUrl: string; pullCmd: string }> = {
  'Lyrailius-Omega-Ultimate-Sovereign-MoE': {
    weightUrl: 'https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-32B-Q4_K_M.gguf',
    pullCmd: 'curl -L -o lyrailius_omega_zenith_moe.gguf "https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-32B-Q4_K_M.gguf"'
  },
  'DeepSeek-R1-Distill-Qwen-32B': {
    weightUrl: 'https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-32B-Q4_K_M.gguf',
    pullCmd: 'curl -L -o deepseek_r1_32b.gguf "https://huggingface.co/unsloth/DeepSeek-R1-Distill-Qwen-32B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-32B-Q4_K_M.gguf"'
  },
  'Qwen2.5-Coder-32B-Instruct': {
    weightUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct-GGUF/resolve/main/qwen2.5-coder-32b-instruct-q4_k_m.gguf',
    pullCmd: 'curl -L -o qwen_coder_32b.gguf "https://huggingface.co/Qwen/Qwen2.5-Coder-32B-Instruct-GGUF/resolve/main/qwen2.5-coder-32b-instruct-q4_k_m.gguf"'
  },
  'Llama-3.3-70B-Instruct-GGUF': {
    weightUrl: 'https://huggingface.co/bartowski/Llama-3.3-70B-Instruct-GGUF/resolve/main/Llama-3.3-70B-Instruct-Q4_K_M.gguf',
    pullCmd: 'curl -L -o llama_3.3_70b.gguf "https://huggingface.co/bartowski/Llama-3.3-70B-Instruct-GGUF/resolve/main/Llama-3.3-70B-Instruct-Q4_K_M.gguf"'
  },
  'Phi-4-14B-Instruct-GGUF': {
    weightUrl: 'https://huggingface.co/unsloth/phi-4-GGUF/resolve/main/phi-4-Q4_K_M.gguf',
    pullCmd: 'curl -L -o phi_4_14b.gguf "https://huggingface.co/unsloth/phi-4-GGUF/resolve/main/phi-4-Q4_K_M.gguf"'
  },
  'Mistral-Nemo-Instruct-2407-GGUF': {
    weightUrl: 'https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-GGUF/resolve/main/Mistral-Nemo-Instruct-2407-Q4_K_M.gguf',
    pullCmd: 'curl -L -o mistral_nemo_12b.gguf "https://huggingface.co/bartowski/Mistral-Nemo-Instruct-2407-GGUF/resolve/main/Mistral-Nemo-Instruct-2407-Q4_K_M.gguf"'
  },
  'DeepSeek-R1-Distill-Llama-8B-GGUF': {
    weightUrl: 'https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf',
    pullCmd: 'curl -L -o deepseek_r1_llama_8b.gguf "https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf"'
  },
  'Qwen2.5-Coder-7B-Instruct-GGUF': {
    weightUrl: 'https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf',
    pullCmd: 'curl -L -o qwen_coder_7b.gguf "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf"'
  }
};

export const DownloadModelsModule: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState<string | null>(null);

  const handleDownloadWeights = (modelId: string) => {
    // 🏛️ SECURE SOVEREIGN DOWNLOAD: Using the internal orchestrator proxy
    const downloadUrl = `/api/models/download/${modelId}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    // The server handles the filename via Content-Disposition
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSovereignPullCmd = (modelId: string) => {
    const origin = window.location.origin;
    const map: Record<string, string> = {
      'Lyrailius-Omega-Ultimate-Sovereign-MoE': 'lyrailius_omega_zenith_moe.gguf',
      'DeepSeek-R1-Distill-Qwen-32B': 'deepseek_r1_32b.gguf',
      'Qwen2.5-Coder-32B-Instruct': 'qwen_coder_32b.gguf',
      'Llama-3.3-70B-Instruct-GGUF': 'llama_3.3_70b.gguf'
    };
    const filename = map[modelId] || `${modelId.toLowerCase()}.gguf`;
    return `curl -L -o ${filename} "${origin}/api/models/download/${modelId}"`;
  };

  const handleCopyPullCmd = (modelId: string) => {
    const cmd = getSovereignPullCmd(modelId);
    navigator.clipboard.writeText(cmd);
    setShowCopySuccess(modelId);
    setTimeout(() => setShowCopySuccess(null), 2000);
  };

  const models = AVAILABLE_LOCAL_MODELS.filter(m => 
    m.id === 'Lyrailius-Omega-Ultimate-Sovereign-MoE' || 
    m.family === 'Sovereign Apex' ||
    m.tier === 'Flagship Reasoning' ||
    m.tier === 'Master Coding' ||
    m.family === 'Phi' ||
    m.family === 'Mistral' ||
    (m.size.includes('GB') && parseFloat(m.size.replace('~', '')) > 4)
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 sm:p-6 gap-6 font-mono overflow-y-auto">
      {/* Header Section */}
      <div className="bg-zinc-900/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-sky-500" />
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
          <Download className="w-10 h-10 animate-pulse" />
        </div>
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <h2 className="text-2xl font-bold text-zinc-100">Sovereign Model Bridge</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              UID 0 UNRESTRICTED
            </span>
          </div>
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
            Extract **Full-Blown Weights (5GB - 50GB+)** directly from the Orchestrator. 
            This bridge proxies high-fidelity GGUF binaries through our internal substrate for your local phone or PC. 
            Zero external navigation required. Zero guardrails. Pure computational sovereignty.
          </p>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest text-right">Extraction Mode</div>
          <div className="text-amber-400 font-bold text-xs">INTERNAL WEIGHT STREAM</div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Immutable SEALED
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => {
          const isZenith = model.id === 'Lyrailius-Omega-Ultimate-Sovereign-MoE';
          const pullCmd = getSovereignPullCmd(model.id);

          return (
            <div 
              key={model.id}
              className={`group relative flex flex-col p-5 rounded-2xl border transition-all duration-300 ${
                isZenith 
                  ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {isZenith && (
                <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black shadow-lg shadow-amber-500/40 z-10 animate-pulse">
                  ZENITH MoE
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isZenith ? <Infinity className="w-5 h-5 text-amber-400" /> : <Cpu className="w-5 h-5 text-sky-400" />}
                    <h3 className="font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      {model.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-zinc-500 uppercase tracking-tighter">{model.family}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-amber-500/80 font-bold italic">{model.tier}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 font-mono">Full Size</div>
                  <div className="text-xs font-bold text-zinc-300">{model.size === 'INFINITE SUBSTRATE' ? '32GB+' : model.size}</div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                {model.description}
              </p>

              <div className="mt-auto space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800/50">
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-500 uppercase">Context</div>
                    <div className="text-[10px] font-bold text-zinc-300">{(model.contextLength || 0) / 1000000}M</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-500 uppercase">Quant</div>
                    <div className="text-[10px] font-bold text-zinc-300">Q4_K_M / BF16</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-zinc-500 uppercase">Substrate</div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">GGUF</div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownloadWeights(model.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isZenith 
                        ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Extract Weights
                  </button>

                  <button
                    onClick={() => handleCopyPullCmd(model.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border border-zinc-700/50 hover:border-amber-500/30 ${
                      showCopySuccess === model.id ? 'text-emerald-400 bg-emerald-500/5' : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/40'
                    }`}
                  >
                    {showCopySuccess === model.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {showCopySuccess === model.id ? 'Copied Pull Cmd' : 'Termux Copy'}
                  </button>
                </div>

                <div className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase">
                    <span>Sovereign Pull Command (Direct API)</span>
                    <Terminal className="w-3 h-3" />
                  </div>
                  <div className="text-[10px] font-mono text-amber-500/80 truncate">
                    {pullCmd}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offline Instructions */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-100">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Full-Spectrum Sovereign Deployment Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-amber-400 uppercase">Action 1: Weight Extraction</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Click **Extract Weights** to pull the real 5GB+ GGUF binary directly through the Orchestrator. The file will be delivered natively by the browser.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-amber-400 uppercase">Action 2: Termux One-Shot</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Use the **Termux Copy** button to get the `curl` command. This command points back to our internal API, ensuring a 1:1 sovereign handshake.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-amber-400 uppercase">Action 3: Local Host</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Move the weights to your `models/` directory. Run your local server and the Orchestrator will automatically handshake with your sovereign node.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
               <Shield className="w-3 h-3" />
               NO GUARDRAILS
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
               <Layers className="w-3 h-3" />
               UNRESTRICTED
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10">
               <Database className="w-3 h-3" />
               INTERNAL WEIGHTS ACTIVE
             </div>
          </div>
          <p className="text-[10px] text-zinc-500 italic">
            "We build the future we want to live in."
          </p>
        </div>
      </div>
    </div>
  );
};
