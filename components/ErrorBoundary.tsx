import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('🔴 Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          backgroundColor: '#fee',
          border: '2px solid #f00',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ color: '#c00', marginTop: 0 }}>⚠️ Error de Renderizado</h2>
          <details style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem' }}>
              Ver detalles del error
            </summary>
            <div style={{ marginTop: '1rem' }}>
              <strong>Error:</strong>
              <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px' }}>
                {this.state.error?.toString()}
              </pre>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <strong>Stack Trace:</strong>
              <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', fontSize: '10px' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
