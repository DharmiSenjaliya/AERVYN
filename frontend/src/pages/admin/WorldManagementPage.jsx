import React, { useState, useEffect } from 'react';
import {
  Globe,
  Edit,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * World Management Module
 * Configure world metadata, view completion metrics, manage active availability,
 * and upload promotional thumbnails.
 */
export default function WorldManagementPage() {
  const { playClick } = useAudio();
  const [worlds, setWorlds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editWorld, setEditWorld] = useState(null);
  const [uploadWorld, setUploadWorld] = useState(null);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchWorlds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/worlds', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.data?.success) {
        setWorlds(res.data.worlds || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorlds();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editWorld || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin/worlds/${editWorld.id}`,
        {
          title: editWorld.title,
          epoch: editWorld.epoch,
          description: editWorld.description,
          display_order: parseInt(editWorld.display_order, 10),
          is_active: !!editWorld.is_active,
          required_level: parseInt(editWorld.required_level, 10)
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setEditWorld(null);
        fetchWorlds();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update world.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadWorld || !file || submitting) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin/worlds/${uploadWorld.id}/thumbnail`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setUploadWorld(null);
        setFile(null);
        fetchWorlds();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload thumbnail.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Game World Management
            </h1>
            <Badge variant="gold" size="sm">4 Timelines Configured</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Configure timeline metadata, set required levels, manage promotional media, and monitor real completion rates.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchWorlds}>
          Refresh
        </Button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* Safety Notice Banner */}
      <div style={{ padding: '0.85rem 1rem', background: 'rgba(0, 217, 255, 0.05)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
        <AlertCircle size={18} color="var(--color-cyan)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Architecture Note:</strong> Modifying world details updates the game catalog configuration and access requirements.
          Stable world identifiers (<code>world_1</code>, <code>world_2</code>, etc.) remain permanently mapped to their respective 3D environments.
        </span>
      </div>

      {/* 2. World Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {worlds.map((w) => {
          const colors = {
            world_1: 'var(--color-cyan)',
            world_2: 'var(--color-purple)',
            world_3: 'var(--color-gold)',
            world_final: '#38BDF8'
          };
          const color = colors[w.id] || 'var(--color-cyan)';

          return (
            <Card key={w.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: color, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                      {w.epoch}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0.2rem 0' }}>
                      {w.title}
                    </h3>
                  </div>
                  <Badge variant={w.is_active ? 'success' : 'danger'} size="sm">
                    {w.is_active ? 'Active' : 'Disabled'}
                  </Badge>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {w.description}
                </p>

                {/* Telemetry Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Missions</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>{w.missions_count} Steps</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Required Level</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-gold)' }}>Lvl {w.required_level}+</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Active Seekers</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-cyan)' }}>{w.active_players}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>Completions</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-success)' }}>{w.completed_players} ({w.completion_rate}%)</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  icon={Edit}
                  onClick={() => { playClick(); setEditWorld({ ...w }); }}
                >
                  Edit World
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Upload}
                  onClick={() => { playClick(); setUploadWorld(w); }}
                  title="Upload Thumbnail"
                >
                  Media
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Edit World Modal */}
      {editWorld && (
        <Modal
          isOpen={!!editWorld}
          onClose={() => setEditWorld(null)}
          title={`Edit World: ${editWorld.title}`}
          maxWidth="560px"
        >
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>World Title</label>
              <input
                type="text"
                value={editWorld.title}
                onChange={(e) => setEditWorld({ ...editWorld, title: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Epoch / Subtitle</label>
              <input
                type="text"
                value={editWorld.epoch}
                onChange={(e) => setEditWorld({ ...editWorld, epoch: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea
                value={editWorld.description}
                onChange={(e) => setEditWorld({ ...editWorld, description: e.target.value })}
                required
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Display Order</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editWorld.display_order}
                  onChange={(e) => setEditWorld({ ...editWorld, display_order: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Required Player Level</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editWorld.required_level}
                  onChange={(e) => setEditWorld({ ...editWorld, required_level: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="world_active_toggle"
                checked={!!editWorld.is_active}
                onChange={(e) => setEditWorld({ ...editWorld, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="world_active_toggle" style={{ fontSize: '0.85rem', color: '#FFFFFF', cursor: 'pointer' }}>
                World is Active & Available to Players
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setEditWorld(null)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save World Settings'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Upload Thumbnail Modal */}
      {uploadWorld && (
        <Modal
          isOpen={!!uploadWorld}
          onClose={() => { setUploadWorld(null); setFile(null); }}
          title={`Upload Promotional Image: ${uploadWorld.title}`}
          maxWidth="480px"
        >
          <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Upload a high-resolution promotional banner or thumbnail for {uploadWorld.title}. Supported formats: JPEG, PNG, WEBP (Max 2MB).
            </p>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files[0] || null)}
              required
              style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.82rem' }}
            />

            {file && (
              <div style={{ fontSize: '0.76rem', color: 'var(--color-cyan)' }}>
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => { setUploadWorld(null); setFile(null); }}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={!file || submitting}>
                {submitting ? 'Uploading...' : 'Upload Media'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
