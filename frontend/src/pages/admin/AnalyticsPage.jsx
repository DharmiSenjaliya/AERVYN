import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Globe,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Award,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Real Game Analytics Intelligence Module
 * DAU/WAU/MAU, session durations, registration curves, world popularity,
 * Ending A vs Ending B breakdown, top collected items, and mission drop-off rates.
 */
export default function AnalyticsPage() {
  const { playClick } = useAudio();
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params: { range }
      });
      if (res.data?.success) {
        setData(res.data);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const summary = data?.summary || {};
  const worldPopularity = data?.world_popularity || [];
  const endings = data?.endings || { ending_a: 0, ending_b: 0, ending_a_rate: 50, ending_b_rate: 50, total: 0 };
  const topItems = data?.top_items || [];
  const dropoffs = data?.dropoffs || [];
  const regTrends = data?.registrations_trend || [];
  const hasSufficientData = data?.has_sufficient_data ?? true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header & Date Range Selectors */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Game Analytics & Telemetry
            </h1>
            <Badge variant="cyan" size="sm">Real Database Telemetry</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Player retention metrics, session durations, timeline popularity curves, and drop-off analysis.
          </p>
        </div>

        {/* Range Selector */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All Time' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => { playClick(); setRange(r.id); }}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-xs)',
                border: range === r.id ? '1px solid var(--border-cyan)' : '1px solid transparent',
                background: range === r.id ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
                color: range === r.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: '0.78rem',
                fontWeight: range === r.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {!hasSufficientData && (
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(245, 185, 66, 0.1)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#E2E8F0' }}>
          <AlertTriangle size={18} color="var(--color-gold)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Note on Sample Size:</strong> Telemetry reflects early player volume. Metrics update dynamically as more players engage with game sessions across timelines.
          </span>
        </div>
      )}

      {/* 2. DAU / WAU / MAU & Core KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        <Card hover={true} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
            <span>Weekly Active (WAU)</span>
            <Users size={16} color="var(--color-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0.1rem 0' }}>
            {loading ? '...' : summary.wau ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)' }}>Players active last 7d</span>
        </Card>

        <Card hover={true} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
            <span>Monthly Active (MAU)</span>
            <TrendingUp size={16} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0.1rem 0' }}>
            {loading ? '...' : summary.mau ?? 0}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-success)' }}>Players active last 30d</span>
        </Card>

        <Card hover={true} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
            <span>Avg Session Duration</span>
            <Clock size={16} color="var(--color-purple)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0.1rem 0' }}>
            {loading ? '...' : `${summary.avg_session_duration_mins ?? 0}m`}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-purple)' }}>Per active game session</span>
        </Card>

        <Card hover={true} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 600 }}>
            <span>Campaign Clearance</span>
            <Sparkles size={16} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.4rem 0 0.1rem 0' }}>
            {loading ? '...' : `${summary.campaign_completion_rate ?? 0}%`}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)' }}>{summary.completed_campaigns ?? 0} Finished Campaign</span>
        </Card>
      </div>

      {/* 3. Middle Grid: Registrations Graph & Ending Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Registrations Daily Trend */}
        <Card title="Player Registration Activity" subtitle={`Daily new seekers over ${range}`}>
          <div style={{ padding: '1rem 0', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {regTrends.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                {regTrends.map((t, idx) => {
                  const maxVal = Math.max(...regTrends.map((r) => r.count), 1);
                  const heightPercent = Math.max((t.count / maxVal) * 100, 15);
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-cyan)', fontWeight: 700, marginBottom: '4px' }}>{t.count}</span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '36px',
                          height: `${heightPercent}%`,
                          background: 'linear-gradient(180deg, #00D9FF 0%, rgba(22, 140, 255, 0.4) 100%)',
                          borderRadius: '4px 4px 0 0',
                          boxShadow: '0 0 10px rgba(0, 217, 255, 0.3)'
                        }}
                      />
                      <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                        {t.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                No registration records in this date range.
              </div>
            )}
          </div>
        </Card>

        {/* Ending A vs Ending B Comparison */}
        <Card title="Continuum Destiny Choices" subtitle="Philosophical breakdown at the Zero Horizon">
          <div style={{ padding: '0.75rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(245, 185, 66, 0.08)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Ending A // The Guardian
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0' }}>
                  {endings.ending_a_rate}%
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {endings.ending_a} Seekers Restored Timeline
                </span>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(0, 217, 255, 0.08)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Ending B // The Architect
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0' }}>
                  {endings.ending_b_rate}%
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {endings.ending_b} Seekers Created New Era
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
              "Ending A returns reality to natural linear entropy. Ending B synthesizes past magic, cybernetics, and singularity science into an unprecedented unified age."
            </p>
          </div>
        </Card>
      </div>

      {/* 4. Bottom Grid: World Popularity, Top Items & Drop-offs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* World Popularity Ranking */}
        <Card title="Timeline Popularity & Engagement" subtitle="Session volume across all eras">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {worldPopularity.map((w) => {
              const maxSess = Math.max(...worldPopularity.map((x) => x.sessions), 1);
              const barWidth = Math.max((w.sessions / maxSess) * 100, 8);
              return (
                <div key={w.world_id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{w.title}</span>
                    <span style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{w.sessions} Sessions</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${barWidth}%`, height: '100%', background: 'linear-gradient(90deg, #168CFF, #00D9FF)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    <span>Seekers: {w.players}</span>
                    <span>Completions: {w.completions}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Most Collected Artifacts */}
        <Card title="Most Reclaimed Relics" subtitle="Items with highest player acquisition">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {topItems.length > 0 ? (
              topItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gold)' }}>#{idx + 1}</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#FFFFFF' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                    {item.times_collected} collected
                  </span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '1.5rem' }}>
                No collectibles gathered yet.
              </div>
            )}
          </div>
        </Card>

        {/* Drop-off / Abandoned Missions Analysis */}
        <Card title="Friction & Drop-Off Points" subtitle="Missions where players are currently stalled">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dropoffs.length > 0 ? (
              dropoffs.map((d, idx) => (
                <div key={idx} style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{d.world_title}</span>
                    <Badge variant="purple" size="sm">Step #{d.step_number}</Badge>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{d.mission_title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px' }}>
                    {d.players_at_step} player(s) currently at this step
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '1.5rem' }}>
                All active players progressing smoothly.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
