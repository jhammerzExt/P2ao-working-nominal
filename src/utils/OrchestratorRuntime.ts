/**
 * 🏛️ ORCHESTRATOR RUNTIME & SWARM ARRAY MANAGER
 * Manages persistent operations across background processes, WebSockets, workers, and intervals.
 * Enforces zero orphaned processes on exit, silent telemetry logging via dev_null,
 * and memory-to-audio swarm state synchronization.
 */

import { dev_null } from './devNullLogger';
import { audioSwarm } from './AudioSwarm';

export interface SwarmTask {
  id: string;
  type: 'INTERVAL' | 'TIMEOUT' | 'WEBSOCKET' | 'WORKER' | 'LISTENER';
  handle: any;
  cleanup?: () => void;
}

export class OrchestratorRuntime {
  private static instance: OrchestratorRuntime | null = null;
  private tasks: Map<string, SwarmTask> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.shutdownAll());
      window.addEventListener('unload', () => this.shutdownAll());
    }
  }

  public static getInstance(): OrchestratorRuntime {
    if (!OrchestratorRuntime.instance) {
      OrchestratorRuntime.instance = new OrchestratorRuntime();
    }
    return OrchestratorRuntime.instance;
  }

  /**
   * Log telemetry silently via dev_null
   */
  public logTelemetry(...args: any[]): void {
    dev_null(...args);
  }

  /**
   * Register a background interval task
   */
  public registerInterval(id: string, fn: () => void, ms: number): number {
    this.unregister(id);
    const handle = setInterval(() => {
      try {
        fn();
      } catch (err) {
        dev_null('[OrchestratorRuntime] Interval exception redirected:', err);
      }
    }, ms);

    this.tasks.set(id, {
      id,
      type: 'INTERVAL',
      handle,
      cleanup: () => clearInterval(handle)
    });

    return handle as any;
  }

  /**
   * Register a background listener / worker / task
   */
  public registerTask(id: string, task: SwarmTask): void {
    this.unregister(id);
    this.tasks.set(id, task);
  }

  /**
   * Unregister and cleanup a single task
   */
  public unregister(id: string): void {
    const existing = this.tasks.get(id);
    if (existing) {
      try {
        if (existing.cleanup) {
          existing.cleanup();
        } else if (existing.type === 'INTERVAL') {
          clearInterval(existing.handle);
        } else if (existing.type === 'TIMEOUT') {
          clearTimeout(existing.handle);
        } else if (existing.type === 'WEBSOCKET' && existing.handle?.close) {
          existing.handle.close();
        } else if (existing.type === 'WORKER' && existing.handle?.terminate) {
          existing.handle.terminate();
        }
      } catch (err) {
        dev_null('[OrchestratorRuntime] Unregister cleanup note:', err);
      }
      this.tasks.delete(id);
    }
  }

  /**
   * State Sync: Notify audio swarm that memory state resolution has completed
   */
  public notifyMemoryStateResolved(isResolved: boolean): void {
    audioSwarm.setMemoryStateResolved(isResolved);
  }

  /**
   * Shutdown all background tasks to ensure no orphaned processes on exit
   */
  public shutdownAll(): void {
    for (const [id] of this.tasks) {
      this.unregister(id);
    }
    audioSwarm.destroyAll();
    dev_null('[OrchestratorRuntime] All background tasks and audio streams safely terminated.');
  }
}

export const orchestratorRuntime = OrchestratorRuntime.getInstance();
