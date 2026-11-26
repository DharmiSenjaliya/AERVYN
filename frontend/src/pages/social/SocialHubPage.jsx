import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  UserPlus,
  Swords,
  Bell,
  Search,
  Activity,
  Trophy,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function SocialHubPage() {
  const { user } = useAuth();
  const { playClick } = useAudio();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hubData, setHubData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHub = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/social/hub');
      if (res.data?.success) {
        setHubData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load social hub:', err);
      setError('Could not connect to AERVYN Social Hub.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHub();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/social/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Connecting to AERVYN Social Network...</div>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Connection Failed</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={fetchHub}>Retry</Button>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Social Suspension Banner if applicable */}
      {hubData.is_social_suspended && (
        <div
          style={{
            backgroundColor: 'rgba(255, 68, 68, 0.15)',
            border: '1px solid rgba(255, 68, 68, 0.4)',
            borderRadius: '8px',
            padding: '1.25rem',
            color: '#ff4444',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <ShieldAlert size={28} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Social Interaction Suspended</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e0' }}>
              {hubData.social_suspended_reason || 'Your account social permissions have been temporarily restricted by administrators.'}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner: Social Hub Identity & Quick Search */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '2.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          background: 'linear-gradient(135deg, rgba(8, 14, 30, 0.95) 0%, rgba(20, 16, 42, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Badge variant="cyan" size="sm">Online Social Nexus</Badge>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Connected to AERVYN Net</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>
            Connect with Fellow <span style={{ color: '#00f0ff' }}>Explorers</span>
          </h1>

          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Form friendships, issue asynchronous time-trial challenges, climb community leaderboards, and follow real-time campaign milestones.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '440px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Find explorer by username or display name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem 0.65rem 2.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <Button type="submit" variant="primary" size="small">
              Search
            </Button>
          </form>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
          <Button
            variant="cyan"
            size="large"
            onClick={() => navigate('/social/challenges')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
          >
            <Swords size={18} />
            Issue Challenge
          </Button>

          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate('/social/friends')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Users size={18} />
            View Friends List
          </Button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Link to="/social/friends" style={{ textDecoration: 'none' }} onClick={playClick}>
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Confirmed Friends</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{hubData.friends_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Manage Friends <ChevronRight size={12} />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/social/requests" style={{ textDecoration: 'none' }} onClick={playClick}>
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <UserPlus size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Pending Requests</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{hubData.pending_requests_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Review Invites <ChevronRight size={12} />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/social/challenges" style={{ textDecoration: 'none' }} onClick={playClick}>
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#ffd700' }}>
              <Swords size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Active Challenges</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{hubData.active_challenges_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                Enter Arena <ChevronRight size={12} />
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/social/notifications" style={{ textDecoration: 'none' }} onClick={playClick}>
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Bell size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Unread Alerts</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{hubData.unread_notifications_count}</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                View Inbox <ChevronRight size={12} />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Social Activity Feed */}
      <Card title="Live Community Activity Feed">
        {(!hubData.activity_feed || hubData.activity_feed.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
            <Activity size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
            <div>No recent community activity recorded.</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>As players unlock achievements and win challenges, milestones appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {hubData.activity_feed.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: act.is_self ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                      color: act.is_self ? '#060913' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {act.display_name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Link
                        to={`/social/search?q=${encodeURIComponent(act.username)}`}
                        style={{ fontWeight: 700, color: 'white', textDecoration: 'none' }}
                      >
                        {act.display_name}
                      </Link>
                      {act.is_self && <Badge variant="cyan" size="sm">You</Badge>}
                      {act.is_friend && <Badge variant="secondary" size="sm">Friend</Badge>}
                    </div>
                    <div style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem' }}>
                      {act.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Badge variant={act.activity_type === 'challenge_won' ? 'gold' : 'cyan'} size="sm">
                    {act.activity_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {act.created_at}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
