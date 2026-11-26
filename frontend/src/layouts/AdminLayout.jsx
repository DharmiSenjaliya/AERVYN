import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Globe,
  Layers,
  Scroll,
  UserCheck,
  Skull,
  Package,
  Backpack,
  Award,
  FolderOpen,
  History,
  Megaphone,
  Bell,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  Key,
  Sliders,
  Settings,
  User,
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Logo from '../components/common/Logo';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

/**
 * Professional Admin Panel Layout
 * Features the complete 23-item sidebar, official AERVYN brand logo,
 * collapsible sidebar, admin quick actions, and responsive layout.
 */
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { playClick } = useAudio();
  const location = useLocation();
  const navigate = useNavigate();

  // Full 23-item admin navigation hierarchy matching specification
  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Players', path: '/admin/players', icon: Users },
    { label: 'Social Moderation', path: '/admin/social', icon: ShieldAlert },
    { label: 'Game Worlds', path: '/admin/worlds', icon: Globe },
    { label: 'Levels', path: '/admin/levels', icon: Layers },
    { label: 'Missions', path: '/admin/missions', icon: Scroll },
    { label: 'Characters', path: '/admin/characters', icon: UserCheck },
    { label: 'Enemies', path: '/admin/enemies', icon: Skull },
    { label: 'Items & Catalog', path: '/admin/items', icon: Package },
    { label: 'Inventory Monitor', path: '/admin/inventory', icon: Backpack },
    { label: 'Achievements', path: '/admin/achievements', icon: Award },
    { label: 'Game Assets', path: '/admin/assets', icon: FolderOpen },
    { label: 'Game Sessions', path: '/admin/sessions', icon: History },
    { label: 'Support & Feedback', path: '/admin/feedback', icon: Megaphone },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Reports & CSV', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Admin Accounts', path: '/admin/users', icon: ShieldCheck },
    { label: 'Activity Logs', path: '/admin/activity-logs', icon: Key },
    { label: 'Game Settings', path: '/admin/game-settings', icon: Sliders },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Profile', path: '/admin/profile', icon: User },
    { label: 'Change Password', path: '/admin/change-password', icon: Lock },
    { label: 'Logout', action: 'logout', icon: LogOut, danger: true }
  ];

  const handleLogout = async () => {
    playClick();
    await logout();
    navigate('/admin/login');
  };

  const currentSection = adminNav.find((item) => item.path === location.pathname)?.label || 'Administration';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#060913',
        color: 'var(--color-text)',
        position: 'relative'
      }}
    >
      {/* Sidebar (Desktop) */}
      <aside
        style={{
          width: collapsed ? '80px' : '260px',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s ease',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
          overflow: 'hidden'
        }}
        className="hide-mobile"
      >
        {/* Sidebar Header with Official Brand Logo */}
        <div
          style={{
            height: '74px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '0' : '0 1.25rem',
            background: 'rgba(8, 11, 24, 0.9)'
          }}
        >
          {collapsed ? (
            <Logo size="xs" glow={false} linkTo="/admin/dashboard" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo size="xs" glow={false} linkTo="/admin/dashboard" />
              <Badge variant="gold" size="sm">Admin</Badge>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: 'var(--color-text-muted)',
              padding: '4px',
              display: collapsed ? 'none' : 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            aria-label="Toggle sidebar collapse"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* 23 Navigation Items Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem'
          }}
        >
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            if (item.action === 'logout') {
              return (
                <button
                  key={item.label}
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-danger)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    width: '100%',
                    textAlign: 'left',
                    marginTop: '0.5rem',
                    borderTop: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    justifyContent: collapsed ? 'center' : 'flex-start'
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={playClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  color: active ? '#FFFFFF' : 'var(--color-text-muted)',
                  background: active ? 'linear-gradient(90deg, rgba(22, 140, 255, 0.25), rgba(0, 217, 255, 0.08))' : 'transparent',
                  borderLeft: active ? '3px solid var(--color-cyan)' : '3px solid transparent',
                  fontSize: '0.82rem',
                  fontWeight: active ? 700 : 500,
                  transition: 'all var(--transition-fast)',
                  justifyContent: collapsed ? 'center' : 'flex-start'
                }}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} style={{ color: active ? 'var(--color-cyan)' : 'inherit', flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(8, 11, 24, 0.8)',
            display: collapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--color-text-dim)'
          }}
        >
          <span>AERVYN Core v1.0</span>
          <span style={{ color: 'var(--color-success)' }}>&bull; Live DB</span>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin Topbar */}
        <header
          style={{
            height: '74px',
            background: 'rgba(17, 23, 43, 0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 90
          }}
        >
          {/* Mobile Toggle + Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ color: '#FFFFFF', padding: '0.4rem', cursor: 'pointer' }}
              aria-label="Toggle admin navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Portal &bull; System
              </div>
              <h2 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                {currentSection}
              </h2>
            </div>
          </div>

          {/* Quick Stats + Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/play"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--color-cyan)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
              className="hide-mobile"
            >
              <span>Test Game Instance</span>
              <ExternalLink size={14} />
            </Link>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  color: '#080B18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}
              >
                A
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                {user?.name || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-cyan)',
              padding: '1rem',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {adminNav.map((item) => {
              const Icon = item.icon;
              if (item.action === 'logout') {
                return (
                  <button
                    key={item.label}
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.9rem',
                      color: 'var(--color-danger)',
                      fontSize: '0.85rem',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => { playClick(); setMobileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    color: location.pathname === item.path ? 'var(--color-cyan)' : 'var(--color-text)',
                    fontSize: '0.85rem'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Admin Content View */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
