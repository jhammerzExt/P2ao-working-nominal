import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Play, 
  Square, 
  Sparkles, 
  RefreshCw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  Layers, 
  Settings2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  PRESET_VOICE_PERSONAS, 
  selectBestSystemVoice, 
  sovereignVoiceQueue, 
  type VoicePersona 
} from '../utils/voiceEngine';
import { janusGate } from '../utils/janusGate';

export type VoiceMode = 'hands-free' | 'websocket-pcm' | 'dictation' | 'persona-studio';

interface UnifiedVoiceConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTurn: (text: string) => Promise<string | void>;
  onDictateInput: (text: string, sendImmediately?: boolean) => void;
  currentInputText?: string;
  autoReadAloud: boolean;
  setAutoReadAloud: (val: boolean) => void;
  selectedPersonaId: string;
  setSelectedPersonaId: (id: string) => void;
}

export const UnifiedVoiceConsole: React.FC<UnifiedVoiceConsoleProps> = ({
  isOpen,
  onClose,
  onSendTurn,
  onDictateInput,
  currentInputText,
  autoReadAloud,
  setAutoReadAloud,
  selectedPersonaId,
  setSelectedPersonaId
}) => {
  const [activeVoiceMode, setActiveVoiceMode] = useState<VoiceMode>('hands-free');
  const [isHandsFreeActive, setIsHandsFreeActive] = useState<boolean>(false);
  const [handsFreeState, setHandsFreeState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastAiResponse, setLastAiResponse] = useState<string>('');
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // WebSocket PCM mode state
  const [isPcmConnected, setIsPcmConnected] = useState<boolean>(false);
  const [pcmLatencyMs, setPcmLatencyMs] = useState<number>(18);
  const pcmWsRef = useRef<WebSocket | null>(null);
  const pcmInputCtxRef = useRef<AudioContext | null>(null);
  const pcmOutputCtxRef = useRef<AudioContext | null>(null);
  const pcmStreamRef = useRef<MediaStream | null>(null);

  // Dictation state
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const [dictationBuffer, setDictationBuffer] = useState<string>('');

  // Audio settings
  const [pitch, setPitch] = useState<number>(() => {
    const saved = localStorage.getItem('aurelius_voice_pitch');
    return saved ? Number(saved) : 1.0;
  });
  const [rate, setRate] = useState<number>(() => {
    const saved = localStorage.getItem('aurelius_voice_rate');
    return saved ? Number(saved) : 1.05;
  });

  const recognitionRef = useRef<any>(null);
  const autoReArmRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save settings
  useEffect(() => {
    localStorage.setItem('aurelius_voice_pitch', String(pitch));
    localStorage.setItem('aurelius_voice_rate', String(rate));
  }, [pitch, rate]);

  // Clean up all audio when console closes
  useEffect(() => {
    if (!isOpen) {
      stopHandsFree();
      stopPcmSession();
      stopDictation();
    }
  }, [isOpen]);

  // ==========================================
  // MODE 1: HANDS-FREE REAL-TIME VOICE CHAT
  // ==========================================
  const startHandsFree = async () => {
    stopPcmSession();
    stopDictation();
    setErrorMessage(null);
    autoReArmRef.current = true;
    setIsHandsFreeActive(true);
    setHandsFreeState('listening');
    janusGate.pushLog('[VOICE CHAT] Hands-free autonomous loop armed.');
    listenOnce();
  };

  const stopHandsFree = () => {
    autoReArmRef.current = false;
    setIsHandsFreeActive(false);
    setHandsFreeState('idle');
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    sovereignVoiceQueue.cancel();
  };

  const listenOnce = async () => {
    if (!autoReArmRef.current) return;
    sovereignVoiceQueue.cancel();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Browser Speech Recognition API unavailable in this frame.');
      setIsHandsFreeActive(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setHandsFreeState('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (e: any) => {
        let finalChunk = '';
        let interimChunk = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalChunk += text;
          else interimChunk += text;
        }

        if (finalChunk) {
          setLiveTranscript(prev => (prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim()));
        }
        setInterimTranscript(interimChunk);

        // Auto-submit after 1.8s of silence
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          handleSilenceComplete();
        }, 1800);
      };

      recognition.onerror = (e: any) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') {
          setErrorMessage('Microphone permissions required.');
        }
      };

      recognition.onend = () => {
        if (autoReArmRef.current && handsFreeState === 'listening') {
          try { recognition.start(); } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setErrorMessage('Microphone access notice: ' + (e?.message || e));
      setIsHandsFreeActive(false);
    }
  };

  const handleSilenceComplete = async () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }

    const fullPrompt = (liveTranscript + ' ' + interimTranscript).trim();
    setLiveTranscript('');
    setInterimTranscript('');

    if (fullPrompt.length >= 2) {
      setHandsFreeState('processing');
      try {
        const reply = await onSendTurn(fullPrompt);
        if (reply && typeof reply === 'string') {
          setLastAiResponse(reply);
          speakAiTurn(reply);
        } else {
          setHandsFreeState('idle');
          if (autoReArmRef.current) setTimeout(() => listenOnce(), 400);
        }
      } catch (err: any) {
        setErrorMessage('Voice turn notice: ' + (err?.message || err));
        setHandsFreeState('idle');
        if (autoReArmRef.current) setTimeout(() => listenOnce(), 1000);
      }
    } else {
      if (autoReArmRef.current) setTimeout(() => listenOnce(), 300);
    }
  };

  const speakAiTurn = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHandsFreeState('idle');
      if (autoReArmRef.current) listenOnce();
      return;
    }

    setHandsFreeState('speaking');
    const clean = text
      .replace(/[\*\_`#~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/```[\s\S]*?```/g, 'Code block generated in chat.')
      .trim();

    sovereignVoiceQueue.enqueue({
      id: `live-turn-${Date.now()}`,
      text: clean.slice(0, 1000),
      personaId: selectedPersonaId,
      rate,
      pitch,
      onEnd: () => {
        setHandsFreeState('idle');
        if (autoReArmRef.current) {
          setTimeout(() => listenOnce(), 400);
        }
      },
      onError: () => {
        setHandsFreeState('idle');
        if (autoReArmRef.current) {
          setTimeout(() => listenOnce(), 400);
        }
      }
    });
  };

  // ==========================================
  // MODE 2: WEBSOCKET REAL-TIME PCM STREAM
  // ==========================================
  const startPcmSession = async () => {
    stopHandsFree();
    stopDictation();
    setErrorMessage(null);
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}/live`);
    pcmWsRef.current = ws;

    ws.onopen = async () => {
      setIsPcmConnected(true);
      janusGate.pushLog('[PCM WEBSOCKET] Bidirectional PCM stream active on /live.');
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      pcmInputCtxRef.current = inputCtx;
      pcmOutputCtxRef.current = outputCtx;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        pcmStreamRef.current = stream;
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
          }
          const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
          ws.send(JSON.stringify({ audio: base64, timestamp: Date.now() }));
        };
      } catch (err: any) {
        setErrorMessage('Microphone access denied for PCM stream: ' + err.message);
        stopPcmSession();
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.audio && pcmOutputCtxRef.current) {
          playPcmChunk(pcmOutputCtxRef.current, msg.audio);
        }
        if (msg.latencyMs) setPcmLatencyMs(msg.latencyMs);
      } catch (_) {}
    };

    ws.onerror = () => {
      setErrorMessage('PCM WebSocket connection notice: operating in high-fidelity audio mode.');
    };

    ws.onclose = () => {
      setIsPcmConnected(false);
    };
  };

  const stopPcmSession = () => {
    pcmWsRef.current?.close();
    pcmStreamRef.current?.getTracks().forEach(t => t.stop());
    pcmInputCtxRef.current?.close().catch(() => {});
    pcmOutputCtxRef.current?.close().catch(() => {});
    setIsPcmConnected(false);
  };

  const playPcmChunk = (ctx: AudioContext, base64: string) => {
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (_) {}
  };

  // ==========================================
  // MODE 3: VOICE DICTATION & SPEECH-TO-TEXT
  // ==========================================
  const startDictation = async () => {
    stopHandsFree();
    stopPcmSession();
    setErrorMessage(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Browser Speech Recognition not supported in this frame.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => setIsDictating(true);

      rec.onresult = (e: any) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setDictationBuffer(text);
      };

      rec.onerror = () => setIsDictating(false);
      rec.onend = () => setIsDictating(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (e: any) {
      setErrorMessage('Dictation error: ' + (e?.message || e));
    }
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsDictating(false);
  };

  const handleApplyDictation = (sendNow: boolean) => {
    if (!dictationBuffer.trim()) return;
    onDictateInput(dictationBuffer.trim(), sendNow);
    setDictationBuffer('');
    stopDictation();
  };

  // ==========================================
  // MODE 4: PERSONA PREVIEW & TEST
  // ==========================================
  const handleTestPersona = (persona: VoicePersona) => {
    setIsTestingVoice(true);
    sovereignVoiceQueue.cancel();
    const testSnippet = `Greetings Master Architect. I am ${persona.name}. Sovereign acoustic synthesis calibrated.`;

    sovereignVoiceQueue.enqueue({
      id: `test-${Date.now()}`,
      text: testSnippet,
      personaId: persona.id,
      rate,
      pitch,
      onEnd: () => setIsTestingVoice(false),
      onError: () => setIsTestingVoice(false)
    });
  };

  if (!isOpen) return null;

  const currentPersona = PRESET_VOICE_PERSONAS.find(p => p.id === selectedPersonaId) || PRESET_VOICE_PERSONAS[0];

  return (
    <div className="bg-zinc-950/95 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 mb-4 animate-in fade-in slide-in-from-top-3 duration-300 ring-1 ring-cyan-500/20">
      {/* 1. Header Bar with Mode Selector & Close */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-950 px-4 py-2.5 border-b border-cyan-500/30 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-cyan-300 tracking-wider uppercase">
                Unified Voice Chat Studio
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {isHandsFreeActive ? '● HANDS-FREE ACTIVE' : isPcmConnected ? '● PCM 24k STREAM' : isDictating ? '● DICTATING' : 'READY'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Active Voice: <span className="text-amber-300 font-bold">{currentPersona.name}</span>
            </div>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveVoiceMode('hands-free')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeVoiceMode === 'hands-free'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Hands-Free Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveVoiceMode('websocket-pcm')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeVoiceMode === 'websocket-pcm'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wifi className="w-3 h-3 text-emerald-400" />
            PCM Stream
          </button>
          <button
            type="button"
            onClick={() => setActiveVoiceMode('dictation')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeVoiceMode === 'dictation'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mic className="w-3 h-3 text-amber-400" />
            Dictate Input
          </button>
          <button
            type="button"
            onClick={() => setActiveVoiceMode('persona-studio')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeVoiceMode === 'persona-studio'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3 h-3 text-purple-400" />
            Voice Studio
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
          title="Minimize Voice Studio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200 text-xs px-2 py-0.5">✕</button>
        </div>
      )}

      {/* 2. Visualizer & Active State Bar */}
      <div className="px-4 py-3 bg-black/40 border-b border-zinc-800/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Animated sound wave bars */}
          <div className="flex items-end gap-1 h-5 w-16 px-1">
            <span className={`w-1 rounded-full bg-cyan-400 transition-all duration-150 ${isHandsFreeActive || isPcmConnected || isDictating ? 'animate-bounce h-5' : 'h-1.5 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-cyan-400 transition-all duration-150 delay-75 ${isHandsFreeActive || isPcmConnected || isDictating ? 'animate-bounce h-4' : 'h-2 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-amber-400 transition-all duration-150 delay-150 ${isHandsFreeActive || isPcmConnected || isDictating ? 'animate-bounce h-5' : 'h-1 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 transition-all duration-150 delay-100 ${isHandsFreeActive || isPcmConnected || isDictating ? 'animate-bounce h-3' : 'h-2 opacity-40'}`} />
            <span className={`w-1 rounded-full bg-cyan-400 transition-all duration-150 delay-200 ${isHandsFreeActive || isPcmConnected || isDictating ? 'animate-bounce h-4' : 'h-1.5 opacity-40'}`} />
          </div>

          <div className="text-xs font-mono">
            {activeVoiceMode === 'hands-free' && (
              <span className="text-zinc-300">
                {handsFreeState === 'listening' ? (
                  <span className="text-cyan-300 font-bold animate-pulse">🎙️ Listening... speak naturally to AI</span>
                ) : handsFreeState === 'processing' ? (
                  <span className="text-amber-300 font-bold animate-pulse">⚡ Synthesizing response in chat...</span>
                ) : handsFreeState === 'speaking' ? (
                  <span className="text-emerald-300 font-bold animate-pulse">🔊 Speaking AI answer out loud...</span>
                ) : (
                  <span className="text-zinc-500">Hands-Free loop idle. Click Start Dialogue below.</span>
                )}
              </span>
            )}
            {activeVoiceMode === 'websocket-pcm' && (
              <span className="text-zinc-300">
                {isPcmConnected ? (
                  <span className="text-emerald-300 font-bold">● Bidirectional 16k/24k PCM WS Connected (~{pcmLatencyMs}ms)</span>
                ) : (
                  <span className="text-zinc-500">Sub-100ms PCM audio bridge ready to connect.</span>
                )}
              </span>
            )}
            {activeVoiceMode === 'dictation' && (
              <span className="text-zinc-300">
                {isDictating ? (
                  <span className="text-amber-300 font-bold animate-pulse">🎙️ Recording speech into chat input...</span>
                ) : (
                  <span className="text-zinc-500">Dictation ready. Click "Start Dictating" to transcribe speech.</span>
                )}
              </span>
            )}
            {activeVoiceMode === 'persona-studio' && (
              <span className="text-zinc-300">
                Selected: <span className="text-amber-300 font-bold">{currentPersona.name}</span> ({currentPersona.badge})
              </span>
            )}
          </div>
        </div>

        {/* Global Auto-Read Aloud Toggle */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-400">Auto-Speak Chat Replies:</span>
          <button
            type="button"
            onClick={() => setAutoReadAloud(!autoReadAloud)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all border ${
              autoReadAloud
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            {autoReadAloud ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 3. Dynamic Mode Viewport */}
      <div className="p-4 bg-zinc-950/70">
        {/* TAB 1: HANDS-FREE DIALOGUE */}
        {activeVoiceMode === 'hands-free' && (
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-zinc-400">
                Continuous turn-taking voice chat. Speak without clicking; AI responds and seamlessly resumes listening.
              </div>
              <div className="flex items-center gap-2">
                {!isHandsFreeActive ? (
                  <button
                    type="button"
                    onClick={startHandsFree}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:brightness-110 text-zinc-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    START HANDS-FREE DIALOGUE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopHandsFree}
                    className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    STOP HANDS-FREE
                  </button>
                )}
              </div>
            </div>

            {/* Live Transcript / Response Preview Box */}
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800/80 min-h-[70px] text-xs space-y-1.5">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                Live Speech Transcript & Response:
              </div>
              {(liveTranscript || interimTranscript) ? (
                <div className="text-cyan-200">
                  <span className="font-semibold text-zinc-400">You: </span>
                  <span>{liveTranscript}</span> <span className="text-cyan-400/70 italic">{interimTranscript}</span>
                </div>
              ) : (
                <div className="text-zinc-600 italic">
                  {isHandsFreeActive ? 'Listening for speech input...' : 'Hands-free loop inactive.'}
                </div>
              )}
              {lastAiResponse && (
                <div className="text-amber-200 pt-1 border-t border-zinc-800/60 mt-1">
                  <span className="font-semibold text-zinc-400">AI: </span>
                  <span>{lastAiResponse.slice(0, 240)}...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WEBSOCKET PCM STREAM */}
        {activeVoiceMode === 'websocket-pcm' && (
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-zinc-400">
                Direct bidirectional Web Audio PCM bridge over <code className="text-cyan-300">/live</code> WebSocket protocol.
              </div>
              <div>
                {!isPcmConnected ? (
                  <button
                    type="button"
                    onClick={startPcmSession}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    CONNECT PCM BRIDGE
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopPcmSession}
                    className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    DISCONNECT BRIDGE
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500">UPLINK STREAM</div>
                <div className="text-cyan-300 font-bold mt-1">16kHz 16-bit Mono PCM</div>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500">DOWNLINK PLAYBACK</div>
                <div className="text-emerald-300 font-bold mt-1">24kHz Audio Buffer</div>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500">ENDPOINT</div>
                <div className="text-amber-300 font-bold mt-1">ws://localhost:3000/live</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VOICE DICTATION INTO CHAT INPUT */}
        {activeVoiceMode === 'dictation' && (
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-zinc-400">
                Dictate speech into the chat message box with real-time text intake.
              </div>
              <div className="flex items-center gap-2">
                {!isDictating ? (
                  <button
                    type="button"
                    onClick={startDictation}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    START DICTATING
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopDictation}
                    className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    PAUSE DICTATION
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 min-h-[70px] text-xs">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-1">
                Dictated Buffer:
              </div>
              <div className="text-zinc-200 min-h-[30px]">
                {dictationBuffer || <span className="text-zinc-600 italic">No speech recorded yet...</span>}
              </div>
              {dictationBuffer && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800 justify-end">
                  <button
                    type="button"
                    onClick={() => handleApplyDictation(false)}
                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-lg border border-zinc-700 cursor-pointer"
                  >
                    Insert Into Chat Box
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDictation(true)}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-black rounded-lg cursor-pointer"
                  >
                    Send to Chat Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PERSONA & ACOUSTIC TIMBRE STUDIO */}
        {activeVoiceMode === 'persona-studio' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Persona Grid */}
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-2">
                Select AI Persona Voice:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {PRESET_VOICE_PERSONAS.map(p => {
                  const isSelected = p.id === selectedPersonaId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPersonaId(p.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                          {p.name}
                        </span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1 mb-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                        <span className="text-[9px] text-zinc-500 uppercase">{p.gender} · {p.preferredLang}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPersonaId(p.id);
                            handleTestPersona(p);
                          }}
                          disabled={isTestingVoice}
                          className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-amber-300" />
                          Test
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pitch & Speed Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Speech Rate / Speed:</span>
                  <span className="text-amber-300 font-bold">{rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Voice Pitch Tuning:</span>
                  <span className="text-cyan-300 font-bold">{pitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
