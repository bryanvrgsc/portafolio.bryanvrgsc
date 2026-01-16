"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 border border-red-500/20">
                            ⚠️
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-4">
                            Algo salió mal
                        </h1>
                        <p className="text-white/60 mb-6">
                            Ha ocurrido un error inesperado. Por favor, recarga la página para continuar.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                        >
                            Recargar página
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left bg-white/5 rounded-xl p-4 border border-white/10">
                                <summary className="text-white/40 text-sm cursor-pointer">
                                    Detalles del error (desarrollo)
                                </summary>
                                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                                    {this.state.error.message}
                                    {'\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
