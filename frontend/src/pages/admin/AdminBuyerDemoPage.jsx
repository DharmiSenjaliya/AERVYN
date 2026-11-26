import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Building,
  Users,
  ShieldCheck,
  BarChart3,
  ExternalLink,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * Admin Buyer Demo Management & Access Links Console
 * Allows administrators to generate private, cryptographically secure buyer demo tokens,
 * set expiration and session limits, revoke access, and inspect aggregate engagement analytics.
 */
export default function AdminBuyerDemoPage() {
  const [links, setLinks] = useState([]);
  const [kpis, setKpis] = useState({
    total_links: 0,
    active_links: 0,
    revoked_links: 0,
    total_private_sessions: 0
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // New Link Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newLinkResult, setNewLinkResult] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const [formData, setFormData] = useState({
    buyer_name: '',
    company: '',
    email: '',
    access_tier: 'standard',
    access_limit: 15,
    expires_in_days: 14,
    internal_notes: ''
  });

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const [linksRes, analyticsRes] = await Promise.all([
        api.get('/admin/buyer-demo/links', { params }),
        api.get('/admin/buyer-demo/analytics').catch(() => ({ data: { data: null } }))
      ]);

      if (linksRes.data?.data) {
        setLinks(linksRes.data.data.data || []);
        if (linksRes.data.kpis) {
          setKpis(linksRes.data.kpis);
        }
      }

      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load demo links:', err);
      showToast('Error loading buyer demo links.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [statusFilter]);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/admin/buyer-demo/links', formData);
      if (res.data?.data) {
        setNewLinkResult(res.data.data);
        showToast('Private buyer demo access token generated!');
        fetchLinks();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create access link.';
      showToast(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id, buyerName) => {
    if (!window.confirm(`Revoke private access for "${buyerName}"? This link will immediately stop functioning.`)) {
      return;
    }

    try {
      await api.post(`/admin/buyer-demo/links/${id}/revoke`);
      showToast(`Link for ${buyerName} revoked successfully.`);
      fetchLinks();
    } catch (err) {
      showToast('Failed to revoke access link.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="green" size="sm">ACTIVE</Badge>;
      case 'revoked':
        return <Badge variant="danger" size="sm">REVOKED</Badge>;
      case 'expired':
        return <Badge variant="gold" size="sm">EXPIRED</Badge>;
      case 'limit_reached':
        return <Badge variant="purple" size="sm">LIMIT REACHED</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '1rem 1.5rem',
            background: 'rgba(8, 11, 24, 0.95)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <Sparkles size={18} color="var(--color-cyan)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Key size={24} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              Buyer Demo Access & Link Management
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Issue private cryptographic access tokens, set expiry and usage limits, and monitor buyer walkthrough analytics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="cyan"
            size="sm"
            icon={Plus}
            onClick={() => {
              setNewLinkResult(null);
              setShowCreateModal(true);
            }}
          >
            Create Private Demo Link
          </Button>
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchLinks}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <Card title="Total Issued Links" accent="cyan">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{kpis.total_links}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            All-time private links
          </div>
        </Card>

        <Card title="Active Links" accent="cyan">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-cyan)' }}>{kpis.active_links}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Valid and unexpired
          </div>
        </Card>

        <Card title="Revoked Links" accent="gold">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ff6b81' }}>{kpis.revoked_links}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Blocked access
          </div>
        </Card>

        <Card title="Private Sessions" accent="purple">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-purple)' }}>{kpis.total_private_sessions}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Verified walkthroughs
          </div>
        </Card>
      </div>

      {/* Analytics Card */}
      {analytics && (
        <div className="glass-panel p-5 mb-8 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Buyer Demo Engagement Analytics
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Avg Feedback Rating: {analytics.avg_feedback_score || 'N/A'} / 5.0 ({analytics.feedback_total || 0} reviews)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-3 text-xs">
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Total Demo Sessions</span>
              <strong className="text-lg font-bold text-white font-mono">{analytics.total_sessions}</strong>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 block mb-1">Private Sessions</span>
              <strong className="text-lg font-bold text-cyan-300 font-mono">{analytics.private_sessions}</strong>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-purple-400 block mb-1">Walkthrough Completions</span>
              <strong className="text-lg font-bold text-purple-300 font-mono">{analytics.completed_sessions}</strong>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 block mb-1">Completion Rate</span>
              <strong className="text-lg font-bold text-emerald-400 font-mono">{analytics.completion_rate_pct}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(8, 11, 24, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.85rem'
            }}
          >
            <option value="all">All Access Links</option>
            <option value="active">Active Only</option>
            <option value="revoked">Revoked</option>
            <option value="expired">Expired</option>
            <option value="limit_reached">Limit Reached</option>
          </select>
        </div>

        <span className="text-xs text-gray-500 font-mono">
          Tokens are stored using SHA-256 hashes. Plaintext tokens cannot be recovered after creation.
        </span>
      </div>

      {/* Links Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
            Loading buyer demo access links...
          </div>
        ) : links.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
            No buyer demo links found. Click "Create Private Demo Link" above to generate one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <th style={{ padding: '1rem' }}>Buyer / Organization</th>
                  <th style={{ padding: '1rem' }}>Tier</th>
                  <th style={{ padding: '1rem' }}>Sessions Used</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Expires</th>
                  <th style={{ padding: '1rem' }}>Internal Reference</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr
                    key={link.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    className="hover:bg-cyan-500/5"
                  >
                    <td style={{ padding: '1rem' }}>
                      <strong style={{ color: '#FFFFFF' }}>{link.buyer_name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {link.company || 'Private Entity'} {link.email ? `• ${link.email}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                        {link.access_tier}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                      <span className="text-cyan-400 font-bold">{link.access_count}</span>
                      <span className="text-gray-500"> / {link.access_limit || '∞'}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(link.status)}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)', maxWidth: '200px' }}>
                      <div className="truncate" title={link.internal_notes}>
                        {link.internal_notes || '—'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {link.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(link.id, link.buyer_name)}
                          className="text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30"
                        >
                          Revoke Access
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title={newLinkResult ? 'Demo Link Created Successfully' : 'Generate Private Buyer Demo Link'}
          size="md"
        >
          {newLinkResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Private Access Link Generated</span>
                </div>
                <p>
                  Share this secure URL with <strong>{newLinkResult.buyer_name}</strong>. The token is stored as a SHA-256 hash server-side and cannot be shown again.
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Copyable Demo URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={newLinkResult.demo_url}
                    className="flex-1 p-2 rounded bg-gray-950 border border-gray-700 text-xs text-cyan-300 font-mono"
                  />
                  <Button
                    variant="cyan"
                    size="sm"
                    icon={Copy}
                    onClick={() => copyToClipboard(newLinkResult.demo_url)}
                    className="text-xs"
                  >
                    {copiedToken ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-mono">Raw Token Only:</label>
                <input
                  type="text"
                  readOnly
                  value={newLinkResult.plain_token}
                  className="w-full p-2 rounded bg-gray-950 border border-gray-800 text-[11px] text-gray-300 font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Buyer / Evaluator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={formData.buyer_name}
                  onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                  className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Interactive"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="john@apex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Access Tier</label>
                  <select
                    value={formData.access_tier}
                    onChange={(e) => setFormData({ ...formData, access_tier: e.target.value })}
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="vip">VIP Executive</option>
                    <option value="evaluator">Technical Evaluator</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Session Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formData.access_limit}
                    onChange={(e) => setFormData({ ...formData, access_limit: parseInt(e.target.value) || 15 })}
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Expires In (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formData.expires_in_days}
                    onChange={(e) => setFormData({ ...formData, expires_in_days: parseInt(e.target.value) || 14 })}
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Internal Reference Notes</label>
                <textarea
                  rows={2}
                  placeholder="Confidential internal notes (e.g. prospective European distribution deal)..."
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 text-white outline-none focus:border-cyan-500 resize-vertical"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="cyan" size="sm" type="submit" disabled={creating}>
                  {creating ? 'Generating...' : 'Generate Secure Token'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
