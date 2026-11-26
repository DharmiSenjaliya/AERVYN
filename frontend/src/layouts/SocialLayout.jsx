import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Users,
  UserPlus,
  Search,
  Swords,
  Trophy,
  Bell,
  Shield,
  Activity,
  ArrowLeft,
  Settings,
  Sparkles
} from 'lucide-react';
import Logo from '../components/common/Logo';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

export default function SocialLayout() {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchQuickCounts = async () => {
    try {
      const res = await api.get('/social/hub');
      if (res.data?.success) {
        setUnreadCount(res.data.data.unread_notifications_count || 0);
        setPendingRequestsCount(res.data.data.pending_requests_count || 0);
      }
    } catch (err) {
      // Quiet fail if not ready
    }
  };

  useEffect(() => {
    fetchQuickCounts();
    const interval = setInterval(fetchQuickCounts, 30000); // 30s poll for social alerts
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Social Hub', path: '/social', icon: Activity, exact: true },
    { label: 'Friends', path: '/social/friends', icon: Users },
    { label: 'Requests', path: '/social/requests', icon: UserPlus, badge: pendingRequestsCount },
    { label: 'Challenges', path: '/social/challenges', icon: Swords },
    { label: 'Leaderboard', path: '/social/leaderboard', icon: Trophy },
    { label: 'Player Search', path: '/social/search', icon: Search },
    { label: 'Notifications', path: '/social/notifications', icon: Bell, badge: unreadCount },
    { label: 'Privacy', path: '/social/privacy', icon: Shield },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#060913',
        color: 'var(--color-text)',
        position: 'relative'
      }}
    >
      {/* Social Hub Top Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(8, 12, 26, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
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
          {/* Logo & Portal Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Logo size="sm" linkTo="/player/dashboard" showTagline={false} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary-cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Social Hub
              </span>
              <Badge variant="cyan" size="sm">Online Layer</Badge>
            </div>
          </div>

          {/* Quick Actions & Back to Dashboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to="/player/dashboard"
              onClick={playClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--color-text-dim)',
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={14} />
              <span>Player Dashboard</span>
            </Link>

            {/* Notifications Bell */}
            <Link
              to="/social/notifications"
              onClick={playClick}
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: unreadCount > 0 ? '#00f0ff' : 'var(--color-text-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(255, 68, 68, 0.8)'
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Secondary Social Sub-Navigation Tabs */}
      <nav
        style={{
          background: 'rgba(12, 16, 34, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={playClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.25rem',
                  color: active ? '#00f0ff' : 'var(--color-text-dim)',
                  fontSize: '0.85rem',
                  fontWeight: active ? 700 : 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderBottom: active ? '2px solid #00f0ff' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {Boolean(item.badge && item.badge > 0) && (
                  <span
                    style={{
                      backgroundColor: '#00f0ff',
                      color: '#060913',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      padding: '1px 6px',
                      marginLeft: '0.2rem'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Social Content Outlet */}
      <main style={{ flex: 1, padding: '2rem 0 4rem 0' }}>
        <div className="app-container">
          <Outlet context={{ fetchQuickCounts }} />
        </div>
      </main>
    </div>
  );
}
