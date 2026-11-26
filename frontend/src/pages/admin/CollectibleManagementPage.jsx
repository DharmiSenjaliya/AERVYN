import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Edit,
  RotateCcw,
  BookOpen,
  Zap,
  Shield,
  Layers,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Collectibles & Story Content Module
 * Manages Energy Fragments, Quantum Cores, Chrono Shards, Artifacts, and Codex Lore.
 */
export default function CollectibleManagementPage() {
  const { playClick } = useAudio();
  const [collectibles, setCollectibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchCollectibles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = activeCategory ? { category: activeCategory } : {};
      const res = await axios.get('http://127.0.0.1:8000/api/admin/collectibles', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });
      if (res.data?.success) {
        setCollectibles(res.data.collectibles || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectibles();
  }, [activeCategory]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editItem || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin/collectibles/${editItem.id}`,
        {
          name: editItem.name,
          description: editItem.description,
          story_text: editItem.story_text,
          is_active: !!editItem.is_active
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setEditItem(null);
        fetchCollectibles();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update content.' });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: '', label: 'All Content' },
    { id: 'fragment', label: 'Energy Fragments (W1)' },
    { id: 'quantum_core', label: 'Quantum Cores (W2)' },
    { id: 'chrono_shard', label: 'Chrono Shards (W3)' },
    { id: 'artifact', label: 'Ancient Artifacts & Keystones' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Collectibles & Story Content
            </h1>
            <Badge variant="purple" size="sm">{collectibles.length} Artifacts / Shards</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Inspect item collection counts, edit artifact lore inscriptions, and configure content availability.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchCollectibles}>
          Refresh
        </Button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 2. Category Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => { playClick(); setActiveCategory(c.id); }}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-xs)',
              border: activeCategory === c.id ? '1px solid var(--border-purple)' : '1px solid transparent',
              background: activeCategory === c.id ? 'rgba(112, 71, 255, 0.2)' : 'transparent',
              color: activeCategory === c.id ? '#FFFFFF' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: activeCategory === c.id ? 700 : 500,
              transition: 'all 0.2s ease'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 3. Collectibles Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Identifier</th>
                <th style={{ padding: '0.85rem 1rem' }}>Name & Inscription</th>
                <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem' }}>World</th>
                <th style={{ padding: '0.85rem 1rem' }}>Times Collected</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading collectibles registry...
                  </td>
                </tr>
              ) : collectibles.length > 0 ? (
                collectibles.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      {item.id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', marginTop: '2px', maxWidth: '380px' }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-purple)', fontWeight: 600 }}>
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-cyan)', fontSize: '0.78rem', fontWeight: 600 }}>
                      {item.world_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--color-gold)' }}>
                      {item.times_collected} seekers
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={item.is_active ? 'success' : 'danger'} size="sm">
                        {item.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => { playClick(); setEditItem({ ...item }); }}
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
                    No collectibles found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Edit Collectible Modal */}
      {editItem && (
        <Modal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title={`Edit Content: ${editItem.name}`}
          maxWidth="560px"
        >
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Display Name</label>
              <input
                type="text"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Short Description</label>
              <textarea
                value={editItem.description}
                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                required
                rows={2}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Story Inscription / Lore Codex Text</label>
              <textarea
                value={editItem.story_text || ''}
                onChange={(e) => setEditItem({ ...editItem, story_text: e.target.value })}
                rows={4}
                placeholder="Narrative revelation displayed in the Story Journal [J]..."
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="item_active_toggle"
                checked={!!editItem.is_active}
                onChange={(e) => setEditItem({ ...editItem, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="item_active_toggle" style={{ fontSize: '0.85rem', color: '#FFFFFF', cursor: 'pointer' }}>
                Content is Active & Collectible in Game
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Content'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
