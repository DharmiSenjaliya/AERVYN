import React from 'react';
import { Link } from 'react-router-dom';
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
  Layers
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

/**
 * Player Dashboard Page
 * Telemetry overview, continue game CTA, missions tracker, achievements, and timeline worlds
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const { playClick, playPortal } = useAudio();

  // Mock player telemetry structure matching MySQL schema
  const playerStats = {
    displayName: user?.name || 'Explorer-7',
    level: 3,
    xp: 450,
    nextLevelXp: 1000,
    totalPlaytimeHours: '4h 15m',
    currentWorld: 'World 1: The Lost Kingdom',
    currentMission: {
      title: 'Awakening the Keystone',
      description: 'Traverse the ancient courtyard and calibrate the Chrono Device resonance frequencies.',
      progress: 65
    },
    completedMissions: 2,
    totalMissions: 10,
    chronoCores: 4,
    achievementsUnlocked: 5,
    totalAchievements: 25
  };

  const recentMissions = [
    {
      id: 1,
      title: 'Echoes in the Ruins',
      world: 'World 1',
      status: 'completed',
      xpReward: 150
    },
    {
      id: 2,
      title: 'The Fractured Keystone',
      world: 'World 1',
      status: 'completed',
      xpReward: 200
    },
    {
      id: 3,
      title: 'Awakening the Keystone',
      world: 'World 1',
      status: 'in_progress',
      xpReward: 350
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. HERO BANNER: Player Greeting & Quick Launch */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          backgroundImage: 'radial-gradient(circle at right, rgba(0, 217, 255, 0.15) 0%, transparent 60%)'
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Badge variant="cyan" size="sm" pulse={true}>
              Active Timeline
            </Badge>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {playerStats.currentWorld}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Welcome Back, <span className="text-gradient-cyan">{playerStats.displayName}</span>
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Current Mission: <strong style={{ color: '#FFFFFF' }}>{playerStats.currentMission.title}</strong> — {playerStats.currentMission.description}
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
          <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
            <Button variant="cyan" size="lg" fullWidth icon={Play} style={{ fontWeight: 700 }}>
              Continue Game
            </Button>
          </Link>

          <Link to="/play?new=true" onClick={playClick}>
            <Button variant="secondary" size="sm" fullWidth icon={RotateCcw}>
              Start New Run
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. PLAYER STATS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <Card title="Player Level" subtitle="Ascension Rank" accent="cyan">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cyan)' }}>
              {playerStats.level}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({playerStats.xp} / {playerStats.nextLevelXp} XP)
            </span>
          </div>
        </Card>

        <Card title="Missions Restored" subtitle="Continuum Progress" accent="blue">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-blue)' }}>
              {playerStats.completedMissions}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              of {playerStats.totalMissions} Completed
            </span>
          </div>
        </Card>

        <Card title="Chrono-Cores" subtitle="Portal Catalysts" accent="gold">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>
              {playerStats.chronoCores}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Ready for Shifts
            </span>
          </div>
        </Card>

        <Card title="Total Playtime" subtitle="Recorded Sessions" accent="purple">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-purple)' }}>
              {playerStats.totalPlaytimeHours}
            </span>
          </div>
        </Card>
      </div>

      {/* 3. MISSIONS & RECENT ACTIVITY */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {/* Mission Objectives */}
        <Card
          title="Active Story Missions"
          subtitle="Explore timelines to unlock new chapters"
          action={
            <Link to="/player/missions" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentMissions.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.world} &bull; +{m.xpReward} XP</div>
                </div>

                <Badge variant={m.status === 'completed' ? 'success' : 'cyan'} size="sm">
                  {m.status === 'completed' ? 'Restored' : 'In Progress'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Timeline Portals Status */}
        <Card
          title="World Timelines"
          subtitle="Dimensional gateways status"
          action={
            <Link to="/player/worlds" style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
              World Matrix &rarr;
            </Link>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(22, 140, 255, 0.1)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#FFFFFF', fontSize: '0.92rem' }}>World 1: The Lost Kingdom</strong>
                <Badge variant="cyan" size="sm">Unlocked</Badge>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0.35rem 0 0 0' }}>
                Primary storyline playable. Castle ruins, ancient glyphs, and first time device.
              </p>
            </div>

            <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', opacity: 0.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>World 2: The Broken Present</strong>
                <Badge variant="neutral" size="sm">Unlocks Lvl 5</Badge>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', margin: '0.35rem 0 0 0' }}>
                Abandoned metropolis and underground subways.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
