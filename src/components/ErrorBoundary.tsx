import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Terminal, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Aurelius Sovereign ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 font-mono select-none">
          <div className="max-w-xl w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertOctagon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-bold text-zinc-100 uppercase tracking-wider">
                  Sovereign Nexus Self-Healing Intercept
                </h1>
                <p className="text-xs text-zinc-400">
                  Substrate caught an unhandled exception. Continuous state preserved.
                </p>
              </div>
            </div>

            <div className="bg-black/60 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono space-y-2 text-zinc-300 overflow-x-auto">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Exception Trace:</span>
              </div>
              <p className="text-rose-400 break-words">
                {this.state.error?.name}: {this.state.error?.message || 'Unknown runtime interruption'}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-zinc-500 mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap font-mono">
                  {this.state.errorInfo.componentStack.slice(0, 500)}
                </pre>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Loss State Recovery Ready</span>
              </div>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Initialize Sovereign Core</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
