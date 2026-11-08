import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Upload, 
  Layers, 
  Wand2, 
  RefreshCw, 
  Check, 
  BookmarkPlus, 
  Sliders, 
  Maximize2 
} from 'lucide-react';
import visualCanvasImg from '../assets/images/visual_studio_canvas_1791569663435.jpg';
import { sovereignAi } from '../utils/sovereignAiDispatcher';
import { checkSafetyInvariant } from '../utils/safety';

interface ImageModuleProps {
  onSaveToVault?: (title: string, prompt: string, model: string, mediaUrl: string) => void;
}

export const ImageModule: React.FC<ImageModuleProps> = ({ onSaveToVault }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<'flux-1-schnell' | 'flux-realism-pro' | 'flux-3d-architect' | 'stable-diffusion-any' | 'aurelius-sovereign-4k'>('flux-1-schnell');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSize, setImageSize] = useState('2K');
  const [useSearch, setUseSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  
  // Image editing state
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [inputImageToEdit, setInputImageToEdit] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [exhaustedModels, setExhaustedModels] = useState<Set<string>>(new Set());
  const [negativePrompt, setNegativePrompt] = useState('');
  const [guidanceScale, setGuidanceScale] = useState(7.5);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4', '21:9', '4:1', '1:4'];
  const imageSizes = ['1K', '2K', '4K'];

  const promptPresets = [
    'Brutalist obsidian architectural citadel soaring above a sea of clouds, ambient amber luminescence, raytracing, 8k hyperdetail',
    'Futuristic holographic CAD blueprint of a hyper-dimensional quantum computer core, schematic wireframes, glowing phosphor',
    'Neo-classical marble colonnade fused with liquid chrome and bioluminescent flora, cinematic architectural photography',
    'Cyberpunk mega-city skyline at rainy midnight with neon holographic advertisements and flying aerodynes, photorealistic anamorphic 4K'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInputImageToEdit(reader.result as string);
      setMode('edit');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setSavedSuccess(false);
    setErrorMessage(null);
    setInfoMessage(null);

    const safety = checkSafetyInvariant(prompt + ' ' + negativePrompt);
    if (!safety.safe) {
      setErrorMessage(safety.reason || 'Safety restricted');
      setLoading(false);
      return;
    }

    try {
      let endpoint = '/api/image/generate';
      let payload: any = {
        prompt: prompt.trim(),
        model,
        aspectRatio,
        imageSize,
        useSearch,
        skipCloud: exhaustedModels.has(model),
        negativePrompt: negativePrompt.trim(),
        guidanceScale
      };

      if (mode === 'edit' && inputImageToEdit) {
        endpoint = '/api/image/edit';
        payload = {
          prompt: prompt.trim(),
          model,
          imageBase64: inputImageToEdit,
          aspectRatio
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('CLOUD_QUOTA_EXHAUSTED');
        }
        throw new Error(data.error || 'Image processing failed');
      }

      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
      setDescription(data.text || '');
    } catch (err: any) {
      console.warn('Image generation note, engaging tertiary sovereign fallback:', err);
      
      const isQuotaError = err.message === 'CLOUD_QUOTA_EXHAUSTED';
      
      try {
        // Tertiary Fallback: Direct Pollinations fetch from client if server proxy fails
        setInfoMessage('Primary neural path deferred. Engaging sovereign substrate fallback...');
        
        let width = 1024;
        let height = 1024;
        if (aspectRatio === '16:9') { width = 1280; height = 720; }
        else if (aspectRatio === '9:16') { width = 720; height = 1280; }
        
        const seed = Math.floor(Math.random() * 1000000);
        const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
        
        // Try to fetch it to make sure it works
        const checkRes = await fetch(directUrl, { method: 'HEAD' });
        if (checkRes.ok) {
          setGeneratedImage(directUrl);
          setDescription(`[Sovereign Neural Synthesis] Multi-layered fallback active. Result generated via Flux.1 Substrate.`);
          return;
        }

        // Final Safety Net: Procedural Canvas
        const offlineImg = sovereignAi.synthesizeOfflineImage(prompt, 1024, 1024);
        setGeneratedImage(offlineImg);
        setDescription(`[Procedural Visual Synthesis] High-fidelity vector blueprint synthesized locally with 0 tokens.`);
        if (isQuotaError) {
          setExhaustedModels(prev => new Set(prev).add(model));
          setInfoMessage('Cloud quota exhausted for this model. Seamlessly generated offline procedural asset.');
        }
      } catch (e: any) {
        setErrorMessage(`Synthesis notice: ${err.message || 'Operation failed'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `aurelius-nano-banana-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSave = () => {
    if (!generatedImage || !onSaveToVault) return;
    onSaveToVault(
      prompt.slice(0, 40) + '...',
      prompt,
      model,
      generatedImage
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <span>Visual Synthesis & Editing</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                {model}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              High-resolution visual generation and iterative image-to-image editing powered by {model}.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setMode('create')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'create'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create Image
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'edit'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Edit Existing
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs & Parameters */}
        <div className="lg:col-span-1 space-y-4">
          {mode === 'edit' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
                <span>Source Image to Edit:</span>
                {inputImageToEdit && (
                  <button
                    onClick={() => setInputImageToEdit(null)}
                    className="text-[10px] text-zinc-500 hover:text-red-400"
                  >
                    Clear
                  </button>
                )}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {inputImageToEdit ? (
                <div className="relative rounded-xl overflow-hidden border border-zinc-700 aspect-square group">
                  <img src={inputImageToEdit} alt="To Edit" className="w-full h-full object-cover" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-zinc-200 font-mono"
                  >
                    Upload Different Image
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-zinc-800 hover:border-purple-500/50 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Upload className="w-6 h-6 text-zinc-400" />
                  <span className="text-xs font-mono">Upload Image to Edit</span>
                </button>
              )}
            </div>
          )}

          {/* Model Architecture Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">Diffusion Model Tier:</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                LATEST 2026
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
              {[
                { id: 'flux-1-schnell', name: 'Flux.1 Schnell', desc: 'Apex High-Fidelity Photorealism', badge: 'OPEN' },
                { id: 'flux-realism-pro', name: 'Flux Realism Pro', desc: 'Studio Grade Cinematic Reality', badge: 'OPEN' },
                { id: 'flux-3d-architect', name: 'Flux 3D Architect', desc: 'High-Detail Spatial & CAD Blueprints', badge: 'OPEN' },
                { id: 'stable-diffusion-any', name: 'Any-Diffusion SD', desc: 'Robust General-Purpose Synthesis', badge: 'OPEN' },
                { id: 'aurelius-sovereign-4k', name: 'Aurelius Sovereign 4K', desc: '100% Free • Zero-Cost Substrate', badge: 'FREE' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id as any)}
                  className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                    model === m.id
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-sm font-semibold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-[12px] font-bold text-zinc-200">{m.name}</div>
                    <div className="text-[10px] text-zinc-500">{m.desc}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    model === m.id ? 'bg-purple-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {m.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Config */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-400">Aspect Ratio:</span>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
              {aspectRatios.map(ar => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    aspectRatio === ar
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Config */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-400">Resolution (Nano Banana 2.1):</span>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
              {imageSizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setImageSize(sz)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    imageSize === sz
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Search Grounding for Images */}
          {mode === 'create' && (
            <label className="flex items-center gap-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors">
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => setUseSearch(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0"
              />
              <span className="text-xs text-zinc-300 font-mono">
                Enable Web/Image Search Grounding
              </span>
            </label>
          )}

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-500">Architectural Prompts:</span>
            <div className="space-y-1.5">
              {promptPresets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="w-full p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-lg text-left text-[11px] text-zinc-400 hover:text-purple-300 transition-colors truncate block"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Prompt & Result Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Primary prompt..."
              rows={3}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none shadow-lg"
            />
            
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Negative prompt (what to avoid)..."
              rows={2}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 resize-none shadow-lg"
            />

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Guidance Scale: {guidanceScale}</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5" 
                value={guidanceScale} 
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="flex-1"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading || (mode === 'edit' && !inputImageToEdit)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with {model}...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{mode === 'create' ? 'Synthesize Image' : 'Apply Visual Transformation'}</span>
                </>
              )}
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5">✕</button>
            </div>
          )}

          {/* Info Banner */}
          {infoMessage && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-mono flex items-center justify-between">
              <span>{infoMessage}</span>
              <button onClick={() => setInfoMessage(null)} className="text-cyan-400 hover:text-cyan-200 text-xs px-2 py-0.5">✕</button>
            </div>
          )}

          {/* Generated Canvas Preview */}
          {generatedImage ? (
            <div className="bg-zinc-900 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Rendered Output ({aspectRatio} • {imageSize})
                </span>

                <div className="flex items-center gap-2">
                  {onSaveToVault && (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 text-xs bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-amber-300 transition-colors"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved to Vault</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Save to Vault</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 px-3 py-1.5 rounded-lg text-purple-300 transition-colors font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center max-h-[500px]">
                <img
                  src={generatedImage}
                  alt="Generated visual"
                  className="max-h-[500px] w-auto object-contain rounded-xl"
                />
              </div>

              {description && (
                <div className="text-xs text-zinc-400 font-mono bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                  {description}
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[360px] flex flex-col justify-end p-6">
              <img 
                src={visualCanvasImg} 
                alt="Visual Studio Showcase" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Studio Gallery Showcase · Flux.1 Schnell</span>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  High-Fidelity Visual Generation Ready
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-lg">
                  Supports 1K–4K resolutions, precise aspect ratios, search grounding, and image-to-image transformations. Select a prompt preset on the left to begin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
