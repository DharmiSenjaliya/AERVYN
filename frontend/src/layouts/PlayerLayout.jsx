import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Scroll,
  Backpack,
  Award,
  Globe,
  Settings,
  LogOut,
  Play,
  Bell,
  User,
  Zap,
  Shield,
  Menu,
  X,
  Trophy,
  BarChart3
} from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

/**
 * Player Application Layout
 * Features official AERVYN logo, live player stats HUD (level, XP progress, world indicator),
 * player navigation tabs, and mobile bottom bar.
 */
export default function PlayerLayout() {
  const { user, logout } = useAuth();
  const { playClick } = useAudio();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Player mock/default telemetry if profile isn't fully seeded yet
  const profile = user?.profile || {
    level: 3,
    xp: 450,
    next_level_xp: 1000,
    current_world: 'World 1: The Lost Kingdom',
    chrono_cores: 4,
    health: 100,
    max_health: 100
  };

  const xpPercent = Math.min(100, Math.round(((profile.xp || 0) / (profile.next_level_xp || 1000)) * 100));

  const navItems = [
    { label: 'Dashboard', path: '/player/dashboard', icon: Compass },
    { label: 'Profile', path: '/player/profile', icon: User },
    { label: 'Achievements', path: '/player/achievements', icon: Award },
    { label: 'Statistics', path: '/player/statistics', icon: BarChart3 },
    { label: 'Leaderboard', path: '/player/leaderboard', icon: Trophy }
  ];

  const handleLogout = async () => {
    playClick();
    await logout();
    navigate('/login');
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
      {/* Player Topbar Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 'var(--z-nav)',
          background: 'rgba(8, 11, 24, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          height: '70px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Brand Logo & Current World Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Logo size="sm" linkTo="/player/dashboard" showTagline={false} />
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant="cyan" size="sm" pulse={true}>
                {profile.current_world || 'World 1: The Lost Kingdom'}
              </Badge>
            </div>
          </div>

          {/* Player Stats HUD */}
          <div
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(22, 30, 53, 0.6)',
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Level & XP */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #168CFF, #00D9FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  color: '#080B18',
                  boxShadow: '0 0 10px var(--color-cyan-glow)'
                }}
              >
                {profile.level || 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                  <span>XP</span>
                  <span>{profile.xp || 0} / {profile.next_level_xp || 1000}</span>
                </div>
                <div
                  style={{
                    height: '5px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    marginTop: '2px'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${xpPercent}%`,
                      background: 'linear-gradient(90deg, #168CFF, #00D9FF)',
                      boxShadow: '0 0 8px var(--color-cyan)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Chrono Cores */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)' }}>
              <Zap size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{profile.chrono_cores || 4}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Cores</span>
            </div>
          </div>

          {/* Quick Play CTA & User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link to="/play" onClick={playClick}>
              <Button variant="cyan" size="sm" icon={Play}>
                Resume 3D Game
              </Button>
            </Link>

            {/* User Profile Dropdown Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(22, 30, 53, 0.8)',
                  border: '1px solid var(--border-medium)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--color-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'P'}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }} className="hide-mobile">
                  {user?.name || 'Player'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="glass-panel-heavy"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '210px',
                    padding: '0.5rem',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{user?.name || 'Explorer'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email || 'player@aervyn.local'}</div>
                  </div>
                  <Link
                    to="/player/profile"
                    onClick={() => { playClick(); setProfileDropdownOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--color-text)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <User size={15} />
                    <span>Explorer Profile</span>
                  </Link>
                  <Link
                    to="/player/statistics"
                    onClick={() => { playClick(); setProfileDropdownOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--color-text)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <BarChart3 size={15} />
                    <span>Game Statistics</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--color-danger)',
                      fontSize: '0.82rem',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Bar (Desktop) */}
      <nav
        className="hide-mobile"
        style={{
          background: 'rgba(17, 23, 43, 0.85)',
          borderBottom: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="app-container" style={{ display: 'flex', gap: '2rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={playClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 0',
                  color: active ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  borderBottom: active ? '2px solid var(--color-cyan)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0 5rem 0' }}>
        <div className="app-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          background: 'rgba(8, 11, 24, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-cyan)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={playClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                color: active ? 'var(--color-cyan)' : 'var(--color-text-dim)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                padding: '0.25rem'
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .hide-mobile {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
