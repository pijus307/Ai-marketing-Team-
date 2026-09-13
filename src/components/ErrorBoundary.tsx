/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
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
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-rose-500/30 bg-slate-950/90 shadow-2xl my-6 space-y-6 animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400 flex-shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1 min-w-0 flex-grow">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider">
                <AlertCircle className="w-3 h-3 text-rose-400" />
                Render Shield Active
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {this.props.fallbackTitle || 'Desk Rendering Recovered'}
              </h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                An unexpected state was encountered in this view. The rest of your 24-agent workspace remains fully active and synchronized.
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="p-3.5 bg-rose-950/50 border border-rose-500/20 rounded-xl text-xs font-mono text-rose-200 overflow-x-auto max-h-36">
              <p className="font-bold text-rose-300 mb-1">Exception:</p>
              <p className="opacity-90">{this.state.error.message || String(this.state.error)}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload View
            </button>
            {this.props.onReset && (
              <button
                onClick={this.props.onReset}
                className="px-4 py-2.5 glass-panel hover:bg-white/10 border border-white/15 text-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                Return to CEO Dashboard
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
