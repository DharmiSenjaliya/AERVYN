import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

/**
 * Player Login Page
 * Features official AERVYN logo, email/password validation, Sanctum authentication,
 * and link to Admin portal.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    playClick();

    try {
      await login(email, password);
      navigate('/player/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 74px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(circle at center, rgba(22, 140, 255, 0.08) 0%, rgba(8, 11, 24, 0.98) 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Card
          className="cyber-border"
          style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--border-cyan)'
          }}
          hover={false}
        >
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <Logo size="md" glow={true} showTagline={true} />
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Player Sign In
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
            Synchronize your temporal credentials to resume the adventure.
          </p>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--color-danger)',
                color: '#FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="player@aervyn.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="cyan"
              fullWidth
              size="md"
              loading={loading}
              icon={LogIn}
              style={{ marginTop: '0.75rem' }}
            >
              Enter Timeline
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}
          >
            <div>
              New explorer?{' '}
              <Link to="/register" onClick={playClick} style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>
                Create Account
              </Link>
            </div>
            <div>
              <Link to="/admin/login" onClick={playClick} style={{ color: 'var(--color-gold)', fontSize: '0.8rem' }}>
                Administrative Access Portal &rarr;
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
