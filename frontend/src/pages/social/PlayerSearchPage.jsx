import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Search,
  UserPlus,
  Users,
  Eye,
  Check,
  Clock,
  RefreshCw,
  AlertTriangle,
  X,
  Flag,
  Swords,
  ShieldAlert
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

export default function PlayerSearchPage() {
  const { playClick, playSuccess } = useAudio();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Profile Modal State
  const [profileTargetId, setProfileTargetId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Report Modal State
  const [reportTarget, setReportTarget] = useState(null);
  const [reportCategory, setReportCategory] = useState('inappropriate_content');
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const doSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await api.get(`/social/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (res.data?.status === 'success' || res.data?.success) {
        setResults(res.data.data || []);
        setTotal(res.data.total || 0);
        setSearched(true);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setSearchParams({ q: query.trim() });
      doSearch(query.trim());
    }
  };

  const handleSendRequest = async (targetId, name) => {
    setActionLoadingId(targetId);
    try {
      const res = await api.post('/social/requests', {
        receiver_id: targetId,
      });
      if (res.data?.status === 'success' || res.data?.success) {
        playSuccess?.();
        setSuccessMsg(res.data.message || `Friend request sent to ${name}!`);
        await doSearch(query);
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send friend request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openProfileModal = async (id) => {
    setProfileTargetId(id);
    setLoadingProfile(true);
    setProfileData(null);
    try {
      const res = await api.get(`/social/profile/${id}`);
      if (res.data?.status === 'success' || res.data?.success) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load profile modal:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    setSubmittingReport(true);
    try {
      const res = await api.post('/social/reports', {
        reported_user_id: reportTarget.id,
        category: reportCategory,
        reason: reportReason,
      });
      if (res.data?.status === 'success' || res.data?.success) {
        setSuccessMsg('Report submitted to staff.');
        setReportTarget(null);
        setReportReason('');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to file report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
          Player Search & Community Discovery
        </h1>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
          Find explorers across timelines by username or display name. Private account credentials and emails are never exposed.
        </p>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'rgba(57, 255, 20, 0.1)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            color: '#39ff14',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Input Card */}
      <Card>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="var(--color-text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by username or display name (min 2 chars)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <Button type="submit" variant="primary" disabled={loading || query.trim().length < 2}>
            {loading ? 'Searching...' : 'Search Network'}
          </Button>
        </form>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
          <div>Scanning Explorer Registry...</div>
        </div>
      ) : searched && results.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--color-text-dim)' }}>
          <Search size={44} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Players Found</h3>
          <p style={{ fontSize: '0.85rem' }}>No explorers matched "{query}". Try checking the spelling.</p>
        </Card>
      ) : results.length > 0 ? (
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '1rem' }}>
            Found <strong style={{ color: 'white' }}>{total}</strong> explorer{total > 1 ? 's' : ''}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {results.map((p) => (
              <Card
                key={p.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(135deg, rgba(8, 14, 30, 0.95) 0%, rgba(14, 20, 42, 0.9) 100%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: 'white'
                    }}
                  >
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: '0.98rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.display_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-cyan)' }}>
                      {p.rank_title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      @{p.username}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center', padding: '0.5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>LEVEL</div>
                    <div style={{ fontWeight: 700, color: 'white' }}>Lvl {p.level}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>XP</div>
                    <div style={{ fontWeight: 700, color: '#ffd700' }}>{p.xp}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>WORLDS</div>
                    <div style={{ fontWeight: 700, color: '#00f0ff' }}>{p.completed_worlds} / 4</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  {p.relationship === 'friends' ? (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/social/challenges?opponent=${p.id}`)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <Swords size={14} /> Challenge
                    </Button>
                  ) : p.relationship === 'request_sent' ? (
                    <Button variant="secondary" size="small" disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Sent
                    </Button>
                  ) : p.relationship === 'request_received' ? (
                    <Button
                      variant="cyan"
                      size="small"
                      onClick={() => navigate('/social/requests')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      Respond
                    </Button>
                  ) : p.relationship === 'blocked' ? (
                    <Button variant="danger" size="small" disabled>
                      Blocked
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="small"
                      disabled={actionLoadingId === p.id}
                      onClick={() => handleSendRequest(p.id, p.display_name)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <UserPlus size={14} /> Add Friend
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => openProfileModal(p.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <Eye size={14} /> Profile
                  </Button>
                </div>

                {/* Report link */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <button
                    onClick={() => setReportTarget(p)}
                    style={{ background: 'none', border: 'none', color: '#718096', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <Flag size={11} /> Report
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {/* Public Profile Modal */}
      {profileTargetId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }} onClick={() => setProfileTargetId(null)}>
          <div style={{ backgroundColor: '#0c1122', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', maxWidth: '560px', width: '100%', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0 }}>Public Explorer Dossier</h3>
              <button onClick={() => setProfileTargetId(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              {loadingProfile ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-dim)' }}>
                  <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.5rem', color: '#00f0ff' }} />
                  <div>Loading dossier...</div>
                </div>
              ) : !profileData ? (
                <div style={{ textAlign: 'center', color: '#ff4444' }}>Profile details unavailable.</div>
              ) : profileData.is_private ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>{profileData.display_name}</h4>
                  <Badge variant="secondary">Private Profile</Badge>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginTop: '1rem' }}>
                    This player has configured their profile to private.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
                      {profileData.display_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{profileData.display_name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-cyan)' }}>{profileData.rank_title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>@{profileData.username}</div>
                    </div>
                  </div>

                  {profileData.bio && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontStyle: 'italic', margin: 0 }}>
                      "{profileData.bio}"
                    </p>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', padding: '0.75rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>LEVEL</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Lvl {profileData.level}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>TOTAL XP</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>{profileData.xp} XP</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>WORLDS</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00f0ff' }}>{profileData.completed_worlds} / 4</div>
                    </div>
                  </div>

                  {profileData.can_send_friend_request && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleSendRequest(profileData.id, profileData.display_name);
                        setProfileTargetId(null);
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <UserPlus size={16} /> Send Friend Request
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#0d1326', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '10px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flag size={18} color="#f59e0b" /> Report Player: {reportTarget.display_name}
              </h3>
              <button onClick={() => setReportTarget(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Violation Category
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: '#060913', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: 'white' }}
                >
                  <option value="harassment">Harassment / Behavior</option>
                  <option value="cheating">Cheating / Score Exploits</option>
                  <option value="abuse">Challenge Abuse / Spam</option>
                  <option value="inappropriate_content">Inappropriate Username/Avatar</option>
                  <option value="suspicious_activity">Suspicious Telemetry</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Reason Details (min 5 chars)
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the violation observed..."
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={() => setReportTarget(null)} disabled={submittingReport}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={submittingReport || reportReason.trim().length < 5}>
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
