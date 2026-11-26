import React, { useState, useEffect } from 'react';
import {
  Mail,
  Building,
  Globe,
  Filter,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  DollarSign,
  AlertCircle,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * Commercial Inquiries & B2B Lead Management
 * Displays buyer inquiry submissions, KPIs, filtering, and triage modal with CRM notes.
 */
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [kpis, setKpis] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    closed: 0
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Selected Inquiry for Modal / Triage
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalStatus, setModalStatus] = useState('new');
  const [modalNotes, setModalNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries');
      if (res.data) {
        setInquiries(res.data.data || []);
        if (res.data.kpis) {
          setKpis(res.data.kpis);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      showToast('Error loading commercial inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openTriageModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setModalStatus(inquiry.status || 'new');
    setModalNotes(inquiry.admin_notes || '');
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      const res = await api.put(`/admin/inquiries/${selectedInquiry.id}`, {
        status: modalStatus,
        admin_notes: modalNotes
      });

      showToast('Inquiry status updated successfully.');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err) {
      console.error('Failed to update inquiry:', err);
      showToast('Failed to update inquiry. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesType = typeFilter === 'all' || inq.inquiry_type === typeFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.company?.toLowerCase().includes(term) ||
      inq.country?.toLowerCase().includes(term) ||
      inq.message?.toLowerCase().includes(term);

    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge variant="cyan" size="sm">NEW</Badge>;
      case 'contacted':
        return <Badge variant="gold" size="sm">IN DISCUSSION</Badge>;
      case 'qualified':
        return <Badge variant="purple" size="sm">QUALIFIED</Badge>;
      case 'closed':
        return <Badge variant="gray" size="sm">CLOSED</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      game_purchase: 'Complete Buyout',
      b2b_licensing: 'B2B Web Licensing',
      customization: 'Custom Commission',
      reskin: 'Branded Reskin',
      technical_inquiry: 'Technical Inquiry',
      partnership: 'Publishing Partnership',
      other: 'General Inquiry'
    };
    return labels[type] || type;
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
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
            <Mail size={24} color="var(--color-cyan)" />
            <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
              Commercial & Buyer Inquiries
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Review incoming buyout proposals, B2B licensing leads, custom commissions, and technical questions.
          </p>
        </div>

        <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchInquiries}>
          Refresh
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <Card title="Total Inquiries" accent="cyan">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>{kpis.total}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            All-time submissions
          </div>
        </Card>

        <Card title="New Leads" accent="cyan">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-cyan)' }}>{kpis.new}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Awaiting initial contact
          </div>
        </Card>

        <Card title="In Discussion" accent="gold">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-gold)' }}>{kpis.contacted}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Active conversations
          </div>
        </Card>

        <Card title="Qualified Deals" accent="purple">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-purple)' }}>{kpis.qualified}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            High-intent buyers
          </div>
        </Card>

        <Card title="Closed / Archived">
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>{kpis.closed}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Completed or archived
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }}
            />
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                backgroundColor: 'rgba(8, 11, 24, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.88rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: 'rgba(8, 11, 24, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem'
            }}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">In Discussion</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: 'rgba(8, 11, 24, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem'
            }}
          >
            <option value="all">All Inquiry Types</option>
            <option value="game_purchase">Complete Buyout</option>
            <option value="b2b_licensing">B2B Web Licensing</option>
            <option value="customization">Custom Commission</option>
            <option value="reskin">Branded Reskin</option>
            <option value="technical_inquiry">Technical Inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Received</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Contact / Prospect</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Company & Region</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Objective</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-muted)', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No inquiries found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>
                      {new Date(inq.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{inq.name}</div>
                      <div style={{ color: 'var(--color-cyan)', fontSize: '0.82rem' }}>{inq.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                      <div>{inq.company || '—'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{inq.country || 'Global'}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#FFFFFF'
                        }}
                      >
                        {getTypeLabel(inq.inquiry_type)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(inq.status)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => openTriageModal(inq)}
                      >
                        Triage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail & Triage Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={true}
          title={`Inquiry from ${selectedInquiry.name}`}
          onClose={() => setSelectedInquiry(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Email</span>
                <div style={{ color: 'var(--color-cyan)', fontWeight: 600 }}>{selectedInquiry.email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Company</span>
                <div style={{ color: '#FFFFFF' }}>{selectedInquiry.company || 'Individual / Not Specified'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Country</span>
                <div style={{ color: '#FFFFFF' }}>{selectedInquiry.country || 'Global'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Inquiry Objective</span>
                <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{getTypeLabel(selectedInquiry.inquiry_type)}</div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Prospect Message</span>
              <div
                style={{
                  marginTop: '0.35rem',
                  padding: '1rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.5rem' }}>
                Pipeline Status
              </label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  backgroundColor: 'rgba(8, 11, 24, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem'
                }}
              >
                <option value="new">New (Unread / Needs Contact)</option>
                <option value="contacted">In Discussion (Outreach Sent)</option>
                <option value="qualified">Qualified (Active Terms / Evaluation)</option>
                <option value="closed">Closed / Archived</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '0.5rem' }}>
                Internal CRM & Negotiation Notes
              </label>
              <textarea
                rows={4}
                placeholder="Log internal conversation milestones, agreed licensing terms, NDA status, or next steps..."
                value={modalNotes}
                onChange={(e) => setModalNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(8, 11, 24, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(null)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                icon={CheckCircle}
                disabled={updating}
                onClick={handleUpdateInquiry}
              >
                {updating ? 'Saving...' : 'Save & Update'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
