import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Trophy,
  Award,
  Zap,
  Globe,
  Crown,
  Medal,
  RefreshCw,
  Search,
  Filter,
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('xp');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = async (selectedFilter = filter) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/player/leaderboard?filter=${selectedFilter}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Unable to load global rankings from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(filter);
  }, [filter]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Tabulating Global Explorer Rankings...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Rankings Error</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={() => fetchLeaderboard(filter)}>Retry</Button>
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
              Global Explorer Leaderboard
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Official player rankings across all temporal timelines and campaign milestones.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => fetchLeaderboard(filter)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} /> Refresh Rankings
        </Button>
      </div>

      {/* Sticky User Standing Banner */}
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
                fontWeight: 900,
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
              }}
            >
              #{userRank.rank}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-primary-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                Your Current Global Standing
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                {userRank.display_name} <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>({userRank.rank_title})</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>LEVEL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Level {userRank.level}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>TOTAL XP</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffd700' }}>{userRank.xp} XP</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>WORLDS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00f0ff' }}>{userRank.completed_worlds} / 4</div>
            </div>
          </div>
        </Card>
      )}

      {/* Top 3 Podium (Desktop/Tablet) */}
      {topThree.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            alignItems: 'flex-end'
          }}
        >
          {/* 2nd Place */}
          <Card
            style={{
              textAlign: 'center',
              padding: '1.5rem 1rem',
              border: '1px solid rgba(192, 192, 192, 0.4)',
              background: 'linear-gradient(180deg, rgba(192, 192, 192, 0.08) 0%, rgba(8, 11, 24, 0.8) 100%)'
            }}
          >
            <div style={{ color: '#c0c0c0', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>#2 SILVER</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{topThree[1].display_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{topThree[1].rank_title}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffd700', marginTop: '0.5rem' }}>{topThree[1].xp} XP</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Level {topThree[1].level} &bull; {topThree[1].completed_worlds} Worlds</div>
          </Card>

          {/* 1st Place */}
          <Card
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              border: '2px solid rgba(255, 215, 0, 0.6)',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.15) 0%, rgba(8, 11, 24, 0.9) 100%)',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.25)',
              transform: 'scale(1.03)'
            }}
          >
            <Crown size={32} color="#ffd700" style={{ margin: '0 auto 0.25rem' }} />
            <div style={{ color: '#ffd700', fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.25rem' }}>#1 GOLD CHAMPION</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white' }}>{topThree[0].display_name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-cyan)' }}>{topThree[0].rank_title}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffd700', marginTop: '0.75rem' }}>{topThree[0].xp} XP</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>Level {topThree[0].level} &bull; {topThree[0].completed_worlds} Worlds Cleared</div>
          </Card>

          {/* 3rd Place */}
          <Card
            style={{
              textAlign: 'center',
              padding: '1.5rem 1rem',
              border: '1px solid rgba(205, 127, 50, 0.4)',
              background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.08) 0%, rgba(8, 11, 24, 0.8) 100%)'
            }}
          >
            <div style={{ color: '#cd7f32', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>#3 BRONZE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{topThree[2].display_name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{topThree[2].rank_title}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffd700', marginTop: '0.5rem' }}>{topThree[2].xp} XP</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>Level {topThree[2].level} &bull; {topThree[2].completed_worlds} Worlds</div>
          </Card>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'xp', label: 'Top XP & Level' },
            { id: 'campaign', label: 'Campaign Progress' },
            { id: 'achievements', label: 'Most Badges' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: filter === tab.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: filter === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: filter === tab.id ? '#00f0ff' : 'var(--color-text-dim)',
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

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--color-text-dim)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search player or title..."
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

      {/* Leaderboard Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(8, 12, 26, 0.6)', color: 'var(--color-text-dim)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', width: '70px', textAlign: 'center' }}>Rank</th>
                <th style={{ padding: '1rem' }}>Explorer</th>
                <th style={{ padding: '1rem' }}>Ascension Title</th>
                <th style={{ padding: '1rem' }}>Level</th>
                <th style={{ padding: '1rem' }}>Total XP</th>
                <th style={{ padding: '1rem' }}>Campaign</th>
                <th style={{ padding: '1rem' }}>Badges</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((entry) => {
                const isCurrentUser = userRank && entry.user_id === userRank.user_id;

                return (
                  <tr
                    key={entry.user_id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      backgroundColor: isCurrentUser ? 'rgba(0, 240, 255, 0.06)' : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 800 }}>
                      {entry.rank === 1 ? (
                        <span style={{ color: '#ffd700' }}>★ 1</span>
                      ) : entry.rank === 2 ? (
                        <span style={{ color: '#c0c0c0' }}>2</span>
                      ) : entry.rank === 3 ? (
                        <span style={{ color: '#cd7f32' }}>3</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-dim)' }}>#{entry.rank}</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCurrentUser ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
                            color: isCurrentUser ? '#060913' : 'white',
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
                            {isCurrentUser && <Badge variant="cyan" size="sm">You</Badge>}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>@{entry.username}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--color-primary-cyan)', fontWeight: 600 }}>
                      {entry.rank_title}
                    </td>

                    <td style={{ padding: '1rem', color: 'white', fontWeight: 600 }}>
                      Level {entry.level}
                    </td>

                    <td style={{ padding: '1rem', color: '#ffd700', fontWeight: 700 }}>
                      {entry.xp} XP
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {entry.campaign_completed ? (
                        <Badge variant="success" size="sm">Completed</Badge>
                      ) : (
                        <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>
                          {entry.completed_worlds} / 4 Worlds
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <Badge variant="gold" size="sm">{entry.achievements_count} / 20</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
