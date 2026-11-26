import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  UserX,
  Swords,
  Eye,
  ShieldAlert,
  Search,
  RefreshCw,
  Check,
  AlertTriangle,
  X,
  Flag
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function FriendsPage() {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals
  const [removeTarget, setRemoveTarget] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportCategory, setReportCategory] = useState('harassment');
  const [reportReason, setReportReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Profile modal
  const [profileTargetId, setProfileTargetId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchFriends = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/social/friends');
      if (res.data?.success || res.data?.status === 'success') {
        setFriends(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load friends:', err);
      setError('Unable to fetch your friends list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleRemoveFriend = async () => {
    if (!removeTarget) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/social/friends/${removeTarget.id}`);
      if (res.data?.success || res.data?.status === 'success') {
        setSuccessMsg(`Removed ${removeTarget.display_name} from friends.`);
        setRemoveTarget(null);
        await fetchFriends();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove friend.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockPlayer = async () => {
    if (!blockTarget) return;
    setActionLoading(true);
    try {
      const res = await api.post('/social/blocks', {
        blocked_user_id: blockTarget.id,
        reason: 'Blocked by user from friends list',
      });
      if (res.data?.success || res.data?.status === 'success') {
        setSuccessMsg(`Blocked ${blockTarget.display_name}. Friend link severed.`);
        setBlockTarget(null);
        await fetchFriends();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block player.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    setActionLoading(true);
    try {
      const res = await api.post('/social/reports', {
        reported_user_id: reportTarget.id,
        category: reportCategory,
        reason: reportReason,
      });
      if (res.data?.success || res.data?.status === 'success') {
        setSuccessMsg('Report submitted for administrative review.');
        setReportTarget(null);
        setReportReason('');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setActionLoading(false);
    }
  };

  const openProfileModal = async (id) => {
    setProfileTargetId(id);
    setLoadingProfile(true);
    setProfileData(null);
    try {
      const res = await api.get(`/social/profile/${id}`);
      if (res.data?.success || res.data?.status === 'success') {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load profile modal:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Friends Roster ({friends.length})
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Manage mutual connections, launch asynchronous trials, and monitor campaign progression.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={fetchFriends}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/social/search')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Search size={16} /> Find New Friends
          </Button>
        </div>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
          <div>Loading confirmed friends...</div>
        </div>
      ) : friends.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Users size={48} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Friends Connected Yet</h3>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
            Connect with other players to unlock friends-only leaderboards, send time-trial challenges, and share timeline achievements.
          </p>
          <Button variant="primary" onClick={() => navigate('/social/search')}>
            Search Players Network
          </Button>
        </Card>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {friends.map((friend) => (
            <Card
              key={friend.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.25rem',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(8, 14, 30, 0.95) 0%, rgba(14, 20, 42, 0.9) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    color: 'white',
                    boxShadow: '0 0 12px rgba(0, 240, 255, 0.35)'
                  }}
                >
                  {friend.display_name.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.display_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-cyan)' }}>
                    {friend.rank_title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    @{friend.username}
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.5rem',
                  padding: '0.65rem 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>LEVEL</div>
                  <div style={{ fontWeight: 700, color: 'white' }}>Lvl {friend.level}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>XP</div>
                  <div style={{ fontWeight: 700, color: '#ffd700' }}>{friend.xp}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-dim)', fontSize: '0.68rem' }}>WORLDS</div>
                  <div style={{ fontWeight: 700, color: '#00f0ff' }}>{friend.completed_worlds} / 4</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate(`/social/challenges?opponent=${friend.id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <Swords size={14} /> Challenge
                </Button>

                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => openProfileModal(friend.id)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                >
                  <Eye size={14} /> Profile
                </Button>
              </div>

              {/* Sub-Actions (Remove / Block / Report) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '0.72rem' }}>
                <button
                  onClick={() => setRemoveTarget(friend)}
                  style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', padding: 0 }}
                >
                  Remove
                </button>
                <button
                  onClick={() => setBlockTarget(friend)}
                  style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 0 }}
                >
                  Block
                </button>
                <button
                  onClick={() => setReportTarget(friend)}
                  style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <Flag size={11} /> Report
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {removeTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#0d1326', border: '1px solid rgba(255, 68, 68, 0.3)', borderRadius: '10px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ color: 'white', marginBottom: '0.75rem' }}>Remove Friend?</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to remove <strong style={{ color: 'white' }}>{removeTarget.display_name}</strong> from your friends list? You can reconnect later by sending a new request.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setRemoveTarget(null)} disabled={actionLoading}>Cancel</Button>
              <Button variant="danger" onClick={handleRemoveFriend} disabled={actionLoading}>
                {actionLoading ? 'Removing...' : 'Confirm Remove'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockTarget && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#0d1326', border: '1px solid rgba(255, 68, 68, 0.5)', borderRadius: '10px', maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4444', marginBottom: '0.75rem' }}>
              <ShieldAlert size={22} />
              <h3 style={{ margin: 0, color: 'white' }}>Block Player?</h3>
            </div>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Blocking <strong style={{ color: 'white' }}>{blockTarget.display_name}</strong> will remove them from your friends list, cancel pending invitations, and prevent all future challenge requests.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="secondary" onClick={() => setBlockTarget(null)} disabled={actionLoading}>Cancel</Button>
              <Button variant="danger" onClick={handleBlockPlayer} disabled={actionLoading}>
                {actionLoading ? 'Blocking...' : 'Confirm Block'}
              </Button>
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
                <Button variant="secondary" onClick={() => setReportTarget(null)} disabled={actionLoading}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={actionLoading || reportReason.trim().length < 5}>
                  {actionLoading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    This player has set their public profile visibility to private.
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

                  {profileData.challenge_stats && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>
                      <span>Challenges Completed: <strong style={{ color: 'white' }}>{profileData.challenge_stats.total_completed}</strong></span>
                      <span>Victories: <strong style={{ color: '#ffd700' }}>{profileData.challenge_stats.wins}</strong> ({profileData.challenge_stats.win_rate}%)</span>
                    </div>
                  )}

                  {profileData.recent_achievements?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                        Ascension Badges ({profileData.achievements_count})
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {profileData.recent_achievements.map((ach) => (
                          <Badge key={ach.id} variant="gold" size="sm">
                            ★ {ach.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
