import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit,
  Clock,
  User,
  X
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Feedback & Bug Support Management Module
 * Player inquiry tickets, bug reports, admin triage, internal notes, and resolution tracking.
 */
export default function FeedbackManagementPage() {
  const { playClick } = useAudio();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (status) params.status = status;
      if (category) params.category = category;
      if (search) params.search = search;

      const res = await axios.get('http://127.0.0.1:8000/api/admin/feedback', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });

      if (res.data?.success) {
        setFeedbacks(res.data.feedbacks.data || []);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [status, category]);

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket || submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://127.0.0.1:8000/api/admin/feedback/${selectedTicket.id}`,
        {
          status: selectedTicket.status,
          admin_notes: selectedTicket.admin_notes || ''
        },
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
      );
      if (res.data?.success) {
        setMsg({ type: 'success', text: res.data.message });
        setSelectedTicket(null);
        fetchFeedback();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update ticket.' });
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (s) => {
    switch (s) {
      case 'new': return <Badge variant="cyan" size="sm">New</Badge>;
      case 'in_progress': return <Badge variant="purple" size="sm">In Progress</Badge>;
      case 'resolved': return <Badge variant="success" size="sm">Resolved</Badge>;
      case 'rejected': return <Badge variant="danger" size="sm">Rejected</Badge>;
      default: return <Badge size="sm">{s}</Badge>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Feedback & Bug Reports
            </h1>
            <Badge variant="blue" size="sm">{feedbacks.length} Tickets</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Triage player bug submissions, review gameplay feedback, add internal notes, and track resolution.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={fetchFeedback}>
          Refresh
        </Button>
      </div>

      {msg && (
        <div style={{ padding: '0.85rem 1rem', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? '#10B981' : '#EF4444'}`, borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* 2. Filters */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by subject, message, or player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFeedback()}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ width: '160px' }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div style={{ width: '160px' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="">All Categories</option>
              <option value="bug">Bug Report</option>
              <option value="gameplay">Gameplay</option>
              <option value="graphics">Graphics</option>
              <option value="audio">Audio</option>
              <option value="general">General</option>
            </select>
          </div>

          <Button variant="cyan" size="sm" onClick={fetchFeedback}>Filter</Button>
        </div>
      </Card>

      {/* 3. Feedback Tickets List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading feedback stream...
          </Card>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((f) => (
            <Card key={f.id} style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <Badge variant={f.category === 'bug' ? 'danger' : 'purple'} size="sm">
                      {f.category.toUpperCase()}
                    </Badge>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                      #{f.id} &bull; {new Date(f.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {f.subject}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-cyan)', marginTop: '2px' }}>
                    By {f.player_name} ({f.player_email})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {statusBadge(f.status)}
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Edit}
                    onClick={() => { playClick(); setSelectedTicket({ ...f }); }}
                  >
                    Triage Ticket
                  </Button>
                </div>
              </div>

              {/* Message */}
              <p style={{ fontSize: '0.86rem', color: '#E2E8F0', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', margin: '0.5rem 0' }}>
                "{f.message}"
              </p>

              {/* Admin Internal Notes */}
              {f.admin_notes && (
                <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', background: 'rgba(245, 185, 66, 0.05)', borderLeft: '3px solid var(--color-gold)', padding: '0.5rem 0.75rem', marginTop: '0.5rem', borderRadius: 'var(--radius-xs)' }}>
                  <strong>Admin Note:</strong> {f.admin_notes}
                  {f.resolved_at && ` (Resolved on ${new Date(f.resolved_at).toLocaleDateString()})`}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No feedback tickets matching filter criteria.
          </Card>
        )}
      </div>

      {/* 4. Edit Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Triage Ticket #${selectedTicket.id}: ${selectedTicket.subject}`}
          maxWidth="560px"
        >
          <form onSubmit={handleUpdateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Ticket Status</label>
              <select
                value={selectedTicket.status}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(22, 30, 53, 0.95)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="new">New (Unreviewed)</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Internal Administrator Notes</label>
              <textarea
                value={selectedTicket.admin_notes || ''}
                onChange={(e) => setSelectedTicket({ ...selectedTicket, admin_notes: e.target.value })}
                rows={4}
                placeholder="Log internal triage notes, bug tracker IDs, or resolution steps..."
                style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>Cancel</Button>
              <Button variant="cyan" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Ticket'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
