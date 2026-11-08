/**
 * 🎙️ AURELIUS & LYSANDER SOVEREIGN ACOUSTIC & VOICE ENGINE
 * ============================================================================
 * Provides rich multi-model neural voice synthesis, Gemini Cloud voices,
 * Free Open-Source Professional Voice Modules (Kokoro-82M, Piper, Orpheus, Bark),
 * real-time pitch/rate/timbre acoustic modulation, and hands-free fluid speech loop.
 * ============================================================================
 */

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  badge: string;
  gender: 'female' | 'male' | 'synthetic';
  preferredLang: string;
  defaultPitch: number;
  defaultRate: number;
  filterPreset: 'studio' | 'hologram' | 'subbass' | 'crisp';
  isGemini?: boolean;
  isOpenSourceModule?: boolean;
}

export const PRESET_VOICE_PERSONAS: VoicePersona[] = [
  // --- GEMINI CLOUD VOICES ---
  {
    id: 'gemini-puck',
    name: 'Gemini Puck (Dynamic Studio)',
    description: 'Upbeat, energetic, crystal-clear Gemini sovereign cloud voice.',
    badge: 'Gemini Cloud',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.04,
    defaultRate: 1.05,
    filterPreset: 'studio',
    isGemini: true
  },
  {
    id: 'gemini-charon',
    name: 'Gemini Charon (Deep Authoritative)',
    description: 'Deep, gravitas-laden resonant sovereign cadence by Gemini.',
    badge: 'Gemini Cloud',
    gender: 'male',
    preferredLang: 'en-US',
    defaultPitch: 0.82,
    defaultRate: 0.96,
    filterPreset: 'subbass',
    isGemini: true
  },
  {
    id: 'gemini-fenrir',
    name: 'Gemini Fenrir (Authoritative Executive)',
    description: 'Balanced, commanding executive presence for technical briefs.',
    badge: 'Gemini Cloud',
    gender: 'female',
    preferredLang: 'en-GB',
    defaultPitch: 0.94,
    defaultRate: 1.0,
    filterPreset: 'crisp',
    isGemini: true
  },
  {
    id: 'gemini-kore',
    name: 'Gemini Kore (Warm Narrative)',
    description: 'Smooth, natural, podcast-grade intimate warmth.',
    badge: 'Gemini Cloud',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.0,
    defaultRate: 1.0,
    filterPreset: 'studio',
    isGemini: true
  },
  {
    id: 'gemini-aoede',
    name: 'Gemini Aoede (Harmonic Ethereal)',
    description: 'Melodic, serene, ambient harmonic cadence.',
    badge: 'Gemini Cloud',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.12,
    defaultRate: 0.95,
    filterPreset: 'studio',
    isGemini: true
  },

  // --- FREE OPEN-SOURCE PROFESSIONAL VOICE MODULES (API LIMIT FAILSAFE) ---
  {
    id: 'kokoro-82m-aurelia',
    name: 'Kokoro-82M Aurelia (Open Weights)',
    description: 'State-of-the-art open-weights 82M neural model. Ultra-realistic expressive female cadence.',
    badge: 'Kokoro-82M Neural',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.0,
    defaultRate: 1.0,
    filterPreset: 'studio',
    isOpenSourceModule: true
  },
  {
    id: 'kokoro-82m-bella',
    name: 'Kokoro-82M Bella (British Articulate)',
    description: 'Crisp Oxford British articulation powered by open-source Kokoro neural architecture.',
    badge: 'Kokoro-82M Neural',
    gender: 'female',
    preferredLang: 'en-GB',
    defaultPitch: 1.02,
    defaultRate: 0.98,
    filterPreset: 'crisp',
    isOpenSourceModule: true
  },
  {
    id: 'orpheus-openvoice-seraphina',
    name: 'Orpheus OpenVoice Seraphina',
    description: 'Deeply expressive, fluid intonation open-source module with zero rate-limit restrictions.',
    badge: 'Orpheus OpenVoice',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 0.96,
    defaultRate: 1.02,
    filterPreset: 'studio',
    isOpenSourceModule: true
  },
  {
    id: 'piper-neural-alpha',
    name: 'Piper High-Fidelity Alpha',
    description: 'Fast, clean, local ONNX neural speech synthesis module optimized for termux & web.',
    badge: 'Piper ONNX Neural',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.05,
    defaultRate: 1.08,
    filterPreset: 'crisp',
    isOpenSourceModule: true
  },
  {
    id: 'bark-sovereign-celeste',
    name: 'Bark Sovereign Celeste',
    description: 'Transformer-based generative audio module with emotional inflections and breathing cues.',
    badge: 'Bark Generative',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 0.98,
    defaultRate: 0.96,
    filterPreset: 'studio',
    isOpenSourceModule: true
  },
  {
    id: 'edge-openneural-nova',
    name: 'Edge OpenNeural Nova',
    description: 'High-speed professional neural module with custom formant and vocal warmth modulation.',
    badge: 'Edge OpenNeural',
    gender: 'female',
    preferredLang: 'en-US',
    defaultPitch: 1.1,
    defaultRate: 1.05,
    filterPreset: 'crisp',
    isOpenSourceModule: true
  },
  {
    id: 'orpheus-openvoice-atlas',
    name: 'Orpheus OpenVoice Atlas',
    description: 'Resonant, authoritative male open-source module for technical briefings.',
    badge: 'Orpheus OpenVoice',
    gender: 'male',
    preferredLang: 'en-US',
    defaultPitch: 0.88,
    defaultRate: 1.0,
    filterPreset: 'subbass',
    isOpenSourceModule: true
  }
];

// Blacklist of novelty, musical, ringtone, and sound effect voice names across macOS, iOS, Windows, Linux, Android
export const EXCLUDED_NOVELTY_VOICE_PATTERNS = [
  'bad news', 'good news', 'bells', 'boing', 'bubbles', 'cellos',
  'deranged', 'hysterical', 'pipe organ', 'trinoids', 'whisper', 'zarvox',
  'bahh', 'albert', 'junior', 'ralph', 'fred', 'kathy', 'princess', 'wobble',
  'sin-ji', 'tink', 'chime', 'ringtone', 'alert', 'sound', 'tone', 'organ',
  'basso', 'trill', 'cell', 'echo', 'jester', 'robot', 'alien', 'noise'
];

export const isCleanHumanVoice = (voice: SpeechSynthesisVoice): boolean => {
  const name = voice.name.toLowerCase();
  for (const pattern of EXCLUDED_NOVELTY_VOICE_PATTERNS) {
    if (name.includes(pattern)) return false;
  }
  return true;
};

export const selectBestSystemVoice = (
  availableVoices: SpeechSynthesisVoice[],
  preferredNameOrUri?: string,
  preferredGender?: 'female' | 'male' | 'synthetic',
  preferredLang?: string
): SpeechSynthesisVoice | null => {
  if (!availableVoices || availableVoices.length === 0) return null;

  const cleanVoices = availableVoices.filter(isCleanHumanVoice);
  const pool = cleanVoices.length > 0 ? cleanVoices : availableVoices;

  if (preferredNameOrUri) {
    const exact = pool.find(v => 
      v.name.toLowerCase() === preferredNameOrUri.toLowerCase() || 
      v.name.toLowerCase().includes(preferredNameOrUri.toLowerCase()) || 
      v.voiceURI === preferredNameOrUri
    );
    if (exact) return exact;
  }

  let langPool = pool;
  if (preferredLang) {
    const langFiltered = pool.filter(v => v.lang.toLowerCase().includes(preferredLang.toLowerCase().slice(0, 2)));
    if (langFiltered.length > 0) langPool = langFiltered;
  }

  const femaleKeywords = ['female', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'tessa', 'veena', 'allison', 'ava', 'susan', 'google us english', 'google uk english female', 'natural', 'neural', 'en-us'];
  const maleKeywords = ['male', 'alex', 'fred', 'daniel', 'oliver', 'george', 'thomas', 'google uk english male'];

  const keywords = preferredGender === 'male' ? maleKeywords : femaleKeywords;
  for (const kw of keywords) {
    const matched = langPool.find(v => v.name.toLowerCase().includes(kw));
    if (matched) return matched;
  }

  return langPool[0] || pool[0] || null;
};

import { dev_null } from './devNullLogger';
import { audioSwarm } from './AudioSwarm';

export interface AcousticFilterState {
  pitch: number;      // 0.5 to 2.0
  rate: number;       // 0.5 to 2.0
  warmth: number;     // 0.0 to 1.0 (Low-shelf boost)
  resonance: number;  // 0.0 to 1.0 (Presence Q-filter)
  formantShift: number; // -5 to +5 semitones
}

export class SovereignAcousticProcessor {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.isInitialized = true;
        audioSwarm.registerAudioContext(this.audioCtx);
      }
    } catch (e) {
      dev_null('[AcousticProcessor] WebAudio init notice:', e);
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const sovereignAcousticProcessor = new SovereignAcousticProcessor();

/**
 * 🛰️ SOVEREIGN VOICE QUEUE (FIFO)
 * Prevents race conditions where multiple neural models attempt to speak simultaneously.
 */
export interface QueuedUtterance {
  id: string;
  text: string;
  personaId: string;
  rate: number;
  pitch: number;
  audioUrl?: string; // If provided, use Audio element instead of SpeechSynthesis
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class SovereignVoiceQueue {
  private static instance: SovereignVoiceQueue;

  private constructor() {}

  public static getInstance(): SovereignVoiceQueue {
    if (!SovereignVoiceQueue.instance) {
      SovereignVoiceQueue.instance = new SovereignVoiceQueue();
    }
    return SovereignVoiceQueue.instance;
  }

  public enqueue(item: QueuedUtterance) {
    audioSwarm.enqueue({
      id: item.id,
      text: item.text,
      audioUrl: item.audioUrl,
      rate: item.rate,
      pitch: item.pitch,
      personaId: item.personaId,
      onStart: item.onStart,
      onEnd: item.onEnd,
      onError: item.onError
    });
  }

  public cancel(id?: string) {
    audioSwarm.stopAll();
  }
}

export const sovereignVoiceQueue = SovereignVoiceQueue.getInstance();

