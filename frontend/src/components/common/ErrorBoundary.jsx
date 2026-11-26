import React, { Component } from 'react';
import Logo from './Logo';
import Button from './Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Global Cinematic Error Boundary
 * Intercepts uncaught runtime/3D errors, prevents blank screens,
 * hides sensitive stack traces from players, and provides recovery actions.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Temporal Anomaly (ErrorBoundary caught):', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: '#080B18',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundImage: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.1) 0%, rgba(8, 11, 24, 0.95) 70%)',
            textAlign: 'center',
            zIndex: 99999
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: 'rgba(15, 20, 36, 0.85)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '2.5rem 2rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)'
            }}
          >
            {/* Official Brand Logo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <Logo size="md" glow={true} showTagline={false} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                marginBottom: '1rem'
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em'
              }}
            >
              TEMPORAL ANOMALY DETECTED
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.6,
                marginBottom: '1.75rem'
              }}
            >
              The spacetime matrix encountered an unexpected paradox. Your saved checkpoints, campaign progress, and inventory remain preserved in the central archive.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Button
                variant="cyan"
                size="md"
                icon={RefreshCw}
                onClick={this.handleReload}
              >
                Re-align Continuum
              </Button>

              <Button
                variant="secondary"
                size="md"
                icon={Home}
                onClick={() => {
                  window.location.href = '/player/dashboard';
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
