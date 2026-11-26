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
  UserCheck,
  Download,
  Calendar,
  Phone,
  BarChart3,
  Sliders,
  Send,
  ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

/**
 * Commercial Inquiries & B2B Lead CRM Management
 * Displays buyer leads, demo conversion telemetry, priority triage, follow-up scheduling, and safe CSV export.
 */
export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [kpis, setKpis] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    discussion: 0,
    demo_sent: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
    urgent_priority: 0,
    high_priority: 0
  });

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Selected Inquiry for Modal / Triage
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [modalStatus, setModalStatus] = useState('new');
  const [modalPriority, setModalPriority] = useState('medium');
  const [modalFollowUpDate, setModalFollowUpDate] = useState('');
  const [modalFollowUpNotes, setModalFollowUpNotes] = useState('');
  const [modalAdminNotes, setModalAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const [inqRes, analyticsRes] = await Promise.all([
        api.get('/admin/inquiries'),
        api.get('/admin/inquiries/analytics').catch(() => ({ data: { data: null } }))
      ]);

      if (inqRes.data) {
        setInquiries(inqRes.data.data || []);
        if (inqRes.data.kpis) {
          setKpis(prev => ({ ...prev, ...inqRes.data.kpis }));
        }
      }

      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
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
    setModalPriority(inquiry.priority || 'medium');
    setModalFollowUpDate(inquiry.follow_up_date ? inquiry.follow_up_date.substring(0, 10) : '');
    setModalFollowUpNotes(inquiry.follow_up_notes || '');
    setModalAdminNotes(inquiry.admin_notes || '');
  };

  const handleUpdateInquiry = async () => {
    if (!selectedInquiry) return;
    setUpdating(true);
    try {
      await api.put(`/admin/inquiries/${selectedInquiry.id}`, {
        status: modalStatus,
        priority: modalPriority,
        follow_up_date: modalFollowUpDate || null,
        follow_up_notes: modalFollowUpNotes,
        admin_notes: modalAdminNotes
      });

      showToast('Lead triage updated successfully.');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err) {
      console.error('Failed to update inquiry:', err);
      showToast('Failed to update lead. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/inquiries/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/csv'
        }
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aervyn-buyer-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Lead export downloaded successfully.');
    } catch (err) {
      showToast('CSV export failed.');
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || inq.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || inq.inquiry_type === typeFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.phone?.toLowerCase().includes(term) ||
      inq.company?.toLowerCase().includes(term) ||
      inq.country?.toLowerCase().includes(term) ||
      inq.message?.toLowerCase().includes(term);

    return matchesStatus && matchesPriority && matchesType && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge variant="cyan" size="sm">NEW</Badge>;
      case 'contacted':
        return <Badge variant="gold" size="sm">CONTACTED</Badge>;
      case 'discussion':
        return <Badge variant="purple" size="sm">IN DISCUSSION</Badge>;
      case 'demo_sent':
        return <Badge variant="cyan" size="sm">DEMO SENT</Badge>;
      case 'negotiation':
        return <Badge variant="gold" size="sm">NEGOTIATION</Badge>;
      case 'won':
        return <Badge variant="green" size="sm">WON DEAL</Badge>;
      case 'lost':
        return <Badge variant="danger" size="sm">LOST</Badge>;
      case 'qualified':
        return <Badge variant="purple" size="sm">QUALIFIED</Badge>;
      case 'closed':
        return <Badge variant="gray" size="sm">CLOSED</Badge>;
      default:
        return <Badge variant="gray" size="sm">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-500/40">URGENT</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-500/40">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-cyan-300 border border-cyan-500/40">MEDIUM</span>;
      case 'low':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-900 text-gray-400 border border-gray-700">LOW</span>;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      game_purchase: 'Package A (Full Buyout)',
      customization: 'Package B (Custom Dev)',
      white_label: 'Package C (White-Label)',
      b2b_licensing: 'B2B Web Licensing',
      reskin: 'Branded Reskin',
      technical_inquiry: 'Technical Evaluation',
      partnership: 'Publishing Partnership',
      other: 'General Inquiry'
    };
    return labels[type] || type;
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1440px', margin: '0 auto' }}>
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
              Lead Management CRM & Commercial Pipeline
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Triage prospective buyers, track demo conversion telemetry, log follow-up actions, and export leads.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCsv}>
            Export CSV
          </Button>
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchInquiries}>
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <Card title="Total Leads" accent="cyan">
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>{kpis.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            All-time submissions
          </div>
        </Card>

        <Card title="New Leads" accent="cyan">
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-cyan)' }}>{kpis.new || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Awaiting triage
          </div>
        </Card>

        <Card title="In Discussion" accent="gold">
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-gold)' }}>
            {(kpis.contacted || 0) + (kpis.discussion || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Active conversations
          </div>
        </Card>

        <Card title="Negotiation / Won" accent="purple">
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-purple)' }}>
            {(kpis.negotiation || 0) + (kpis.won || 0) + (kpis.qualified || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            High-intent deals
          </div>
        </Card>

        <Card title="High / Urgent" accent="gold">
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ff6b81' }}>
            {(kpis.urgent_priority || 0) + (kpis.high_priority || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            Immediate action needed
          </div>
        </Card>
      </div>

      {/* Demo Telemetry & Funnel Card */}
      {analytics?.demo_funnel && (
        <div className="glass-panel p-5 mb-8 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Buyer Demo Conversion Funnel (Zero-PII Telemetry)
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              Completion Rate: {analytics.demo_funnel.completion_rate_pct}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-3">
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">Demo Sessions</span>
              <span className="text-lg font-bold text-white font-mono">{analytics.demo_funnel.total_sessions}</span>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-cyan-400 block mb-1">Milestone 1 (Temple)</span>
              <span className="text-lg font-bold text-cyan-300 font-mono">{analytics.demo_funnel.milestone_1_reached}</span>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-purple-400 block mb-1">Milestone 2 (Runic)</span>
              <span className="text-lg font-bold text-purple-300 font-mono">{analytics.demo_funnel.milestone_2_reached}</span>
            </div>
            <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 block mb-1">Full Completions</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{analytics.demo_funnel.completed_sessions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 300px' }}>
          <Search size={18} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, company, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              backgroundColor: 'rgba(8, 11, 24, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#FFFFFF',
              fontSize: '0.88rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                padding: '0.55rem 0.75rem',
                backgroundColor: 'rgba(8, 11, 24, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.55rem 0.75rem',
                backgroundColor: 'rgba(8, 11, 24, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="discussion">In Discussion</option>
              <option value="demo_sent">Demo Sent</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won Deal</option>
              <option value="lost">Lost</option>
              <option value="closed">Closed / Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '0.55rem 0.75rem',
                backgroundColor: 'rgba(8, 11, 24, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#FFFFFF',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Types</option>
              <option value="game_purchase">Package A (Buyout)</option>
              <option value="customization">Package B (Custom)</option>
              <option value="white_label">Package C (White-Label)</option>
              <option value="b2b_licensing">B2B Licensing</option>
              <option value="technical_inquiry">Technical Inquiry</option>
              <option value="partnership">Partnership</option>
              <option value="other">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
            Loading commercial leads...
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-muted)' }}>
            No inquiries match your criteria.
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
                  <th style={{ padding: '1rem' }}>Priority</th>
                  <th style={{ padding: '1rem' }}>Prospect / Org</th>
                  <th style={{ padding: '1rem' }}>Contact Info</th>
                  <th style={{ padding: '1rem' }}>Type & Budget</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Next Follow-Up</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    className="hover:bg-cyan-500/5"
                  >
                    <td style={{ padding: '1rem' }}>
                      {getPriorityBadge(inq.priority)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{inq.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {inq.company || 'Individual'} {inq.country ? `• ${inq.country}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--color-text-secondary)' }}>{inq.email}</div>
                      {inq.phone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone className="w-3 h-3 text-cyan-400" /> {inq.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ color: 'var(--color-cyan)', fontWeight: 500 }}>{getTypeLabel(inq.inquiry_type)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        Budget: {inq.budget_range || 'Not specified'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(inq.status)}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: inq.follow_up_date ? '#f5b942' : 'var(--color-text-muted)' }}>
                      {inq.follow_up_date ? inq.follow_up_date.substring(0, 10) : '—'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => openTriageModal(inq)}
                      >
                        Triage Lead
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Triage & Follow-up Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInquiry(null)}
          title={`Triage Lead: ${selectedInquiry.name}`}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Prospect Information Card */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Full Name
                </span>
                <strong style={{ color: '#FFFFFF' }}>{selectedInquiry.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Email Address
                </span>
                <a href={`mailto:${selectedInquiry.email}`} style={{ color: 'var(--color-cyan)', textDecoration: 'none' }}>
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Phone / Mobile
                </span>
                <strong style={{ color: '#FFFFFF' }}>{selectedInquiry.phone || 'Not provided'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Company / Organization
                </span>
                <strong style={{ color: '#FFFFFF' }}>{selectedInquiry.company || 'Not provided'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Country / Region
                </span>
                <strong style={{ color: '#FFFFFF' }}>{selectedInquiry.country || 'Not provided'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Budget Range
                </span>
                <strong style={{ color: 'var(--color-gold)' }}>{selectedInquiry.budget_range || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Preferred Contact
                </span>
                <strong style={{ color: 'var(--color-purple)', textTransform: 'capitalize' }}>
                  {selectedInquiry.preferred_contact || 'Email'}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Submission Date
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {new Date(selectedInquiry.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Prospect Message */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                Prospect Requirements / Message:
              </label>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(8, 11, 24, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {selectedInquiry.message}
              </div>
            </div>

            {/* Triage Inputs: Status, Priority, Follow-Up Date */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Deal Status:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="new">New (Awaiting Contact)</option>
                  <option value="contacted">Contacted</option>
                  <option value="discussion">In Discussion</option>
                  <option value="demo_sent">Demo Sent</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won Deal</option>
                  <option value="lost">Lost</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed / Archived</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Priority:
                </label>
                <select
                  value={modalPriority}
                  onChange={(e) => setModalPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                  Next Follow-Up Date:
                </label>
                <input
                  type="date"
                  value={modalFollowUpDate}
                  onChange={(e) => setModalFollowUpDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'rgba(8, 11, 24, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            {/* Follow-Up Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                Follow-Up Plan / Scheduled Actions:
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Schedule live Zoom walkthrough on Friday with CTO..."
                value={modalFollowUpNotes}
                onChange={(e) => setModalFollowUpNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'rgba(8, 11, 24, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Internal Admin CRM Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                Internal Admin CRM Notes:
              </label>
              <textarea
                rows={2}
                placeholder="Add confidential internal deal notes, pricing offered, or technical considerations..."
                value={modalAdminNotes}
                onChange={(e) => setModalAdminNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'rgba(8, 11, 24, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
              >
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                icon={CheckCircle}
                disabled={updating}
                onClick={handleUpdateInquiry}
              >
                {updating ? 'Saving Changes...' : 'Save Triage & Notes'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
