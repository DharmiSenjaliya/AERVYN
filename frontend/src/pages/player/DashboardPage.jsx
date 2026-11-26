import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Play,
  RotateCcw,
  Compass,
  Award,
  Backpack,
  Clock,
  Zap,
  Shield,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Trophy,
  History,
  Lock,
  RefreshCw,
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { playClick, playPortal } = useAudio();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/player/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch player dashboard:', err);
      setError('Unable to load live player telemetry from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLaunchGame = (worldId = 'world_1') => {
    playPortal();
    navigate(`/play?world=${worldId}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={40} className="animate-spin" style={{ margin: '0 auto 1.25rem', color: '#00f0ff' }} />
        <h2 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>Synchronizing Chrono Telemetry...</h2>
        <p style={{ fontSize: '0.85rem' }}>Fetching live timeline progress from AERVYN temporal core.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Connection Failed</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error || 'Could not load player data.'}</p>
        <Button variant="primary" onClick={fetchDashboardData}>
          Retry Connection
        </Button>
      </Card>
    );
  }

  const {
    user: player,
    campaign,
    playtime,
    achievements,
    collectibles,
    recent_sessions: recentSessions,
    worlds
  } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. HERO BANNER: Player Greeting & Quick Launch */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '2.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          background: 'linear-gradient(135deg, rgba(8, 14, 30, 0.95) 0%, rgba(18, 26, 52, 0.9) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '600px', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Badge variant="cyan" size="sm" pulse={true}>
              Active Timeline
            </Badge>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {campaign.current_world_title}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Welcome back, <span style={{ color: 'var(--color-cyan)' }}>{player.display_name}</span>
          </h1>

          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            You are currently on mission <strong style={{ color: '#FFFFFF' }}>{campaign.current_mission_title}</strong> (Step {campaign.current_step}).
            The temporal fabric is waiting for your next calibration.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="large"
              onClick={() => handleLaunchGame(campaign.current_world_id)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)' }}
            >
              <Play size={20} fill="currentColor" />
              Continue Game
            </Button>

            <Button
              variant="secondary"
              size="large"
              onClick={() => handleLaunchGame('world_1')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={18} />
              New Game / World 1
            </Button>
          </div>
        </div>

        {/* Player Profile Quick HUD Card */}
        <div
          style={{
            zIndex: 2,
            minWidth: '280px',
            backgroundColor: 'rgba(5, 8, 18, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'white',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
              }}
            >
              {player.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{player.display_name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-primary-cyan)' }}>{player.rank_title}</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--color-text-dim)' }}>Level {player.level}</span>
              <span style={{ color: 'white', fontWeight: 600 }}>{player.xp} / {player.next_level_xp} XP</span>
            </div>
            <div style={{ height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${player.level_progress_percent}%`,
                  background: 'linear-gradient(90deg, #00f0ff 0%, #a855f7 100%)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              color: 'var(--color-text-dim)'
            }}
          >
            <div>
              <span>Playtime:</span> <strong style={{ color: 'white' }}>{playtime.formatted}</strong>
            </div>
            <div>
              <span>Campaign:</span> <strong style={{ color: '#00f0ff' }}>{campaign.campaign_percent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS (4 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
            <Compass size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Campaign Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{campaign.campaign_percent}%</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{campaign.completed_worlds_count} of 4 worlds cleared</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#ffd700' }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Achievements</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{achievements.unlocked_count} / {achievements.total_count}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{achievements.percent}% completion rate</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <Backpack size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Collectibles</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{collectibles.discovered_count}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Fragments, cores & shards</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Clock size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', textTransform: 'uppercase' }}>Total Playtime</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{playtime.formatted}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Logged across sessions</div>
          </div>
        </Card>
      </div>

      {/* 3. WORLD SELECTION & PROGRESSION CARDS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'white' }}>Epoch Timelines</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>Select an unlocked era to enter the 3D environment.</p>
          </div>
          <Link to="/player/statistics" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View Full Telemetry <ChevronRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {worlds.map((world, index) => {
            return (
              <Card
                key={world.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                  border: world.is_completed
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : world.is_unlocked
                    ? '1px solid rgba(0, 240, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  opacity: world.is_unlocked ? 1 : 0.6
                }}
              >
                {/* World Card Header / Epoch Tag */}
                <div style={{ padding: '1.25rem 1.25rem 0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-primary-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    {world.epoch}
                  </span>
                  {world.is_completed ? (
                    <Badge variant="success" size="sm">Completed</Badge>
                  ) : world.is_unlocked ? (
                    <Badge variant="cyan" size="sm">Available</Badge>
                  ) : (
                    <Badge variant="secondary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Lock size={12} /> Locked
                    </Badge>
                  )}
                </div>

                <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{world.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.5, flex: 1 }}>
                    {world.description}
                  </p>

                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <Button
                      variant={world.is_unlocked ? 'primary' : 'secondary'}
                      size="small"
                      disabled={!world.is_unlocked}
                      onClick={() => handleLaunchGame(world.id)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}
                    >
                      {world.is_unlocked ? (
                        <>
                          <Play size={14} fill="currentColor" /> Enter {world.title.split(':')[0]}
                        </>
                      ) : (
                        <>
                          <Lock size={14} /> Locked by Timeline
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. RECENT ACHIEVEMENTS & RECENT ACTIVITY (2 Columns) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Recent Achievements */}
        <Card title="Recent Achievements" style={{ display: 'flex', flexDirection: 'column' }}>
          {achievements.recent.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
              <Award size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No achievements unlocked yet.</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Explore the Lost Kingdom courtyard to earn your first badges!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {achievements.recent.map((ach) => (
                <div
                  key={ach.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '8px'
                  }}
                >
                  <div
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      color: '#ffd700'
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{ach.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ach.description}
                    </div>
                  </div>
                  <Badge variant="gold" size="sm">+{ach.xp_reward} XP</Badge>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              to="/player/achievements"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: 'var(--color-cyan)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span>View All 20 Achievements</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </Card>

        {/* Recent Game Activity Sessions */}
        <Card title="Recent Activity" style={{ display: 'flex', flexDirection: 'column' }}>
          {recentSessions.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
              <History size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
              <div>No past session records.</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Launch a game world to record session telemetry.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={18} color="var(--color-cyan)" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'white' }}>
                        {session.world_id.replace('_', ' ').toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        Duration: {Math.floor((session.duration_seconds || 0) / 60)} mins
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {session.completed ? (
                      <Badge variant="success" size="sm">Completed</Badge>
                    ) : (
                      <Badge variant="secondary" size="sm">Session Ended</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              to="/player/statistics"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                color: 'var(--color-cyan)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span>View Detailed Game Statistics</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
