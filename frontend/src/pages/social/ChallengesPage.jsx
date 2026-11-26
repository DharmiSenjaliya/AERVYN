import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import {
  Swords,
  Trophy,
  Clock,
  Plus,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Play,
  Award,
  Zap,
  Target,
  Send,
  Sparkles
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

export default function ChallengesPage() {
  const { playClick, playSuccess, playLevelUp } = useAudio();
  const [searchParams] = useSearchParams();
  const preselectedOpponent = searchParams.get('opponent');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challenges, setChallenges] = useState({ active: [], pending_received: [], pending_sent: [], completed: [] });
  const [templates, setTemplates] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [successMsg, setSuccessMsg] = useState(null);

  // New Challenge Modal
  const [showCreateModal, setShowCreateModal] = useState(Boolean(preselectedOpponent));
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('courtyard_sprint');
  const [selectedOpponentId, setSelectedOpponentId] = useState(preselectedOpponent || '');
  const [customTarget, setCustomTarget] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Submit Result Modal
  const [submitModalChallenge, setSubmitModalChallenge] = useState(null);
  const [submitScore, setSubmitScore] = useState('');
  const [submitTime, setSubmitTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchChallengeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [chalRes, tempRes, friendRes] = await Promise.all([
        api.get('/social/challenges'),
        api.get('/social/challenges/templates'),
        api.get('/social/friends'),
      ]);

      if (chalRes.data?.status === 'success' || chalRes.data?.success) {
        setChallenges(chalRes.data.data || chalRes.data);
      }
      if (tempRes.data?.status === 'success' || tempRes.data?.success) {
        setTemplates(tempRes.data.data || tempRes.data.templates || []);
      }
      if (friendRes.data?.status === 'success' || friendRes.data?.success) {
        setFriends(friendRes.data.data || []);
        if (preselectedOpponent && !selectedOpponentId) {
          setSelectedOpponentId(preselectedOpponent);
        }
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
      setError('Unable to fetch challenge arena.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpponentId) {
      setCreateError('Please choose a friend to challenge.');
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const res = await api.post('/social/challenges', {
        opponent_id: selectedOpponentId,
        challenge_type: selectedTemplateKey,
        target_value: customTarget ? parseFloat(customTarget) : undefined,
      });

      if (res.data?.status === 'success' || res.data?.success) {
        playSuccess?.();
        setSuccessMsg(res.data.message || 'Challenge successfully issued!');
        setShowCreateModal(false);
        setCustomTarget('');
        await fetchChallengeData();
        setActiveTab('pending_sent');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Challenge creation failed:', err);
      setCreateError(err.response?.data?.message || 'Failed to issue challenge.');
    } finally {
      setCreating(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.post(`/social/challenges/${id}/accept`);
      if (res.data?.status === 'success' || res.data?.success) {
        playSuccess?.();
        setSuccessMsg('Challenge accepted! Prepare your run.');
        await fetchChallengeData();
        setActiveTab('active');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept challenge.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.post(`/social/challenges/${id}/reject`);
      if (res.data?.status === 'success' || res.data?.success) {
        setSuccessMsg('Challenge declined.');
        await fetchChallengeData();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline challenge.');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await api.post(`/social/challenges/${id}/cancel`);
      if (res.data?.status === 'success' || res.data?.success) {
        setSuccessMsg('Challenge cancelled.');
        await fetchChallengeData();
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel challenge.');
    }
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    if (!submitModalChallenge) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.post(`/social/challenges/${submitModalChallenge.id}/submit`, {
        score: parseFloat(submitScore),
        time_seconds: submitTime ? parseFloat(submitTime) : parseFloat(submitScore),
      });

      if (res.data?.status === 'success' || res.data?.success) {
        playLevelUp?.() || playSuccess?.();
        setSuccessMsg('Your run telemetry was verified and recorded!');
        setSubmitModalChallenge(null);
        setSubmitScore('');
        setSubmitTime('');
        await fetchChallengeData();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error('Score submission failed:', err);
      setSubmitError(err.response?.data?.message || 'Score submission failed validation.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeTemplate = templates.find((t) => t.type === selectedTemplateKey) || templates[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
            Asynchronous Player Challenges
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Compete asynchronously against friends in speed trials, core harvests, and reflex puzzles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={fetchChallengeData}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}
          >
            <Plus size={16} /> Issue Challenge
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'active', label: `Active (${challenges.active.length})` },
          { id: 'pending_received', label: `Invitations (${challenges.pending_received.length})` },
          { id: 'pending_sent', label: `Sent (${challenges.pending_sent.length})` },
          { id: 'completed', label: `History (${challenges.completed.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
              backgroundColor: activeTab === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#00f0ff' : 'var(--color-text-dim)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on Active Tab */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)' }}>
          <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
          <div>Synchronizing Arena Telemetry...</div>
        </div>
      ) : (
        <div>
          {/* TAB: ACTIVE */}
          {activeTab === 'active' && (
            challenges.active.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3.5rem' }}>
                <Swords size={44} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No Active Challenges</h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Select a confirmed friend and issue a speed trial or puzzle reflex challenge.
                </p>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  Challenge a Friend
                </Button>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {challenges.active.map((c) => (
                  <Card key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(0, 240, 255, 0.35)', background: 'linear-gradient(135deg, rgba(8, 14, 30, 0.95) 0%, rgba(16, 22, 46, 0.9) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant="cyan" size="sm">ACTIVE TRIAL</Badge>
                      <Badge variant="gold" size="sm">+{c.xp_reward} XP</Badge>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>{c.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.5, margin: 0 }}>
                        {c.description}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-dim)' }}>Opponent:</span>
                        <div style={{ fontWeight: 700, color: 'white' }}>{c.opponent.display_name}</div>
                        <div style={{ fontSize: '0.72rem', color: c.their_submission.has_submitted ? '#39ff14' : '#f59e0b' }}>
                          {c.their_submission.has_submitted ? 'Run Completed' : 'Awaiting Run'}
                        </div>
                      </div>

                      <div>
                        <span style={{ color: 'var(--color-text-dim)' }}>Target Goal:</span>
                        <div style={{ fontWeight: 700, color: '#00f0ff' }}>{c.target_value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{c.metric_label}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                      {c.my_submission.has_submitted ? (
                        <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: 'rgba(57, 255, 20, 0.08)', borderRadius: '6px', color: '#39ff14', fontSize: '0.82rem' }}>
                          ★ Run Submitted: <strong>{c.my_submission.score}</strong>. Awaiting opponent result.
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setSubmitModalChallenge(c);
                            setSubmitScore(c.target_value.toString());
                          }}
                          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Play size={16} fill="currentColor" /> Record Challenge Run
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* TAB: INVITATIONS */}
          {activeTab === 'pending_received' && (
            challenges.pending_received.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
                <div>No pending challenge invitations received.</div>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {challenges.pending_received.map((c) => (
                  <Card key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant="gold" size="sm">INVITATION</Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.created_at}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>{c.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: 0 }}>
                        Challenged by <strong style={{ color: 'white' }}>{c.opponent.display_name}</strong>.
                      </p>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#00f0ff' }}>
                      Target: {c.target_value} ({c.metric_label}) &bull; +{c.xp_reward} XP Reward
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                      <Button variant="primary" size="small" onClick={() => handleAccept(c.id)} style={{ flex: 1 }}>
                        Accept Challenge
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleReject(c.id)}>
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* TAB: SENT */}
          {activeTab === 'pending_sent' && (
            challenges.pending_sent.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
                <div>No pending challenges sent.</div>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {challenges.pending_sent.map((c) => (
                  <Card key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant="secondary" size="sm">AWAITING OPPONENT</Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sent {c.created_at}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>{c.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', margin: 0 }}>
                        Invited friend: <strong style={{ color: 'white' }}>{c.opponent.display_name}</strong>
                      </p>
                    </div>

                    <Button variant="secondary" size="small" onClick={() => handleCancel(c.id)} style={{ marginTop: 'auto' }}>
                      Cancel Challenge
                    </Button>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* TAB: COMPLETED HISTORY */}
          {activeTab === 'completed' && (
            challenges.completed.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
                <div>No completed challenge history yet.</div>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {challenges.completed.map((c) => (
                  <Card key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', border: c.i_won ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge variant={c.i_won ? 'gold' : c.is_draw ? 'cyan' : 'secondary'} size="sm">
                        {c.i_won ? 'VICTORY' : c.is_draw ? 'DRAW' : 'COMPLETED'}
                      </Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.created_at}</span>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', margin: '0 0 0.2rem' }}>{c.title}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>vs {c.opponent.display_name}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-dim)' }}>Your Score:</span>
                        <div style={{ fontWeight: 700, color: c.i_won ? '#ffd700' : 'white' }}>{c.my_submission.score ?? '—'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-text-dim)' }}>Opponent:</span>
                        <div style={{ fontWeight: 700, color: 'white' }}>{c.their_submission.score ?? '—'}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Modal: Issue New Challenge */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#0d1326', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '12px', maxWidth: '560px', width: '100%', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Swords size={20} color="#00f0ff" /> Issue Asynchronous Challenge
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Select Friend */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Select Opponent (Friend)
                </label>
                {friends.length === 0 ? (
                  <div style={{ color: '#ff4444', fontSize: '0.82rem' }}>
                    You have no confirmed friends yet. Connect with players in Search first!
                  </div>
                ) : (
                  <select
                    value={selectedOpponentId}
                    onChange={(e) => setSelectedOpponentId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', backgroundColor: '#060913', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: 'white' }}
                  >
                    <option value="">-- Choose Friend --</option>
                    {friends.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.display_name} (@{f.username}) &bull; Lvl {f.level}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Select Challenge Template */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-dim)', marginBottom: '0.5rem' }}>
                  Choose Challenge Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {templates.map((tpl) => (
                    <div
                      key={tpl.type}
                      onClick={() => setSelectedTemplateKey(tpl.type)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: selectedTemplateKey === tpl.type ? '2px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: selectedTemplateKey === tpl.type ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{tpl.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#ffd700', marginTop: '0.2rem' }}>+{tpl.xp_reward} XP Reward</div>
                    </div>
                  ))}
                </div>
              </div>

              {activeTemplate && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                  {activeTemplate.description}
                  <div style={{ color: '#00f0ff', marginTop: '0.3rem', fontWeight: 600 }}>
                    Default Target: {activeTemplate.default_target} {activeTemplate.metric_label}
                  </div>
                </div>
              )}

              {createError && (
                <div style={{ color: '#ff4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} /> {createError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={creating}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={creating || friends.length === 0}>
                  {creating ? 'Issuing Challenge...' : 'Send Challenge'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record/Submit Challenge Result */}
      {submitModalChallenge && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ backgroundColor: '#0d1326', border: '1px solid rgba(0, 240, 255, 0.4)', borderRadius: '12px', maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.15rem' }}>Record Run: {submitModalChallenge.title}</h3>
              <button onClick={() => setSubmitModalChallenge(null)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Submit your verified completion metric. Server will validate values against realistic engine physics thresholds.
            </p>

            <form onSubmit={handleSubmitResult} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--color-text-dim)', marginBottom: '0.35rem' }}>
                  Achieved Score / Metric ({submitModalChallenge.metric_label})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={submitScore}
                  onChange={(e) => setSubmitScore(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', backgroundColor: '#060913', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '6px', color: 'white', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>

              {submitError && (
                <div style={{ color: '#ff4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} /> {submitError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button variant="secondary" onClick={() => setSubmitModalChallenge(null)} disabled={submitting}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={submitting || !submitScore}>
                  {submitting ? 'Verifying Result...' : 'Verify & Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
