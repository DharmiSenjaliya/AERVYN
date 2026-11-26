import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Globe,
  Scroll,
  Clock,
  Layers,
  BarChart3,
  TrendingUp,
  Download,
  PlusCircle,
  FolderUp,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

/**
 * Professional Admin Dashboard Page
 * Core system KPIs, player growth telemetry, game sessions log, and rapid actions
 */
export default function AdminDashboardPage() {
  const { playClick } = useAudio();

  const metrics = [
    { label: 'Total Players', value: '1,428', change: '+14% this week', icon: Users, color: 'var(--color-cyan)' },
    { label: 'Active Sessions', value: '84', change: 'Live connected', icon: TrendingUp, color: 'var(--color-success)' },
    { label: 'Completed Missions', value: '3,892', change: '+220 today', icon: Scroll, color: 'var(--color-blue)' },
    { label: 'Avg Playtime', value: '48m', change: 'Per active session', icon: Clock, color: 'var(--color-purple)' },
    { label: 'Published Worlds', value: '4', change: '100% operational', icon: Globe, color: 'var(--color-gold)' },
  ];

  const recentPlayers = [
    { id: 1, name: 'ChronoWalker', email: 'chrono@aervyn.local', level: 8, status: 'active', joined: '10 mins ago' },
    { id: 2, name: 'AetherSeeker', email: 'aether@aervyn.local', level: 4, status: 'active', joined: '45 mins ago' },
    { id: 3, name: 'TimeBreaker', email: 'breaker@aervyn.local', level: 12, status: 'active', joined: '2 hours ago' },
    { id: 4, name: 'VoidRifter', email: 'void@aervyn.local', level: 1, status: 'active', joined: '5 hours ago' },
  ];

  const recentSessions = [
    { id: 'SES-9821', player: 'ChronoWalker', world: 'World 1: The Lost Kingdom', duration: '32 mins', xp: '+250 XP', status: 'In Progress' },
    { id: 'SES-9820', player: 'TimeBreaker', world: 'World 3: Future Collapse', duration: '54 mins', xp: '+500 XP', status: 'Completed' },
    { id: 'SES-9819', player: 'AetherSeeker', world: 'World 1: The Lost Kingdom', duration: '18 mins', xp: '+150 XP', status: 'Completed' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header & Quick Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', fontWeight: 800 }}>
            System Intelligence Dashboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            Real-time analytics, player progression telemetry, and game world controls.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/reports">
            <Button variant="secondary" size="sm" icon={Download}>
              Export CSV
            </Button>
          </Link>
          <Link to="/admin/missions">
            <Button variant="gold" size="sm" icon={PlusCircle}>
              New Mission
            </Button>
          </Link>
          <Link to="/admin/assets">
            <Button variant="cyan" size="sm" icon={FolderUp}>
              Upload 3D Asset
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Indicators Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} hover={true} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.label}
                </span>
                <Icon size={18} style={{ color: m.color }} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: m.color, fontWeight: 600 }}>
                {m.change}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Detailed Data Tables Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {/* Recent Registrations Table */}
        <Card
          title="Recent Player Registrations"
          subtitle="Latest authenticated users"
          action={
            <Link to="/admin/players" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              All Players &rarr;
            </Link>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Player</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Level</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentPlayers.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>{p.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant="cyan" size="sm">Lvl {p.level}</Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant="success" size="sm">Active</Badge>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      {p.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Game Telemetry Sessions */}
        <Card
          title="Live Gameplay Telemetry"
          subtitle="Real-time player sessions"
          action={
            <Link to="/admin/sessions" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              All Sessions &rarr;
            </Link>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Session</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>World</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Duration</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-cyan)' }}>{s.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.player}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#FFFFFF', fontSize: '0.82rem' }}>
                      {s.world}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                      {s.duration}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <Badge variant={s.status === 'Completed' ? 'success' : 'cyan'} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
