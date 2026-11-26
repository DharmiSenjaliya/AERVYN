import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  UserX,
  UserCheck,
  RotateCcw,
  Shield,
  Clock,
  Sparkles,
  Award,
  Globe,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Player Management Module
 * Searchable & filterable player table, deep telemetry modal, and secure suspend/reactivate actions.
 */
export default function PlayerManagementPage() {
  const { playClick } = useAudio();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected Player for Details Modal
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetailsLoading, setPlayerDetailsLoading] = useState(false);

  // Action Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, player: null, action: 'suspend', reason: '' });
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const fetchPlayers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { page };
      if (search) params.search = search;
      if (status) params.status = status;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await axios.get('http://127.0.0.1:8000/api/admin/players', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });

      if (res.data?.success) {
        setPlayers(res.data.players.data || []);
        setPagination({
          current_page: res.data.players.current_page,
          last_page: res.data.players.last_page,
          total: res.data.players.total
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers(1);
  }, [status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlayers(1);
  };

  const handleViewPlayer = async (playerId) => {
    playClick();
    setPlayerDetailsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://127.0.0.1:8000/api/admin/players/${playerId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.data?.success) {
        setSelectedPlayer(res.data.player);
      }
    } catch {
    } finally {
      setPlayerDetailsLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.player || actionSubmitting) return;
    setActionSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin/players/${confirmModal.player.id}/status`,
        { action: confirmModal.action, reason: confirmModal.reason },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        // Update table locally
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === confirmModal.player.id
              ? { ...p, is_active: res.data.player.is_active, is_banned: res.data.player.is_banned }
              : p
          )
        );
        setConfirmModal({ isOpen: false, player: null, action: 'suspend', reason: '' });
      }
    } catch {
    } finally {
      setActionSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Player Management
            </h1>
            <Badge variant="cyan" size="sm">{pagination.total} Registered</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Inspect player profiles, view real progress telemetry, manage account status, and enforce security policies.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RotateCcw}
          onClick={() => { playClick(); fetchPlayers(pagination.current_page); }}
        >
          Refresh
        </Button>
      </div>

      {/* 2. Filters & Search Bar */}
      <Card style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search player by name or email..."
              value={search}
              onChange={(e) => setSearch}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          {/* Status Dropdown */}
          <div style={{ width: '160px' }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                background: 'rgba(22, 30, 53, 0.95)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          <Button variant="cyan" size="sm" type="submit">
            Search
          </Button>

          {(search || status || startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatus('');
                setStartDate('');
                setEndDate('');
                fetchPlayers(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </form>
      </Card>

      {/* 3. Players Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Player Details</th>
                <th style={{ padding: '0.85rem 1rem' }}>Rank / Level</th>
                <th style={{ padding: '0.85rem 1rem' }}>Sessions</th>
                <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Registered Date</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading player directory...
                  </td>
                </tr>
              ) : players.length > 0 ? (
                players.map((p) => {
                  const isActive = p.is_active && !p.is_banned;
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{p.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{p.email}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>Lvl {p.level}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>({p.xp} XP)</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#FFFFFF' }}>
                        {p.sessions_count ?? 0} runs
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={isActive ? 'success' : 'danger'} size="sm">
                          {isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleViewPlayer(p.id)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid var(--border-subtle)',
                              color: '#FFFFFF',
                              padding: '0.35rem 0.65rem',
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.76rem'
                            }}
                            title="View Player Profile"
                          >
                            <Eye size={13} /> Inspect
                          </button>

                          {isActive ? (
                            <button
                              onClick={() => {
                                playClick();
                                setConfirmModal({ isOpen: true, player: p, action: 'suspend', reason: '' });
                              }}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #EF4444',
                                color: '#EF4444',
                                padding: '0.35rem 0.65rem',
                                borderRadius: 'var(--radius-xs)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.76rem'
                              }}
                              title="Suspend Player"
                            >
                              <UserX size={13} /> Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playClick();
                                setConfirmModal({ isOpen: true, player: p, action: 'reactivate', reason: '' });
                              }}
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid #10B981',
                                color: '#10B981',
                                padding: '0.35rem 0.65rem',
                                borderRadius: 'var(--radius-xs)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.76rem'
                              }}
                              title="Reactivate Player"
                            >
                              <UserCheck size={13} /> Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No players matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.last_page > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Total)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => fetchPlayers(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  cursor: pagination.current_page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: pagination.current_page <= 1 ? 0.4 : 1
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => fetchPlayers(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  cursor: pagination.current_page >= pagination.last_page ? 'not-allowed' : 'pointer',
                  opacity: pagination.current_page >= pagination.last_page ? 0.4 : 1
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Player Deep Telemetry Profile Modal */}
      {selectedPlayer && (
        <Modal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          title={`Seeker Profile: ${selectedPlayer.name}`}
          maxWidth="700px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Vitals & Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Level & XP</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-cyan)', marginTop: '2px' }}>
                  Lvl {selectedPlayer.level} <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({selectedPlayer.xp} XP)</span>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Total Playtime</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-gold)', marginTop: '2px' }}>
                  {selectedPlayer.total_playtime_formatted}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Campaign Status</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: selectedPlayer.campaign_completed ? '#10B981' : '#F5B942', marginTop: '2px' }}>
                  {selectedPlayer.campaign_completed ? 'Completed' : 'In Progress'}
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Chosen Destiny</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: selectedPlayer.ending_selected === 'ending_b' ? 'var(--color-cyan)' : 'var(--color-gold)', marginTop: '4px' }}>
                  {selectedPlayer.ending_selected === 'ending_a'
                    ? 'The Guardian'
                    : selectedPlayer.ending_selected === 'ending_b'
                    ? 'The Architect'
                    : 'Undecided'}
                </div>
              </div>
            </div>

            {/* Completed Worlds Badges */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Completed Timelines ({selectedPlayer.completed_worlds?.length || 0} / 4)
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['world_1', 'world_2', 'world_3', 'world_final'].map((wId) => {
                  const isDone = selectedPlayer.completed_worlds?.includes(wId);
                  const names = {
                    world_1: 'World 1: Lost Kingdom',
                    world_2: 'World 2: Broken Present',
                    world_3: 'World 3: Fractured Future',
                    world_final: 'World 4: The Last Timeline'
                  };
                  return (
                    <Badge key={wId} variant={isDone ? 'success' : 'purple'} size="sm">
                      {isDone ? '✓ ' : '○ '}{names[wId]}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Inventory / Items Collected */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Collected Items ({selectedPlayer.unique_items?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedPlayer.unique_items?.length > 0 ? (
                  selectedPlayer.unique_items.map((it, idx) => (
                    <span key={idx} style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', color: '#E2E8F0' }}>
                      {it}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>No items discovered yet.</span>
                )}
              </div>
            </div>

            {/* Recent Sessions */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Recent Game Sessions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
                {selectedPlayer.recent_sessions?.length > 0 ? (
                  selectedPlayer.recent_sessions.map((s) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-xs)', fontSize: '0.76rem' }}>
                      <span>{s.world_id} &bull; {new Date(s.started_at).toLocaleDateString()}</span>
                      <span style={{ color: 'var(--color-gold)' }}>+{s.xp_earned} XP ({Math.floor(s.duration_seconds / 60)} mins)</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>No recorded sessions.</span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Action Confirmation Modal */}
      {confirmModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-panel-heavy" style={{ maxWidth: '440px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-md)', border: confirmModal.action === 'suspend' ? '1px solid #EF4444' : '1px solid #10B981', background: 'rgba(12, 15, 28, 0.98)', textAlign: 'center' }}>
            <AlertTriangle size={38} color={confirmModal.action === 'suspend' ? '#EF4444' : '#10B981'} style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
              {confirmModal.action === 'suspend' ? 'Suspend Player Account?' : 'Reactivate Player Account?'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to {confirmModal.action} <strong>{confirmModal.player?.name}</strong> ({confirmModal.player?.email})?
              {confirmModal.action === 'suspend' && ' This will revoke game access immediately.'}
            </p>

            <input
              type="text"
              placeholder="Audit log reason (optional)..."
              value={confirmModal.reason}
              onChange={(e) => setConfirmModal({ ...confirmModal, reason: e.target.value })}
              style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.82rem', marginBottom: '1.5rem', outline: 'none', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setConfirmModal({ isOpen: false, player: null, action: 'suspend', reason: '' })}
                disabled={actionSubmitting}
                style={{ padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionSubmitting}
                style={{
                  padding: '0.55rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: confirmModal.action === 'suspend' ? '#EF4444' : '#10B981',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                {actionSubmitting ? 'Processing...' : `Confirm ${confirmModal.action === 'suspend' ? 'Suspension' : 'Activation'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
