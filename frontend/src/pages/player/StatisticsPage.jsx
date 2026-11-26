import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Clock,
  History,
  Globe,
  Scroll,
  Backpack,
  Key,
  Swords,
  Zap,
  Award,
  Sparkles,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/player/statistics', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load player stats:', err);
      setError('Unable to load temporal statistics from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Compiling In-Game Telemetry Statistics...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Telemetry Error</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={fetchStats}>Retry</Button>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            In-Game Player Statistics
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Verified telemetry recorded directly from your 3D adventure gameplay.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchStats} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> Refresh Telemetry
        </Button>
      </div>

      {/* 10 Core Metric Overview Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}
      >
        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Playtime</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.playtime.formatted}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <History size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Sessions</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.sessions_count}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Globe size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Worlds Cleared</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.worlds_completed} / 4</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#ffd700' }}>
            <Scroll size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Objectives</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.missions_completed}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Backpack size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Collectibles</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.collectibles_discovered}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <Key size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Puzzles Solved</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.puzzles_completed}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Swords size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Boss Victories</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{stats.boss_victories}</div>
          </div>
        </Card>

        <Card style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ padding: '0.65rem', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Total XP Earned</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd700' }}>{stats.total_xp_earned} XP</div>
          </div>
        </Card>
      </div>

      {/* Campaign Climax & Ending Selection Banner */}
      <Card
        style={{
          padding: '1.5rem',
          background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, rgba(0, 240, 255, 0.08) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-primary-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
            Campaign Completion Status & Climax Destiny
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginTop: '0.25rem' }}>
            {stats.campaign_completed ? 'Campaign Climax Reached' : 'Campaign In Progress'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginTop: '0.35rem' }}>
            Selected Ending: <strong style={{ color: stats.ending_raw ? '#ffd700' : 'white' }}>{stats.ending_selected}</strong>
          </div>
        </div>

        <div style={{ minWidth: '220px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, marginBottom: '0.35rem' }}>
            Overall Completion: {stats.campaign_completion_percentage}%
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${stats.campaign_completion_percentage}%`,
                background: 'linear-gradient(90deg, #00f0ff 0%, #10b981 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </Card>

      {/* World-by-World Telemetry Breakdown */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
          Epoch Telemetry Breakdowns
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {stats.world_breakdowns.map((world) => (
            <Card
              key={world.world_id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: world.is_completed ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {world.epoch}
                </span>
                {world.is_completed ? (
                  <Badge variant="success" size="sm">Completed</Badge>
                ) : (
                  <Badge variant="secondary" size="sm">Step {world.current_step}</Badge>
                )}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{world.title}</h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-text-dim)' }}>Playtime:</span>{' '}
                  <strong style={{ color: 'white' }}>{world.playtime_formatted}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-dim)' }}>Relics:</span>{' '}
                  <strong style={{ color: '#ffd700' }}>{world.items_collected} found</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--color-text-dim)' }}>Checkpoint:</span>{' '}
                  <span style={{ color: '#a0aec0', fontFamily: 'monospace' }}>{world.checkpoint}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Discovered Relics Inventory Table */}
      <Card title={`Discovered Collectibles & Relics (${stats.inventory_items?.length || 0})`}>
        {(!stats.inventory_items || stats.inventory_items.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
            <Backpack size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
            <div>No inventory items discovered yet.</div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Collect Energy Fragments in World 1 or Quantum Cores in World 2.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--color-text-dim)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Item Identifier</th>
                  <th style={{ padding: '0.75rem' }}>Item Name</th>
                  <th style={{ padding: '0.75rem' }}>Epoch Discovered</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.inventory_items.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--color-primary-cyan)' }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: 'white' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.world.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <Badge variant="cyan" size="sm">Collected</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
