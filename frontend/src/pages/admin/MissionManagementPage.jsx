import React, { useState, useEffect } from 'react';
import {
  Scroll,
  Filter,
  Edit,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Mission Management Module
 * Lists all missions across Worlds 1-4, filters by world, and enables updating title,
 * descriptions, objectives, XP rewards, and availability.
 */
export default function MissionManagementPage() {
  const { playClick } = useAudio();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorld, setSelectedWorld] = useState('');
  const [editMission, setEditMission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = selectedWorld ? { world_id: selectedWorld } : {};
      const res = await axios.get('http://127.0.0.1:8000/api/admin/missions', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });
      if (res.data?.success) {
        setMissions(res.data.missions || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [selectedWorld]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editMission || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin/missions/${editMission.id}`,
        {
          title: editMission.title,
          description: editMission.description,
          objectives: editMission.objectives || [],
          xp_reward: parseInt(editMission.xp_reward, 10),
          is_active: !!editMission.is_active
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setEditMission(null);
        fetchMissions();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update mission.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddObjective = () => {
    const cur = editMission.objectives || [];
    setEditMission({ ...editMission, objectives: [...cur, ''] });
  };

  const handleObjectiveChange = (index, val) => {
    const cur = [...(editMission.objectives || [])];
    cur[index] = val;
    setEditMission({ ...editMission, objectives: cur });
  };

  const handleRemoveObjective = (index) => {
    const cur = [...(editMission.objectives || [])];
    cur.splice(index, 1);
    setEditMission({ ...editMission, objectives: cur });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Mission Management
            </h1>
            <Badge variant="cyan" size="sm">{missions.length} Missions Active</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Manage step objectives, XP awards, and availability for all story campaign milestones.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchMissions}>
          Refresh
        </Button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 2. World Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        {[
          { id: '', label: 'All Timelines' },
          { id: 'world_1', label: 'World 1: Lost Kingdom' },
          { id: 'world_2', label: 'World 2: Broken Present' },
          { id: 'world_3', label: 'World 3: Fractured Future' },
          { id: 'world_final', label: 'World 4: The Last Timeline' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { playClick(); setSelectedWorld(tab.id); }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-xs)',
              border: selectedWorld === tab.id ? '1px solid var(--border-cyan)' : '1px solid transparent',
              background: selectedWorld === tab.id ? 'rgba(0, 217, 255, 0.15)' : 'transparent',
              color: selectedWorld === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: selectedWorld === tab.id ? 700 : 500,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Missions Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Step</th>
                <th style={{ padding: '0.85rem 1rem' }}>Mission Title & Objectives</th>
                <th style={{ padding: '0.85rem 1rem' }}>World</th>
                <th style={{ padding: '0.85rem 1rem' }}>XP Reward</th>
                <th style={{ padding: '0.85rem 1rem' }}>Players Reached</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading missions registry...
                  </td>
                </tr>
              ) : missions.length > 0 ? (
                missions.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                      #{m.step_number}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{m.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '2px', maxWidth: '420px', lineHeight: 1.4 }}>
                        {m.description}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-cyan)', fontWeight: 600 }}>{m.world_id}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                      +{m.xp_reward} XP
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {m.players_reached}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={m.is_active ? 'success' : 'danger'} size="sm">
                        {m.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => { playClick(); setEditMission({ ...m }); }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid var(--border-subtle)',
                          color: '#FFFFFF',
                          padding: '0.35rem 0.65rem',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.76rem'
                        }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No missions found for this timeline.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Edit Mission Modal */}
      {editMission && (
        <Modal
          isOpen={!!editMission}
          onClose={() => setEditMission(null)}
          title={`Edit Mission: Step ${editMission.step_number} - ${editMission.title}`}
          maxWidth="600px"
        >
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Mission Title</label>
              <input
                type="text"
                value={editMission.title}
                onChange={(e) => setEditMission({ ...editMission, title: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea
                value={editMission.description}
                onChange={(e) => setEditMission({ ...editMission, description: e.target.value })}
                required
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Objectives Checklist</label>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <Plus size={12} /> Add Objective
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(editMission.objectives || []).map((obj, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleObjectiveChange(i, e.target.value)}
                      placeholder={`Objective ${i + 1}...`}
                      style={{ flex: 1, padding: '0.45rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveObjective(i)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#EF4444', borderRadius: 'var(--radius-sm)', padding: '0 0.5rem', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>XP Reward</label>
              <input
                type="number"
                min="0"
                max="5000"
                value={editMission.xp_reward}
                onChange={(e) => setEditMission({ ...editMission, xp_reward: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="mission_active_toggle"
                checked={!!editMission.is_active}
                onChange={(e) => setEditMission({ ...editMission, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="mission_active_toggle" style={{ fontSize: '0.85rem', color: '#FFFFFF', cursor: 'pointer' }}>
                Mission is Active & Solvable in Game
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setEditMission(null)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Mission'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
