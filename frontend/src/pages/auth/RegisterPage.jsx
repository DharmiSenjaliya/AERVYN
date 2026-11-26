import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

/**
 * Player Registration Page
 * Features official AERVYN logo, secure inputs, validation, Sanctum integration
 */
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    playClick();

    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/player/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
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
        padding: '2.5rem 1rem',
        background: 'radial-gradient(circle at center, rgba(112, 71, 255, 0.08) 0%, rgba(8, 11, 24, 0.98) 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <Card
          className="cyber-border"
          style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--border-purple)'
          }}
          hover={false}
        >
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <Logo size="md" glow={true} showTagline={true} />
          </div>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Player Registration
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
            Initialize your temporal profile and begin the adventure.
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
              label="Explorer Name"
              type="text"
              placeholder="e.g. ChronosWalker"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              label="Password (min 8 characters)"
              type="password"
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••••••"
              icon={Lock}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="purple"
              fullWidth
              size="md"
              loading={loading}
              icon={UserPlus}
              style={{ marginTop: '0.75rem' }}
            >
              Create Account
            </Button>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)'
            }}
          >
            Already an explorer?{' '}
            <Link to="/login" onClick={playClick} style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
