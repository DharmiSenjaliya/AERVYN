import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldAlert,
  Save,
  Lock,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Mail,
  Zap,
  Globe,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * System & Game Settings Module
 * Game branding, maintenance mode lock, support contact, announcement marquee,
 * and secure admin password modification.
 */
export default function AdminSettingsPage() {
  const { playClick } = useAudio();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  // Maintenance Toggle Confirmation
  const [maintenanceModal, setMaintenanceModal] = useState({ isOpen: false, enable: false, reason: '' });

  // Password Change
  const [pwdForm, setPwdForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwdSubmitting, setPwdSubmitting] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.data?.success) {
        // Flatten into key-value map
        const map = {};
        Object.values(res.data.settings || {}).forEach((group) => {
          group.forEach((s) => {
            map[s.key] = s.value;
          });
        });
        setSettings(map);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));

      const res = await axios.put(
        'http://127.0.0.1:8000/api/admin/settings',
        { settings: payload },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );

      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        fetchSettings();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMaintenanceConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://127.0.0.1:8000/api/admin/settings/maintenance',
        { enabled: maintenanceModal.enable, reason: maintenanceModal.reason },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setSettings((prev) => ({ ...prev, maintenance_mode: res.data.maintenance_mode ? 'true' : 'false' }));
        setMaintenanceModal({ isOpen: false, enable: false, reason: '' });
        setMsg({ type: 'success', text: res.data.message });
      }
    } catch {
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdSubmitting) return;
    setPwdSubmitting(true);
    setPwdMsg(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://127.0.0.1:8000/api/admin/change-password',
        pwdForm,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setPwdMsg({ type: 'success', text: res.data.message });
        setPwdForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      }
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPwdSubmitting(false);
    }
  };

  const isMaintenanceActive = settings.maintenance_mode === 'true';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              System & Game Settings
            </h1>
            <Badge variant="cyan" size="sm">System Configuration</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Manage server maintenance mode, brand announcements, support contacts, and security credentials.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchSettings}>
          Reload Settings
        </Button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 2. Main Settings Form */}
      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General Branding */}
        <Card title="Game Branding & Public Metadata" subtitle="Official product title and public communication">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Game Title</label>
              <input
                type="text"
                value={settings.game_title || ''}
                onChange={(e) => setSettings({ ...settings, game_title: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Brand Tagline</label>
              <input
                type="text"
                value={settings.game_tagline || ''}
                onChange={(e) => setSettings({ ...settings, game_tagline: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>In-Game Announcement Marquee</label>
              <textarea
                value={settings.announcement || ''}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                rows={2}
                placeholder="Broadcast marquee message visible in menus..."
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </Card>

        {/* Support & Gameplay Tuning */}
        <Card title="Support & Economy Configuration" subtitle="Customer contact routes and gameplay reward tuning">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Player Support Email</label>
              <input
                type="email"
                value={settings.support_email || ''}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Global XP Multiplier</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5.0"
                value={settings.xp_multiplier || '1.0'}
                onChange={(e) => setSettings({ ...settings, xp_multiplier: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="cyan" size="md" icon={Save} type="submit" disabled={submitting}>
            {submitting ? 'Saving Configuration...' : 'Save System Settings'}
          </Button>
        </div>
      </form>

      {/* 3. Maintenance Mode Danger Zone */}
      <Card
        title="Server Maintenance Mode Lock"
        subtitle="Global gameplay lock across all timelines"
        style={{ borderColor: isMaintenanceActive ? '#EF4444' : 'rgba(239, 68, 68, 0.3)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>
                Status: {isMaintenanceActive ? 'MAINTENANCE MODE ACTIVE' : 'SERVERS OPERATIONAL'}
              </span>
              <Badge variant={isMaintenanceActive ? 'danger' : 'success'} size="sm">
                {isMaintenanceActive ? 'Locked' : 'Online'}
              </Badge>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '520px' }}>
              Enabling maintenance mode prevents new player sessions from launching. Existing connected sessions are notified gracefully.
            </p>
          </div>

          <Button
            variant={isMaintenanceActive ? 'success' : 'danger'}
            size="sm"
            onClick={() => {
              playClick();
              setMaintenanceModal({ isOpen: true, enable: !isMaintenanceActive, reason: '' });
            }}
          >
            {isMaintenanceActive ? 'Deactivate Maintenance' : 'Activate Maintenance Mode'}
          </Button>
        </div>
      </Card>

      {/* 4. Administrator Password Change */}
      <Card title="Administrator Password & Security" subtitle="Update current administrative credentials">
        {pwdMsg && (
          <div style={{ padding: '0.75rem 1rem', background: pwdMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${pwdMsg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {pwdMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Current Password</label>
            <input
              type="password"
              value={pwdForm.current_password}
              onChange={(e) => setPwdForm({ ...pwdForm, current_password: e.target.value })}
              required
              style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>New Password (min 8 chars)</label>
            <input
              type="password"
              value={pwdForm.new_password}
              onChange={(e) => setPwdForm({ ...pwdForm, new_password: e.target.value })}
              required
              minLength={8}
              style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
            <input
              type="password"
              value={pwdForm.new_password_confirmation}
              onChange={(e) => setPwdForm({ ...pwdForm, new_password_confirmation: e.target.value })}
              required
              minLength={8}
              style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <Button variant="secondary" size="md" icon={Lock} type="submit" disabled={pwdSubmitting}>
              {pwdSubmitting ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </Card>

      {/* 5. Maintenance Confirmation Modal */}
      {maintenanceModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-panel-heavy" style={{ maxWidth: '440px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid #EF4444', background: 'rgba(12, 15, 28, 0.98)', textAlign: 'center' }}>
            <AlertTriangle size={38} color="#EF4444" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
              {maintenanceModal.enable ? 'Lock Game for Maintenance?' : 'Deactivate Maintenance Mode?'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              {maintenanceModal.enable
                ? 'Activating maintenance mode will immediately lock game launch access for all player accounts.'
                : 'Deactivating maintenance mode will restore normal player access across all timelines.'}
            </p>

            {maintenanceModal.enable && (
              <input
                type="text"
                placeholder="Reason (e.g. Scheduled database upgrade)..."
                value={maintenanceModal.reason}
                onChange={(e) => setMaintenanceModal({ ...maintenanceModal, reason: e.target.value })}
                style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.82rem', marginBottom: '1.5rem', outline: 'none', boxSizing: 'border-box' }}
              />
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setMaintenanceModal({ isOpen: false, enable: false, reason: '' })}
                style={{ padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleMaintenanceConfirm}
                style={{
                  padding: '0.55rem 1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: maintenanceModal.enable ? '#EF4444' : '#10B981',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.82rem'
                }}
              >
                {maintenanceModal.enable ? 'Confirm Maintenance Lock' : 'Confirm Restoration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
