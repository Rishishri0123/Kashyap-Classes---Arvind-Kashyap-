import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    let display = error.message || 'An unexpected application error occurred.';
    try {
      const parsed = JSON.parse(display);
      if (parsed && typeof parsed.error === 'string') {
        display = parsed.error;
      }
    } catch {
      // keep raw message
    }
    return { hasError: true, errorMessage: display };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#ff6600] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-black text-[#0c2340] font-heading">
                Something Needs Attention
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 break-words">
                {this.state.errorMessage}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-[#0c2340] hover:bg-[#13325b] text-white text-sm font-bold rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
