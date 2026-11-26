import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Key,
  Edit,
  RotateCcw,
  UserX,
  UserCheck,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Admin User Management & Role-Based Access Control (RBAC) Module
 * Super Admin, Game Manager, Support Manager, and Analyst account administration.
 */
export default function AdminUsersPage() {
  const { playClick } = useAudio();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'game_manager' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      if (res.data?.success) {
        setAdmins(res.data.admins || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://127.0.0.1:8000/api/admin/users',
        newAdmin,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setCreateModal(false);
        setNewAdmin({ name: '', email: '', password: '', role: 'game_manager' });
        fetchAdmins();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create admin.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editAdmin || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin/users/${editAdmin.id}`,
        {
          name: editAdmin.name,
          email: editAdmin.email,
          role: editAdmin.role,
          password: editAdmin.password || undefined
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setEditAdmin(null);
        fetchAdmins();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update admin.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (adminId) => {
    playClick();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://127.0.0.1:8000/api/admin/users/${adminId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        fetchAdmins();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update status.' });
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
      case 'admin':
        return <Badge variant="gold" size="sm">Super Admin</Badge>;
      case 'game_manager':
        return <Badge variant="cyan" size="sm">Game Manager</Badge>;
      case 'support_manager':
        return <Badge variant="blue" size="sm">Support Manager</Badge>;
      case 'analyst':
        return <Badge variant="purple" size="sm">Analyst</Badge>;
      default:
        return <Badge size="sm">{role}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Admin Users & RBAC Permissions
            </h1>
            <Badge variant="gold" size="sm">{admins.length} Administrators</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Manage studio administrator accounts, assign role permissions, and control security authorization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchAdmins}>
            Refresh
          </Button>
          <Button variant="cyan" size="sm" icon={UserPlus} onClick={() => { playClick(); setCreateModal(true); }}>
            Create Admin
          </Button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 2. Admin Users Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Administrator</th>
                <th style={{ padding: '0.85rem 1rem' }}>Assigned Role</th>
                <th style={{ padding: '0.85rem 1rem' }}>Account Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Created Date</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading administrator directory...
                  </td>
                </tr>
              ) : admins.length > 0 ? (
                admins.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{a.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>{a.email}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {getRoleBadge(a.role)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <Badge variant={a.is_active ? 'success' : 'danger'} size="sm">
                        {a.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => { playClick(); setEditAdmin({ ...a, password: '' }); }}
                          style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem' }}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(a.id)}
                          style={{
                            background: a.is_active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: `1px solid ${a.is_active ? '#EF4444' : '#10B981'}`,
                            color: a.is_active ? '#EF4444' : '#10B981',
                            padding: '0.35rem 0.65rem',
                            borderRadius: 'var(--radius-xs)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem'
                          }}
                        >
                          {a.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                          {a.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No administrators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Create Admin Modal */}
      {createModal && (
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="Create New Administrator"
          maxWidth="500px"
        >
          <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Password (min 8 characters)</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                required
                minLength={8}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Administrative Role</label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="game_manager">Game Manager (Worlds, Missions, Content)</option>
                <option value="support_manager">Support Manager (Feedback & Bug Triage)</option>
                <option value="analyst">Analyst (Telemetry & Analytics)</option>
                <option value="super_admin">Super Admin (Full System Control)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setCreateModal(false)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Admin Account'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Edit Admin Modal */}
      {editAdmin && (
        <Modal
          isOpen={!!editAdmin}
          onClose={() => setEditAdmin(null)}
          title={`Edit Administrator: ${editAdmin.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                value={editAdmin.name}
                onChange={(e) => setEditAdmin({ ...editAdmin, name: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                value={editAdmin.email}
                onChange={(e) => setEditAdmin({ ...editAdmin, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Reset Password (leave blank to keep current)</label>
              <input
                type="password"
                placeholder="New password..."
                value={editAdmin.password}
                onChange={(e) => setEditAdmin({ ...editAdmin, password: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Administrative Role</label>
              <select
                value={editAdmin.role}
                onChange={(e) => setEditAdmin({ ...editAdmin, role: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="game_manager">Game Manager (Worlds, Missions, Content)</option>
                <option value="support_manager">Support Manager (Feedback & Bug Triage)</option>
                <option value="analyst">Analyst (Telemetry & Analytics)</option>
                <option value="super_admin">Super Admin (Full System Control)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setEditAdmin(null)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Admin Account'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
