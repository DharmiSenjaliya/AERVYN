import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Award,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Trophy,
  Filter,
  Compass,
  MapPin,
  Globe,
  Footprints,
  Cpu,
  Layers,
  Activity,
  Shield,
  ShieldCheck,
  Key,
  Sliders,
  Clock,
  Swords,
  Skull,
  Sun,
  Orbit
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

export default function AchievementsPage() {
  const { playClick, playSuccess, playLevelUp } = useAudio();

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/player/achievements', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data?.status === 'success') {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
      setError('Unable to load achievements from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSyncAchievements = async () => {
    playClick();
    setSyncing(true);
    setNotification(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/player/achievements/check', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.data?.status === 'success') {
        const newlyUnlocked = res.data.newly_unlocked || [];
        if (newlyUnlocked.length > 0) {
          playLevelUp?.() || playSuccess?.();
          setNotification({
            type: 'success',
            title: `Unlocked ${newlyUnlocked.length} New Achievement${newlyUnlocked.length > 1 ? 's' : ''}!`,
            items: newlyUnlocked
          });
        } else {
          setNotification({
            type: 'info',
            title: 'Achievements Synchronized',
            message: 'All eligible achievements have been claimed and are up to date.'
          });
        }
        await fetchAchievements();
      }
    } catch (err) {
      console.error('Achievement check failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const getIcon = (iconName, isUnlocked) => {
    const props = { size: 24, color: isUnlocked ? '#ffd700' : '#718096' };
    switch (iconName) {
      case 'Footprints': return <Footprints {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'CheckCircle': return <CheckCircle {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Key': return <Key {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      case 'Clock': return <Clock {...props} />;
      case 'Swords': return <Swords {...props} />;
      case 'Skull': return <Skull {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Orbit': return <Orbit {...props} />;
      default: return <Award {...props} />;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-text-dim)' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#00f0ff' }} />
        <div>Verifying Temporal Badges & Achievements...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#ff4444', marginBottom: '1rem' }}>Failed to Load Achievements</h3>
        <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>{error}</p>
        <Button variant="primary" onClick={fetchAchievements}>Retry</Button>
      </Card>
    );
  }

  const { total_count, unlocked_count, completion_percent, total_xp_awarded, achievements } = data;

  const filteredAchievements = achievements.filter((ach) => {
    if (activeCategory === 'all') return true;
    return ach.category === activeCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner & Progress Summary */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 215, 0, 0.25)',
          background: 'linear-gradient(135deg, rgba(14, 18, 38, 0.95) 0%, rgba(26, 20, 48, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <Trophy size={28} color="#ffd700" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
              Achievements & Temporal Badges
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
            Earn XP and ascension rank by exploring eras, restoring keystone cores, solving puzzles, and vanquishing bosses.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Completion: {unlocked_count} of {total_count}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffd700' }}>{completion_percent}%</div>
            <div style={{ fontSize: '0.75rem', color: '#00f0ff' }}>+{total_xp_awarded} XP Awarded</div>
          </div>

          <Button
            variant="primary"
            onClick={handleSyncAchievements}
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Verifying Progress...' : 'Sync Achievements'}
          </Button>
        </div>
      </div>

      {/* Celebration Notification */}
      {notification && (
        <div
          style={{
            backgroundColor: notification.type === 'success' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0, 240, 255, 0.1)',
            border: notification.type === 'success' ? '1px solid rgba(255, 215, 0, 0.4)' : '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            padding: '1.25rem',
            color: notification.type === 'success' ? '#ffd700' : '#00f0ff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
            <Sparkles size={20} />
            <span>{notification.title}</span>
          </div>
          {notification.message && (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
              {notification.message}
            </div>
          )}
          {notification.items && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {notification.items.map((item) => (
                <Badge key={item.id} variant="gold" size="sm">
                  ★ {item.title} (+{item.xp_reward} XP)
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Badges' },
          { id: 'explorer', label: 'Explorer' },
          { id: 'collector', label: 'Collector' },
          { id: 'mission', label: 'Missions' },
          { id: 'puzzle', label: 'Puzzles' },
          { id: 'boss', label: 'Boss Victories' },
          { id: 'campaign', label: 'Campaign' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeCategory === cat.id ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)',
              backgroundColor: activeCategory === cat.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeCategory === cat.id ? '#00f0ff' : 'var(--color-text-dim)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredAchievements.map((ach) => (
          <Card
            key={ach.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
              border: ach.is_unlocked
                ? '1px solid rgba(255, 215, 0, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              background: ach.is_unlocked
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(10, 15, 30, 0.9) 100%)'
                : 'rgba(8, 11, 24, 0.6)',
              boxShadow: ach.is_unlocked ? '0 0 15px rgba(255, 215, 0, 0.15)' : 'none',
              opacity: ach.is_unlocked ? 1 : 0.65,
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: ach.is_unlocked ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: ach.is_unlocked ? '0 0 12px rgba(255, 215, 0, 0.3)' : 'none',
                  flexShrink: 0
                }}
              >
                {getIcon(ach.icon, ach.is_unlocked)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: ach.is_unlocked ? 'white' : '#a0aec0' }}>
                    {ach.title}
                  </h3>
                  <Badge variant={ach.is_unlocked ? 'gold' : 'secondary'} size="sm">
                    +{ach.xp_reward} XP
                  </Badge>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-cyan)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {ach.category}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
              {ach.description}
            </p>

            {/* Footer with Unlocked Status or Lock Condition */}
            <div
              style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem'
              }}
            >
              {ach.is_unlocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffd700', fontWeight: 600 }}>
                  <Unlock size={14} />
                  <span>Unlocked {ach.unlocked_at}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)' }}>
                  <Lock size={14} />
                  <span>Requirement: {ach.condition_type.replace('_', ' ')}</span>
                </div>
              )}

              {ach.is_unlocked && (
                <Badge variant="success" size="sm">Claimed</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
