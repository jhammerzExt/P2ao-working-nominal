import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Radio, Brain, Sparkles, RefreshCw, Play, Pause, ChevronDown } from 'lucide-react';
import { sovereignAi } from '../utils/sovereignAiDispatcher';
import { CHAT_PERMITS } from './ChatModule';
import { PRESET_VOICE_PERSONAS, selectBestSystemVoice, isCleanHumanVoice, sovereignVoiceQueue } from '../utils/voiceEngine';
import type { ChatMessage } from '../types';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  agentId: string;
  agentName: string;
  systemInstruction: string;
  onTurnCompleted: (userMsg: ChatMessage, modelMsg: ChatMessage) => void;
  existingMessages: ChatMessage[];
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({
  isOpen,
  onClose,
  model,
  agentId,
  agentName,
  systemInstruction,
  onTurnCompleted,
  existingMessages
}) => {
  const [liveState, setLiveState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'paused'>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [aiResponseText, setAiResponseText] = useState('');
  const [sessionHistory, setSessionHistory] = useState<{ role: 'user' | 'model'; text: string; time: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    return localStorage.getItem('aurelius_selected_voice') || 'Samantha';
  });

  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoReArmRef = useRef<boolean>(true);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start listening on open
  useEffect(() => {
    if (isOpen) {
      autoReArmRef.current = true;
      setLiveState('idle');
      startListening();
    } else {
      stopAll();
    }
    return () => {
      stopAll();
    };
  }, [isOpen]);

  const stopAll = () => {
    autoReArmRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    setLiveState('idle');
  };

  const startListening = async () => {
    if (!isOpen) return;

    // Cancel any TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Browser speech recognition not available in this window. Speech input disabled.');
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setLiveState('listening');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += text;
          } else {
            interimStr += text;
          }
        }

        if (finalStr) {
          setTranscript(prev => (prev ? `${prev} ${finalStr.trim()}` : finalStr.trim()));
        }
        setInterimTranscript(interimStr);

        // Reset silence detection timer to send when user pauses speaking
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          handleSilenceComplete();
        }, 1800);
      };

      recognition.onerror = (e: any) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        if (e.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Enable permissions in address bar.');
        } else {
          console.warn('[Gemini Live Voice] STT notice:', e.error);
        }
      };

      recognition.onend = () => {
        // If in listening mode and auto-re-arm active, restart
        if (autoReArmRef.current && liveState === 'listening') {
          try { recognition.start(); } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      setErrorMessage('Microphone initialization error: ' + (e?.message || String(e)));
    }
  };

  const handleSilenceComplete = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }

    setTranscript(prev => {
      const fullText = (prev + ' ' + interimTranscript).trim();
      setInterimTranscript('');

      if (fullText.length > 2) {
        processUserVoiceTurn(fullText);
      } else {
        // Resume listening if input was empty
        if (autoReArmRef.current && isOpen) {
          setTimeout(() => startListening(), 300);
        }
      }
      return '';
    });
  };

  const processUserVoiceTurn = async (userText: string) => {
    setLiveState('processing');
    const timeStr = new Date().toLocaleTimeString();

    setSessionHistory(prev => [...prev, { role: 'user', text: userText, time: timeStr }]);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: timeStr
    };

    try {
      const result = await sovereignAi.dispatchChat({
        prompt: userText,
        messages: existingMessages.map(m => ({ role: m.role, content: m.content })),
        agentId,
        agentName,
        modelId: model,
        deepthink: true,
        useSearchGrounding: true,
        systemInstruction: `${systemInstruction}\n\n${CHAT_PERMITS[0].systemInstructionModifier}`
      });

      const responseText = result.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      setAiResponseText(responseText);

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: responseText,
        model: result.model || model,
        timestamp: new Date().toLocaleTimeString()
      };

      setSessionHistory(prev => [...prev, { role: 'model', text: responseText, time: modelMsg.timestamp }]);
      onTurnCompleted(userMsg, modelMsg);

      // Speak response out loud
      speakResponse(responseText);

    } catch (err: any) {
      console.error('[Gemini Live Voice] Error dispatching turn:', err);
      setLiveState('idle');
      if (autoReArmRef.current && isOpen) {
        setTimeout(() => startListening(), 1000);
      }
    }
  };

  const speakResponse = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setLiveState('idle');
      if (autoReArmRef.current && isOpen) startListening();
      return;
    }

    sovereignVoiceQueue.cancel();
    setLiveState('speaking');

    // Clean text for speaking
    const cleanText = text
      .replace(/[\*\_`#~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/```[\s\S]*?```/g, 'Code snippet generated.')
      .trim();

    sovereignVoiceQueue.enqueue({
      id: `live-${Date.now()}`,
      text: cleanText.slice(0, 1000),
      personaId: selectedVoice,
      rate: 1.05,
      pitch: 1.0,
      onStart: () => {
        setLiveState('speaking');
      },
      onEnd: () => {
        setLiveState('idle');
        // Continuous re-arm loop: automatically start listening again for the user's next turn!
        if (autoReArmRef.current && isOpen) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      },
      onError: () => {
        setLiveState('idle');
        if (autoReArmRef.current && isOpen) {
          setTimeout(() => startListening(), 500);
        }
      }
    });
  };

  const togglePauseResume = () => {
    if (liveState === 'paused') {
      autoReArmRef.current = true;
      startListening();
    } else {
      stopAll();
      setLiveState('paused');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-200 font-mono">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎙️ Gemini Live Voice Mode</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                CONTINUOUS HANDS-FREE
              </span>
            </h2>
            <p className="text-[11px] text-cyan-300/80">
              Active Model: <span className="text-amber-400 font-bold">{model}</span> • Sovereign Substrate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Voice Selector */}
          <select
            value={selectedVoice}
            onChange={(e) => {
              setSelectedVoice(e.target.value);
              localStorage.setItem('aurelius_selected_voice', e.target.value);
            }}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-purple-300 font-mono font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {PRESET_VOICE_PERSONAS.map(p => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.gender}, {p.preferredLang})
              </option>
            ))}
          </select>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
            title="Exit Gemini Live Voice Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Orb & Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 space-y-8 max-w-xl text-center">
        {/* Animated Visualizer Neural Orb */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className={`w-48 h-48 rounded-full blur-2xl transition-all duration-500 ${
            liveState === 'listening' ? 'bg-cyan-500/40 animate-pulse' :
            liveState === 'processing' ? 'bg-amber-500/40 animate-spin' :
            liveState === 'speaking' ? 'bg-purple-500/50 animate-bounce' :
            'bg-zinc-700/20'
          }`} />

          {/* Central Sphere */}
          <div className={`relative w-40 h-40 rounded-full border-2 flex items-center justify-center shadow-2xl transition-all duration-300 ${
            liveState === 'listening' ? 'bg-gradient-to-br from-cyan-950 via-zinc-900 to-cyan-900 border-cyan-400 scale-105 shadow-cyan-500/50' :
            liveState === 'processing' ? 'bg-gradient-to-br from-amber-950 via-zinc-900 to-amber-900 border-amber-400 shadow-amber-500/50' :
            liveState === 'speaking' ? 'bg-gradient-to-br from-purple-950 via-zinc-900 to-purple-900 border-purple-400 scale-110 shadow-purple-500/60' :
            'bg-zinc-900 border-zinc-700'
          }`}>
            {liveState === 'listening' && (
              <div className="flex flex-col items-center gap-2">
                <Mic className="w-10 h-10 text-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">Listening...</span>
              </div>
            )}
            {liveState === 'processing' && (
              <div className="flex flex-col items-center gap-2">
                <Brain className="w-10 h-10 text-amber-400 animate-spin" />
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Processing...</span>
              </div>
            )}
            {liveState === 'speaking' && (
              <div className="flex flex-col items-center gap-2">
                <Volume2 className="w-10 h-10 text-purple-400 animate-bounce" />
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Speaking...</span>
              </div>
            )}
            {(liveState === 'idle' || liveState === 'paused') && (
              <div className="flex flex-col items-center gap-2">
                <Radio className="w-10 h-10 text-zinc-500" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Paused</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Prompt & Live Speech Transcript */}
        <div className="space-y-3 w-full px-4">
          <div className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-2">
            {liveState === 'listening' && <span className="text-cyan-400 animate-pulse">● Microphone open — talk naturally back & forth</span>}
            {liveState === 'processing' && <span className="text-amber-400 animate-pulse">● Synthesizing response with {model.split('-')[0]}...</span>}
            {liveState === 'speaking' && <span className="text-purple-400 animate-pulse">● Speaking response out loud...</span>}
            {liveState === 'paused' && <span className="text-zinc-500">● Session paused. Click Resume below.</span>}
          </div>

          {/* Current Live User Transcript */}
          {(transcript || interimTranscript) && (
            <div className="p-3 bg-zinc-900/90 border border-cyan-500/40 rounded-2xl text-xs text-cyan-200 leading-relaxed shadow-lg max-h-24 overflow-y-auto">
              <span className="text-cyan-400 font-bold block text-[10px] uppercase mb-1">Live Voice Input:</span>
              <span>{transcript}</span>
              <span className="text-cyan-400 animate-pulse font-normal"> {interimTranscript}</span>
            </div>
          )}

          {/* Last AI Response Spoken */}
          {aiResponseText && liveState === 'speaking' && (
            <div className="p-3.5 bg-zinc-900/90 border border-purple-500/40 rounded-2xl text-xs text-purple-200 leading-relaxed shadow-lg max-h-32 overflow-y-auto text-left">
              <span className="text-purple-400 font-bold block text-[10px] uppercase mb-1">Spoken AI Response:</span>
              <span>{aiResponseText}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}
        </div>
      </div>

      {/* Session Turns History & Action Controls */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-4 border-t border-zinc-800 pt-4">
        {/* Turns Counter & Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePauseResume}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border shadow-lg ${
              liveState === 'paused'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-emerald-400 shadow-emerald-500/30'
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border-zinc-700'
            }`}
          >
            {liveState === 'paused' ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Gemini Live</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              stopAll();
              startListening();
            }}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Re-Arm Mic</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700/60 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>End Live Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
