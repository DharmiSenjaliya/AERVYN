import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Code
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useAudio } from '../../context/AudioContext';
import axios from 'axios';

/**
 * Admin Activity Logs & Audit Trail Module
 * Immutable recording of all admin operations, status changes, world updates, and security events.
 */
export default function ActivityLogsPage() {
  const { playClick } = useAudio();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [selectedDetails, setSelectedDetails] = useState(null);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { page };
      if (search) params.search = search;

      const res = await axios.get('http://127.0.0.1:8000/api/admin/activity-logs', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        params
      });

      if (res.data?.success) {
        setLogs(res.data.logs.data || []);
        setPagination({
          current_page: res.data.logs.current_page,
          last_page: res.data.logs.last_page,
          total: res.data.logs.total
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const getActionBadge = (action) => {
    if (action.includes('suspend') || action.includes('deactivate')) {
      return <Badge variant="danger" size="sm">{action}</Badge>;
    }
    if (action.includes('activate') || action.includes('create')) {
      return <Badge variant="success" size="sm">{action}</Badge>;
    }
    if (action.includes('maintenance')) {
      return <Badge variant="gold" size="sm">{action}</Badge>;
    }
    return <Badge variant="cyan" size="sm">{action}</Badge>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
              Admin Activity Logs
            </h1>
            <Badge variant="purple" size="sm">{pagination.total} Recorded Events</Badge>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
            Immutable audit trail of administrator updates, player disciplinary actions, and system alterations.
          </p>
        </div>

        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => fetchLogs(pagination.current_page)}>
          Refresh
        </Button>
      </div>

      {/* 2. Search */}
      <Card style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.45rem 0.85rem' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by admin name, action, or entity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>
          <Button variant="cyan" size="sm" type="submit">Search</Button>
          {search && <Button variant="ghost" size="sm" onClick={() => { setSearch(''); fetchLogs(1); }}>Clear</Button>}
        </form>
      </Card>

      {/* 3. Activity Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Timestamp</th>
                <th style={{ padding: '0.85rem 1rem' }}>Administrator</th>
                <th style={{ padding: '0.85rem 1rem' }}>Operation</th>
                <th style={{ padding: '0.85rem 1rem' }}>Target Entity</th>
                <th style={{ padding: '0.85rem 1rem' }}>IP Address</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Metadata</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading audit stream...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {log.admin_name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {getActionBadge(log.action)}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-cyan)', fontSize: '0.8rem' }}>
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.76rem', fontFamily: 'monospace' }}>
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      {log.details ? (
                        <button
                          onClick={() => { playClick(); setSelectedDetails(log); }}
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
                          <Code size={13} /> View JSON
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>None</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No audit logs recorded yet.
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
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} Total Events)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => fetchLogs(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', cursor: pagination.current_page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => fetchLogs(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-xs)', cursor: pagination.current_page >= pagination.last_page ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* 4. Details JSON Modal */}
      {selectedDetails && (
        <Modal
          isOpen={!!selectedDetails}
          onClose={() => setSelectedDetails(null)}
          title={`Audit Payload: ${selectedDetails.action} (#${selectedDetails.id})`}
          maxWidth="600px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Admin: <strong>{selectedDetails.admin_name}</strong> &bull; Entity: <strong>{selectedDetails.entity_type} #{selectedDetails.entity_id}</strong>
            </div>
            <pre
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                color: '#38BDF8',
                fontSize: '0.8rem',
                overflowX: 'auto',
                lineHeight: 1.5,
                maxHeight: '360px'
              }}
            >
              {JSON.stringify(selectedDetails.details, null, 2)}
            </pre>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="cyan" size="sm" onClick={() => setSelectedDetails(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
