import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--background)',
          padding: '20px',
          color: 'var(--text-main)'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="glass"
            style={{
              padding: '48px',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              marginBottom: '8px'
            }}>
              <AlertTriangle size={48} strokeWidth={1.5} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                background: 'linear-gradient(to bottom right, #fff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Something went wrong
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
                We've encountered an unexpected error. Don't worry, your data is safe. Please try refreshing the page.
              </p>
            </div>

            {import.meta.env.DEV && (
              <div style={{
                width: '100%',
                maxHeight: '150px',
                padding: '16px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                textAlign: 'left',
                color: '#fca5a5',
                overflow: 'auto',
                fontFamily: '"Fira Code", monospace',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: '#ef4444' }}>Error Stack:</div>
                {this.state.error?.stack ?? this.state.error?.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: '52px', fontSize: '1.05rem' }}
            >
              <RefreshCcw size={20} />
              Refresh Application
            </button>

            <button
              onClick={() => { window.location.href = '/'; }}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', height: '52px' }}
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
