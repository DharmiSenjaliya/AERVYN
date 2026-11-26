import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Game Session Management & Monitoring Module
 * Tracks live and historical player game runs, durations, worlds, and XP rewards.
 */
export default function GameSessionsPage() {
  const { playClick } = useAudio();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [worldId, setWorldId] = useState('');
  const [status, setStatus] = useState('');

  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { page };
      if (search) params.search = search;
      if (worldId) params.world_id = worldId;
      if (status) params.status = status;

      const res = await axios.get('http://127.0.0.1:8000/api/admin/sessions', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });

      if (res.data?.success) {
        setSessions(res.data.sessions.data || []);
        setPagination({
          current_page: res.data.sessions.current_page,
          last_page: res.data.sessions.last_page,
          total: res.data.sessions.total
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(1);
  }, [worldId, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSessions(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Game Session Monitoring
            </h1>
            <Badge variant="blue" size="sm">{pagination.total} Recorded Sessions</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Monitor real-time player connection durations, active timelines, and session completion states.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => fetchSessions(pagination.current_page)}>
          Refresh
        </Button>
      </div>

      {/* 2. Filters Card */}
      <Card style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by player name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              value={worldId}
              onChange={(e) => setWorldId(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="">All Worlds</option>
              <option value="world_1">World 1: Lost Kingdom</option>
              <option value="world_2">World 2: Broken Present</option>
              <option value="world_3">World 3: Fractured Future</option>
              <option value="world_final">World 4: The Last Timeline</option>
            </select>
          </div>

          <div style={{ width: '150px' }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>

          <Button variant="cyan" size="sm" type="submit">Filter</Button>

          {(search || worldId || status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(''); setWorldId(''); setStatus(''); fetchSessions(1); }}
            >
              Reset
            </Button>
          )}
        </form>
      </Card>

      {/* 3. Sessions Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Session ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Player</th>
                <th style={{ padding: '0.85rem 1rem' }}>Active Timeline</th>
                <th style={{ padding: '0.85rem 1rem' }}>Started At</th>
                <th style={{ padding: '0.85rem 1rem' }}>Duration</th>
                <th style={{ padding: '0.85rem 1rem' }}>XP Rewarded</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading session stream...
                  </td>
                </tr>
              ) : sessions.length > 0 ? (
                sessions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      #SES-{s.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{s.user?.name || 'Explorer'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{s.user?.email || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
                      {s.world_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)' }}>
                      {new Date(s.started_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#FFFFFF' }}>
                      {s.duration_formatted || `${Math.floor(s.duration_seconds / 60)}m ${s.duration_seconds % 60}s`}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-gold)' }}>
                      +{s.xp_earned} XP
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={s.completed ? 'success' : 'cyan'} size="sm">
                        {s.completed ? 'Completed' : 'In Progress'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No sessions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Total)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => fetchSessions(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', cursor: pagination.current_page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => fetchSessions(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', cursor: pagination.current_page >= pagination.last_page ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
