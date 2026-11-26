import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Compass,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Award,
  ChevronRight,
  ArrowRight,
  Cpu,
  Monitor
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

/**
 * Public Landing Page
 * Cinematic Hero, Story Preview, 4 Timeline Previews, Gameplay Features, Characters, System Requirements
 */
export default function LandingPage() {
  const { playClick, playPortal } = useAudio();

  const worlds = [
    {
      id: 'world-1',
      title: 'World 1: The Lost Kingdom',
      epoch: 'Past Era • Year -840',
      description: 'Ancient stone castles, mystic forests, underground crypts and primordial ruins where the first Chrono Device was forged.',
      gradient: 'linear-gradient(135deg, rgba(22, 140, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-cyan)'
    },
    {
      id: 'world-2',
      title: 'World 2: The Broken Present',
      epoch: 'Current Era • Year 2026',
      description: 'A crumbling metropolis torn apart by dimensional fissures. Navigate subterranean transit systems and decipher broken tech.',
      gradient: 'linear-gradient(135deg, rgba(245, 185, 66, 0.2), rgba(22, 140, 255, 0.05))',
      border: 'var(--border-gold)'
    },
    {
      id: 'world-3',
      title: 'World 3: The Future Collapse',
      epoch: 'Future Era • Year 2480',
      description: 'A neon-drenched cybernetic citadel governed by rogue quantum energy grids and lethal temporal obstacles.',
      gradient: 'linear-gradient(135deg, rgba(112, 71, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-purple)'
    },
    {
      id: 'world-4',
      title: 'World 4: The Forgotten Timeline',
      epoch: 'Dimensional Rift • Zero Horizon',
      description: 'Floating celestial islands suspended in a vortex of time distortions where the final timeline convergence unfolds.',
      gradient: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(112, 71, 255, 0.05))',
      border: 'var(--border-cyan)'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Real-Time Time Shifts',
      description: 'Shift between historical, present, and future states instantly to solve spatial puzzles and uncover hidden paths.'
    },
    {
      icon: Compass,
      title: 'Third-Person 3D Exploration',
      description: 'Fluid character locomotion, jumping, sprinting, ledge traversal, and responsive dynamic camera controls.'
    },
    {
      icon: Shield,
      title: '10+ Story Missions',
      description: 'Deep narrative progression with interactive objectives, ancient relics, and timeline restoration milestones.'
    },
    {
      icon: Zap,
      title: 'Persistent Cloud Saves',
      description: 'Player levels, inventory items, unlocked checkpoints, and mission progress synced automatically to MySQL.'
    }
  ];

  return (
    <div>
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        style={{
          minHeight: 'calc(100vh - 74px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 40%, rgba(22, 140, 255, 0.15) 0%, rgba(112, 71, 255, 0.08) 35%, rgba(8, 11, 24, 0.98) 75%)'
        }}
      >
        {/* Background Ambient Glow FX */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Hero Content Container */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <Logo size="hero" glow={true} showTagline={false} />
          </div>

          {/* Master Tagline */}
          <h2
            style={{
              fontSize: 'clamp(1.15rem, 3vw, 1.85rem)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '1.25rem',
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
            }}
          >
            CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.
          </h2>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            An original, story-driven 3D adventure through fractured timelines. Uncover the mystery of the ancient Chrono Device, traverse corrupted eras, and restore the timeline.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap'
            }}
          >
            <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="cyan" size="lg" icon={Play}>
                Play Now (3D Adventure)
              </Button>
            </Link>

            <Link to="/register" onClick={playClick}>
              <Button variant="outline" size="lg" icon={Compass}>
                Player Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STORY SECTION */}
      <section id="story" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              The Lore
            </Badge>
            <h2 style={{ marginBottom: '1.5rem', color: '#FFFFFF' }}>
              The Corruption of the Chrono Continuum
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Deep within the forgotten ruins of Aervyn, an explorer activates a relic known as the <em>Temporal Keystone</em>. But as its ancient gears align, an cataclysmic fracture splinters reality into four distinct timelines.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              Past empires bleed into futuristic dystopias. To survive, you must step through quantum portals, manipulate time-energy mechanisms, and restore equilibrium before the continuum collapses permanently.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WORLDS SECTION */}
      <section id="worlds" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              Timelines
            </Badge>
            <h2 style={{ color: '#FFFFFF' }}>Explore Four Distinct Realities</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Each world presents unique atmospheric lighting, spatial puzzles, and dimensional shifts.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {worlds.map((w) => (
              <Card
                key={w.id}
                title={w.title}
                subtitle={w.epoch}
                style={{
                  background: w.gradient,
                  borderColor: w.border
                }}
              >
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {w.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
              Mechanics
            </Badge>
            <h2 style={{ color: '#FFFFFF' }}>Genuinely Playable 3D Systems</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Engineered with Three.js, React Three Fiber, and robust Laravel database persistence.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 217, 255, 0.15)',
                      border: '1px solid var(--border-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-cyan)'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SYSTEM REQUIREMENTS SECTION */}
      <section id="specs" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              Compatibility
            </Badge>
            <h2 style={{ color: '#FFFFFF' }}>Cross-Platform Specifications</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Optimized for high-performance rendering across devices.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              maxWidth: '900px',
              margin: '0 auto'
            }}
          >
            <Card title="Minimum Requirements" subtitle="30+ FPS Performance">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <li><strong>OS:</strong> Windows 10/11, macOS 12+, iOS 15+, Android 10+</li>
                <li><strong>Browser:</strong> Chrome 90+, Firefox 90+, Safari 15+, Edge</li>
                <li><strong>GPU:</strong> WebGL 2.0 compatible hardware</li>
                <li><strong>RAM:</strong> 4 GB System Memory</li>
                <li><strong>Controls:</strong> Keyboard/Mouse, Touch, or Gamepad</li>
              </ul>
            </Card>

            <Card title="Recommended Requirements" subtitle="60 FPS Ultra Settings" accent="cyan">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <li><strong>OS:</strong> Modern 64-bit Desktop OS</li>
                <li><strong>Browser:</strong> Latest Chromium-based or Firefox browser</li>
                <li><strong>GPU:</strong> Dedicated NVIDIA GeForce / AMD Radeon / Apple Silicon</li>
                <li><strong>RAM:</strong> 8 GB+ System Memory</li>
                <li><strong>Display:</strong> 1080p, 1440p, or 4K with hardware acceleration</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section
        style={{
          padding: '6rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(22, 140, 255, 0.12) 100%)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Logo size="md" glow={true} showTagline={false} />
          <h2 style={{ margin: '1.5rem 0 1rem 0', color: '#FFFFFF' }}>
            Ready to Restore the Continuum?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Step through the portal now. Experience the first playable release of AERVYN: Echoes of Time.
          </p>
          <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
            <Button variant="cyan" size="lg" icon={Play}>
              Launch 3D Game
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
