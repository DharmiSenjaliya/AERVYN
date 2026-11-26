import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Activity
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Professional Admin Dashboard Page
 * Real database metrics, 10 KPI overview cards, interactive charts,
 * live game sessions feed, and recent players telemetry.
 */
export default function AdminDashboardPage() {
  const { playClick } = useAudio();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/dashboard-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load system intelligence metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const metrics = data?.metrics || {};
  const worldStats = data?.world_stats || [];
  const endings = data?.endings || { ending_a: 0, ending_b: 0, total: 0 };
  const recentPlayers = data?.recent_players || [];
  const recentSessions = data?.recent_sessions || [];

  const kpis = [
    { label: 'Total Players', value: metrics.total_registered_players ?? 0, sub: `${metrics.new_players_this_week ?? 0} this week`, icon: Users, color: 'var(--color-cyan)', accent: 'cyan' },
    { label: 'Active Players', value: metrics.active_players ?? 0, sub: 'Past 7 days active', icon: TrendingUp, color: 'var(--color-success)', accent: 'green' },
    { label: 'New Players Today', value: metrics.new_players_today ?? 0, sub: 'New registrations', icon: Sparkles, color: 'var(--color-purple)', accent: 'purple' },
    { label: 'Total Sessions', value: metrics.total_game_sessions ?? 0, sub: 'Recorded runs', icon: Activity, color: 'var(--color-blue)', accent: 'blue' },
    { label: 'Completed Campaigns', value: metrics.completed_campaigns ?? 0, sub: 'Zero Horizon sealed', icon: AwardIcon, color: 'var(--color-gold)', accent: 'gold' },
    { label: 'Worlds Restored', value: metrics.total_worlds_completed ?? 0, sub: 'Gateways unlocked', icon: Globe, color: 'var(--color-cyan)', accent: 'cyan' },
    { label: 'Missions Cleared', value: metrics.total_missions_completed ?? 0, sub: 'Cumulative steps', icon: Scroll, color: 'var(--color-purple)', accent: 'purple' },
    { label: 'Avg Completion Rate', value: `${metrics.average_completion_rate ?? 0}%`, sub: 'Players beating W1+', icon: CheckCircle2, color: 'var(--color-success)', accent: 'green' },
    { label: 'Total Feedback', value: metrics.total_feedback ?? 0, sub: 'Player reports', icon: MessageSquare, color: 'var(--color-blue)', accent: 'blue' },
    { label: 'Reported Issues', value: metrics.reported_issues ?? 0, sub: 'New / In progress', icon: AlertTriangle, color: metrics.reported_issues > 0 ? '#EF4444' : 'var(--color-text-muted)', accent: 'red' },
  ];

  function AwardIcon(props) {
    return <Sparkles {...props} />;
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.02em', margin: 0 }}>
              System Intelligence Dashboard
            </h1>
            <Badge variant="gold" size="sm">Live Telemetry</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Real database analytics, world progression telemetry, player sessions, and game controls.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={() => { playClick(); fetchDashboardStats(); }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Link to="/admin/analytics">
            <Button variant="secondary" size="sm" icon={BarChart3}>
              Analytics Matrix
            </Button>
          </Link>
          <Link to="/admin/missions">
            <Button variant="gold" size="sm" icon={PlusCircle}>
              Missions
            </Button>
          </Link>
          <Link to="/admin/worlds">
            <Button variant="cyan" size="sm" icon={Globe}>
              Manage Worlds
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: 'var(--radius-sm)', color: '#EF4444', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      {/* 2. 10 Key Performance Indicators Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.15rem'
        }}
      >
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} hover={true} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                  {k.label}
                </span>
                <Icon size={17} style={{ color: k.color }} />
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                {loading ? '...' : k.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: k.color, fontWeight: 500 }}>
                {k.sub}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Mid Grid: World Breakdown & Ending Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* World Telemetry Distribution */}
        <Card
          title="World Progression Matrix"
          subtitle="Real-time player distribution across timelines"
          action={
            <Link to="/admin/worlds" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              Configure Worlds &rarr;
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {worldStats.map((w) => {
              const activeCount = w.active_players || 0;
              const completedCount = w.completed_players || 0;
              const rate = activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0;

              return (
                <div key={w.id} style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>{w.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>({w.epoch})</span>
                    </div>
                    <Badge variant={w.is_active ? 'success' : 'danger'} size="sm">
                      {w.is_active ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                    <span>Active Seekers: {activeCount}</span>
                    <span>Completed: {completedCount} ({rate}%)</span>
                  </div>

                  <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(rate, 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #168CFF, #00D9FF)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Campaign Ending Distribution */}
        <Card
          title="Grand Campaign Destiny Breakdown"
          subtitle="Divergent ending choices made by players at the Zero Horizon"
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(245, 185, 66, 0.08)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Ending A // The Guardian
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0' }}>
                  {endings.ending_a}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Restore the Timeline
                </span>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0, 217, 255, 0.08)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Ending B // The Architect
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0' }}>
                  {endings.ending_b}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Create a New Timeline
                </span>
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                <span>Ending Choice Ratio</span>
                <span>{endings.total} Total Endings Reached</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0, 217, 255, 0.3)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div
                  style={{
                    width: `${endings.total > 0 ? (endings.ending_a / endings.total) * 100 : 50}%`,
                    height: '100%',
                    background: '#F5B942'
                  }}
                  title="Ending A: Restore"
                />
                <div
                  style={{
                    width: `${endings.total > 0 ? (endings.ending_b / endings.total) * 100 : 50}%`,
                    height: '100%',
                    background: '#00D9FF'
                  }}
                  title="Ending B: Create"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '0.4rem' }}>
                <span style={{ color: '#F5B942' }}>&bull; Ending A: {endings.total > 0 ? Math.round((endings.ending_a / endings.total) * 100) : 50}%</span>
                <span style={{ color: '#00D9FF' }}>&bull; Ending B: {endings.total > 0 ? Math.round((endings.ending_b / endings.total) * 100) : 50}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Grid: Recent Players & Recent Sessions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Recent Registered Players Table */}
        <Card
          title="Recent Player Registrations"
          subtitle="Real-time player account creations"
          action={
            <Link to="/admin/players" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              All Players &rarr;
            </Link>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Player</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Level</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentPlayers.length > 0 ? (
                  recentPlayers.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.email}</div>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                        Lvl {p.level}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem' }}>
                        <Badge variant={p.is_active && !p.is_banned ? 'success' : 'danger'} size="sm">
                          {p.is_active && !p.is_banned ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No registered players found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Live Game Sessions Feed */}
        <Card
          title="Recent Game Sessions"
          subtitle="Telemetry from active and concluded game runs"
          action={
            <Link to="/admin/sessions" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              Session History &rarr;
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentSessions.length > 0 ? (
              recentSessions.map((s) => {
                const durationMins = Math.floor(s.duration_seconds / 60);
                const durationSecs = s.duration_seconds % 60;

                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '0.75rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFFFFF' }}>
                        {s.user?.name || 'Explorer'} &bull; <span style={{ color: 'var(--color-cyan)' }}>{s.world_id}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Duration: {durationMins}m {durationSecs}s &bull; XP Earned: +{s.xp_earned}
                      </div>
                    </div>

                    <Badge variant={s.completed ? 'success' : 'cyan'} size="sm">
                      {s.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)' }}>
                No recent game sessions recorded.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
