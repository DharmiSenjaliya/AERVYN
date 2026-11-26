import React, { useState, useEffect } from 'react';
import {
  Users,
  Swords,
  ShieldAlert,
  AlertTriangle,
  UserX,
  UserCheck,
  CheckCircle,
  Clock,
  Filter,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  X,
  MessageSquare,
  Shield
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

export default function AdminSocialPage() {
  const [activeTab, setActiveTab] = useState('reports'); // reports | challenges | suspensions
  const [overview, setOverview] = useState({
    total_friendships: 0,
    total_challenges: 0,
    pending_reports: 0,
    suspended_users: 0,
    total_activities: 0
  });

  // Reports state
  const [reports, setReports] = useState([]);
  const [reportStatus, setReportStatus] = useState('all');
  const [reportCategory, setReportCategory] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportNotes, setReportNotes] = useState('');
  const [reportUpdating, setReportUpdating] = useState(false);

  // Challenges state
  const [challenges, setChallenges] = useState([]);
  const [challengeSearch, setChallengeSearch] = useState('');

  // Suspension Modal / Action state
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspensionActionLoading, setSuspensionActionLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/social/overview');
      if (res.data?.success) {
        setOverview(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load social overview:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const params = {};
      if (reportStatus !== 'all') params.status = reportStatus;
      if (reportCategory !== 'all') params.category = reportCategory;

      const res = await api.get('/admin/social/reports', { params });
      if (res.data?.success) {
        setReports(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/admin/social/challenges');
      if (res.data?.success) {
        setChallenges(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchOverview(), fetchReports(), fetchChallenges()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [reportStatus, reportCategory]);

  const handleUpdateReport = async (status) => {
    if (!selectedReport) return;
    try {
      setReportUpdating(true);
      const res = await api.put(`/admin/social/reports/${selectedReport.id}`, {
        status,
        admin_notes: reportNotes
      });
      if (res.data?.success) {
        showToast(`Report marked as ${status}.`);
        setSelectedReport(null);
        setReportNotes('');
        fetchReports();
        fetchOverview();
      }
    } catch (err) {
      console.error('Failed to update report:', err);
      showToast('Error updating report status.');
    } finally {
      setReportUpdating(false);
    }
  };

  const handleToggleSuspension = async (user, suspend) => {
    try {
      setSuspensionActionLoading(true);
      const res = await api.post(`/admin/social/users/${user.id}/suspend`, {
        suspend,
        reason: suspend ? suspendReason || 'Violation of operative conduct rules.' : null
      });
      if (res.data?.success) {
        showToast(suspend ? `Social access suspended for ${user.name}.` : `Social access restored for ${user.name}.`);
        setSuspendModalUser(null);
        setSuspendReason('');
        loadData();
      }
    } catch (err) {
      console.error('Failed to toggle suspension:', err);
      showToast('Error executing social suspension.');
    } finally {
      setSuspensionActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="info">Reviewing</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'rejected':
      case 'dismissed':
        return <Badge variant="default">Dismissed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getChallengeBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="warning">Active</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'expired':
        return <Badge variant="danger">Expired</Badge>;
      case 'pending':
        return <Badge variant="info">Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filteredChallenges = challenges.filter(c => {
    if (!challengeSearch) return true;
    const q = challengeSearch.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.creator?.name?.toLowerCase().includes(q) ||
      c.recipient?.name?.toLowerCase().includes(q) ||
      c.challenge_template?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Social & Operative Moderation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee community telemetry, enforce fair play in temporal trials, triage player conduct flags, and manage social privileges.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Friendships</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{overview.total_friendships}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Challenges</p>
          <p className="text-2xl font-black text-violet-400 mt-1">{overview.total_challenges}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Open Reports</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{overview.pending_reports}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Suspended</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{overview.suspended_users}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 md:col-span-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Transmissions</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{overview.total_activities}</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'reports'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Player Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'challenges'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Challenge Monitor ({challenges.length})</span>
        </button>
      </div>

      {/* TAB 1: PLAYER CONDUCT REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filter Status:</span>
            </div>
            {['all', 'pending', 'reviewing', 'resolved', 'rejected'].map(st => (
              <button
                key={st}
                onClick={() => setReportStatus(st)}
                className={`px-2.5 py-1 text-xs rounded-lg capitalize transition ${
                  reportStatus === st
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-2" />

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Category:</span>
            </div>
            <select
              value={reportCategory}
              onChange={(e) => setReportCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="harassment">Harassment</option>
              <option value="cheating">Cheating / Glitch Abuse</option>
              <option value="inappropriate_name">Inappropriate Name</option>
              <option value="spam">Spam / Unsolicited</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Reports Table */}
          {reports.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800">
              <Shield className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs">No player reports matching selected parameters.</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Reported Operative</th>
                      <th className="p-3.5">Reporter</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Reason & Description</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reports.map(rep => {
                      const reported = rep.reported_user || {};
                      const reporter = rep.reporter || {};

                      return (
                        <tr key={rep.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5 font-mono text-slate-500">#{rep.id}</td>
                          <td className="p-3.5 font-medium text-white">
                            <div className="flex items-center gap-2">
                              <span>{reported.name || `User #${rep.reported_user_id}`}</span>
                              {reported.is_social_suspended && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                                  Suspended
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-slate-400">
                            {reporter.name || `User #${rep.reporter_id}`}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 capitalize text-[11px]">
                              {rep.category?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-300 max-w-xs truncate" title={rep.reason}>
                            {rep.reason}
                          </td>
                          <td className="p-3.5">{getStatusBadge(rep.status)}</td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap">
                            {new Date(rep.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedReport(rep);
                                setReportNotes(rep.admin_notes || '');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-semibold transition"
                            >
                              Triage
                            </button>
                            <button
                              onClick={() => {
                                setSuspendModalUser(reported);
                                setSuspendReason(reported.social_suspended_reason || '');
                              }}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                                reported.is_social_suspended
                                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950'
                                  : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white'
                              }`}
                            >
                              {reported.is_social_suspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEMPORAL CHALLENGES MONITOR */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by arena trial, creator, or challenger..."
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Trial & Title</th>
                    <th className="p-3.5">Challenger</th>
                    <th className="p-3.5">Defender</th>
                    <th className="p-3.5">Target Metric</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredChallenges.map(ch => (
                    <tr key={ch.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3.5 font-mono text-slate-500">#{ch.id}</td>
                      <td className="p-3.5 font-medium text-white">
                        <div>
                          <span>{ch.title}</span>
                          <span className="block text-[10px] text-cyan-400 font-mono">
                            {ch.challenge_template}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300">{ch.creator?.name || `User #${ch.creator_id}`}</td>
                      <td className="p-3.5 text-slate-300">{ch.recipient?.name || `User #${ch.recipient_id}`}</td>
                      <td className="p-3.5 font-mono text-amber-300">
                        {ch.target_value} {ch.target_metric}
                      </td>
                      <td className="p-3.5">{getChallengeBadge(ch.status)}</td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {ch.expires_at ? new Date(ch.expires_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT TRIAGE MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Triage Report #{selectedReport.id}</span>
              </h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500">Accused Operative:</span>
                  <p className="font-bold text-white mt-0.5">{selectedReport.reported_user?.name || `ID ${selectedReport.reported_user_id}`}</p>
                </div>
                <div>
                  <span className="text-slate-500">Filed By:</span>
                  <p className="font-bold text-slate-300 mt-0.5">{selectedReport.reporter?.name || `ID ${selectedReport.reporter_id}`}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Violation Category:</span>
                <p className="font-bold text-amber-300 capitalize mt-0.5">{selectedReport.category?.replace('_', ' ')}</p>
              </div>

              <div>
                <span className="text-slate-500">Report Reason & Narrative:</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 mt-1 leading-relaxed">
                  {selectedReport.reason}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Admin Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Record investigative notes, moderation verdict, or actions taken..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleUpdateReport('rejected')}
                disabled={reportUpdating}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Dismiss Report
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateReport('reviewing')}
                  disabled={reportUpdating}
                  className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 text-xs font-semibold"
                >
                  Mark In Review
                </button>
                <button
                  onClick={() => handleUpdateReport('resolved')}
                  disabled={reportUpdating}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs"
                >
                  Resolve Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUSPENSION TOGGLE MODAL */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-400" />
                <span>
                  {suspendModalUser.is_social_suspended ? 'Restore Social Access' : 'Suspend Social Access'}
                </span>
              </h3>
              <button onClick={() => setSuspendModalUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {suspendModalUser.is_social_suspended
                ? `Restore social features, challenges, and friend communications for operative ${suspendModalUser.name}?`
                : `Suspending ${suspendModalUser.name} will disable their ability to send/receive friend requests, create challenges, and post public broadcasts. Campaign progression remains accessible.`}
            </p>

            {!suspendModalUser.is_social_suspended && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reason for Social Suspension
                </label>
                <textarea
                  rows={2}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g. Repeated harassment or unverified telemetry submissions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSuspendModalUser(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleSuspension(suspendModalUser, !suspendModalUser.is_social_suspended)}
                disabled={suspensionActionLoading}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs ${
                  suspendModalUser.is_social_suspended
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'
                }`}
              >
                {suspensionActionLoading
                  ? 'Processing...'
                  : suspendModalUser.is_social_suspended
                  ? 'Confirm Re-instatement'
                  : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
