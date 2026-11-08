/**
 * 🎙️ AUDIOSWARM MODULE (SINGLETON PATTERN)
 * Enforces Mutex Lock on Audio Output and Single-Instance Queue
 * Prevents Audio Thread Saturation ("hundred voices" phenomenon)
 */

import { dev_null } from './devNullLogger';

export interface AudioRequest {
  id: string;
  text?: string;
  audioUrl?: string;
  audioBuffer?: AudioBuffer;
  rate?: number;
  pitch?: number;
  personaId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class AudioSwarm {
  private static instance: AudioSwarm | null = null;

  // Mutex lock & queue
  private isLocked: boolean = false;
  private queue: AudioRequest[] = [];
  
  // Track current active sound instances
  private activeAudioElements: HTMLAudioElement[] = [];
  private activeAudioContexts: AudioContext[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  // State sync flag with Memory Swarm
  private isMemoryStateResolved: boolean = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.destroyAll());
      window.addEventListener('unload', () => this.destroyAll());
    }
  }

  /**
   * Singleton Accessor
   */
  public static getInstance(): AudioSwarm {
    if (!AudioSwarm.instance) {
      AudioSwarm.instance = new AudioSwarm();
    }
    return AudioSwarm.instance;
  }

  /**
   * Hard stop and destroy all existing audio instances in buffer
   */
  public stopAll(): void {
    if (typeof window === 'undefined') return;

    // 1. Stop Speech Synthesis
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {
      dev_null('SpeechSynthesis cancel note:', e);
    }
    this.activeUtterance = null;

    // 2. Stop & pause HTMLAudioElements
    for (const audio of this.activeAudioElements) {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();
      } catch (e) {
        dev_null('Audio element pause note:', e);
      }
    }
    this.activeAudioElements = [];

    // 3. Close AudioContexts
    for (const ctx of this.activeAudioContexts) {
      try {
        if (ctx.state !== 'closed') {
          ctx.close().catch(dev_null);
        }
      } catch (e) {
        dev_null('AudioContext close note:', e);
      }
    }
    this.activeAudioContexts = [];

    this.isLocked = false;
  }

  /**
   * Alias for stopAll and complete cleanup
   */
  public destroyAll(): void {
    this.queue = [];
    this.stopAll();
  }

  /**
   * State-Sync Verification: Flag memory state resolution
   */
  public setMemoryStateResolved(resolved: boolean): void {
    this.isMemoryStateResolved = resolved;
    if (resolved) {
      this.processQueue();
    }
  }

  /**
   * Public API to dispatch audio play request
   */
  public enqueue(request: AudioRequest): void {
    // 1. Hard Mutex Lock Rule: Calling play automatically stops & destroys all previous instances
    this.stopAll();

    // 2. Deduplicate in queue
    if (request.text && this.queue.some(q => q.text === request.text)) {
      return;
    }

    this.queue.push(request);
    this.processQueue();
  }

  /**
   * Process single-instance FIFO queue with state-sync check
   */
  private async processQueue(): Promise<void> {
    // Wait until memory state is resolved and mutex lock is open
    if (this.isLocked || !this.isMemoryStateResolved || this.queue.length === 0 || typeof window === 'undefined') {
      return;
    }

    const request = this.queue.shift();
    if (!request) return;

    // Acquire Mutex Lock
    this.isLocked = true;

    try {
      if (request.audioUrl) {
        // --- Single Audio Instance Execution ---
        const audio = new Audio(request.audioUrl);
        if (request.rate) audio.playbackRate = request.rate;
        this.activeAudioElements.push(audio);

        audio.onplay = () => {
          if (request.onStart) request.onStart();
        };

        const releaseAndNext = () => {
          this.activeAudioElements = this.activeAudioElements.filter(a => a !== audio);
          this.isLocked = false;
          if (request.onEnd) request.onEnd();
          this.processQueue();
        };

        audio.onended = releaseAndNext;
        audio.onerror = (err) => {
          dev_null('[AudioSwarm] Audio error:', err);
          this.activeAudioElements = this.activeAudioElements.filter(a => a !== audio);
          this.isLocked = false;
          if (request.onError) request.onError(err);
          this.processQueue();
        };

        await audio.play().catch((e) => {
          dev_null('[AudioSwarm] Play error:', e);
          releaseAndNext();
        });

      } else if (request.text) {
        // --- Single SpeechSynthesis Instance Execution ---
        if (!('speechSynthesis' in window)) {
          this.isLocked = false;
          this.processQueue();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(request.text);
        if (request.rate) utterance.rate = request.rate;
        if (request.pitch) utterance.pitch = request.pitch;
        this.activeUtterance = utterance;

        const releaseAndNext = () => {
          this.activeUtterance = null;
          this.isLocked = false;
          if (request.onEnd) request.onEnd();
          this.processQueue();
        };

        utterance.onstart = () => {
          if (request.onStart) request.onStart();
        };

        utterance.onend = releaseAndNext;
        utterance.onerror = (err) => {
          dev_null('[AudioSwarm] SpeechSynthesis error:', err);
          releaseAndNext();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        this.isLocked = false;
        this.processQueue();
      }
    } catch (e) {
      dev_null('[AudioSwarm] Execution exception:', e);
      this.isLocked = false;
      this.processQueue();
    }
  }

  public registerAudioContext(ctx: AudioContext): void {
    this.activeAudioContexts.push(ctx);
  }
}

export const audioSwarm = AudioSwarm.getInstance();
