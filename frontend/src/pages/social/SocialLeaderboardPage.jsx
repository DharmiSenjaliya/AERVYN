import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Trophy,
  Users,
  Crown,
  Search,
  RefreshCw,
  Award,
  Zap,
  Globe,
  Swords,
  Calendar,
  Layers
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

export default function SocialLeaderboardPage() {
  const { user } = useAuth();
  const { playClick } = useAudio();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [category, setCategory] = useState('global_xp');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = async (cat = category) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/social/leaderboard?category=${cat}`);
      if (res.data?.status === 'success' || res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load social leaderboard:', err);
      setError('Unable to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(category);
  }, [category]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Tabulating Social Rankings...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Rankings Error</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={() => fetchLeaderboard(category)}>Retry</Button>
      </Card>
    );
  }

  const { leaderboard, current_user_rank: userRank } = data;

  const filteredList = leaderboard.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.display_name.toLowerCase().includes(q) ||
      entry.username.toLowerCase().includes(q) ||
      entry.rank_title.toLowerCase().includes(q)
    );
  });

  const topThree = leaderboard.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Trophy size={28} color="#ffd700" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
              Social & Friends Leaderboards
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Compare metrics globally, over weekly/monthly timelines, or filter exclusively to your accepted friends.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => fetchLeaderboard(category)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* Sticky User Standing */}
      {userRank && (
        <Card
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#00f0ff',
                color: '#060913',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 900
              }}
            >
              #{userRank.rank}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                Your Standing in this Category
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                {userRank.display_name} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>({userRank.rank_title})</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>LEVEL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Lvl {userRank.level}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>XP</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>{userRank.xp} XP</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>CHALLENGE WINS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00f0ff' }}>{userRank.challenge_wins}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Top 3 Podium if >= 3 */}
      {topThree.length >= 3 && category !== 'friends_only' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          {/* 2nd Place */}
          <Card style={{ textAlign: 'center', padding: '1.5rem 1rem', border: '1px solid rgba(192, 192, 192, 0.4)' }}>
            <div style={{ color: '#c0c0c0', fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.35rem' }}>#2 SILVER</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{topThree[1].display_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{topThree[1].rank_title}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffd700', marginTop: '0.5rem' }}>{topThree[1].xp} XP</div>
          </Card>

          {/* 1st Place */}
          <Card style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px solid rgba(255, 215, 0, 0.6)', background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.15) 0%, rgba(8, 11, 24, 0.9) 100%)', boxShadow: '0 0 30px rgba(255, 215, 0, 0.25)', transform: 'scale(1.02)' }}>
            <Crown size={32} color="#ffd700" style={{ margin: '0 auto 0.25rem' }} />
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem' }}>#1 GOLD CHAMPION</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>{topThree[0].display_name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-cyan)' }}>{topThree[0].rank_title}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd700', marginTop: '0.5rem' }}>{topThree[0].xp} XP</div>
          </Card>

          {/* 3rd Place */}
          <Card style={{ textAlign: 'center', padding: '1.5rem 1rem', border: '1px solid rgba(205, 127, 50, 0.4)' }}>
            <div style={{ color: '#cd7f32', fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.35rem' }}>#3 BRONZE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{topThree[2].display_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{topThree[2].rank_title}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffd700', marginTop: '0.5rem' }}>{topThree[2].xp} XP</div>
          </Card>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'global_xp', label: 'Global XP' },
            { id: 'friends_only', label: 'Friends Only' },
            { id: 'challenge_wins', label: 'Challenge Wins' },
            { id: 'achievements', label: 'Badges' },
            { id: 'worlds_completed', label: 'Worlds Cleared' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: category === tab.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: category === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: category === tab.id ? '#00f0ff' : 'var(--color-text-dim)',
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

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search within board..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filteredList.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-dim)' }}>
            <Users size={36} color="rgba(255, 255, 255, 0.2)" style={{ margin: '0 auto 0.75rem' }} />
            <div>No players found in this category.</div>
            {category === 'friends_only' && (
              <div style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
                You have not connected with any friends yet. Add friends to populate this leaderboard!
              </div>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(8, 12, 26, 0.6)', color: 'var(--color-text-dim)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', width: '70px', textAlign: 'center' }}>Rank</th>
                  <th style={{ padding: '1rem' }}>Explorer</th>
                  <th style={{ padding: '1rem' }}>Title</th>
                  <th style={{ padding: '1rem' }}>Level</th>
                  <th style={{ padding: '1rem' }}>Total XP</th>
                  <th style={{ padding: '1rem' }}>Challenge Wins</th>
                  <th style={{ padding: '1rem' }}>Badges</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((entry) => {
                  const isCurrent = userRank && entry.user_id === userRank.user_id;

                  return (
                    <tr
                      key={entry.user_id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: isCurrent ? 'rgba(0, 240, 255, 0.08)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 800 }}>
                        {entry.rank === 1 ? <span style={{ color: '#ffd700' }}>★ 1</span> :
                         entry.rank === 2 ? <span style={{ color: '#c0c0c0' }}>2</span> :
                         entry.rank === 3 ? <span style={{ color: '#cd7f32' }}>3</span> :
                         <span style={{ color: 'var(--color-text-dim)' }}>#{entry.rank}</span>}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCurrent ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                              color: isCurrent ? '#060913' : 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {entry.display_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span>{entry.display_name}</span>
                              {isCurrent && <Badge variant="cyan" size="sm">You</Badge>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>@{entry.username}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--color-primary-cyan)', fontWeight: 600 }}>
                        {entry.rank_title}
                      </td>

                      <td style={{ padding: '1rem', color: 'white' }}>
                        Lvl {entry.level}
                      </td>

                      <td style={{ padding: '1rem', color: '#ffd700', fontWeight: 700 }}>
                        {entry.xp} XP
                      </td>

                      <td style={{ padding: '1rem', color: '#00f0ff', fontWeight: 700 }}>
                        {entry.challenge_wins}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <Badge variant="gold" size="sm">{entry.achievements_count}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
