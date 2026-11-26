import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, Play, Compass, BookOpen, Shield, Sparkles } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';

/**
 * Public Website Layout
 * Features official AERVYN logo in header and footer, responsive navigation drawer,
 * audio ambiance toggle, and cinematic footer.
 */
export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { muted, toggleMute, playClick } = useAudio();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Worlds', path: '/#worlds' },
    { label: 'Features', path: '/#features' },
    { label: 'Specs', path: '/#specs' },
    { label: 'Product Info', path: '/product' },
    { label: 'Demo', path: '/demo' },
    { label: 'Inquiries', path: '/#inquiry' },
  ];

  const handleNavClick = () => {
    playClick();
    setMobileMenuOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--color-text)',
        position: 'relative'
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-nav)',
          background: 'rgba(8, 11, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          transition: 'all var(--transition-normal)'
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px'
          }}
        >
          {/* Official Brand Logo */}
          <Logo size="sm" linkTo="/" showTagline={true} />

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.75rem'
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={handleNavClick}
                style={{
                  color: location.pathname === link.path ? 'var(--color-cyan)' : 'var(--color-text-secondary)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'color var(--transition-fast)'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Play CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Audio Toggle */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: muted ? 'var(--color-text-muted)' : 'var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Auth / Play CTA */}
            {isAuthenticated ? (
              <Link to="/player/dashboard" onClick={playClick}>
                <Button variant="cyan" size="sm" icon={Compass}>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" onClick={playClick} className="hide-mobile">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/play" onClick={playClick}>
                  <Button variant="cyan" size="sm" icon={Play}>
                    Play Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              background: 'rgba(8, 11, 24, 0.98)',
              borderBottom: '1px solid var(--border-cyan)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={handleNavClick}
                style={{
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                {link.label}
              </a>
            ))}
            {!isAuthenticated && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={handleNavClick}>
                  <Button variant="secondary" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={handleNavClick}>
                  <Button variant="gold" fullWidth>
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Official Cinematic Footer */}
      <footer
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '4rem 0 2rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-cyan), transparent)'
          }}
        />

        <div className="app-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem'
            }}
          >
            {/* Column 1: Brand & Official Tagline */}
            <div>
              <Logo size="md" glow={true} showTagline={true} />
              <p
                style={{
                  marginTop: '1.25rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6
                }}
              >
                CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                A premium, story-driven 3D time-travel adventure powered by Three.js and Laravel 12.
              </p>
            </div>

            {/* Column 2: Timelines / Worlds */}
            <div>
              <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-cyan)', marginBottom: '1rem' }}>
                Timelines
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><a href="/#worlds" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>World 1: The Lost Kingdom</a></li>
                <li><a href="/#worlds" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>World 2: The Broken Present</a></li>
                <li><a href="/#worlds" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>World 3: The Future Collapse</a></li>
                <li><a href="/#worlds" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>World 4: The Forgotten Timeline</a></li>
              </ul>
            </div>

            {/* Column 3: Navigation */}
            <div>
              <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-cyan)', marginBottom: '1rem' }}>
                Navigation
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><Link to="/play" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Launch 3D Game</Link></li>
                <li><Link to="/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Player Sign In</Link></li>
                <li><Link to="/register" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Register Account</Link></li>
                <li><Link to="/admin/login" style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Admin Portal</Link></li>
              </ul>
            </div>

            {/* Column 4: Experience & Specifications */}
            <div>
              <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                Platform
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Optimized for Desktop, Laptop, Tablet, and Mobile browsers with gamepad, keyboard/mouse, and virtual touch controls.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>WebGL 2.0</span>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>Three.js</span>
                <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>60 FPS Target</span>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.82rem',
              color: 'var(--color-text-dim)'
            }}
          >
            <span>&copy; {new Date().getFullYear()} AERVYN: Echoes of Time. All rights reserved.</span>
            <span>Commercial Indie Game Product &bull; Original Brand Identity</span>
          </div>
        </div>
      </footer>

      {/* Responsive Style Overrides */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
