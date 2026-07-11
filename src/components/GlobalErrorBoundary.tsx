import React from 'react';
import { AlertTriangle, RefreshCcw, Home, FileText } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  logId: string;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    logId: ""
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Global System Error:", error, errorInfo);
    (this as any).setState({
      errorInfo,
      logId: `ERR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-red-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Application Error</h1>
                <p className="text-slate-500">The system encountered an unexpected condition.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-sm text-slate-700 font-mono overflow-auto max-h-64">
              <p className="font-bold mb-1 text-red-600">Request ID / Log ID: {this.state.logId}</p>
              <p className="mb-4">{this.state.error?.toString()}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600 hover:underline font-semibold mb-2">View Technical Details</summary>
                <pre className="text-xs whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
              </details>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Retry / Reload
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
