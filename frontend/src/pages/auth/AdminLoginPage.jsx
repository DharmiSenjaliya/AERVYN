import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

/**
 * Dedicated Admin Portal Login
 * Official logo, gold security accents, administrative role verification
 */
export default function AdminLoginPage() {
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
      const user = await login(email, password);
      if (user.role === 'admin' || user.role_id === 1 || user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Administrator privileges required.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: '#060913',
        backgroundImage: 'radial-gradient(circle at center, rgba(245, 185, 66, 0.08) 0%, #060913 70%)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Card
          className="cyber-border"
          style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--border-gold)',
            boxShadow: 'var(--shadow-glow-gold)'
          }}
          hover={false}
        >
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '1.25rem' }}>
            <Logo size="md" glow={true} showTagline={false} />
          </div>

          <Badge variant="gold" size="sm" style={{ marginBottom: '1.25rem' }}>
            System Administration
          </Badge>

          <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
            Admin Portal Access
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
            Restricted to game masters, directors, and system engineers.
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
              label="Admin Account"
              type="email"
              placeholder="admin@aervyn.local"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Security Key"
              type="password"
              placeholder="••••••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="gold"
              fullWidth
              size="md"
              loading={loading}
              icon={ShieldCheck}
              style={{ marginTop: '0.75rem' }}
            >
              Authenticate Admin
            </Button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/"
              onClick={playClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.82rem'
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
